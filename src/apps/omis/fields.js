module.exports = {
  company: {
    validate: 'required',
    label: 'fields.company.label',
  },
  contact: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.contact.label',
    validate: 'required',
    initialOption: '-- Select contact --',
    options: [],
  },
  primary_market: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.primary_market.label',
    validate: 'required',
    initialOption: '-- Select country --',
    options: [],
  },
  use_sector_from_company: {
    fieldType: 'MultipleChoiceField',
    type: 'radio',
    modifier: ['inline'],
    validate: 'required',
    label: 'fields.use_sector_from_company.label',
    options: [{
      value: 'true',
      label: 'Yes',
    },
    {
      value: 'false',
      label: 'No',
    }],
  },
  sector: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.sector.label',
    modifier: ['subfield'],
    validate: 'required',
    initialOption: '-- Select sector --',
    options: [],
    condition: {
      name: 'use_sector_from_company',
      value: 'false',
    },
    dependent: {
      field: 'use_sector_from_company',
      value: 'false',
    },
  },
}
