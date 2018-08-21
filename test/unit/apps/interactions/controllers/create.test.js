const { assign } = require('lodash')

describe('Create interaction, step 1', () => {
  beforeEach(() => {
    this.kindFormStub = sinon.spy()

    this.create = proxyquire('~/src/apps/interactions/controllers/create', {
      '../macros': {
        kindForm: this.kindFormStub,
      },
    })

    this.req = {
      query: {},
      session: {
        token: '4321',
        user: {
          permissions: ['interaction.add_policy_feedback_interaction'],
        },
      },
      body: {},
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      redirect: sinon.spy(),
      render: sinon.spy(),
      locals: {
        interactions: {
          returnLink: '/return/',
        },
      },
    }

    this.next = sinon.spy()
  })

  describe('#postcreate', () => {
    context('when a request is made to add an interaction', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            kind: 'interaction',
          },
          query: {
            company: '1234',
            contact: '4321',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create interaction page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('/return/create/interaction')
      })
    })

    context('when a request is made to add a service delivery', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          body: {
            kind: 'service_delivery',
          },
          query: {
            company: '1234',
            contact: '4321',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should forward the user to the create service delivery page', () => {
        const redirectUrl = this.res.redirect.firstCall.args[0]
        expect(redirectUrl).to.contain('/return/create/service-delivery')
      })
    })

    context('when a request is made with no select', () => {
      beforeEach(() => {
        this.req = assign({}, this.req, {
          query: {
            company: '1234',
          },
        })

        this.create.postCreate(this.req, this.res, this.next)
      })

      it('should add an error to the response', () => {
        expect(this.res.locals.errors.messages.kind).to.deep.equal(['You must select an interaction type'])
      })

      it('should continue onto the render form controller', () => {
        expect(this.next).to.be.calledOnce
      })
    })
  })

  describe('renderCreate', () => {
    context('when a request is made with no errors', () => {
      beforeEach(() => {
        this.create.renderCreate(this.req, this.res, this.next)
      })

      it('should generate a form with no errors', () => {
        expect(this.kindFormStub).to.be.calledWith({
          errors: [],
          permissions: ['interaction.add_policy_feedback_interaction'],
        })
      })

      it('render the correct template', () => {
        expect(this.res.render).to.be.calledWith('interactions/views/create.njk')
      })
    })

    context('when a request is made with errors', () => {
      beforeEach(() => {
        this.res.locals.errors = {}
        this.create.renderCreate(this.req, this.res, this.next)
      })

      it('should generate a form with no errors', () => {
        expect(this.kindFormStub).to.be.calledWith({
          errors: this.res.locals.errors,
          permissions: ['interaction.add_policy_feedback_interaction'],
        })
      })
    })
  })
})
