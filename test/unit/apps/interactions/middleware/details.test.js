
const { assign, merge } = require('lodash')

const interactionData = require('../../../data/interactions/new-interaction.json')
const servicesData = [
  { id: '9484b82b-3499-e211-a939-e4115bead28a', name: 'Account Management' },
  { id: '632b8708-28b6-e611-984a-e4115bead28a', name: 'Bank Referral' },
]
const contactsData = require('~/test/unit/data/contacts/contacts.json')

const adviserFilters = require('~/src/apps/adviser/filters')
const eventsRepos = require('~/src/apps/events/repos')

const transformed = {
  id: '1',
  data: 'transformed',
}

describe('Interaction details middleware', () => {
  beforeEach(() => {
    this.saveInteractionStub = sandbox.stub()
    this.fetchInteractionStub = sandbox.stub()
    this.transformInteractionFormBodyToApiRequestStub = sandbox.stub()
    this.transformInteractionResponseToViewRecordStub = sandbox.stub()
    this.getContactsForCompanyStub = sandbox.stub()
    this.getContactStub = sandbox.stub()
    this.getDitCompanyStub = sandbox.stub()
    this.filterActiveAdvisersSpy = sandbox.spy(adviserFilters, 'filterActiveAdvisers')
    this.getActiveEventsSpy = sandbox.spy(eventsRepos, 'getActiveEvents')

    this.middleware = proxyquire('~/src/apps/interactions/middleware/details', {
      '../repos': {
        saveInteraction: this.saveInteractionStub.resolves({ id: '1' }),
        fetchInteraction: this.fetchInteractionStub.resolves(interactionData),
      },
      '../transformers': {
        transformInteractionFormBodyToApiRequest: this.transformInteractionFormBodyToApiRequestStub.returns(transformed),
        transformInteractionResponseToViewRecord: this.transformInteractionResponseToViewRecordStub.returns(transformed),
      },
      '../../adviser/filters': {
        filterActiveAdvisers: this.filterActiveAdvisersSpy,
      },
      '../../../lib/metadata': {
        getServices: () => { return servicesData },
      },
      '../../contacts/repos': {
        getContactsForCompany: this.getContactsForCompanyStub.returns(contactsData),
        getContact: this.getContactStub,
      },
      '../../companies/repos': {
        getDitCompany: this.getDitCompanyStub,
      },
    })

    this.req = {
      session: {
        token: 'abcd',
      },
      flash: sandbox.spy(),
      body: assign({}, interactionData),
      query: {
        company: '299e7412-d9ee-4ab0-a4cb-a8cc00922c91',
      },
      params: {
        kind: 'interaction',
      },
    }

    this.res = {
      breadcrumb: sandbox.stub().returnsThis(),
      render: sandbox.spy(),
      redirect: sandbox.spy(),
      locals: {
        company: {
          id: '1',
        },
        returnLink: '/return/',
      },
    }

    this.nextSpy = sandbox.spy()

    this.activeInactiveAdviserData = {
      count: 5,
      results: [
        { id: '1', name: 'Jeff Smith', is_active: true },
        { id: '2', name: 'John Smith', is_active: true },
        { id: '3', name: 'Zac Smith', is_active: true },
        { id: '4', name: 'Fred Smith', is_active: false },
        { id: '5', name: 'Jim Smith', is_active: false },
      ],
    }
  })

  describe('#postDetails', () => {
    context('when all fields are valid for creating', () => {
      beforeEach(async () => {
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)
      })

      it('should post to the API', () => {
        expect(this.saveInteractionStub).to.have.been.calledWith(this.req.session.token)
        expect(this.saveInteractionStub).to.have.been.calledOnce
        expect(this.saveInteractionStub.firstCall.args[1]).to.deep.equal(transformed)
      })

      it('should flash a created message', () => {
        expect(this.req.flash).to.be.calledWith('success', 'Interaction created')
      })

      it('should redirect on success', () => {
        expect(this.res.redirect).to.be.calledWith('/return/1')
      })
    })

    context('when all fields are valid for updating', () => {
      beforeEach(async () => {
        const res = merge({}, this.res, {
          locals: {
            interaction: interactionData,
          },
        })
        await this.middleware.postDetails(this.req, res, this.nextSpy)
      })

      it('should flash an updated message', () => {
        expect(this.req.flash).to.be.calledWith('success', 'Interaction updated')
      })
    })

    context('when all fields are valid for updating an interaction found from the top level navigation', () => {
      it('should redirect on success', async () => {
        const res = assign({}, this.res, {
          breadcrumb: sandbox.stub().returnsThis(),
          render: sandbox.spy(),
          redirect: sandbox.spy(),
          locals: {},
        })

        await this.middleware.postDetails(this.req, res, this.nextSpy)

        expect(res.redirect).to.be.calledWith('/interactions/1')
      })
    })

    context('when there is a 400', () => {
      beforeEach(async () => {
        this.saveInteractionStub.rejects({ statusCode: 400, error: 'error' })
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)
      })

      it('should set the errors', () => {
        expect(this.res.locals.form.errors.messages).to.equal('error')
      })

      it('should not call next with errors', () => {
        expect(this.nextSpy).have.been.calledWith()
        expect(this.nextSpy).have.been.calledOnce
      })
    })

    context('when there is an error other than 400', () => {
      beforeEach(async () => {
        this.saveInteractionStub.rejects({ statusCode: 500, error: 'error' })
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)
      })

      it('should not set form', () => {
        expect(this.res.locals.form).to.be.undefined
      })

      it('should call next with errors', () => {
        expect(this.nextSpy).have.been.calledWith({ statusCode: 500, error: 'error' })
        expect(this.nextSpy).have.been.calledOnce
      })
    })
  })

  describe('#getInteractionDetails', () => {
    context('when provided an interaction with a company associated', () => {
      beforeEach(async () => {
        this.company = sandbox.mock()
        this.interaction = assign({}, interactionData, { company: this.company })
        this.fetchInteractionStub.resolves(this.interaction)
        await this.middleware.getInteractionDetails(this.req, this.res, this.nextSpy, '1')
      })

      it('should set interaction data on locals', () => {
        expect(this.res.locals.interaction).to.deep.equal(this.interaction)
      })

      it('should set company to the one associated with the interaction', () => {
        expect(this.res.locals.company).to.deep.equal(this.company)
      })
    })

    context('when provided an investment interaction with no company', () => {
      beforeEach(async () => {
        this.interaction = assign({}, interactionData, {
          company: null,
          contact: {
            id: '4444',
          },
        })

        this.fetchInteractionStub.resolves(this.interaction)

        this.getContactStub.resolves({
          company: {
            id: '1234',
          },
        })

        this.company = sandbox.mock()
        this.getDitCompanyStub.resolves(this.company)

        await this.middleware.getInteractionDetails(this.req, this.res, this.nextSpy, '1')
      })

      it('should set interaction data on locals', () => {
        expect(this.res.locals.interaction).to.deep.equal(this.interaction)
      })

      it('should set company to the one associated with the interaction contact', () => {
        expect(this.res.locals.company).to.deep.equal(this.company)
      })
    })
  })
})
