require('core-js/fn/array/from')
const ConditionalSubfields = require('./modules/conditional-subfields')
const SortableTable = require('./modules/sortable-table')
const DetailsList = require('./modules/details-list')
const LabelSelect = require('./modules/label-select')

const AddAnotherField = require('./_deprecated/add-another-field')
const ArchiveForm = require('./_deprecated/archive-form')
const CompanyAdd = require('./_deprecated/company-add')
const CompanyEdit = require('./_deprecated/company-edit')
const ContactEdit = require('./_deprecated/contact-edit')
const ExpandableCard = require('./_deprecated/expandable-card')
const ClippedList = require('./_deprecated/clipped-list')

LabelSelect.init()
ConditionalSubfields.init()
SortableTable.init()
DetailsList.init()

// Deprecated
AddAnotherField.init()
ArchiveForm.init()
CompanyAdd.init()
CompanyEdit.init()
ContactEdit.init()
ExpandableCard.init()

/* eslint no-new: 0 */
new ClippedList(document.getElementById('interactions-list'), 'See all new interactions', 'See less interactions')
new ClippedList(document.getElementById('contacts-list'), 'See all new contacts', 'See less contacts')
