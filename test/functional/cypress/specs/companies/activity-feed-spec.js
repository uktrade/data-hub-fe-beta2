const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('Company activity feed', () => {
  context('when viewing Venus Ltd which has no activities', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.venusLtd.id))
    })

    it('should render a meta title', () => {
      cy.title().should(
        'eq',
        'Activities - Venus Ltd - Companies - DIT Data Hub'
      )
    })

    it('should display the activity header', () => {
      cy.findByRole('heading', { name: 'Activities' })
    })

    it('should display "Add interaction" button', () => {
      cy.findByRole('button', { name: 'Add interaction' }).should('exist')
    })

    it('should display "Refer this company" button', () => {
      cy.findByRole('button', { name: 'Refer this company' }).should('exist')
    })

    it('should display the "There are no activities to show." message', () => {
      cy.findByText('There are no activities to show.')
    })
  })

  context('when viewing activity feed for an archived company', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.archivedLtd.id))
    })

    it('should display the badge', () => {
      cy.findByText('Global HQ')
    })

    it('should display the One List tier', () => {
      cy.findByText(
        'This is an account managed company (One List Tier A - Strategic Account)'
      )
    })

    it('should display the Global Account Manager with view core team link', () => {
      cy.findByText(/^Global Account Manager: Travis Greene/i)
      cy.findByRole('link', {
        name: /View core team/i,
      }).should('exist')
    })

    it('should not display the "Add interaction" button', () => {
      cy.findByRole('button', { name: /Add interaction/i }).should('not.exist')
    })

    it('should not display "Refer this company" button', () => {
      cy.findByRole('button', { name: /Refer this company/i }).should(
        'not.exist'
      )
    })

    it('should not display the "There are no activities to show." message', () => {
      cy.findByText('There are no activities to show.').should('not.exist')
    })
  })

  context('when company has a DUNS number (is matched)', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.dnbCorp.id))
    })

    it('should not display the prompt for company matching', () => {
      cy.contains(
        'Business details on this company record have not been verified and could be wrong.'
      ).should('not.exist')
    })
  })

  context('when company does NOT have a DUNS number (is NOT matched)', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.lambdaPlc.id))
    })

    it('should display the prompt for company matching', () => {
      cy.contains(
        'Business details on this company record have not been verified and could be wrong.'
      )
        .parent()
        .next()
        .should('match', 'details')
        .should(
          'have.text',
          'Why verify?Using verified business details from a trusted third-party supplier' +
            ' means we can keep certain information up to date automatically. This' +
            ' helps reduce duplicate records, provide a shared view of complex' +
            ' companies and make it more likely we can link other data sources' +
            ' together.Verification can often be done in just 4 clicks.'
        )
        .next()
        .should('have.text', 'Verify business details')
        .should(
          'have.attr',
          'href',
          urls.companies.match.index(fixtures.company.lambdaPlc.id)
        )
    })

    it('should have the Analytics id', () => {
      cy.get('#ga-company-details-matching-prompt').should('exist')
    })

    it('should not display the pending D&B investigation message', () => {
      cy.findByText(
        'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
      ).should('not.exist')
    })
  })

  context('when company is pending D&B investigation', () => {
    before(() => {
      cy.visit(
        urls.companies.activity.index(fixtures.company.investigationLimited.id)
      )
    })

    it('should not display the prompt for company matching', () => {
      cy.contains(
        'There might be wrong information on this company page because' +
          " it doesn't get updated automatically."
      ).should('not.exist')
    })

    it('should display the pending D&B investigation message', () => {
      cy.findByText(
        'This company record is based on information that has not yet been validated. This information is currently being checked by the Data Hub support team.'
      ).should('exist')
    })
  })

  context('when viewing an export enquiry in the activity feed', () => {
    before(() => {
      cy.visit(
        urls.companies.activity.index(fixtures.company.externalActivitiesLtd.id)
      )
      cy.get('[data-test="activity-feed"] select').select('externalActivity')
    })
    it('should display an export enquiry with truncated comment', () => {
      const exportEnquiry = [
        {
          th: 'Comment',
          td: 'We export fish products to South Korea. In 2011 we were issued an approved exporter authorisation number by HMRC to be able to export to South Korea. Does this number still stand for exporting to South Korea in 2021 or do we need a new number? Lorem... Read More',
        },
        {
          th: 'Name',
          td: 'Gary James',
        },
        {
          th: 'Position',
          td: 'Director',
        },
        {
          th: 'Email',
          td: 'gary.james@fish.com',
        },
      ]
      cy.findByText('Great.gov.uk')
      cy.findByText('10 Nov 2020')
      cy.findByText('View key details for this enquiry')
      exportEnquiry.forEach((item) => {
        cy.findByRole('cell', { name: `${item.th}` })
        cy.findByRole('cell', { name: `${item.td}` })
      })
    })
    it('should be able to read the full comment', () => {
      const comment =
        'We export fish products to South Korea. In 2011 we were issued an approved exporter authorisation number by HMRC to be able to export to South Korea. Does this number still stand for exporting to South Korea in 2021 or do we need a new number? Lorem... Read More'
      cy.findByRole('cell', { name: `${comment}` })
    })
  })

  context('when viewing a Maxemail campaign in the Activity Feed', () => {
    before(() => {
      const companyId = fixtures.company.externalActivitiesLtd.id
      const url = urls.companies.activity.index(companyId)

      cy.visit(url)
        .get('[data-test="activity-feed"] select')
        .select('externalActivity')
    })

    it('should show campaign heading, email subject and date', () => {
      cy.findAllByRole('heading', {
        name: 'Email Campaign',
      })
      cy.findByRole('heading', {
        name: 'British Business Network Update - December 2020',
      })
      cy.findByText('15 Dec 2020')
    })

    it('should summarize the details of the campaign', () => {
      campaignDetails = [
        {
          th: 'Senders name',
          td: 'Susannah Howen',
        },
        {
          th: 'Senders email',
          td: 'anz.newsletter@email.trade.gov.uk',
        },
        {
          th: 'Content',
          td: 'All the latest updates from around the BBN',
        },
      ]
      campaignDetails.forEach((item) => {
        cy.findAllByRole('cell', { name: `${item.th}` }).should('exist')
        cy.findAllByRole('cell', { name: `${item.td}` }).should('exist')
      })
    })

    it('should show a list of campaign email recipients', () => {
      cy.findAllByRole('cell', { name: 'Recipients' }).should('exist')

      const recipients = [
        {
          text: 'Max Speed',
          href: '/contacts/9136dd49-df67-4b2b-b241-6b64a662f1af/details',
        },
        {
          text: 'Max Weight',
          href: '/contacts/236f8b6c-afac-4fba-a8eb-5739aa14823a/details',
        },
        {
          text: 'Max Height',
          href: '/contacts/335369fc-b010-4730-97aa-10e66315b821/details',
        },
      ]

      recipients.forEach((recipient) => {
        cy.findAllByRole('link', { name: `${recipient.text}` }).and(
          'have.attr',
          'href',
          recipient.href
        )
      })
    })
  })
})
