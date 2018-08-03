const { assign } = require('lodash')

const companyData = require('~/test/unit/data/company')
const transformCompanyToListItem = require('~/src/apps/companies/transformers/company-to-list-item')

describe('transformCompanyToListItem', () => {
  context('when there is no companies house data or datahub data', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem()
    })

    it('should return undefined', () => {
      expect(this.listItem).to.be.undefined
    })
  })

  context('when the object passed to the transformer is not a company', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem({ a: 'b' })
    })

    it('should return undefined', () => {
      expect(this.listItem).to.be.undefined
    })
  })

  context('when passed a company with no ID', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem({ a: 'b' })
    })

    it('should return undefined', () => {
      expect(this.listItem).to.be.undefined
    })
  })

  context('when called with a fully populated company', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem(companyData)
    })

    it('should return the id of the company', () => {
      expect(this.listItem).to.have.property('id', 'dcdabbc9-1781-e411-8955-e4115bead28a')
    })

    it('should return a type of company', () => {
      expect(this.listItem).to.have.property('type', 'company')
    })

    it('should return the company name', () => {
      expect(this.listItem).to.have.property('name', 'Wonka Industries')
    })

    it('should return a url to view the company', () => {
      expect(this.listItem).to.have.property('url', '/companies/dcdabbc9-1781-e411-8955-e4115bead28a')
    })

    it('should return a modifed on property', () => {
      expect(this.listItem).to.have.deep.property('subTitle', {
        value: '2017-05-13T15:58:46.421721',
        type: 'datetime',
        label: 'Updated on',
      })
    })
  })

  context('when the company is based in the uk', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem(companyData)
    })

    it('should return the business sector for the company', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'Sector',
        value: 'ICT',
      }])
    })

    it('should return the country', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'Country',
        type: 'badge',
        value: 'United Kingdom',
      }])
    })

    it('should return the UK region', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'UK region',
        type: 'badge',
        value: 'Yorkshire and The Humber',
      }])
    })
  })

  context('when called with a non-UK company', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem(assign({}, companyData, {
        uk_based: false,
      }))
    })

    it('should return the business sector for the company', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'Sector',
        value: 'ICT',
      }])
    })

    it('should return the country', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'Country',
        type: 'badge',
        value: 'United Kingdom',
      }])
    })

    it('should not return the region', () => {
      expect(this.listItem.meta).to.not.containSubset([{
        label: 'UK region',
        type: 'badge',
        value: 'Yorkshire and The Humber',
      }])
    })
  })

  context('when the company has a trading address', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem(assign({}, companyData, {
        trading_address_postcode: 'W1C 2BA',
        trading_address_town: 'London',
        trading_address_1: '100 Bolton Road',
        trading_address_country: {
          id: '123',
          name: 'United Kingdom',
        },
      }))
    })

    it('should include the trading address in the result', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'Trading address',
        value: '100 Bolton Road, London, W1C 2BA, United Kingdom',
      }])
    })

    it('does not include the registered address', () => {
      expect(this.listItem.meta).to.not.containSubset([{
        label: 'Primary address',
        value: 'Leeds City Centre, Leeds, EX1 2PM, United Kingdom',
      }])
    })
  })

  context('when the company does not have a trading address', () => {
    beforeEach(() => {
      this.listItem = transformCompanyToListItem(assign({}, companyData, {
        trading_address_postcode: null,
        trading_address_town: null,
        trading_address_1: null,
      }))
    })

    it('should not include the trading address in the result', () => {
      expect(this.listItem.meta).to.not.containSubset([{
        label: 'Trading address',
      }])
    })

    it('returns a formatted registered address', () => {
      expect(this.listItem.meta).to.containSubset([{
        label: 'Primary address',
        value: 'Leeds City Centre, Leeds, EX1 2PL, United Kingdom',
      }])
    })
  })

  context('headquarter information', () => {
    context('contains the headquarter information', () => {
      beforeEach(() => {
        this.listItem = transformCompanyToListItem(companyData)
      })

      it('should not include the headquarter info in the result', () => {
        expect(this.listItem.meta).to.containSubset([{
          label: 'Headquarter type',
          type: 'badge',
          value: 'European HQ',
        }])
      })
    })

    context('should not contain the headquarter information', () => {
      beforeEach(() => {
        this.listItem = transformCompanyToListItem({
          ...companyData,
          headquarter_type: null,
        })
      })

      it('should not include the headquarter info in the result', () => {
        expect(this.listItem.meta).to.not.containSubset([{
          label: 'Headquarter type',
          type: 'badge',
          value: 'European HQ',
        }])
      })
    })
  })

  context('global headquarters information', () => {
    context('contains the global headquarters information', () => {
      context('and the parent company is not archived', () => {
        beforeEach(() => {
          this.listItem = transformCompanyToListItem(companyData)
        })

        it('should include the headquarter info in the result', () => {
          expect(this.listItem.meta).to.containSubset([{
            label: 'Global HQ',
            value: 'Mars Exports Ltd',
            url: '/companies/b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
          }])
        })

        it('should include the "Remove subsidiary" link in the result', () => {
          expect(this.listItem.meta).to.containSubset([{
            label: '',
            value: 'Remove subsidiary',
            url: '/companies/dcdabbc9-1781-e411-8955-e4115bead28a/hierarchies/ghq/remove',
          }])
        })
      })

      context('and the parent company is archived', () => {
        beforeEach(() => {
          this.listItem = transformCompanyToListItem({
            ...companyData,
            parentCompanyArchived: true,
          })
        })

        it('should include the headquarter info in the result', () => {
          expect(this.listItem.meta).to.containSubset([{
            label: 'Global HQ',
            value: 'Mars Exports Ltd',
            url: '/companies/b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
          }])
        })

        it('should not include the "Remove subsidiary" link in the result', () => {
          expect(this.listItem.meta).to.not.containSubset([{
            label: '',
            value: 'Remove subsidiary',
            url: '/companies/b2c34b41-1d5a-4b4b-9249-7c53ff2868dd/hierarchies/ghq/remove',
          }])
        })
      })
    })

    context('does not contain the headquarter information', () => {
      beforeEach(() => {
        this.listItem = transformCompanyToListItem({
          ...companyData,
          global_headquarters: null,
        })
      })

      it('should not include the headquarter info in the result', () => {
        expect(this.listItem.meta).to.not.containSubset([{
          label: 'Global HQ',
          value: 'Mars Exports Ltd',
          url: '/companies/b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
        }])
      })
    })
  })
})
