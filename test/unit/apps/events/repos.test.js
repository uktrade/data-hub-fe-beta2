const config = require('~/config')
const { search } = require('~/src/apps/search/services')

const token = 'abcd'

describe('Event repos', () => {
  beforeEach(() => {
    this.authorisedRequestStub = sinon.stub().resolves()
    this.searchSpy = sinon.spy(search)
    this.repos = proxyquire('~/src/apps/events/repos', {
      '../../lib/authorised-request': { authorisedRequest: this.authorisedRequestStub },
      '../search/services': {
        search: this.searchSpy,
      },
    })
  })

  describe('#saveEvent', () => {
    context('when POST request', () => {
      const eventMock = { name: 'Convention' }

      it('should call with POST method', () => {
        this.repos.saveEvent(token, eventMock)

        expect(this.authorisedRequestStub).to.be.calledWith(token, sinon.match({ method: 'POST' }))
      })

      it('should contain event form body', () => {
        this.repos.saveEvent(token, eventMock)

        expect(this.authorisedRequestStub).to.be.calledWith(token, sinon.match({ body: eventMock }))
      })
    })

    context('when PATCH request', () => {
      const eventMock = { id: '123', name: 'Convention' }

      it('should call with POST method', () => {
        this.repos.saveEvent(token, eventMock)

        expect(this.authorisedRequestStub).to.be.calledWith(token, sinon.match({ method: 'PATCH' }))
      })

      it('should set request URL to event URL', () => {
        this.repos.saveEvent(token, eventMock)

        expect(this.authorisedRequestStub)
          .to.be.calledWith(token, sinon.match({ url: `${config.apiRoot}/v3/event/${eventMock.id}` }))
      })

      it('should contain event form body', () => {
        const event = { name: 'Convention' }
        this.repos.saveEvent(token, eventMock)

        expect(this.authorisedRequestStub).to.be.calledWith(token, sinon.match({ body: event }))
      })
    })
  })

  describe('#fetchEvent', () => {
    it('should call with event URL', () => {
      this.repos.fetchEvent(token, '123')
      expect(this.authorisedRequestStub)
        .to.be.calledWith(token, `${config.apiRoot}/v3/event/123`)
    })
  })

  describe('#getActiveEvents', () => {
    context('When there is a mix of active and inactive events on the server', () => {
      beforeEach(() => {
        this.currentId = '3'

        this.eventCollection = {
          results: [{
            id: '2',
            disabled_on: null,
          }],
        }

        nock(config.apiRoot)
          .post('/v3/search/event')
          .reply(200, this.eventCollection)
      })

      context('and when asked for all active events', () => {
        beforeEach(async () => {
          const now = new Date()
          this.clock = sinon.useFakeTimers(now.getTime())

          this.currentFormattedTime = now.toISOString()

          this.events = await this.repos.getActiveEvents(token)
        })

        afterEach(() => {
          this.clock.restore()
        })

        it('should call search to get all active events today', () => {
          expect(this.searchSpy).to.be.calledWith({
            searchEntity: 'event',
            requestBody: {
              sortby: 'name:asc',
              disabled_on: {
                exists: false,
                after: this.currentFormattedTime,
              },
            },
            token,
            limit: 100000,
            isAggregation: false,
          })
        })
      })

      context('and when asked for all active events at a point in time', () => {
        beforeEach(async () => {
          const now = new Date()
          this.createdOn = now.toISOString()
          this.events = await this.repos.getActiveEvents(token, this.createdOn)
        })

        it('should call search to get all active events on the specified date', () => {
          expect(this.searchSpy).to.be.calledWith({
            searchEntity: 'event',
            requestBody: {
              sortby: 'name:asc',
              disabled_on: {
                exists: false,
                after: this.createdOn,
              },
            },
            token,
            limit: 100000,
            isAggregation: false,
          })
        })
      })
    })
  })
})
