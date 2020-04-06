const faker = require('faker')

const minimalCompany = require('../../../../../../test/unit/data/companies/minimal-company.json')
const { transformCompanyToExportDetailsView } = require('../transformer')
const {
  generateExportCountries,
} = require('../../../../../../test/unit/helpers/generate-export-countries')
const { EXPORT_INTEREST_STATUS } = require('../../../../../apps/constants')

function createRegion(name, status) {
  const region = { id: faker.random.uuid(), name }
  return {
    input: {
      region,
      status,
    },
    output: region,
  }
}

describe('transformCompanyToExportDetailsView', () => {
  context('when no export market information has been entered', () => {
    it('should create the correct viewRecord data', () => {
      const company = {
        ...minimalCompany,
        export_experience_category: null,
        export_to_countries: [],
        future_interest_countries: [],
      }

      const viewRecord = transformCompanyToExportDetailsView(company)

      expect(viewRecord).to.deep.equal({
        exportPotential: {
          name: 'Export potential',
          value: undefined,
        },
        exportWinCategory: {
          name: 'Export win category',
          value: null,
        },
        greatProfile: {
          name: 'great.gov.uk business profile',
          value: undefined,
        },
        exportCountriesInformation: [
          { name: 'Currently exporting to', values: [] },
          { name: 'Future countries of interest', values: [] },
          { name: 'Countries of no interest', values: [] },
        ],
        exportRegionsInformation: [
          { name: 'Currently exporting to', values: [] },
          { name: 'Future countries of interest', values: [] },
          { name: 'Countries of no interest', values: [] },
        ],
      })
    })
  })

  context('when single values have been selected for drop down fields', () => {
    it('should create the correct viewRecord data', () => {
      const exportExperienceCategory = {
        id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
        name: 'Increasing export markets',
      }
      const regions = {
        current: createRegion(
          faker.lorem.words(),
          EXPORT_INTEREST_STATUS.EXPORTING_TO
        ),
        future: createRegion(
          faker.lorem.words(),
          EXPORT_INTEREST_STATUS.FUTURE_INTEREST
        ),
      }
      const company = {
        ...minimalCompany,
        export_experience_category: exportExperienceCategory,
        export_countries: [
          {
            country: {
              id: '1234',
              name: 'France',
            },
            status: 'currently_exporting',
          },
          {
            country: {
              id: '4321',
              name: 'Germany',
            },
            status: 'future_interest',
          },
        ],
        export_potential: 'low',
        export_regions: [regions.current.input, regions.future.input],
      }

      const viewRecord = transformCompanyToExportDetailsView(company)

      expect(viewRecord).to.deep.equal({
        exportPotential: {
          name: 'Export potential',
          value: 'Low',
        },
        exportWinCategory: {
          name: 'Export win category',
          value: 'Increasing export markets',
        },
        greatProfile: {
          name: 'great.gov.uk business profile',
          value: undefined,
        },
        exportCountriesInformation: [
          {
            name: 'Currently exporting to',
            values: [{ id: '1234', name: 'France' }],
          },
          {
            name: 'Future countries of interest',
            values: [{ id: '4321', name: 'Germany' }],
          },
          { name: 'Countries of no interest', values: [] },
        ],
        exportRegionsInformation: [
          {
            name: 'Currently exporting to',
            values: [regions.current.output],
          },
          {
            name: 'Future countries of interest',
            values: [regions.future.output],
          },
          { name: 'Countries of no interest', values: [] },
        ],
      })
    })
  })

  context(
    'when multiple values have been selected for drop down fields',
    () => {
      it('should create the correct viewRecord data', () => {
        const exportExperienceCategory = {
          id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
          name: 'Increasing export markets',
        }
        const regions = {
          currentA: createRegion('AAAA', EXPORT_INTEREST_STATUS.EXPORTING_TO),
          currentB: createRegion('BBBB', EXPORT_INTEREST_STATUS.EXPORTING_TO),
          noInterestA: createRegion(
            'AAA',
            EXPORT_INTEREST_STATUS.NOT_INTERESTED
          ),
          noInterestB: createRegion(
            'BBB',
            EXPORT_INTEREST_STATUS.NOT_INTERESTED
          ),
        }
        const company = {
          ...minimalCompany,
          export_experience_category: exportExperienceCategory,
          export_countries: [
            {
              country: {
                id: '1234',
                name: 'France',
              },
              status: 'currently_exporting',
            },
            {
              country: {
                id: '5511',
                name: 'Spain',
              },
              status: 'currently_exporting',
            },
            {
              country: {
                id: '4321',
                name: 'Germany',
              },
              status: 'future_interest',
            },
            {
              country: {
                id: '4123',
                name: 'Sweden',
              },
              status: 'future_interest',
            },
          ],
          export_regions: [
            regions.noInterestB.input,
            regions.noInterestA.input,
            regions.currentB.input,
            regions.currentA.input,
          ],
        }

        const viewRecord = transformCompanyToExportDetailsView(company)

        expect(viewRecord).to.deep.equal({
          exportPotential: {
            name: 'Export potential',
            value: undefined,
          },
          exportWinCategory: {
            name: 'Export win category',
            value: 'Increasing export markets',
          },
          greatProfile: {
            name: 'great.gov.uk business profile',
            value: undefined,
          },
          exportCountriesInformation: [
            {
              name: 'Currently exporting to',
              values: [
                {
                  id: '1234',
                  name: 'France',
                },
                {
                  id: '5511',
                  name: 'Spain',
                },
              ],
            },
            {
              name: 'Future countries of interest',
              values: [
                { id: '4321', name: 'Germany' },
                { id: '4123', name: 'Sweden' },
              ],
            },
            { name: 'Countries of no interest', values: [] },
          ],
          exportRegionsInformation: [
            {
              name: 'Currently exporting to',
              values: [regions.currentA.output, regions.currentB.output],
            },
            { name: 'Future countries of interest', values: [] },
            {
              name: 'Countries of no interest',
              values: [regions.noInterestA.output, regions.noInterestB.output],
            },
          ],
        })
      })
    }
  )

  describe('great profile', () => {
    const companiesHouseNumber = faker.random.alphaNumeric(8)

    function createRecord(props) {
      return transformCompanyToExportDetailsView({
        ...minimalCompany,
        company_number: companiesHouseNumber,
        ...props,
      })
    }

    context('when a profile is published', () => {
      it('should return the data to link to the profile', () => {
        const viewRecord = createRecord({ great_profile_status: 'published' })
        const data = viewRecord.greatProfile

        expect(data).to.deep.equal({
          name: 'great.gov.uk business profile',
          value: 'published',
        })
      })
    })

    context('when a profile is unpublished', () => {
      it('should return the label and data', () => {
        const viewRecord = createRecord({
          great_profile_status: 'unpublished',
        })
        const data = viewRecord.greatProfile

        expect(data).to.deep.equal({
          name: 'great.gov.uk business profile',
          value: 'unpublished',
        })
      })
    })

    context('without a profile', () => {
      it('should return the label and data', () => {
        const viewRecord = createRecord({ great_profile_status: undefined })
        const data = viewRecord.greatProfile

        expect(data).to.deep.equal({
          name: 'great.gov.uk business profile',
          value: undefined,
        })
      })
    })
  })

  context('when multiple countries have been added in all categories', () => {
    it('should show the countries', () => {
      const getCountriesByStatus = (values, status) =>
        values
          .filter((item) => item.status === status)
          .map((item) => item.country)
          .sort((a, b) => a.name.localeCompare(b.name))

      const { exportCountries } = generateExportCountries()

      const company = {
        ...minimalCompany,
        export_countries: exportCountries,
      }

      const viewRecord = transformCompanyToExportDetailsView(company)

      expect(viewRecord).to.deep.equal({
        exportWinCategory: { name: 'Export win category', value: null },
        greatProfile: {
          name: 'great.gov.uk business profile',
          value: undefined,
        },
        exportPotential: { name: 'Export potential', value: undefined },
        exportCountriesInformation: [
          {
            name: 'Currently exporting to',
            values: getCountriesByStatus(
              exportCountries,
              EXPORT_INTEREST_STATUS.EXPORTING_TO
            ),
          },
          {
            name: 'Future countries of interest',
            values: getCountriesByStatus(
              exportCountries,
              EXPORT_INTEREST_STATUS.FUTURE_INTEREST
            ),
          },
          {
            name: 'Countries of no interest',
            values: getCountriesByStatus(
              exportCountries,
              EXPORT_INTEREST_STATUS.NOT_INTERESTED
            ),
          },
        ],
        exportRegionsInformation: [
          { name: 'Currently exporting to', values: [] },
          { name: 'Future countries of interest', values: [] },
          { name: 'Countries of no interest', values: [] },
        ],
      })
    })
  })
})
