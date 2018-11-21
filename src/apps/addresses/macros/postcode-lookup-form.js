module.exports = ({
  returnLink,
  errors = {},
  state = {},
}) => {
  return {
    children: [
      {
        macroName: 'TextField',
        name: 'postcode',
        label: 'Postcode',
        modifier: 'short',
        innerHTML: '<button class="button">Find address</button>',
        validations: [
          {
            type: 'required',
            message: 'Postcode is required',
          },
          {
            type: 'postcode',
            message: 'A valid postcode is required',
          },
        ],
        error: errors.postcode,
        value: state.postcode,
      },
    ],
    hidePrimaryFormAction: true,
  }
}
