import qs from 'qs'

import { interactions } from '../../../../../src/lib/urls'

import {
  clickCheckboxGroupOption,
  removeChip,
  selectFirstAdvisersTypeaheadOption,
} from '../../support/actions'

import {
  assertQueryParams,
  assertPayload,
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertCheckboxGroupOption,
  assertTypeaheadOptionSelected,
} from '../../support/assertions'

const buildQueryString = (queryParams = {}) =>
  qs.stringify({
    // Default query params
    sortby: 'date:desc',
    ...queryParams,
  })

const minimumPayload = {
  limit: 10,
  offset: 0,
  sortby: 'date:desc',
}

const interactionsSearchEndpoint = '/api-proxy/v3/search/interaction'
const adviserAutocompleteEndpoint = '/api-proxy/adviser/?autocomplete=*'
const adviserId = '7d19d407-9aec-4d06-b190-d3f404627f21'
const adviserEndpoint = `/api-proxy/adviser/${adviserId}`

const advisersFilter = '[data-test="adviser-filter"]'
const myInteractionsFilter = '[data-test="my-interactions-filter"]'

const adviser = {
  id: adviserId,
  name: 'Barry Oling',
}

describe('Interactions Collections Filter', () => {
  context('Default Params', () => {
    it('should set the default params', () => {
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(interactions.react())
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
    })
  })
  context('Interaction Kind', () => {
    const element = '[data-test="status-filter"]'
    it('should filter from the url', () => {
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      const queryParams = buildQueryString({
        kind: ['interaction', 'service_delivery'],
      })
      cy.visit(`${interactions.react()}?${queryParams}`)
      assertPayload('@apiRequest', {
        ...minimumPayload,
        kind: ['interaction', 'service_delivery'],
      })
      assertCheckboxGroupOption({
        element,
        value: 'interaction',
        checked: true,
      })
      assertCheckboxGroupOption({
        element,
        value: 'service_delivery',
        checked: true,
      })
      assertChipExists({ label: 'Interaction', position: 1 })
    })

    it('should filter from user input and remove the chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(`${interactions.react()}?${queryString}`)
      cy.wait('@apiRequest')

      clickCheckboxGroupOption({
        element,
        value: 'interaction',
      })
      assertPayload('@apiRequest', {
        ...minimumPayload,
        kind: ['interaction'],
      })
      clickCheckboxGroupOption({
        element,
        value: 'service_delivery',
      })
      assertPayload('@apiRequest', {
        ...minimumPayload,
        kind: ['interaction', 'service_delivery'],
      })

      assertQueryParams('kind', ['interaction', 'service_delivery'])
      assertChipExists({ label: 'Interaction', position: 1 })
      assertChipExists({ label: 'Service delivery', position: 2 })
      removeChip('interaction')
      cy.wait('@apiRequest')
      removeChip('service_delivery')
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(element)
    })
  })

  context('Advisers', () => {
    const expectedPayload = {
      ...minimumPayload,
      dit_participants__adviser: [adviser.id],
    }

    it('should filter from the url', () => {
      const queryParams = buildQueryString({
        adviser: [adviser.id],
      })

      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', adviserAutocompleteEndpoint, {
        count: 1,
        results: [adviser],
      }).as('adviserListApiRequest')
      cy.intercept('GET', adviserEndpoint, adviser).as('adviserApiRequest')
      cy.visit(`${interactions.react()}?${queryParams}`)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(expectedPayload)
      })
      assertTypeaheadOptionSelected({
        element: advisersFilter,
        expectedOption: adviser.name,
      })
      assertChipExists({ label: adviser.name, position: 1 })
      /*
       Asserts the "My interactions" filter checkbox as this should
      be checked if the adviser chosen is the same as the current user.
      */
      assertCheckboxGroupOption({
        element: myInteractionsFilter,
        value: adviser.id,
        checked: true,
      })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', adviserAutocompleteEndpoint, {
        count: 1,
        results: [adviser],
      }).as('adviserListApiRequest')
      cy.intercept('GET', adviserEndpoint, adviser).as('adviserApiRequest')

      cy.visit(`${interactions.react()}?${queryString}`)
      cy.wait('@apiRequest')
      selectFirstAdvisersTypeaheadOption({
        element: advisersFilter,
        input: adviser.name,
      })
      cy.wait('@adviserApiRequest')
      cy.wait('@adviserListApiRequest')
      assertPayload('@apiRequest', expectedPayload)
      assertQueryParams('adviser', [adviser.id])
      assertTypeaheadOptionSelected({
        element: advisersFilter,
        expectedOption: adviser.name,
      })
      /*
       Asserts the "My interactions" filter checkbox as this should
      be checked if the adviser chosen is the same as the current user.
      */
      assertCheckboxGroupOption({
        element: myInteractionsFilter,
        value: adviser.id,
        checked: true,
      })
      assertChipExists({
        label: adviser.name,
        position: 1,
      })
      removeChip(adviser.id)
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body).to.deep.equal(minimumPayload)
      })
      assertChipsEmpty()
      assertFieldEmpty(advisersFilter)
    })
  })

  context('My interactions', () => {
    it('should filter from the url', () => {
      const queryString = buildQueryString({
        adviser: [adviser.id],
      })
      cy.intercept('GET', adviserEndpoint, adviser).as('adviserApiRequest')
      cy.visit(`${interactions.react()}?${queryString}`)
      cy.wait('@adviserApiRequest')
      /*
      Asserts the "Adviser typeahead" filter is selected with the
      current user as this is the same as selecting "My interactions".
      */
      assertTypeaheadOptionSelected({
        element: advisersFilter,
        expectedOption: adviser.name,
      })
      assertCheckboxGroupOption({
        element: myInteractionsFilter,
        value: adviser.id,
        checked: true,
      })
      assertChipExists({ label: adviser.name, position: 1 })
    })

    it('should filter from user input and remove chips', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.intercept('GET', adviserEndpoint, adviser).as('adviserApiRequest')
      cy.visit(`${interactions.react()}?${queryString}`)
      cy.wait('@apiRequest')
      clickCheckboxGroupOption({
        element: myInteractionsFilter,
        value: adviser.id,
      })
      cy.wait('@adviserApiRequest')
      assertPayload('@apiRequest', {
        ...minimumPayload,
        dit_participants__adviser: [adviser.id],
      })
      assertQueryParams('adviser', [adviser.id])
      assertChipExists({ label: adviser.name, position: 1 })
      removeChip(adviser.id)
      assertPayload('@apiRequest', minimumPayload)
      assertChipsEmpty()
      assertFieldEmpty(myInteractionsFilter)
    })
  })
})
