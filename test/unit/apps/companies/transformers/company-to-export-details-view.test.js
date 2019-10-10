const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')
const { transformCompanyToExportDetailsView } = require('~/src/apps/companies/transformers')

const EXPORT_POTENTIAL_LABEL = 'Export potential'

describe('transformCompanyToExportDetailsView', () => {
  context('when no export market information has been entered', () => {
    beforeEach(() => {
      const company = {
        ...minimalCompany,
        export_experience_category: null,
        export_to_countries: [],
        future_interest_countries: [],
      }

      this.viewRecord = transformCompanyToExportDetailsView(company)
    })

    it('should show the country currently exporting to', () => {
      expect(this.viewRecord).to.have.property('Currently exporting to', 'None')
    })

    it('should not show the country the company wants to export to', () => {
      expect(this.viewRecord).to.have.property('Future countries of interest', 'None')
    })

    it('should show the export win category', () => {
      expect(this.viewRecord).to.have.property('Export win category', 'None')
    })

    it('should show the export potential', () => {
      expect(this.viewRecord).to.have.property(EXPORT_POTENTIAL_LABEL, 'No score given')
    })
  })

  context('when single values have been selected for drop down fields', () => {
    beforeEach(() => {
      this.exportExperienceCategory = {
        id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
        name: 'Increasing export markets',
      }
      const company = {
        ...minimalCompany,
        export_experience_category: this.exportExperienceCategory,
        export_to_countries: [{
          id: '1234',
          name: 'France',
        }],
        future_interest_countries: [{
          id: '4321',
          name: 'Germany',
        }],
        export_potential_score: 'low',
      }

      this.viewRecord = transformCompanyToExportDetailsView(company)
    })

    it('should show the country currently exporting to', () => {
      expect(this.viewRecord).to.have.property('Currently exporting to', 'France')
    })

    it('should not show the country the company wants to export to', () => {
      expect(this.viewRecord).to.have.property('Future countries of interest', 'Germany')
    })

    it('should show the export win category', () => {
      expect(this.viewRecord).to.have.property('Export win category', this.exportExperienceCategory)
    })

    it('should show the export potential', () => {
      expect(this.viewRecord).to.have.property(EXPORT_POTENTIAL_LABEL, 'Low')
    })
  })

  context('when multiple values have been selected for drop down fields', () => {
    beforeEach(() => {
      this.exportExperienceCategory = {
        id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
        name: 'Increasing export markets',
      }
      const company = {
        ...minimalCompany,
        export_experience_category: this.exportExperienceCategory,
        export_to_countries: [{
          id: '1234',
          name: 'France',
        }, {
          id: '5511',
          name: 'Spain',
        }],
        future_interest_countries: [{
          id: '4321',
          name: 'Germany',
        }, {
          id: '4123',
          name: 'Sweden',
        }],
      }

      this.viewRecord = transformCompanyToExportDetailsView(company)
    })

    it('should show the country currently exporting to', () => {
      expect(this.viewRecord).to.have.property('Currently exporting to', 'France, Spain')
    })

    it('should not show the country the company wants to export to', () => {
      expect(this.viewRecord).to.have.property('Future countries of interest', 'Germany, Sweden')
    })

    it('should show the export win category', () => {
      expect(this.viewRecord).to.have.property('Export win category', this.exportExperienceCategory)
    })
  })
})
