const proxyquire = require('proxyquire')
const faker = require('faker')
const urls = require('../../../../../lib/urls')
const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const {
  generateCountries,
} = require('../../../../../../test/unit/helpers/generate-export-countries')
const { transformObjectToOption } = require('../../../../transformers')
const {
  NEW_COUNTRIES_FEATURE,
  EXPORT_INTEREST_STATUS,
} = require('../../../../constants')

const companyMock = require('../../../../../../test/unit/data/companies/company-v4.json')

describe('Company export controller', () => {
  let updateCompany
  let saveCompanyExportDetails
  let transformerSpy
  let middlewareParameters
  let controller
  let metadata

  beforeEach(() => {
    updateCompany = sinon.stub()
    saveCompanyExportDetails = sinon.spy()
    transformerSpy = sinon.spy()
    metadata = {
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
    }

    controller = proxyquire('../controller', {
      '../../repos': {
        updateCompany,
        saveCompanyExportDetails,
      },
      '../../../../lib/metadata': metadata,
      './transformer': transformerSpy,
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

    it('should call the transformer to get the deails', () => {
      expect(transformerSpy).to.be.calledWith(companyMock)
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
        let metadataCountries
        let export_experience_category

        function getExportCountry([id, name]) {
          return [transformObjectToOption({ id, name })]
        }

        beforeEach(() => {
          export_experience_category = {
            id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
            name: 'Increasing export markets',
          }
          metadataCountries = generateCountries(3)
          metadata.countryOptions.push(
            ...metadataCountries.map(([id, name]) => ({
              id,
              name,
            }))
          )
          countries = {
            [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: metadataCountries[0][0],
            [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: metadataCountries[1][0],
            [EXPORT_INTEREST_STATUS.EXPORTING_TO]: metadataCountries[2][0],
          }
        })

        context('when all fields have a value', () => {
          beforeEach(() => {
            middlewareParameters = buildMiddlewareParameters({
              reqMock: { method: 'POST' },
              requestBody: {
                export_experience_category,
                ...countries,
              },
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
              export_experience_category,
              [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: getExportCountry(
                metadataCountries[0]
              ),
              [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: getExportCountry(
                metadataCountries[1]
              ),
              [EXPORT_INTEREST_STATUS.EXPORTING_TO]: getExportCountry(
                metadataCountries[2]
              ),
            })
          })

          it('should call next with no arguments', () => {
            expect(middlewareParameters.nextSpy).to.have.been.calledWith()
            expect(middlewareParameters.nextSpy).to.have.been.calledOnce
          })
        })

        context('when two fields have a value', () => {
          beforeEach(() => {
            delete countries[EXPORT_INTEREST_STATUS.NOT_INTERESTED]

            middlewareParameters = buildMiddlewareParameters({
              reqMock: { method: 'POST' },
              requestBody: {
                export_experience_category,
                ...countries,
              },
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
              export_experience_category,
              [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: getExportCountry(
                metadataCountries[0]
              ),
              [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: [],
              [EXPORT_INTEREST_STATUS.EXPORTING_TO]: getExportCountry(
                metadataCountries[2]
              ),
            })
          })

          it('should call next with no arguments', () => {
            expect(middlewareParameters.nextSpy).to.have.been.calledWith()
            expect(middlewareParameters.nextSpy).to.have.been.calledOnce
          })
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
            [EXPORT_INTEREST_STATUS.EXPORTING_TO]: faker.random.uuid(),
            [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: faker.random.uuid(),
            [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: faker.random.uuid(),
          }
          beforeEach(async () => {
            updateCompany.resolves(companyMock)

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

          it('should call update method with token', () => {
            expect(updateCompany.args[0][0]).to.equal('1234', companyMock.id)
          })

          it('should call update method with flattened body data', () => {
            const actualData = updateCompany.args[0][2]
            expect(actualData).to.deep.equal({
              ...companyMock,
              export_experience_category: '111',
            })
          })

          it('should call saveCompanyExportDetails with the correct arguments and data', () => {
            expect(saveCompanyExportDetails.args[0][0]).to.equal(
              '1234',
              companyMock.id
            )

            const actualData = saveCompanyExportDetails.args[0][2]

            expect(actualData.export_countries).to.deep.equal(
              Object.entries(countries).map(([status, id]) => ({
                country: { id },
                status,
              }))
            )
          })

          it('should redirect to exports routes', () => {
            expect(middlewareParameters.nextSpy).not.to.have.been.called
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
          it('should call update method with flattened body data', async () => {
            updateCompany.resolves(companyMock)

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

            const updateData = updateCompany.args[0][2]
            const exportData = saveCompanyExportDetails.args[0][2]

            expect(updateData.export_experience_category).to.equal('111')
            expect(Array.isArray(exportData.export_countries)).to.equal(true)
            expect(exportData.export_countries.length).to.equal(0)
          })
        })
      })

      context('without any feature flags', () => {
        beforeEach(async () => {
          updateCompany.resolves(companyMock)

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

        it('should call save method with token and companyId', () => {
          expect(updateCompany.args[0][0]).to.equal('1234')
          expect(updateCompany.args[0][1]).to.equal(companyMock.id)
        })

        it('Should not call saveCompanyExportDetails', () => {
          expect(saveCompanyExportDetails.callCount).to.equal(0)
        })

        it('should call save method with flattened body data', () => {
          const actualData = updateCompany.args[0][2]

          expect(actualData).to.deep.equal({
            ...companyMock,
            export_experience_category: '111',
            export_to_countries: ['222'],
            future_interest_countries: ['333', '444'],
          })
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
        updateCompany.rejects(errorMock)

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
})
