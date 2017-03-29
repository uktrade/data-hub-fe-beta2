/* globals expect: true, describe: true, it: true, beforeEach: true */
const proxyquire = require('proxyquire')

describe('Company add controller', function () {
  let lastSearchPhrase
  let getCompanyForSourceId
  let getCompanyForSourceType
  let getDisplayCHCalled

  const companyAddController = proxyquire('../../src/controllers/companyaddcontroller', {
    '../services/searchservice': {
      searchLimited: function (token, term) {
        lastSearchPhrase = term

        return new Promise((resolve) => {
          resolve([
            {
              _type: 'company_company',
              _source: {
                id: '1234',
                company_number: '123123',
                name: 'freds'
              }
            }
          ])
        })
      }
    },
    '../services/companyservice': {
      getCompanyForSource: function (token, id, type) {
        getCompanyForSourceId = id
        getCompanyForSourceType = type
        return new Promise((resolve) => {
          resolve({ id: '1234' })
        })
      }
    },
    '../services/companyformattingservice': {
      getDisplayCH: function () {
        getDisplayCHCalled = true
        return { id: 1 }
      }
    }
  })

  beforeEach(function () {
    lastSearchPhrase = null
    getCompanyForSourceId = null
    getCompanyForSourceType = null
    getDisplayCHCalled = false
  })

  describe('Get step 1', function () {
    it('should return options for company types', function (done) {
      const req = {session: {}}
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.ukOtherCompanyOptions).to.deep.equal([
            'Charity',
            'Government dept',
            'Intermediary',
            'Limited partnership',
            'Partnership',
            'Sole trader'
          ])
          expect(allOptions.foreignOtherCompanyOptions).to.deep.equal([
            'Charity',
            'Company',
            'Government dept',
            'Intermediary',
            'Limited partnership',
            'Partnership',
            'Sole trader'
          ])
          done()
        }
      }

      companyAddController.getAddStepOne(req, res)
    })
    it('should return labels for the types and error messages', function (done) {
      const req = {session: {}}
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.companyTypeOptions).to.deep.equal({
            ltd: 'UK private or public limited company',
            ltdchild: 'Child of a UK private or public limited company',
            ukother: 'Other type of UK organisation',
            forother: 'Foreign organisation'
          })
          expect(allOptions.companyDetailsLabels.business_type).to.equal('Business type')
          done()
        }
      }

      companyAddController.getAddStepOne(req, res)
    })
    it('should pass through the request body to show previosuly selected options', function (done) {
      const body = { business_type: '1231231231232' }
      const req = { body, session: {}}
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.companyTypeOptions).to.deep.equal({
            ltd: 'UK private or public limited company',
            ltdchild: 'Child of a UK private or public limited company',
            ukother: 'Other type of UK organisation',
            forother: 'Foreign organisation'
          })
          expect(allOptions.company).to.deep.equal(body)
          done()
        }
      }

      companyAddController.getAddStepOne(req, res)
    })
  })
  describe('Post step 1', function () {
    describe('forward to next page', function () {
      it('should forward the user to step 2 when adding a uk ltd.', function (done) {
        const req = {
          body: {
            business_type: 'ltd'
          },
          session: {}
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/company/add-step-2/?business_type=ltd&country=uk')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
      it('should forward the user to add screen when adding uk other', function (done) {
        const req = {
          body: {
            business_type: 'ukother',
            business_type_uk_other: 'Charity'
          },
          session: {}
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/company/add?business_type=Charity&country=uk')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
      it('should forward the user to add screen when adding a foreign company', function (done) {
        const req = {
          body: {
            business_type: 'forother',
            business_type_for_other: 'Charity'
          },
          session: {}
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/company/add?business_type=Charity&country=non-uk')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
    })
    describe('errors', function () {
      it('should show an error when no option selected', function (done) {
        const req = {
          body: {},
          session: {}
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors).to.have.property('business_type')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
      it('should show an error if other uk selected but no option selected from the list', function (done) {
        const req = {
          body: {
            business_type: 'ukother'
          },
          session: {}
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors).to.have.property('business_type_uk_other')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
      it('should show an error if foreign selected but no option selected from the list', function (done) {
        const req = {
          body: {
            business_type: 'forother'
          },
          session: {}
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors).to.have.property('business_type_for_other')
            done()
          }
        }
        companyAddController.postAddStepOne(req, res)
      })
    })
  })
  describe('Get step 2', function () {
    describe('show initial page', function () {
      it('should render the correct page', function (done) {
        const req = {
          query: {
            business_type: 'ltd',
            country: 'uk'
          },
          session: {}
        }
        const res = {
          locals: {},
          render: function (template, options) {
            expect(template).to.equal('company/add-step-2.html')
            done()
          }
        }
        companyAddController.getAddStepTwo(req, res)
      })
      it('should pass the company type labels', function (done) {
        const req = {
          query: {
            business_type: 'ltd',
            country: 'uk'
          },
          session: {}
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.companyTypeOptions).to.deep.equal({
              ltd: 'UK private or public limited company',
              ltdchild: 'Child of a UK private or public limited company',
              ukother: 'Other type of UK organisation',
              forother: 'Foreign organisation'
            })
            done()
          }
        }
        companyAddController.getAddStepTwo(req, res)
      })
      it('should pass through the query variables', function (done) {
        const req = {
          query: {
            business_type: 'ltd',
            country: 'uk'
          },
          session: {}
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.business_type).to.equal('ltd')
            expect(allOptions.country).to.equal('uk')
            done()
          }
        }
        companyAddController.getAddStepTwo(req, res)
      })
    })
    describe('show when search term entered', function () {
      it('should search for the company name entered', function (done) {
        const req = {
          session: {
            token: '1234'
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test'
          }
        }
        const res = {
          locals: {},
          render: function (template, options) {
            expect(lastSearchPhrase).to.equal('test')
            done()
          }
        }
        companyAddController.getAddStepTwo(req, res)
      })
      it('should include parsed search results in page', function (done) {
        const req = {
          session: {
            token: '1234'
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test'
          }
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            const hit = allOptions.hits[0]
            expect(hit.type).to.equal('company_company')
            expect(hit.url).to.include('selected=1234')
            expect(hit.name).to.equal('freds')
            done()
          }
        }
        companyAddController.getAddStepTwo(req, res)
      })
    })
    describe('show when a company is selected', function () {
      it('should fetch the ch company', function (done) {
        const req = {
          session: {
            token: '1234'
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '1234',
            type: 'company_company'
          }
        }
        const res = {
          locals: {},
          render: function (template, options) {
            expect(getCompanyForSourceId).to.equal('1234')
            expect(getCompanyForSourceType).to.equal('company_company')
            done()
          }
        }
        companyAddController.getAddStepTwo(req, res)
      })
      it('should parse the CH details for display', function (done) {
        const req = {
          session: {
            token: '1234'
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '1234',
            type: 'company_company'
          }
        }
        const res = {
          locals: {},
          render: function (template, options) {
            expect(getDisplayCHCalled).to.eq(true)
            done()
          }
        }
        companyAddController.getAddStepTwo(req, res)
      })
      it('should include labels and display order for the table', function (done) {
        const req = {
          session: {
            token: '1234'
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '1234',
            type: 'company_company'
          }
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.chDetailsLabels).to.deep.equal({
              name: 'Registered name',
              company_number: 'Companies House No',
              registered_address: 'Registered office address',
              business_type: 'Company type',
              company_status: 'Company status',
              sic_code: 'Nature of business (SIC)',
              incorporation_date: 'Incorporated on'
            })
            expect(allOptions.chDetailsDisplayOrder).to.deep.equal(['business_type', 'company_status', 'incorporation_date', 'sic_code'])
            done()
          }
        }
        companyAddController.getAddStepTwo(req, res)
      })
      it('should include la link to close the selected section', function (done) {
        const req = {
          session: {
            token: '1234'
          },
          query: {
            business_type: 'ltd',
            country: 'uk',
            term: 'test',
            selected: '1234',
            type: 'company_company'
          }
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.closeLink).to.not.include('selected')
            done()
          }
        }
        companyAddController.getAddStepTwo(req, res)
      })
    })
  })
})

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}
