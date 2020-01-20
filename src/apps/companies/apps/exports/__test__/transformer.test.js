const proxyquire = require('proxyquire')
const faker = require('faker')

const minimalCompany = require('../../../../../../test/unit/data/companies/minimal-company.json')
const { formatDateTime } = require('../../../../../config/nunjucks/filters')

const transformerPath = '../transformer'
const EXPORT_POTENTIAL_LABEL = 'Export potential'

const {
  generateExportCountries,
} = require('../../../../../../test/unit/helpers/generate-export-countries')

describe('Company export transformers', () => {
  let transformers
  let urls
  let greatUrlProfileResponse

  beforeEach(() => {
    greatUrlProfileResponse = faker.internet.url()
    urls = {
      external: {
        greatProfile: sinon.stub().returns(greatUrlProfileResponse),
      },
    }
    transformers = proxyquire(transformerPath, {
      '../../../../lib/urls': urls,
    })
  })

  describe('transformCompanyToExportDetailsView', () => {
    context('when there is no feature flag', () => {
      context('when no export market information has been entered', () => {
        it('should create the correct viewRecord data', () => {
          const company = {
            ...minimalCompany,
            export_experience_category: null,
            export_to_countries: [],
            future_interest_countries: [],
          }

          const viewRecord = transformers.transformCompanyToExportDetailsView(
            company
          )

          expect(viewRecord).to.have.property('Currently exporting to', 'None')
          expect(viewRecord).to.have.property(
            'Future countries of interest',
            'None'
          )
          expect(viewRecord).to.have.property('Export win category', 'None')
          expect(viewRecord).to.have.property(
            EXPORT_POTENTIAL_LABEL,
            'No score given'
          )
          expect(viewRecord).not.to.have.property('Countries of no interest')
        })
      })

      context(
        'when single values have been selected for drop down fields',
        () => {
          it('should create the correct viewRecord data', () => {
            const exportExperienceCategory = {
              id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
              name: 'Increasing export markets',
            }
            const company = {
              ...minimalCompany,
              export_experience_category: exportExperienceCategory,
              export_to_countries: [
                {
                  id: '1234',
                  name: 'France',
                },
              ],
              future_interest_countries: [
                {
                  id: '4321',
                  name: 'Germany',
                },
              ],
              export_potential: 'low',
            }

            const viewRecord = transformers.transformCompanyToExportDetailsView(
              company
            )

            expect(viewRecord).to.have.property(
              'Currently exporting to',
              'France'
            )
            expect(viewRecord).to.have.property(
              'Future countries of interest',
              'Germany'
            )
            expect(viewRecord).to.have.property(
              'Export win category',
              exportExperienceCategory
            )
            expect(viewRecord).to.have.property(EXPORT_POTENTIAL_LABEL, 'Low')
          })
        }
      )

      context(
        'when multiple values have been selected for drop down fields',
        () => {
          it('should create the correct viewRecord data', () => {
            const exportExperienceCategory = {
              id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
              name: 'Increasing export markets',
            }
            const company = {
              ...minimalCompany,
              export_experience_category: exportExperienceCategory,
              export_to_countries: [
                {
                  id: '1234',
                  name: 'France',
                },
                {
                  id: '5511',
                  name: 'Spain',
                },
              ],
              future_interest_countries: [
                {
                  id: '4321',
                  name: 'Germany',
                },
                {
                  id: '4123',
                  name: 'Sweden',
                },
              ],
            }

            const viewRecord = transformers.transformCompanyToExportDetailsView(
              company
            )

            expect(viewRecord).to.have.property(
              'Currently exporting to',
              'France, Spain'
            )
            expect(viewRecord).to.have.property(
              'Future countries of interest',
              'Germany, Sweden'
            )
            expect(viewRecord).to.have.property(
              'Export win category',
              exportExperienceCategory
            )
          })
        }
      )

      describe('great profile', () => {
        const GREAT_LABEL = 'great.gov.uk business profile'
        let companiesHouseNumber

        function createRecord(props) {
          return transformers.transformCompanyToExportDetailsView({
            ...minimalCompany,
            export_experience_category: null,
            export_to_countries: [],
            future_interest_countries: [],
            company_number: companiesHouseNumber,
            ...props,
          })
        }

        beforeEach(() => {
          companiesHouseNumber = faker.random.alphaNumeric(8)
        })

        context('when a profile is published', () => {
          it('should return the data to link to the profile', () => {
            const viewRecord = createRecord({
              great_profile_status: 'published',
            })
            const data = viewRecord[GREAT_LABEL]

            expect(data).to.have.property('url', greatUrlProfileResponse)
            expect(data).to.have.property('newWindow', true)
            expect(data).to.have.property('name', '"Find a supplier" profile')
            expect(data).to.have.property('hint', '(opens in a new window)')

            expect(urls.external.greatProfile).to.have.been.calledWith(
              companiesHouseNumber
            )
          })
        })

        context('when a profile is unpublished', () => {
          it('should return the label and data', () => {
            const viewRecord = createRecord({
              great_profile_status: 'unpublished',
            })
            expect(viewRecord).to.have.property(
              GREAT_LABEL,
              'Profile not published'
            )
          })
        })

        context('without a profile', () => {
          it('should return the label and data', () => {
            const viewRecord = createRecord({ great_profile_status: null })
            expect(viewRecord).to.have.property(GREAT_LABEL, 'No profile')
          })
        })
      })
    })

    context('when the interaction-add-countries feature flag is true', () => {
      context('when multiple countries have been added', () => {
        it('should show the countries', () => {
          const {
            future,
            current,
            noInterest,
            exportCountries,
          } = generateExportCountries()

          const company = {
            ...minimalCompany,
            export_countries: exportCountries,
          }

          function getCountryText(countries) {
            return countries.map(([, name]) => name).join(', ')
          }

          const viewRecord = transformers.transformCompanyToExportDetailsView(
            company,
            true
          )

          expect(viewRecord).to.have.property(
            'Currently exporting to',
            getCountryText(current)
          )
          expect(viewRecord).to.have.property(
            'Future countries of interest',
            getCountryText(future)
          )
          expect(viewRecord).to.have.property(
            'Countries of no interest',
            getCountryText(noInterest)
          )
        })
      })
    })
  })

  describe('createExportHistory', () => {
    const mockResponse = {
      count: 123,
      next: 'string',
      previous: 'string',
      results: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          type: 'interaction',
          contacts: [
            {
              name: 'Jim Smith',
              id: '3da5dc1f-75d3-454f-bb1d-4d2c72b672b9',
            },
            {
              name: 'Jane Doe',
              id: '99184536-228c-4229-bfbb-85e9234cea2c',
            },
          ],
          created_on: '2020-01-13T15:27:54.438Z',
          created_by: '9f06c1f1-b2fb-45a5-9710-11b41b8e8031',
          modified_by: 'fde45024-021b-4bcc-a650-e5da751e0d90',
          modified_on: '2020-01-13T15:27:54.438Z',
          date: '2020-01-13T15:27:54.438Z',
          dit_participants: [
            {
              adviser: 'Paul',
              team: 'string',
            },
            {
              adviser: 'John',
              team: 'string',
            },
          ],
          service: 'A service name here',
          subject: 'the subject',
          were_countries_discussed: true,
          export_countries: [
            {
              country: '',
            },
          ],
        },
        {
          id: 'f219dae2-f2e1-4bd8-b6b8-a20f9f08d6e7',
          type: 'interaction',
          contacts: [
            {
              name: 'Jane Smith',
              id: 'b412fc53-2d6f-4e5e-a2d4-5522832d8aee',
            },
          ],
          created_on: '2020-01-13T15:27:54.438Z',
          created_by: '9f06c1f1-b2fb-45a5-9710-11b41b8e8031',
          modified_by: 'fde45024-021b-4bcc-a650-e5da751e0d90',
          modified_on: '2020-01-13T15:27:54.438Z',
          date: '2020-01-13T15:27:54.438Z',
          dit_participants: [
            {
              adviser: 'Sally',
              team: 'string',
            },
          ],
          service: 'A service name here',
          subject: 'the subject',
          were_countries_discussed: true,
          export_countries: [
            {
              country: '',
            },
          ],
        },
        {
          id: '123e456u-895-etf56-uuid-5tu44-1',
          type: 'export_country_future_interest',
          edit_history: 'insert',
          modified_by: 'Bob 1',
          created_on: '2020-01-13T15:27:54.438Z',
          modified_on: '2020-01-13T15:27:54.438Z',
          countries: ['France', 'China'],
        },
        {
          id: '123e456u-895-etf56-uuid-5tu44-1',
          type: 'export_country_future_interest',
          edit_history: 'delete',
          modified_by: 'Bob 2',
          created_on: '2020-01-13T15:27:54.438Z',
          modified_on: '2020-01-13T15:27:54.438Z',
          countries: ['France', 'China'],
        },
        {
          id: '123e456u-895-etf56-uuid-5tu44-2',
          type: 'export_country_currently_exporting',
          edit_history: 'insert',
          modified_by: 'Jill 1',
          created_on: '2020-01-13T15:27:54.438Z',
          modified_on: '2020-01-13T15:27:54.438Z',
          countries: ['Madagascar', 'Kenya'],
        },
        {
          id: '123e456u-895-etf56-uuid-5tu44-2',
          type: 'export_country_currently_exporting',
          edit_history: 'delete',
          modified_by: 'Jill 2',
          created_on: '2020-01-13T15:27:54.438Z',
          modified_on: '2020-01-13T15:27:54.438Z',
          countries: ['Madagascar', 'Kenya'],
        },
        {
          id: '123e456u-895-etf56-uuid-5tu44-3',
          type: 'export_country_no_interest',
          edit_history: 'insert',
          modified_by: 'Fred 1',
          modified_on: '2020-01-13T15:27:54.438Z',
          created_on: '2020-01-13T15:27:54.438Z',
          countries: ['Argentina', 'Greenland', 'Zimbabwe'],
        },
        {
          id: '123e456u-895-etf56-uuid-5tu44-3',
          type: 'export_country_no_interest',
          edit_history: 'delete',
          modified_by: 'Fred 2',
          modified_on: '2020-01-13T15:27:54.438Z',
          created_on: '2020-01-13T15:27:54.438Z',
          countries: ['Argentina', 'Greenland', 'Zimbabwe'],
        },
      ],
    }

    context('With a full history', () => {
      it('Should return the data in the correct format', () => {
        const [
          interaction1,
          interaction2,
          future1,
          future2,
          current1,
          current2,
          noInterest1,
          noInterest2,
        ] = mockResponse.results
        const output = transformers.createExportHistory(mockResponse)

        expect(output.count).to.equal(mockResponse.count)
        expect(output.results.length).to.equal(mockResponse.results.length)

        expect(output.results).to.deep.equal([
          {
            headingText: interaction1.subject,
            badges: ['Interaction'],
            metadata: [
              { label: 'Date', value: formatDateTime(interaction1.created_on) },
              {
                label: 'Contacts',
                value: interaction1.contacts.map(({ name }) => name).join(', '),
              },
              {
                label: 'Advisors',
                value: interaction1.dit_participants
                  .map(({ adviser }) => adviser)
                  .join(', '),
              },
              {
                label: 'Service',
                value: interaction1.service,
              },
            ],
          },
          {
            headingText: interaction2.subject,
            badges: ['Interaction'],
            metadata: [
              { label: 'Date', value: formatDateTime(interaction2.created_on) },
              {
                label: 'Contact',
                value: interaction2.contacts.map(({ name }) => name).join(', '),
              },
              {
                label: 'Advisor',
                value: interaction2.dit_participants
                  .map(({ adviser }) => adviser)
                  .join(', '),
              },
              {
                label: 'Service',
                value: interaction2.service,
              },
            ],
          },
          {
            headingText: `${future1.countries.join(
              ', '
            )} added to future countries of interest`,
            metadata: [
              { label: 'By', value: future1.modified_by },
              { label: 'Date', value: formatDateTime(future1.created_on) },
            ],
          },
          {
            headingText: `${future2.countries.join(
              ', '
            )} removed from future countries of interest`,
            metadata: [
              { label: 'By', value: future2.modified_by },
              { label: 'Date', value: formatDateTime(future2.created_on) },
            ],
          },
          {
            headingText: `${current1.countries.join(
              ', '
            )} added to currently exporting`,
            metadata: [
              { label: 'By', value: current1.modified_by },
              { label: 'Date', value: formatDateTime(current1.created_on) },
            ],
          },
          {
            headingText: `${current2.countries.join(
              ', '
            )} removed from currently exporting`,
            metadata: [
              { label: 'By', value: current2.modified_by },
              { label: 'Date', value: formatDateTime(current2.created_on) },
            ],
          },
          {
            headingText: `${noInterest1.countries.join(
              ', '
            )} added to countries of no interest`,
            metadata: [
              { label: 'By', value: noInterest1.modified_by },
              { label: 'Date', value: formatDateTime(noInterest1.created_on) },
            ],
          },
          {
            headingText: `${noInterest2.countries.join(
              ', '
            )} removed from countries of no interest`,
            metadata: [
              { label: 'By', value: noInterest2.modified_by },
              { label: 'Date', value: formatDateTime(noInterest2.created_on) },
            ],
          },
        ])
      })
    })
  })
})
