import qs from 'qs'

import { interactions } from '../../../../../src/lib/urls'

import { clickCheckboxGroupOption, removeChip } from '../../support/actions'
import {
  assertQueryParams,
  assertPayload,
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertCheckboxGroupOption,
} from '../../support/assertions'

const buildQueryString = (queryParams = {}) =>
  qs.stringify({
    // Default query params
    sortby: 'date:desc',
    ...queryParams,
  })

const taskParams = {
  limit: 10,
  offset: 0,
  sortby: 'date:desc',
}

describe('Interactions Collections Filter', () => {
  context('Default Params', () => {
    it('should set the default params', () => {
      cy.intercept('POST', '/api-proxy/v3/search/interaction').as('apiRequest')
      cy.visit(interactions.react())
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(taskParams)
      })
    })
  })
  context('Interaction Kind', () => {
    const element = '[data-test="status-filter"]'
    it('should filter from the url', () => {
      cy.intercept('POST', '/api-proxy/v3/search/interaction').as('apiRequest')
      const queryParams = buildQueryString({
        kind: ['interaction', 'service_delivery'],
      })
      cy.visit(`${interactions.react()}?${queryParams}`)

      assertPayload('@apiRequest', {
        ...taskParams,
        kind: ['interaction', 'service_delivery'],
      })
      assertCheckboxGroupOption({
        element,
        value: 'Interaction',
        checked: true,
      })
      assertCheckboxGroupOption({
        element,
        value: 'Service delivery',
        checked: true,
      })
      assertChipExists({ label: 'Interaction', position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', '/api-proxy/v3/search/interaction').as('apiRequest')
      cy.visit(`${interactions.react()}?${queryString}`)
      cy.wait('@apiRequest')

      clickCheckboxGroupOption({
        element,
        value: 'interaction',
      })
      assertPayload('@apiRequest', {
        ...taskParams,
        kind: ['interaction'],
      })
      clickCheckboxGroupOption({
        element,
        value: 'service_delivery',
      })
      assertPayload('@apiRequest', {
        ...taskParams,
        kind: ['interaction', 'service_delivery'],
      })

      assertQueryParams('kind', ['interaction', 'service_delivery'])
      assertChipExists({ label: 'Interaction', position: 1 })
      assertChipExists({ label: 'Service delivery', position: 2 })
      removeChip('interaction')
      cy.wait('@apiRequest')
      removeChip('service_delivery')
      assertPayload('@apiRequest', taskParams)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })
})
