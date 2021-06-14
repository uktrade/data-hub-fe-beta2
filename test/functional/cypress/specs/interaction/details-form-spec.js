const { reduce, isEqual } = require('lodash')

import {
  assertFieldInput,
  assertFieldRadiosWithLegend,
  assertFieldSelect,
  testBreadcrumbs,
} from '../../support/assertions'

const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const interactionWithoutTheme = require('../../../../sandbox/fixtures/v3/interaction/interaction-without-theme')
const {
  assertFieldTextarea,
  assertFieldDate,
  assertFieldTypeahead,
  assertFormActions,
  assertFormFields,
} = require('../../support/assertions')

const {
  KINDS,
  THEMES,
} = require('../../../../../src/apps/interactions/constants')

const assertHeader = ({ element, text }) =>
  cy.wrap(element).should('have.text', text).and('match', 'h2')

const [TODAY_YEAR, TODAY_MONTH, TODAY_DAY] = new Date()
  .toISOString()
  .split('T')[0]
  .split('-')

const ELEMENT_SERVICE_HEADER = {
  text: 'Service',
  assert: assertHeader,
}

const ELEMENT_BUSINESS_INTELLIGENCE_INFO = {
  assert: ({ element }) =>
    cy
      .wrap(element)
      .contains(
        'If your contact provided business intelligence (eg issues impacting the company or feedback on government policy), complete the business intelligence section.'
      ),
}

const ELEMENT_SERVICE_STATUS = {
  label: 'Service status (optional)',
}
const ELEMENT_SERVICE_GRANT_OFFERED = {
  label: 'Grant offered (optional)',
}
const ELEMENT_SERVICE_NET_RECEIPT = {
  label: 'Net receipt (optional)',
}
const ELEMENT_RELATED_TRADE_AGREEMENT = {
  legend: 'Does this interaction relate to a named trade agreement?',
  assert: assertFieldRadiosWithLegend,
  optionsCount: 2,
}
const ELEMENT_TRADE_AGREEMENTS = {
  legend: 'Related named trade agreement(s)',
  placeholder: '-- Select named trade agreement --',
}
const ELEMENT_TRADE_AGREEMENT_ADD = {
  text: 'Add another',
}
const ELEMENT_SERVICE = {
  emptyOption: '-- Select service --',
  assert: assertFieldSelect,
}
const ELEMENT_PARTICIPANTS_HEADER = {
  text: 'Participants',
  assert: assertHeader,
}
const ELEMENT_CONTACT = {
  label: 'Contact(s)',
  placeholder: '-- Select contact --',
  assert: assertFieldTypeahead,
}
const ELEMENT_ADVISER = {
  label: 'Adviser(s)',
  value: 'DIT Staff',
  assert: assertFieldTypeahead,
}
const ELEMENT_DETAILS_HEADER = {
  text: 'Details',
  assert: assertHeader,
}
const ELEMENT_DATE = {
  label: 'Date of interaction',
  value: {
    day: TODAY_DAY,
    month: TODAY_MONTH,
    year: TODAY_YEAR,
  },
  assert: assertFieldDate,
}
const ELEMENT_COMMUNICATION_CHANNEL = {
  label: 'Communication channel',
  placeholder: '-- Select communication channel --',
  assert: assertFieldTypeahead,
}
const ELEMENT_NOTES_HEADER = {
  text: 'Notes',
  assert: assertHeader,
}
const ELEMENT_SUBJECT = {
  label: 'Subject',
  assert: assertFieldInput,
}
const ELEMENT_NOTES = {
  label: 'Notes (optional)',
  hint: 'Use this text box to record any details of the logistics of the interaction eg how meeting(s) came about and where or when they happened. These are for your records. Do not include comments about issues impacting the company or feedback on government policy. Include that information in the business intelligence section.',
  assert: assertFieldTextarea,
}
// The radios on this page have been refactored to use legends instead of labels, as part of the Accessibility work.
const ELEMENT_FEEDBACK_POLICY = {
  legend: 'Did the contact provide business intelligence?',
  assert: assertFieldRadiosWithLegend,
  optionsCount: 2,
}
const ELEMENT_POLICY_ISSUE_TYPES = {
  label: 'Policy issue types',
}
const ELEMENT_POLICY_AREAS = {
  label: 'Policy area(s)',
}
const ELEMENT_POLICY_FEEDBACK_NOTES = {
  label: 'Business intelligence',
}
const ELEMENT_COUNTRIES = {
  legend: 'Were any countries discussed?',
  assert: assertFieldRadiosWithLegend,
  optionsCount: 2,
}
const ELEMENT_COUNTRIES_CURRENTLY_EXPORTING = {
  label: 'Countries currently exporting to',
}
const ELEMENT_COUNTRIES_FUTURE_INTEREST = {
  label: 'Future countries of interest',
}
const ELEMENT_COUNTRIES_NOT_INTERESTED = {
  label: 'Countries not interested in',
}
const ELEMENT_IS_EVENT = {
  legend: 'Is this an event?',
  assert: assertFieldRadiosWithLegend,
  optionsCount: 2,
}
const ELEMENT_STEP2_BUTTONS = {
  buttons: ['Add interaction', 'Back'],
  assert: assertFormActions,
}

