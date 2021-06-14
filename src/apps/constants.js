const ERROR = {
  SELECT_AN_OPTION: 'You must select an option',
  ENTER_A_DATE: 'You must enter a date',
}

// The order here controls the order they are displayed to the user
// either on a form or when displaying the values
const EXPORT_INTEREST_STATUS = {
  EXPORTING_TO: 'currently_exporting',
  FUTURE_INTEREST: 'future_interest',
  NOT_INTERESTED: 'not_interested',
}

const OPTION_YES = 'yes'
const OPTION_NO = 'no'
const OPTIONS_YES_NO = [
  { label: 'Yes', value: OPTION_YES },
  { label: 'No', value: OPTION_NO },
]

const US_COUNTRY_ID = '81756b9a-5d95-e211-a939-e4115bead28a'
const CANADA_COUNTRY_ID = '5daf72a6-5d95-e211-a939-e4115bead28a'

module.exports = {
  ERROR,
  EXPORT_INTEREST_STATUS,
  EXPORT_INTEREST_STATUS_VALUES: Object.values(EXPORT_INTEREST_STATUS),
  OPTION_YES,
  OPTION_NO,
  OPTIONS_YES_NO,
  US_COUNTRY_ID,
  CANADA_COUNTRY_ID,
}
