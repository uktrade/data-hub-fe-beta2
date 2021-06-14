module.exports = {
  name: '#field-name',
  statusActive: '[for="field-archived-1"]',
  statusInactive: '[for="field-archived-2"]',
  ukRegion: '#group-field-uk_region',
  area: '#group-field-area',
  ukPostcode: '#field-uk_postcode',
  completedOnAfterTextInput: '#field-completed_on_after',
  country: '#group-field-country',
  sector: '#group-field-sector_descends',
  exportingTo: '#group-field-export_to_countries',
  interestedIn: '#group-field-future_interest_countries',
  firstInteractionDate: '[for="field-interaction_between-1"]',
  leadIta: '#group-field-one_list_group_global_account_manager',
  contacts: {
    sector: '#group-field-company_sector_descends',
    companyName: '#field-company_name',
    country: '#group-field-address_country',
    ukRegion: '#group-field-company_uk_region',
  },
  interaction: {
    myInteractions: '[for="field-dit_participants__adviser-1"]',
  },
  investments: {
    companyName: '#group-field-sector_descends',
    country: '#group-field-investor_company_country',
    ukRegion: '#group-field-uk_region_location',
    sector: '#group-field-sector_descends',
  },
  omis: {
    country: '#group-field-primary_market',
    firstUkRegion: '[for="field-uk_region-1"]',
    sector: '#group-field-sector_descends',
  },
  events: {
    country: '#group-field-address_country',
    ukRegion: '#group-field-uk_region',
  },
  companies: {
    country: '#group-field-address_country',
    sector: '#group-field-company_sector_descends',
  },
  typeahead(id) {
    return {
      fieldset: id,
      placeHolder: `${id} .multiselect__tags`,
      textInput: `${id} .multiselect__input`,
      selectedOption: `${id} .multiselect`,
      addAnotherBtn: `${id} .js-AddItems__add--typeahead`,
      firstOption: `${id} .multiselect__element:nth-child(1)`,
      options: `${id} .multiselect__element`,
    }
  },
}