const COMMON_REQUEST_BODY = {
  contacts: ['9b1138ab-ec7b-497f-b8c3-27fed21694ef'],
  dit_participants: [{ adviser: '7d19d407-9aec-4d06-b190-d3f404627f21' }],
  date: `${TODAY_YEAR}-${TODAY_MONTH}-${TODAY_DAY}`,
  subject: 'Some subject',
  notes: 'Some notes',
  was_policy_feedback_provided: 'yes',
  policy_issue_types: ['688ac22e-89d4-4d1f-bf0b-013588bf63a7'],
  policy_areas: ['583c0bb6-d3c5-4e4b-8f25-e861c1e8d9c9'],
  policy_feedback_notes: 'Some policy feedback notes',
  company: { id: '0f5216e0-849f-11e6-ae22-56b6b6499611' },
  service_answers: {},
  status: 'complete',
  has_related_trade_agreements: 'yes',
  related_trade_agreements: [
    '50370070-71f9-4ada-ae2c-cd0a737ba5e2',
    '09787712-0d94-4137-a5f3-3f9131e681f0',
  ],
}

function fillCommonFields({
  service,
  subservice = null,
  contact = 'Johnny Cakeman',
}) {
  cy.contains('Service').next().next().find('select').select(service)

  if (subservice) {
    cy.contains('Service')
      .next()
      .next()
      .find('select')
      .last()
      .select(subservice)
  }

  cy.contains(ELEMENT_RELATED_TRADE_AGREEMENT.legend)
    .next()
    .find('input')
    .check('yes')

  cy.contains(ELEMENT_TRADE_AGREEMENT_ADD.text).click()

  cy.contains(ELEMENT_TRADE_AGREEMENTS.legend)
    .parent()
    .find("[data-test='trade-agreement-field-0']")
    .selectTypeaheadOption('UK-Australia Mutual Recognition Agreement')

  cy.contains(ELEMENT_TRADE_AGREEMENTS.legend)
    .parent()
    .find("[data-test='trade-agreement-field-1']")
    .selectTypeaheadOption('UK-Mexico Trade Continuity Agreement')

  if (contact) {
    cy.contains(ELEMENT_CONTACT.label)
      .next()
      .next()
      .selectTypeaheadOption(contact)
  }

  cy.contains(ELEMENT_SUBJECT.label).next().find('input').type('Some subject')

  cy.contains(ELEMENT_NOTES.label)
    .next()
    .next()
    .find('textarea')
    .type('Some notes')

  cy.contains(ELEMENT_FEEDBACK_POLICY.legend).next().find('input').check('yes')

  cy.contains(ELEMENT_POLICY_ISSUE_TYPES.label)
    .next()
    .contains('Domestic')
    .click()

  cy.contains(ELEMENT_POLICY_AREAS.label)
    .next()
    .selectTypeaheadOption('State Aid')

  cy.contains(ELEMENT_POLICY_FEEDBACK_NOTES.label)
    .next()
    .next()
    .find('textarea')
    .type('Some policy feedback notes')
}

