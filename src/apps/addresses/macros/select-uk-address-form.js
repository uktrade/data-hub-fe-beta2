module.exports = ({
  returnLink,
  errors = {},
  state = {},
  addresses = [],
  postcode,
}) => {
  return {
    returnLink,
    buttonText: 'Continue',
    children: [
      {
        macroName: 'PreviouslySelected',
        label: 'Postcode',
        value: postcode,
        url: 'postcode-lookup',
        name: 'previous_postcode',
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        name: 'lookup_address_id',
        label: 'Select an address',
        options: addresses,
        validations: [
          {
            type: 'required',
            message: 'Address is required',
          },
        ],
        error: errors.address,
        value: state.address,
      },
      {
        macroName: 'Link',
        url: 'manual-uk-address',
        text: 'I can\'t find the address in the list',
      },
    ],
  }
}
