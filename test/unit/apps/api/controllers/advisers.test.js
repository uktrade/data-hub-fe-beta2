const { assign } = require('lodash')

const config = require('~/config')
const { getAdviserOptionsHandler } = require('~/src//apps/api/controllers/advisers')

describe('Adviser options API controller', () => {
  beforeEach(() => {
    this.bertSmith = {
      id: '1',
      name: 'Bert Smith',
      is_active: false,
      last_login: null,
      first_name: 'Bert',
      last_name: 'Smith',
      email: 'bert.smith@mockexample.com',
      contact_email: '',
      telephone_number: '',
      dit_team: {
        id: 't1',
        name: 'Team E',
        role: 'r1',
        uk_region: null,
        country: 'c1',
      },
    }

    this.reqMock = {
      session: {
        token: '1234',
      },
    }

    this.resMock = {
      json: sandbox.spy(),
    }

    this.nextSpy = sandbox.spy()
  })

  context('when called with a name for an adviser', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/adviser/?first_name__icontains=be')
        .reply(200, {
          results: [this.bertSmith],
        })

      const reqMock = assign({}, this.reqMock, {
        query: {
          term: 'be',
        },
      })

      await getAdviserOptionsHandler(reqMock, this.resMock, this.nextSpy)
    })

    it('should return the advisers found, transformed', () => {
      expect(this.resMock.json).to.be.calledWith([{
        value: '1',
        label: 'Bert Smith',
        subLabel: 'Team E',
      }])
    })
  })
})