function fillExportCountriesFields() {
  cy.contains(ELEMENT_COUNTRIES.legend).next().find('input').check('yes')

  cy.contains(ELEMENT_COUNTRIES_CURRENTLY_EXPORTING.label)
    .parent()
    .selectTypeaheadOption('Iceland')

  cy.contains(ELEMENT_COUNTRIES_FUTURE_INTEREST.label)
    .parent()
    .selectTypeaheadOption('Austria')

  cy.contains(ELEMENT_COUNTRIES_NOT_INTERESTED.label)
    .parent()
    .selectTypeaheadOption('Germany')
}

function submitForm(kind, theme, values) {
  cy.get('#interaction-details-form').within(() => {
    fillCommonFields(values)

    if (theme !== THEMES.INVESTMENT) {
      fillExportCountriesFields()
    }

    if (kind === KINDS.INTERACTION) {
      cy.contains(ELEMENT_COMMUNICATION_CHANNEL.label)
        .next()
        .selectTypeaheadOption('Telephone')
    } else if (kind === KINDS.SERVICE_DELIVERY) {
      cy.contains(ELEMENT_SERVICE_STATUS.label)
        .next()
        .find('select')
        .select('Completed')

      cy.contains(ELEMENT_SERVICE_GRANT_OFFERED.label)
        .next()
        .find('input')
        .type('123')

      cy.contains(ELEMENT_SERVICE_NET_RECEIPT.label)
        .next()
        .find('input')
        .type('456')

      cy.contains(ELEMENT_IS_EVENT.legend).next().find('input').check('yes')

      cy.get('#event').parent().selectTypeaheadOption('Sort event')
    }

    clickAddInteraction()
  })
}

function clickAddInteraction() {
  cy.contains('Add interaction').click()
}

function spyOnRequest(url = '/api-proxy/v4/interaction') {
  cy.intercept('POST', url).as('interactionHttpRequest')
}

function objectDiff(a, b) {
  return reduce(
    a,
    (result, value, key) =>
      isEqual(value, b[key]) ? result : result.concat(key),
    []
  )
}

function assertRequestBody(expectedBody, callback) {
  cy.wait('@interactionHttpRequest').then((xhr) => {
    // eslint-disable-next-line no-console
    cy.log(
      'Request body fields that differ',
      objectDiff(xhr.request.body, expectedBody)
    )

    expect(xhr.request.body.has_related_trade_agreements).to.equal(
      expectedBody.has_related_trade_agreements
    )
    expect(xhr.request.body.related_trade_agreements).to.deep.equal(
      expectedBody.related_trade_agreements
    )

    expect(xhr.request.body).to.deep.equal(expectedBody)

    callback(xhr)
  })
}

const company = fixtures.company.venusLtd

