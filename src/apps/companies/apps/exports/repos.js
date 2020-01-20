const mockResponse = {
  count: 4,
  next: 'string',
  previous: 'string',
  results: [
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      type: 'interaction',
      company: 'string',
      contacts: [{ name: 'Fred' }, { name: 'Jane' }],
      created_on: '2020-01-13T15:27:54.438Z',
      created_by: 'string',
      event: 'string',
      is_event: true,
      modified_by: 'string',
      modified_on: '2020-01-13T15:27:54.438Z',
      date: '2020-01-13T15:27:54.438Z',
      dit_participants: [
        {
          adviser: 'Jim Smith',
          team: 'string',
        },
      ],
      communication_channel: 'string',
      grant_amount_offered: 0,
      investment_project: 'string',
      net_company_receipt: 0,
      service: 'string',
      service_answers: {},
      service_delivery_status: 'string',
      subject: 'My interaction subject here',
      notes: 'string',
      archived_documents_url_path: 'string',
      policy_areas: ['string'],
      policy_feedback_notes: 'string',
      policy_issue_types: ['string'],
      was_policy_feedback_provided: true,
      were_countries_discussed: true,
      export_countries: [
        {
          country: 'string',
        },
      ],
      archived: true,
      archived_by: 'string',
      archived_on: '2020-01-13T15:27:54.438Z',
      archived_reason: 'string',
    },
    {
      id: '123e456u-895-etf56-uuid-5tu44-1',
      type: 'export_country_future_interest',
      edit_history: 'insert',
      modified_by: 'Bob Smith',
      created_on: '2020-01-13T15:27:54.438Z',
      modified_on: '2020-01-13T15:27:54.438Z',
      countries: ['France', 'China'],
    },
    {
      id: '123e456u-895-etf56-uuid-5tu44-2',
      type: 'export_country_currently_exporting',
      edit_history: 'delete',
      modified_by: 'Fred Smith',
      created_on: '2020-01-13T15:27:54.438Z',
      modified_on: '2020-01-13T15:27:54.438Z',
      countries: ['Madagascar', 'Kenya'],
    },
    {
      id: '123e456u-895-etf56-uuid-5tu44-3',
      type: 'export_country_no_interest',
      edit_history: 'delete',
      modified_by: 'Jane Doe',
      modified_on: '2020-01-13T15:27:54.438Z',
      created_on: '2020-01-13T15:27:54.438Z',
      countries: ['Argentina', 'Greenland', 'Zimbabwe'],
    },
  ],
}

// const authorisedRequest = require('../../../../lib/authorised-request')

module.exports = {
  getCompanyHistory: (token) => Promise.resolve(mockResponse),
}
