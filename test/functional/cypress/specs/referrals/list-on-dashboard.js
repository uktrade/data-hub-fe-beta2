import '../../../../cypress/support/commands'
import urls from '../../../../../src/lib/urls'

const EXPECTED_REFERRALS = {
  computerSaysNo: {
    company: 'Computer supply inc',
    subject: 'Computer says no',
    id: 'fff',
    companyId: 'cosuplyinc',
    date: '02 Jan 2020',
    dateAccepted: '25 Nov 2021',
    sender: {
      name: 'Carol Beer',
      team: 'Little Britain',
    },
    recipient: {
      name: 'Daffyd Thomas',
    },
  },
  andy2lou: {
    company: 'Andy & Lou',
    subject: 'Andy to Lou',
    id: 'bbb',
    companyId: 'andy-and-lou',
    date: '03 Jan 2020',
    dateAccepted: '25 Nov 2021',
    sender: {
      name: 'Andy Pipkin',
      email: 'andy.pipkin@gov.uk',
      team: 'Little Britain',
    },
    recipient: {
      name: 'Lou Todd',
      email: 'lou.todd@gov.uk',
      team: 'Little Britain',
    },
  },
  lou2andy: {
    company: 'Andy & Lou',
    subject: 'Lou to Andy',
    id: 'ccc',
    companyId: 'andy-and-lou',
    date: '02 Jan 2020',
    sender: {
      name: 'Lou Todd',
      email: 'lou.todd@gov.uk',
      team: 'Little Britain',
    },
    recipient: {
      name: 'Andy Pipkin',
      email: 'andy.pipkin@gov.uk',
      team: 'Little Britain',
    },
  },
  yeahButNo: {
    company: 'Chav Fashion Outlet',
    subject: 'Yeah, but no, but yeah, but no',
    id: 'aaa',
    companyId: 'chav-fashion-outlet',
    date: '04 Jan 2020',
    sender: {
      name: 'Vicky Pollard',
      email: 'vickypollard@gmail.com',
      team: 'Little Britain',
    },
    recipient: {
      name: 'Coach',
      email: 'coach@wlbc.com',
      team: 'Wilderness Lodge Boot Camp',
    },
  },
  yeahIKnow: {
    company: 'Andy & Lou',
    subject: 'Yeah, I know',
    id: 'eee',
    companyId: 'andy-and-lou',
    date: '06 Jan 2020',
    dateAccepted: '25 Nov 2021',
    sender: {
      name: 'Andy Pipkin',
      team: 'Little Britain',
    },
    recipient: {
      name: 'Lou Todd',
    },
  },
  zoo: {
    company: 'Andy & Lou',
    subject: 'Have you got a bandage?',
    id: 'ddd',
    companyId: 'andy-and-lou',
    date: '05 Jan 2020',
    dateAccepted: '25 Nov 2021',
    sender: {
      name: 'Andy Pipkin',
      team: 'Little Britain',
    },
    recipient: {
      name: 'Lou Todd',
    },
  },
}

const selectFilter = (option) =>
  cy.contains('label', 'View').find('select').select(option)

const assertDescription = ({ term, name, email, team }) =>
  cy
    .contains(term)
    .should('have.prop', 'tagName', 'DT')
    .next()
    .should('have.prop', 'tagName', 'DD')
    .and('have.text', [name, email, team].filter(Boolean).join(', '))
    .within(
      () =>
        email &&
        cy
          .get('a')
          .should('have.text', email)
          .and('have.prop', 'href', `mailto:${email}`)
    )

const assertReferralCard = ({
  company,
  subject,
  id,
  companyId,
  date,
  dateAccepted,
  sender,
  recipient,
}) => {
  cy.get('div').eq(0).children().eq(0).should('have.text', company)

  cy.get('h2')
    .should('have.text', subject)
    .find('a')
    .should('have.attr', 'href', `/companies/${companyId}/referrals/${id}`)

  cy.get('ul')
    .children()
    .eq(0)
    .should('have.text', date)
    .next()
    .should(
      'have.text',
      `${dateAccepted ? 'Accepted' : 'Outstanding'} referral`
    )

  assertDescription({
    term: 'Sending adviser',
    ...sender,
  })

  assertDescription({
    term: 'Receiving adviser',
    ...recipient,
  })

  dateAccepted &&
    cy
      .contains('Accepted on')
      .should('have.prop', 'tagName', 'DT')
      .next()
      .should('have.prop', 'tagName', 'DD')
      .and('have.text', dateAccepted)
}

const assertResultList = (expectedItems) => {
  cy.getDhTabNavPanel('Dashboard').find('ol').children().as('items')

  expectedItems.forEach((expected, i) =>
    cy
      .get('@items')
      .eq(i)
      .within(() => assertReferralCard(expected))
  )
}

describe('Referall list on dashboard', () => {
  before(() => {
    cy.visit('/')
    cy.selectDhTablistTab('Dashboard', 'My referrals')
      // This is only to wait for the content to be loaded
      .within(() => cy.get('ol'))
  })

  it('The path should be /my-referrals', () =>
    cy
      .url()
      .should('eq', Cypress.config().baseUrl + urls.companies.referrals.list()))

  it('All referrals should be visible by default', () => {
    cy.selectDhTablistTab('Dashboard', 'My referrals')
      .children()
      .eq(0)
      .within(() =>
        cy
          .contains('h1', '3 received referrals')
          .next()
          .contains('View')
          .contains('select', 'Received referrals')
      )

    assertResultList([
      EXPECTED_REFERRALS.yeahButNo,
      EXPECTED_REFERRALS.andy2lou,
      EXPECTED_REFERRALS.lou2andy,
    ])
  })

  it('Only sent referrals shold be visible when sent filter is set', () => {
    selectFilter('Sent referrals')
    assertResultList([
      EXPECTED_REFERRALS.yeahIKnow,
      EXPECTED_REFERRALS.zoo,
      EXPECTED_REFERRALS.computerSaysNo,
    ])
  })
})