describe('Interaction theme', () => {
  context('when viewing the form', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [`Add interaction for ${company.name}`]: null,
    })
  })

  context('when giving user guidance about trade agreement options', () => {
    it('should permanently show a description about when to select trade agreement', () => {
      cy.get('div [data-test="trade-agreement-guide"]').should(
        'contain',
        `Select ‘Trade agreement’ if your interaction was set up to focus on, or contributes to, implementing a trade agreement.Read more information and guidance (opens in a new window or tab) on this section.`
      )
    })

    it('should always have a see more guidance link', () => {
      cy.get('div [data-test="trade-agreement-guide"]>a')
        .should('contain', 'information and guidance')
        .should(
          'have.attr',
          'href',
          'https://data-services-help.trade.gov.uk/data-hub/how-articles/trade-agreement-activity/recording-trade-agreement-activity/'
        )
    })
  })

  context('when creating an interaction', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Export').click()
      cy.contains('label', 'A standard interaction').click()
      cy.contains('button', 'Continue').click()
    })

    it('should render all form fields', () => {
      assertFormFields(cy.get('#interaction-details-form form div'), [
        ELEMENT_SERVICE_HEADER,
        ELEMENT_BUSINESS_INTELLIGENCE_INFO,
        ELEMENT_SERVICE,
        ELEMENT_RELATED_TRADE_AGREEMENT,
        ELEMENT_PARTICIPANTS_HEADER,
        ELEMENT_CONTACT,
        ELEMENT_ADVISER,
        ELEMENT_DETAILS_HEADER,
        ELEMENT_DATE,
        ELEMENT_COMMUNICATION_CHANNEL,
        ELEMENT_NOTES_HEADER,
        ELEMENT_SUBJECT,
        ELEMENT_NOTES,
        ELEMENT_FEEDBACK_POLICY,
        ELEMENT_COUNTRIES,
        ELEMENT_STEP2_BUTTONS,
      ])
    })

    it('should only show non-archived contacts in the contacts field', () => {
      cy.contains(ELEMENT_CONTACT.label)
        .next()
        .next()
        .click()
        .find('> div > div > div')
        .should('have.text', '-- Select contact --Johnny Cakeman')
    })

    it('should validate the form', () => {
      cy.contains('button', 'Add interaction').click()
      cy.contains('h2', 'There is a problem')
        .next()
        .should(
          'have.text',
          [
            'Select a service',
            'Answer if this interaction relates to a named trade agreement',
            'Select at least one contact',
            'Select a communication channel',
            'Enter a subject',
            'Answer if the contact provided business intelligence',
            'Answer if any countries were discussed',
          ].join('')
        )
    })

    it('should save the interaction', () => {
      submitForm(KINDS.INTERACTION, THEMES.EXPORT, {
        service: 'A Specific DIT Export Service or Funding',
        subservice: 'Tradeshow Access Programme (TAP)',
      })

      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
          theme: 'export',
          service: '380bba2b-3499-e211-a939-e4115bead28a',
          communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
          were_countries_discussed: 'yes',
          kind: 'interaction',
          event: null,
          export_countries: [
            {
              country: '6e6a9ab2-5d95-e211-a939-e4115bead28a',
              status: 'currently_exporting',
            },
            {
              country: 'a05f66a0-5d95-e211-a939-e4115bead28a',
              status: 'future_interest',
            },
            {
              country: '83756b9a-5d95-e211-a939-e4115bead28a',
              status: 'not_interested',
            },
          ],
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.response.body.id)
          )
        }
      )
    })
  })
})

