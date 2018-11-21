module.exports = ({
  returnLink,
  errors = {},
  state = {},
}) => {
  return {
    returnLink,
    buttonText: 'Continue',
    children: [
      {
        macroName: 'TextField',
        name: 'address_1',
        label: 'Address line 1',
        validations: [
          {
            type: 'required',
            message: 'Address line 1 is required',
          },
        ],
        error: errors.address_1,
        value: state.address_1,
      },
      {
        macroName: 'TextField',
        name: 'address_2',
        label: 'Address line 2',
        optional: true,
        value: state.address_2,
      },
      {
        macroName: 'TextField',
        name: 'address_town',
        label: 'Town or city',
        validations: [
          {
            type: 'required',
            message: 'Town or city is required',
          },
        ],
        error: errors.address_town,
        value: state.address_town,
      },
      {
        macroName: 'TextField',
        name: 'address_county',
        label: 'County, province or state',
        optional: true,
        value: state.address_county,
      },
      {
        macroName: 'TextField',
        name: 'postcode',
        label: 'Post or zip code',
        validations: [
          {
            type: 'required',
            message: 'Post or zip code is required',
          },
        ],
        error: errors.postcode,
        value: state.postcode,
      },
    ],
  }
}
