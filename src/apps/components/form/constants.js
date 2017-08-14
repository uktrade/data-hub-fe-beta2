module.exports.macros = {
  standardForm: {
    children: [
      {
        macroName: 'TextField',
        name: 'name',
        label: 'Company name',
        placeholder: 'e.g. Hooli',
      },
      {
        macroName: 'TextField',
        name: 'description',
        label: 'Describe yourself',
        placeholder: 'Lorem ipsum',
        type: 'textarea',
        hint: 'A few words about yourself',
        optional: true,
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'country',
        label: 'Country',
        initialOption: '-- Select country --',
      },
      {
        macroName: 'MultipleChoiceField',
        name: 'sector',
        label: 'Sectors',
        initialOption: '-- Select sector --',
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'checkbox',
        name: 'strategicDrivers',
        label: 'Strategic drivers',
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        name: 'averageSalary',
        label: 'Average salary range',
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        name: 'feedbackType',
        modifier: 'inline',
        label: 'Inline inputs',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        macroName: 'Fieldset',
        legend: 'Inline text fields',
        children: [
          {
            macroName: 'TextField',
            name: 'subFirstName',
            label: 'First name',
            modifier: 'inline',
          },
          {
            macroName: 'TextField',
            name: 'subLastName',
            label: 'Last name',
            modifier: 'inline',
          },
        ],
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        name: 'businessType',
        label: 'Company type',
        options: [
          {
            value: 'ltd',
            label: 'UK private or public limited company',
            hint: 'Must be a company registered with Companies House',
          }, {
            value: 'ukother',
            label: 'Other type of UK organisation',
            hint: 'UK organisation not registered with Companies House',
            children: [
              {
                macroName: 'MultipleChoiceField',
                name: 'foreignOtherCompany',
                label: 'Type of organisation',
                initialOption: '-- Select organisation type --',
                options: [
                  { label: 'Charity' },
                  { label: 'Limited company' },
                ],
                condition: {
                  name: 'businessType',
                  value: 'ukother',
                },
                modifier: 'subfield',
              },
            ],
          }, {
            value: 'foreign',
            label: 'Foreign organisation',
          },
        ],
      },
      {
        macroName: 'Fieldset',
        legend: 'A set of fields',
        children: [
          {
            macroName: 'TextField',
            name: 'firstName',
            label: 'First name',
          },
          {
            macroName: 'TextField',
            name: 'lastName',
            label: 'Last name',
          },
        ],
      },
      {
        macroName: 'DateFieldset',
        name: 'estimated_date',
        label: 'What is your favourite day?',
        hint: 'A day you really like',
      },
    ],
  },
}