describe('Service delivery theme', () => {
  context('when creating a service delivery', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Export').click()
      cy.contains('label', 'A service that you have provided').click()
      cy.contains('button', 'Continue').click()
    })

    it('should render all form fields', () => {
      assertFormFields(cy.get('#interaction-details-form form div'), [
        ELEMENT_SERVICE_HEADER,
        ELEMENT_BUSINESS_INTELLIGENCE_INFO,
        ELEMENT_SERVICE,
        ELEMENT_RELATED_TRADE_AGREEMENT,
        ELEMENT_PARTICIPANTS_HEADER,
        ELEMENT_CONTACT,
        ELEMENT_ADVISER,
        ELEMENT_DETAILS_HEADER,
        ELEMENT_DATE,
        ELEMENT_IS_EVENT,
        ELEMENT_NOTES_HEADER,
        ELEMENT_SUBJECT,
        ELEMENT_NOTES,
        ELEMENT_FEEDBACK_POLICY,
        ELEMENT_COUNTRIES,
        ELEMENT_STEP2_BUTTONS,
      ])
    })

    it('should validate the form', () => {
      cy.contains('button', 'Add interaction').click()
      cy.contains('h2', 'There is a problem')
        .next()
        .should(
          'have.text',
          [
            'Select a service',
            'Answer if this interaction relates to a named trade agreement',
            'Select at least one contact',
            'Answer if this was an event',
            'Enter a subject',
            'Answer if the contact provided business intelligence',
            'Answer if any countries were discussed',
          ].join('')
        )
    })

    it('should save the service delivery', () => {
      submitForm(KINDS.SERVICE_DELIVERY, THEMES.EXPORT, {
        service: 'A Specific DIT Export Service or Funding',
        subservice: 'Tradeshow Access Programme (TAP)',
      })

      const expectedBody = {
        ...COMMON_REQUEST_BODY,
        theme: 'export',
        service: '380bba2b-3499-e211-a939-e4115bead28a',
        is_event: 'yes',
        were_countries_discussed: 'yes',
        service_delivery_status: '47329c18-6095-e211-a939-e4115bead28a',
        grant_amount_offered: '123',
        net_company_receipt: '456',
        event: '0010f189-9331-4916-818a-231bf2f4882b',
        kind: 'service_delivery',
        communication_channel: null,
        export_countries: [
          {
            country: '6e6a9ab2-5d95-e211-a939-e4115bead28a',
            status: 'currently_exporting',
          },
          {
            country: 'a05f66a0-5d95-e211-a939-e4115bead28a',
            status: 'future_interest',
          },
          {
            country: '83756b9a-5d95-e211-a939-e4115bead28a',
            status: 'not_interested',
          },
        ],
      }

      assertRequestBody(expectedBody, (xhr) => {
        cy.location('pathname').should(
          'eq',
          urls.companies.interactions.detail(company.id, xhr.response.body.id)
        )
      })
    })
  })
})

describe('Investment theme', () => {
  context('when creating an interaction regarding investment', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Investment').click()
      cy.contains('button', 'Continue').click()
    })

    it('should render all form fields', () => {
      assertFormFields(cy.get('#interaction-details-form form div'), [
        ELEMENT_SERVICE_HEADER,
        ELEMENT_BUSINESS_INTELLIGENCE_INFO,
        ELEMENT_SERVICE,
        ELEMENT_RELATED_TRADE_AGREEMENT,
        ELEMENT_PARTICIPANTS_HEADER,
        ELEMENT_CONTACT,
        ELEMENT_ADVISER,
        ELEMENT_DETAILS_HEADER,
        ELEMENT_DATE,
        ELEMENT_COMMUNICATION_CHANNEL,
        ELEMENT_NOTES_HEADER,
        ELEMENT_SUBJECT,
        ELEMENT_NOTES,
        ELEMENT_FEEDBACK_POLICY,
        ELEMENT_STEP2_BUTTONS,
      ])
    })

    it('should validate the form', () => {
      cy.contains('button', 'Add interaction').click()
      cy.contains('h2', 'There is a problem')
        .next()
        .should(
          'have.text',
          [
            'Select a service',
            'Answer if this interaction relates to a named trade agreement',
            'Select at least one contact',
            'Select a communication channel',
            'Enter a subject',
            'Answer if the contact provided business intelligence',
          ].join('')
        )
    })

    it('should save the interaction', () => {
      submitForm(KINDS.INTERACTION, THEMES.INVESTMENT, {
        service: 'Enquiry received',
        subservice: 'General Investment Enquiry',
      })

      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
          theme: 'investment',
          service: '3a0bba2b-3499-e211-a939-e4115bead28a',
          communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
          kind: 'interaction',
          event: null,
          export_countries: [],
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.response.body.id)
          )
        }
      )
    })
  })
})

