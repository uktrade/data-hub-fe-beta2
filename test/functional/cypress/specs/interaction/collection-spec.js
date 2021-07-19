import { omit } from 'lodash'

import { assertBreadcrumbs } from '../../support/assertions'
import { interactions } from '../../../../../src/lib/urls'
import {
  interactionsListFaker,
  interactionFaker,
} from '../../fakers/interactions'

import { userFaker } from '../../fakers/users'
import teamFaker from '../../fakers/team'

const date = '2019-06-05T00:00:00+00:00'

const multipleContacts = interactionFaker({
  kind: 'interaction',
  was_policy_feedback_provided: false,
  date,
  contacts: [userFaker(), userFaker(), userFaker()],
})

const multipleAdvisers = interactionFaker({
  kind: 'interaction',
  date,
  was_policy_feedback_provided: false,
  dit_participants: [
    {
      adviser: userFaker(),
      team: teamFaker(),
    },
    {
      adviser: userFaker(),
      team: teamFaker(),
    },
  ],
})

const serviceDeliveryKind = interactionFaker({
  kind: 'service_delivery',
  date,
  was_policy_feedback_provided: false,
})

const policyFeedback = interactionFaker({
  kind: 'interaction',
  date,
  was_policy_feedback_provided: true,
})

const noService = omit(
  interactionFaker({
    kind: 'interaction',
    date,
  }),
  'service'
)

const interactionsList = [
  multipleContacts,
  multipleAdvisers,
  serviceDeliveryKind,
  policyFeedback,
  noService,
  ...interactionsListFaker(5),
]

const assertInteractionDetails = ({
  listType,
  listItemNumber,
  badgeLabel = 'Interaction',
  hasPolicyFeedback = false,
  hasMultipleContacts = false,
  hasMultipleAdvisers = false,
  hasService = true,
}) => {
  it('should display badges', () => {
    cy.get('@collectionItems')
      .eq(listItemNumber)
      .find('[data-test=badge]')
      .eq(0)
      .should('have.text', badgeLabel)

    hasPolicyFeedback &&
      cy
        .get('@collectionItems')
        .eq(listItemNumber)
        .find('[data-test=badge]')
        .eq(1)
        .should('have.text', 'Business intelligence')
  })
  it('should display an interaction subject with link', () => {
    cy.get('@collectionItems')
      .eq(listItemNumber)
      .find('h3')
      .children()
      .should('have.text', listType.subject)
      .should('have.attr', 'href', interactions.detail(listType.id))
  })
  it('should display an interaction date', () => {
    cy.get('@collectionItems')
      .eq(listItemNumber)
      .find('[data-test="metadata-item"]')
      .eq(0)
      .should('have.text', 'Date 05 June 2019')
  })
  it('should display contact details', () => {
    cy.get('@collectionItems')
      .eq(listItemNumber)
      .find('[data-test="metadata-item"]')
      .eq(1)
      .should(
        'have.text',
        `Contact(s) ${
          hasMultipleContacts
            ? 'Multiple contacts'
            : `${listType.contacts[0].name}`
        }`
      )
  })
  it('should display company details', () => {
    cy.get('@collectionItems')
      .eq(listItemNumber)
      .find('[data-test="metadata-item"]')
      .eq(2)
      .should('have.text', `Company ${listType.company.name}`)
  })
  it('should display adviser details', () => {
    cy.get('@collectionItems')
      .eq(listItemNumber)
      .find('[data-test="metadata-item"]')
      .eq(3)
      .should(
        'have.text',
        `Adviser(s) ${
          hasMultipleAdvisers
            ? 'Multiple advisers'
            : `${listType.dit_participants[0].adviser.name}, ${listType.dit_participants[0].team.name}`
        }`
      )
  })

  hasService
    ? it('should display service details', () => {
        cy.get('@collectionItems')
          .eq(listItemNumber)
          .find('[data-test="metadata-item"]')
          .eq(4)
          .should('have.text', `Service ${listType.service.name}`)
      })
    : it('should not display service details', () => {
        cy.get('@collectionItems')
          .eq(listItemNumber)
          .find('[data-test="metadata-item"]')
          .eq(5)
          .should('not.exist')
      })
}

describe('Interactions Collections', () => {
  before(() => {
    cy.intercept('POST', '/api-proxy/v3/search/interaction', {
      body: {
        count: interactionsList.length,
        results: interactionsList,
      },
    }).as('apiRequest')
    cy.visit(interactions.index())
    cy.wait('@apiRequest')
  })

  beforeEach(() => {
    cy.get('[data-test="collection-list"]').as('collectionList')
    cy.get('[data-test="collection-item"]').as('collectionItems')
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Interactions: null,
    })
  })

  it('should render a title', () => {
    cy.get('h1').should('have.text', 'Interactions')
  })

  it('should display a list of interactions', () => {
    cy.get('@collectionList').should('have.length', 1)
    cy.get('@collectionItems').should('have.length', interactionsList.length)
  })

  context('when an interaction has multiple contacts', () => {
    assertInteractionDetails({
      listType: multipleContacts,
      listItemNumber: 0,
      hasMultipleContacts: true,
    })
  })
  context('when an interaction has multiple advisers', () => {
    assertInteractionDetails({
      listType: multipleAdvisers,
      listItemNumber: 1,
      hasMultipleAdvisers: true,
    })
  })
  context('when an interaction is a service delivery kind', () => {
    assertInteractionDetails({
      listType: serviceDeliveryKind,
      listItemNumber: 2,
      badgeLabel: 'Service delivery',
    })
  })
  context('when an interaction has policy feedback', () => {
    assertInteractionDetails({
      listType: policyFeedback,
      listItemNumber: 3,
      hasPolicyFeedback: true,
    })
  })
  context('when an interaction contains no service', () => {
    assertInteractionDetails({
      listType: noService,
      listItemNumber: 4,
      hasService: false,
    })
  })
})
