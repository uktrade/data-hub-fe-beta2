const qs = require('querystring')
const { buildExportAction } = require('~/src/lib/export-helper')

const queryString = {
  sortby: 'date:desc',
  custom: true,
}

const exportOptions = {
  targetPermission: 'interaction.export_interaction',
  urlFragment: 'interactions',
  maxItems: 5000,
  entityName: 'interaction',
}

describe('#export helper', () => {
  context('When a user has not got permission to export', () => {
    beforeEach(() => {
      const user = {
        permissions: [],
      }
      this.exportAction = buildExportAction(qs.stringify(queryString), user.permissions, exportOptions)
    })

    it('should return false if the user has not got permission', () => {
      expect(this.exportAction.enabled).to.equal(false)
    })
  })

  context('When a user has permission to export', () => {
    beforeEach(() => {
      const user = {
        permissions: [
          'interaction.export_interaction',
        ],
      }
      this.exportAction = buildExportAction(qs.stringify(queryString), user.permissions, exportOptions)
    })

    it('should return true if the user has permission', () => {
      expect(this.exportAction.enabled).to.equal(true)
    })

    it('should return a buildMessage function for the macro', () => {
      expect(this.exportAction.buildMessage).to.be.a('function')
    })

    it('should return a url for the export link/button', () => {
      expect(this.exportAction.url).to.equal('interactions/export?sortby=date%3Adesc&custom=true')
    })

    it('should return a maximum of 5000 results to export', () => {
      expect(this.exportAction.maxItems).to.equal(5000)
    })

    it('should return a invalidNumberOfItems function for the macro', () => {
      expect(this.exportAction.invalidNumberOfItems).to.be.a('function')
    })
  })
})