describe('Trade Agreement theme', () => {
  context('when creating an interaction regarding trade agreements', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))
      cy.contains('label', 'Trade agreement').click()
      cy.contains('button', 'Continue').click()
    })
    it('should render all form fields', () => {
      assertFormFields(cy.get('#interaction-details-form form div'), [
        ELEMENT_SERVICE_HEADER,
        ELEMENT_BUSINESS_INTELLIGENCE_INFO,
        ELEMENT_SERVICE,
        ELEMENT_RELATED_TRADE_AGREEMENT,
        ELEMENT_PARTICIPANTS_HEADER,
        ELEMENT_CONTACT,
        ELEMENT_ADVISER,
        ELEMENT_DETAILS_HEADER,
        ELEMENT_DATE,
        ELEMENT_COMMUNICATION_CHANNEL,
        ELEMENT_NOTES_HEADER,
        ELEMENT_SUBJECT,
        ELEMENT_NOTES,
        ELEMENT_FEEDBACK_POLICY,
        ELEMENT_COUNTRIES,
        ELEMENT_STEP2_BUTTONS,
      ])
    })

    it('should validate the form', () => {
      cy.contains('button', 'Add interaction').click()
      cy.contains('h2', 'There is a problem')
        .next()
        .should(
          'have.text',
          [
            'Select a service',
            'Answer if this interaction relates to a named trade agreement',
            'Select at least one contact',
            'Select a communication channel',
            'Enter a subject',
            'Answer if the contact provided business intelligence',
            'Answer if any countries were discussed',
          ].join('')
        )
    })

    it('should save the interaction for a specific service', () => {
      submitForm(KINDS.INTERACTION, THEMES.TRADE_AGREEMENT, {
        service: 'A Specific Service',
        subservice: 'Export Academy',
      })

      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
          theme: 'trade_agreement',
          service: '440b7770-62d2-e325-df93-cd7b62818405',
          communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
          were_countries_discussed: 'yes',
          kind: 'interaction',
          event: null,
          export_countries: [
            {
              country: '6e6a9ab2-5d95-e211-a939-e4115bead28a',
              status: 'currently_exporting',
            },
            {
              country: 'a05f66a0-5d95-e211-a939-e4115bead28a',
              status: 'future_interest',
            },
            {
              country: '83756b9a-5d95-e211-a939-e4115bead28a',
              status: 'not_interested',
            },
          ],
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.response.body.id)
          )
        }
      )
    })

    it('should save the interaction for trade agreements', () => {
      submitForm(KINDS.INTERACTION, THEMES.TRADE_AGREEMENT, {
        service: 'Trade Agreement Implementation Activity',
        subservice: 'Civil Society meetings',
      })

      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
          theme: 'trade_agreement',
          service: '8d098d19-5988-4afd-8c0b-cc5652eccb26',
          communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
          were_countries_discussed: 'yes',
          kind: 'interaction',
          event: null,
          export_countries: [
            {
              country: '6e6a9ab2-5d95-e211-a939-e4115bead28a',
              status: 'currently_exporting',
            },
            {
              country: 'a05f66a0-5d95-e211-a939-e4115bead28a',
              status: 'future_interest',
            },
            {
              country: '83756b9a-5d95-e211-a939-e4115bead28a',
              status: 'not_interested',
            },
          ],
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.response.body.id)
          )
        }
      )
    })
  })
})

