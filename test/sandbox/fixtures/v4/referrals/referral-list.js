var whoami = require('../../../fixtures/whoami.json')

module.exports = [
  {
    id: 'aaa',
    status: 'outstanding',
    subject: 'Yeah, but no, but yeah, but no',
    created_on: '2020-01-04',
    company: {
      name: 'Chav Fashion Outlet',
      id: 'chav-fashion-outlet',
    },
    created_by: {
      name: 'Vicky Pollard',
      contact_email: 'vickypollard@gmail.com',
      dit_team: {
        name: 'Little Britain',
      },
    },
    recipient: {
      name: 'Coach',
      contact_email: 'coach@wlbc.com',
      dit_team: {
        name: 'Wilderness Lodge Boot Camp',
      },
    },
  },
  {
    id: 'bbb',
    status: 'complete',
    subject: 'Andy to Lou',
    created_on: '2020-01-03',
    completed_on: '2021-11-25',
    company: {
      name: 'Andy & Lou',
      id: 'andy-and-lou',
    },
    created_by: {
      name: 'Andy Pipkin',
      contact_email: 'andy.pipkin@gov.uk',
      dit_team: {
        name: 'Little Britain',
      },
    },
    recipient: {
      name: 'Lou Todd',
      contact_email: 'lou.todd@gov.uk',
      dit_team: {
        name: 'Little Britain',
      },
    },
  },
  {
    id: 'ccc',
    status: 'outstanding',
    subject: 'Lou to Andy',
    created_on: '2020-01-02',
    company: {
      name: 'Andy & Lou',
      id: 'andy-and-lou',
    },
    created_by: {
      name: 'Lou Todd',
      contact_email: 'lou.todd@gov.uk',
      dit_team: {
        name: 'Little Britain',
      },
    },
    recipient: {
      name: 'Andy Pipkin',
      contact_email: 'andy.pipkin@gov.uk',
      dit_team: {
        name: 'Little Britain',
      },
    },
  },
  {
    id: 'ddd',
    status: 'complete',
    completed_on: '2021-11-25',
    subject: 'Have you got a bandage?',
    created_on: '2020-01-05',
    company: {
      name: 'Andy & Lou',
      id: 'andy-and-lou',
    },
    created_by: {
      id: whoami.id,
      name: 'Andy Pipkin',
      dit_team: {
        name: 'Little Britain',
      },
    },
    recipient: {
      name: 'Lou Todd',
    },
  },
  {
    id: 'eee',
    status: 'complete',
    completed_on: '2021-11-25',
    subject: 'Yeah, I know',
    created_on: '2020-01-06',
    company: {
      name: 'Andy & Lou',
      id: 'andy-and-lou',
    },
    created_by: {
      id: whoami.id,
      name: 'Andy Pipkin',
      dit_team: {
        name: 'Little Britain',
      },
    },
    recipient: {
      name: 'Lou Todd',
    },
  },
  {
    id: 'fff',
    status: 'complete',
    completed_on: '2021-11-25',
    subject: 'Computer says no',
    created_on: '2020-01-02',
    company: {
      name: 'Computer supply inc',
      id: 'cosuplyinc',
    },
    created_by: {
      id: whoami.id,
      name: 'Carol Beer',
      dit_team: {
        name: 'Little Britain',
      },
    },
    recipient: {
      name: 'Daffyd Thomas',
    },
  },
]
