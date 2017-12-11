require('core-js/fn/array/from')
require('core-js/fn/promise')
require('element-closest')
require('classlist.js')

const ConditionalSubfields = require('./modules/conditional-subfields')
const SortableTable = require('./modules/sortable-table')
const LabelSelect = require('./modules/label-select')
const ArchiveForm = require('./modules/archive-form')
const Messages = require('./modules/messages')
const ErrorSummary = require('./modules/error-summary')
const AutoSubmit = require('./modules/auto-submit')
const XhrLink = require('./modules/xhr-link')
const AddItems = require('./modules/add-items')
const PrintDialog = require('./modules/print-dialog')
const Autocomplete = require('./modules/autocomplete')

const CompanyAdd = require('./_deprecated/company-add')
const CompanyEdit = require('./_deprecated/company-edit')

LabelSelect.init()
ConditionalSubfields.init()
SortableTable.init()
ArchiveForm.init()
Messages.init()
ErrorSummary.init()
AutoSubmit.init()
XhrLink.init()
AddItems.init()
PrintDialog.init()
Autocomplete.init()

document.addEventListener('AddItems_Render', () => {
  Autocomplete.init()
})

// Deprecated
CompanyAdd.init()
CompanyEdit.init()