describe('Contact loop', () => {
  context('when a contact does not exists and user wants to add one', () => {
    beforeEach(() => {
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Export').click()
      cy.contains('label', 'A standard interaction').click()
      cy.contains('button', 'Continue').click()
    })

    after(() => {
      window.sessionStorage.clear()
    })

    it('should redirect the user back to the interaction form after the contact is added', () => {
      cy.contains(ELEMENT_SUBJECT.label)
        .next()
        .find('input')
        .type('Test if values is restored')

      cy.contains('a', 'add a new contact').click()

      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        urls.companies.interactions.create(company.id)
      )

      cy.contains('div', 'First name').find('input').type('John')
      cy.contains('div', 'Last name').find('input').type('Doe')
      cy.contains('div', 'Job title').find('input').type('Full-stack dev')
      cy.contains('fieldset', 'Is this person a primary contact?')
        .contains('label', 'Yes')
        .click()
      cy.contains('div', 'Telephone country code').find('input').type('+44')
      cy.contains('div', 'Telephone number').find('input').type('123 567 789')
      cy.contains('div', 'Email').find('input').type('john@example.com')
      cy.contains(
        'fieldset',
        'Is the contact’s address the same as the company address?'
      )
        .contains('label', 'Yes')
        .click()
      cy.contains('button', 'Add contact').click()

      cy.url().should('include', urls.companies.interactions.create(company.id))

      cy.contains(ELEMENT_SUBJECT.label)
        .next()
        .find('input')
        .should('have.attr', 'value', 'Test if values is restored')

      cy.get('.c-message--success').should(
        'contain',
        'You added Json Russel.You can now continue recording the interaction.'
      )
    })
  })
})

describe('Adding an interaction from a referral', () => {
  const referral = fixtures.referrals.referalDetails

  it('should be able to create an interaction from referral', () => {
    spyOnRequest(`/api-proxy/v4/company-referral/${referral.id}/complete`)

    cy.visit(urls.companies.referrals.details(referral.company.id, referral.id))

    cy.contains('Accept referral').click()
    cy.contains('Export').click()
    cy.contains('A standard interaction').click()
    cy.contains('Continue').click()

    submitForm(KINDS.INTERACTION, THEMES.EXPORT, {
      service: 'A Specific DIT Export Service or Funding',
      subservice: 'Export Academy',
      contact: null,
    })

    assertRequestBody(
      {
        ...COMMON_REQUEST_BODY,
        company: {
          id: referral.company.id,
        },
        contacts: [referral.contact.id], // Was prepopulated
        theme: 'export',
        service: 'e64d7719-0bd9-65df-55a9-f08d328bc467',
        communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
        were_countries_discussed: 'yes',
        kind: 'interaction',
        event: null,
        export_countries: [
          {
            country: '6e6a9ab2-5d95-e211-a939-e4115bead28a',
            status: 'currently_exporting',
          },
          {
            country: 'a05f66a0-5d95-e211-a939-e4115bead28a',
            status: 'future_interest',
          },
          {
            country: '83756b9a-5d95-e211-a939-e4115bead28a',
            status: 'not_interested',
          },
        ],
      },
      (xhr) => {
        cy.location('pathname').should(
          'eq',
          urls.companies.referrals.interactions.detail(
            referral.company.id,
            referral.id,
            xhr.response.body.id
          )
        )
      }
    )
  })
})

describe('Adding an interaction from a contact', () => {
  const contact = fixtures.contact.deanCox

  it('should be able to create an interaction from a contact', () => {
    cy.visit(urls.contacts.interactions.index(contact.id))

    cy.contains('Add interaction').click()
    cy.contains('Export').click()
    cy.contains('A standard interaction').click()
    cy.contains('Continue').click()

    cy.contains('h1', 'Add interaction for Zboncak Group')
    cy.contains('button', 'Add interaction')
  })
})

describe('Editing an interaction from a contact', () => {
  it('should be able to edit an interaction from a contact', () => {
    cy.visit(urls.contacts.interactions.index(fixtures.contact.deanCox.id))

    cy.contains('a', 'totam|f19f5014-8bb1-4645-a224-27a4c8db5336').click()
    cy.contains('a', 'Edit interaction').click()
    cy.contains('h1', 'Edit interaction for Zboncak Group')
    cy.contains('button', 'Save interaction')
  })
})

