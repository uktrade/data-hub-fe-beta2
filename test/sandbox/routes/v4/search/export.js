var fullExportHistoryPage1 = require('../../../fixtures/v4/export/full-export-history-page-1.json')
var fullExportHistoryPage2 = require('../../../fixtures/v4/export/full-export-history-page-2.json')
var emptyFullExportHistory = require('../../../fixtures/v4/export/empty-full-export-history.json')
var unkownUserExportHistory = require('../../../fixtures/v4/export/unkown-user-export-history.json')
var dnbCorp = require('../../../fixtures/v4/company/company-dnb-corp.json')
var marsExportsLtd = require('../../../fixtures/v4/company/company-mars-exports-ltd.json')

exports.fetchFullExportHistory = function(req, res) {
  if (req.body.company === dnbCorp.id) {
    if (req.body.offset === 10) {
      return res.json(fullExportHistoryPage2)
    }
    return res.json(fullExportHistoryPage1)
  }
  if (req.body.company === marsExportsLtd.id) {
    return res.json(unkownUserExportHistory)
  }
  return res.json(emptyFullExportHistory)
}
