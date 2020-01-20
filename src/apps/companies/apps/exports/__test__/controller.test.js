const proxyquire = require('proxyquire')
const faker = require('faker')
const urls = require('../../../../../lib/urls')
const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const {
  NEW_COUNTRIES_FEATURE,
  EXPORT_INTEREST_STATUS,
} = require('../../../../constants')

const companyMock = require('../../../../../../test/unit/data/companies/company-v4.json')

describe('Company export controller', () => {
  let saveCompany
  let transformCompanyToExportDetailsViewSpy
  let createExportHistorySpy
  let middlewareParameters
  let controller

  beforeEach(() => {
    saveCompany = sinon.stub()
    transformCompanyToExportDetailsViewSpy = sinon.spy()
    createExportHistorySpy = sinon.spy()

    controller = proxyquire('../controller', {
      '../../repos': {
        saveCompany,
      },
      '../../../../lib/metadata': {
        countryOptions: [
          {
            id: '1234',
            name: 'France',
          },
        ],
        exportExperienceCategory: [
          {
            id: '73023b55-9568-4e3f-a134-53ec58451d3f',
            name: 'Export growth',
          },
        ],
      },
      './transformer': {
        transformCompanyToExportDetailsView: transformCompanyToExportDetailsViewSpy,
        createExportHistory: createExportHistorySpy,
      },
    })
  })

  describe('#renderExports', () => {
    beforeEach(() => {
      middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      controller.renderExports(
        middlewareParameters.reqMock,
        middlewareParameters.resMock
      )
    })

    it('should set correct breadcrumbs', () => {
      expect(middlewareParameters.resMock.breadcrumb).to.be.calledWith(
        'Exports'
      )
    })

    it('should call the transformer to get the details', () => {
      expect(transformCompanyToExportDetailsViewSpy).to.be.calledWith(
        companyMock
      )
    })

    it('should render the correct view', () => {
      expect(middlewareParameters.resMock.render.args[0][0]).to.equal(
        'companies/apps/exports/views/exports-view'
      )
      expect(middlewareParameters.resMock.render).to.have.been.calledOnce
    })

    it('should exports to view', () => {
      expect(middlewareParameters.resMock.render.args[0][1]).to.have.property(
        'exportDetails'
      )
    })
  })

  describe('#populateExportForm', () => {
    context('without any feature flags', () => {
      context('when no request body exists', () => {
        beforeEach(() => {
          middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
          })

          controller.populateExportForm(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should populate formData on locals', () => {
          expect(middlewareParameters.resMock.locals.formData).to.deep.equal({
            export_experience_category: {
              id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
              name: 'Increasing export markets',
            },
            export_to_countries: [
              '35afd8d0-5d95-e211-a939-e4115bead28a',
              '36afd8d0-5d95-e211-a939-e4115bead28a',
            ],
            future_interest_countries: ['37afd8d0-5d95-e211-a939-e4115bead28a'],
          })
        })

        it('should call next with no arguments', () => {
          expect(middlewareParameters.nextSpy).to.have.been.calledWith()
          expect(middlewareParameters.nextSpy).to.have.been.calledOnce
        })
      })

      context('when request body exists', () => {
        beforeEach(() => {
          middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              export_to_countries: ['09876'],
              future_interest_countries: ['67890'],
            },
            company: companyMock,
          })

          controller.populateExportForm(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should populate formData on locals', () => {
          expect(middlewareParameters.resMock.locals.formData).to.deep.equal({
            export_experience_category: {
              id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
              name: 'Increasing export markets',
            },
            export_to_countries: ['09876'],
            future_interest_countries: ['67890'],
          })
        })

        it('should call next with no arguments', () => {
          expect(middlewareParameters.nextSpy).to.have.been.calledWith()
          expect(middlewareParameters.nextSpy).to.have.been.calledOnce
        })
      })
    })
    context('when the new countries feature flag is true', () => {
      context('when no request body exists', () => {
        beforeEach(() => {
          middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            features: { [NEW_COUNTRIES_FEATURE]: true },
          })

          controller.populateExportForm(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should populate formData on locals', () => {
          expect(middlewareParameters.resMock.locals.formData).to.deep.equal({
            export_experience_category: {
              id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
              name: 'Increasing export markets',
            },
            [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: [],
            [EXPORT_INTEREST_STATUS.EXPORTING_TO]: [],
            [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: [],
          })
        })

        it('should call next with no arguments', () => {
          expect(middlewareParameters.nextSpy).to.have.been.calledWith()
          expect(middlewareParameters.nextSpy).to.have.been.calledOnce
        })
      })

      context('when request body exists', () => {
        let countries

        beforeEach(() => {
          countries = {
            [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: faker.random.uuid(),
            [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: faker.random.uuid(),
            [EXPORT_INTEREST_STATUS.EXPORTING_TO]: faker.random.uuid(),
          }
          middlewareParameters = buildMiddlewareParameters({
            requestBody: countries,
            company: companyMock,
            features: { [NEW_COUNTRIES_FEATURE]: true },
          })

          controller.populateExportForm(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should populate formData on locals', () => {
          expect(middlewareParameters.resMock.locals.formData).to.deep.equal({
            export_experience_category: {
              id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
              name: 'Increasing export markets',
            },
            ...countries,
          })
        })

        it('should call next with no arguments', () => {
          expect(middlewareParameters.nextSpy).to.have.been.calledWith()
          expect(middlewareParameters.nextSpy).to.have.been.calledOnce
        })
      })
    })
  })

  describe('#renderExportEdit', () => {
    beforeEach(() => {
      middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      controller.renderExportEdit(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )
    })

    it('should set correct breadcrumbs', () => {
      expect(middlewareParameters.resMock.breadcrumb).to.have.been.calledThrice
    })

    it('should render the correct view', () => {
      expect(middlewareParameters.resMock.render.args[0][0]).to.equal(
        'companies/apps/exports/views/exports-edit'
      )
      expect(middlewareParameters.resMock.render).to.have.been.calledOnce
    })

    it('send labels to view', () => {
      expect(middlewareParameters.resMock.render.args[0][1]).to.have.property(
        'exportDetailsLabels'
      )
    })

    it('send export experience categories options to view', () => {
      expect(middlewareParameters.resMock.render.args[0][1]).to.have.property(
        'exportExperienceCategories'
      )
      expect(
        middlewareParameters.resMock.render.args[0][1]
          .exportExperienceCategories
      ).to.deep.equal([
        {
          value: '73023b55-9568-4e3f-a134-53ec58451d3f',
          label: 'Export growth',
        },
      ])
    })

    it('send country options to view', () => {
      expect(middlewareParameters.resMock.render.args[0][1]).to.have.property(
        'countryOptions'
      )
      expect(
        middlewareParameters.resMock.render.args[0][1].countryOptions
      ).to.deep.equal([
        {
          value: '1234',
          label: 'France',
        },
      ])
    })
  })

  describe('#handleEditFormPost', () => {
    context('when save is successful', () => {
      context('when the new countries feature flag is true', () => {
        context('With countries specified', () => {
          const countries = {
            [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: faker.random.uuid(),
            [EXPORT_INTEREST_STATUS.EXPORTING_TO]: faker.random.uuid(),
            [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: faker.random.uuid(),
          }
          beforeEach(async () => {
            saveCompany.resolves(companyMock)

            middlewareParameters = buildMiddlewareParameters({
              requestBody: {
                export_experience_category: '111',
                ...countries,
              },
              company: companyMock,
              features: { [NEW_COUNTRIES_FEATURE]: true },
            })

            await controller.handleEditFormPost(
              middlewareParameters.reqMock,
              middlewareParameters.resMock,
              middlewareParameters.nextSpy
            )
          })

          it('should call save method with token', () => {
            expect(saveCompany.args[0][0]).to.equal('1234')
          })

          it('should call save method with flattened body data', () => {
            const actualData = saveCompany.args[0][1]
            expect(actualData.export_experience_category).to.equal('111')
            expect(actualData.export_countries).to.deep.equal(
              Object.entries(countries).map(([status, id]) => ({
                country: { id },
                status,
              }))
            )
          })

          it('should redirect to exports routes', () => {
            expect(
              middlewareParameters.resMock.redirect
            ).to.have.been.calledWith(
              urls.companies.exports.index(companyMock.id)
            )
            expect(middlewareParameters.resMock.redirect).to.have.been
              .calledOnce
          })

          it('next should not have been called', () => {
            expect(middlewareParameters.nextSpy).not.to.have.been.called
          })
        })
        context('Without any countries', () => {
          it('should call save method with flattened body data', async () => {
            saveCompany.resolves(companyMock)

            middlewareParameters = buildMiddlewareParameters({
              requestBody: {
                export_experience_category: '111',
              },
              company: companyMock,
              features: { [NEW_COUNTRIES_FEATURE]: true },
            })

            await controller.handleEditFormPost(
              middlewareParameters.reqMock,
              middlewareParameters.resMock,
              middlewareParameters.nextSpy
            )
            const actualData = saveCompany.args[0][1]
            expect(actualData.export_experience_category).to.equal('111')
            expect(Array.isArray(actualData.export_countries)).to.equal(true)
            expect(actualData.export_countries.length).to.equal(0)
          })
        })
      })

      context('without any feature flags', () => {
        beforeEach(async () => {
          saveCompany.resolves(companyMock)

          middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              export_experience_category: '111',
              export_to_countries: '222',
              future_interest_countries: ['333', '444'],
            },
            company: companyMock,
          })

          await controller.handleEditFormPost(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should call save method with token', () => {
          expect(saveCompany.args[0][0]).to.equal('1234')
        })

        it('should call save method with flattened body data', () => {
          const actualData = saveCompany.args[0][1]
          expect(actualData.export_experience_category).to.equal('111')
          expect(actualData.export_to_countries).to.deep.equal(['222'])
          expect(actualData.future_interest_countries).to.deep.equal([
            '333',
            '444',
          ])
        })

        it('should redirect to exports routes', () => {
          expect(middlewareParameters.resMock.redirect).to.have.been.calledWith(
            urls.companies.exports.index(companyMock.id)
          )
          expect(middlewareParameters.resMock.redirect).to.have.been.calledOnce
        })

        it('should redirect to exports routes', () => {
          expect(middlewareParameters.resMock.redirect).to.have.been.calledWith(
            urls.companies.exports.index(companyMock.id)
          )
          expect(middlewareParameters.resMock.redirect).to.have.been.calledOnce
        })

        it('next should not have been called', () => {
          expect(middlewareParameters.nextSpy).not.to.have.been.called
        })
      })
    })

    context('when save rejects with error', () => {
      it('should call next with error', async () => {
        const errorMock = { statusCode: 500 }
        saveCompany.rejects(errorMock)

        middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            export_experience_category: '111',
            export_to_countries: '222',
            future_interest_countries: ['333', '444'],
          },
          company: companyMock,
        })

        await controller.handleEditFormPost(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
        expect(middlewareParameters.nextSpy).to.have.been.calledWith(errorMock)
        expect(middlewareParameters.nextSpy).to.have.been.calledOnce
      })
    })
  })

  describe('createExportCountries', () => {
    context('with some valid data', () => {
      it('Sets the breadcrumb and renders the template with the correct data', async () => {
        const company = require('../../../../../../test/unit/data/company')
        const { reqMock, resMock, nextSpy } = buildMiddlewareParameters({
          locals: { company },
        })
        await controller.renderExportCountries(reqMock, resMock, nextSpy)

        expect(resMock.breadcrumb.firstCall).to.be.calledWith(
          company.name,
          urls.companies.detail(company.id)
        )

        expect(resMock.breadcrumb.secondCall).to.be.calledWith(
          'Exports',
          urls.companies.exports.index(company.id)
        )

        expect(resMock.breadcrumb.thirdCall).to.be.calledWith(
          'Export markets history - all countries'
        )
      })
    })

    context('When an error is returned from the API', () => {})
  })
})