describe('Adding an interaction from an investment project', () => {
  const investmentProject = fixtures.investment.newHotelFdi

  it('should be able to create an interaction from investment project', () => {
    cy.visit(urls.investments.projects.interactions.index(investmentProject.id))

    cy.contains('Add interaction').click()
    cy.contains('h1', 'Add interaction for Venus Ltd')
    cy.contains('button', 'Add interaction')
  })
})

describe('Editing an interaction from an investment project', () => {
  const investmentProject = fixtures.investment.newHotelFdi

  it('should be able to edit an interaction from an investment project', () => {
    cy.visit(urls.investments.projects.interactions.index(investmentProject.id))
    cy.contains('a', 'totam|f19f5014-8bb1-4645-a224-27a4c8db5336').click()
    cy.contains('a', 'Edit interaction').click()
    cy.contains('h1', 'Edit interaction for Venus Ltd')
    cy.contains('button', 'Save interaction')
  })
})

describe('Editing an interaction from an interactions list', () => {
  it('should be able to edit an interaction from an interactions list', () => {
    cy.visit(urls.interactions.edit(fixtures.interaction.withLink))

    cy.contains('h1', 'Edit interaction for Zboncak Group')
    cy.contains('button', 'Save interaction')
  })
})

describe('Filtering services based on theme & kind', () => {
  const openFormForNewInteraction = (theme, kind) =>
    cy.visit(
      urls.companies.interactions.createType(
        fixtures.company.dnbCorp,
        theme,
        kind
      )
    )

  it('should show filtered services for Export => Interaction', () => {
    openFormForNewInteraction(THEMES.EXPORT, KINDS.INTERACTION)

    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'A Specific DIT Export Service or Funding',
        'Account Management',
        'Enquiry or Referral Received',
        'Export Win',
        'Making Export Introductions',
        'Providing Export Advice & Information',
      ].join('')
    )
  })

  it('should show filtered services for Export => Service delivery', () => {
    openFormForNewInteraction(THEMES.EXPORT, KINDS.SERVICE_DELIVERY)

    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'A Specific DIT Export Service or Funding',
        'Account Management',
        'Events',
        'Export Win',
      ].join('')
    )
  })

  it('should show filtered services for Investment', () => {
    openFormForNewInteraction(THEMES.INVESTMENT, KINDS.INTERACTION)

    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'Account Management',
        'Enquiry received',
        'IST Specific Service',
        'Making Investment Introductions',
        'Providing Investment Advice & Information',
      ].join('')
    )
  })

  it('should show filtered services for Trade Agreement', () => {
    openFormForNewInteraction(THEMES.TRADE_AGREEMENT, KINDS.INTERACTION)
    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'A Specific Service',
        'Account Management',
        'Enquiry or Referral Received',
        'Events',
        'Making Other Introductions',
        'Providing Other Advice & Information',
        'Trade Agreement Implementation Activity',
      ].join('')
    )
  })

  it('should show filtered services for Other => Interaction', () => {
    openFormForNewInteraction(THEMES.OTHER, KINDS.INTERACTION)

    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'A Specific Service',
        'Account Management',
        'Enquiry or Referral Received',
        'Making Other Introductions',
        'Providing Other Advice & Information',
      ].join('')
    )
  })

  it('should show filtered services for Other => Service delivery', () => {
    openFormForNewInteraction(THEMES.OTHER, KINDS.SERVICE_DELIVERY)

    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'A Specific Service',
        'Account Management',
        'Events',
      ].join('')
    )
  })
})

describe('Editing an interaction without a theme', () => {
  it('should set a default theme (Other)', () => {
    cy.visit(urls.interactions.edit(interactionWithoutTheme.id))

    cy.get('#field-subject').then((element) =>
      assertFieldInput({
        element,
        label: 'Subject',
        value: interactionWithoutTheme.subject,
      })
    )

    cy.contains('button', 'Save interaction')
  })
})
