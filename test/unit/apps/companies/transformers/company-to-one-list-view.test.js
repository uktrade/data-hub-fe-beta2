const transformCompanyToOneListView = require('~/src/apps/companies/transformers/company-to-one-list-view')

const dnbCompany = require('~/test/unit/data/companies/dnb-company.json')

describe('transformCompanyToOneListView', () => {
  const commonTests = (expectedOneListTier, expectedGlobalAccountManager) => {
    it('should set the One List tier', () => {
      expect(this.actual['One List tier']).to.equal(expectedOneListTier)
    })

    it('should set the Global Account Manager', () => {
      expect(this.actual['Global Account Manager']).to.deep.equal(expectedGlobalAccountManager)
    })
  }

  context('when One List tier and Global Account Manager information exists', () => {
    beforeEach(() => {
      this.actual = transformCompanyToOneListView(dnbCompany)
    })

    commonTests('Tier A - Strategic Account', [
      'Travis Greene',
      'IST - Sector Advisory Services',
      'London',
    ])
  })

  context('when One List tier and Global Account Manager information exists', () => {
    beforeEach(() => {
      const company = {
        ...dnbCompany,
        one_list_group_tier: null,
        one_list_group_global_account_manager: null,
      }

      this.actual = transformCompanyToOneListView(company)
    })

    commonTests('None', 'None')
  })

  context('when Global Account Manager if from outside UK', () => {
    beforeEach(() => {
      const company = {
        ...dnbCompany,
        one_list_group_global_account_manager: {
          ...dnbCompany.one_list_group_global_account_manager,
          dit_team: {
            ...dnbCompany.one_list_group_global_account_manager.dit_team,
            uk_region: null,
            country: {
              name: 'France',
            },
          },
        },
      }

      this.actual = transformCompanyToOneListView(company)
    })

    commonTests('Tier A - Strategic Account', [
      'Travis Greene',
      'IST - Sector Advisory Services',
      'France',
    ])
  })
})
