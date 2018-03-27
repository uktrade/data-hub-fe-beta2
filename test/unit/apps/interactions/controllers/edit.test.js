const { assign, merge, find } = require('lodash')

const interactionData = require('../../../data/interactions/new-interaction.json')

describe('Interaction edit controller', () => {
  const currentUserTeam = 'team1'

  beforeEach(() => {
    this.controller = require('~/src/apps/interactions/controllers/edit')
    this.req = {
      session: {
        token: 'abcd',
        user: {
          dit_team: {
            id: currentUserTeam,
          },
        },
      },
      query: {
        communication_channel: '1',
      },
      body: {},
      params: {
        kind: 'interaction',
      },
    }
    this.res = {
      breadcrumb: sandbox.stub().returnsThis(),
      title: sandbox.stub().returnsThis(),
      render: sandbox.spy(),
      redirect: sandbox.spy(),
      locals: {
        entityName: 'company',
        returnLink: 'return',
        company: {
          id: '1',
        },
      },
    }
    this.nextSpy = sandbox.spy()
  })

  describe('#renderEditPage', () => {
    context('when rendering the interaction form for a company', () => {
      beforeEach(async () => {
        await this.controller.renderEditPage(this.req, this.res, this.nextSpy)
      })

      it('should render the interaction page', async () => {
        expect(this.res.render).to.be.calledWith('interactions/views/edit')
        expect(this.res.render).to.have.been.calledOnce
      })

      it('should render the interaction page with a return link', async () => {
        const actual = this.res.render.getCall(0).args[1].interactionForm.returnLink

        expect(actual).to.equal('return')
      })

      it('should render the interaction page with an interaction form', async () => {
        const actual = this.res.render.getCall(0).args[1].interactionForm.children

        expect(actual).to.be.an('array')
      })

      it('should render an interaction form with hidden fields', async () => {
        const actualHiddenFields = this.res.render.getCall(0).args[1].interactionForm.hiddenFields

        expect(actualHiddenFields.company).to.equal('1')
        expect(actualHiddenFields.investment_project).to.be.undefined
      })

      it('should render an interaction form with the service provider pre-seledcted', async () => {
        const interactionForm = this.res.render.getCall(0).args[1].interactionForm
        const actualServiceProvider = find(interactionForm.children, { name: 'dit_team' }).value

        expect(actualServiceProvider).to.equal(currentUserTeam)
      })
    })

    context('when rendering the interaction form for an investment project', () => {
      it('should render an interaction form with hidden fields', async () => {
        const res = merge({}, this.res, {
          locals: {
            investmentData: {
              id: '2',
            },
          },
        })
        await this.controller.renderEditPage(this.req, res, this.nextSpy)

        const actualHiddenFields = this.res.render.getCall(0).args[1].interactionForm.hiddenFields

        expect(actualHiddenFields.company).to.equal('1')
        expect(actualHiddenFields.investment_project).to.equal('2')
      })
    })

    context('when rendering the interaction form for editing an interaction found from top level navigation', () => {
      it('should render an interaction form with hidden fields', async () => {
        const res = assign({}, this.res, {
          locals: {
            company: {
              id: '1',
            },
            interaction: {
              id: '3',
            },
          },
        })
        await this.controller.renderEditPage(this.req, res, this.nextSpy)

        const actualHiddenFields = this.res.render.getCall(0).args[1].interactionForm.hiddenFields

        expect(actualHiddenFields.company).to.equal('1')
        expect(actualHiddenFields.id).to.equal('3')
        expect(actualHiddenFields.investment_project).to.be.undefined
      })

      it('should add a title without entity name', async () => {
        const res = assign({}, this.res, {
          locals: {
            company: {
              id: '1',
            },
          },
        })

        await this.controller.renderEditPage(this.req, res, this.nextSpy)

        expect(this.res.title.firstCall).to.be.calledWith('Add interaction')
      })
    })

    context('when adding an interaction', () => {
      beforeEach(async () => {
        await this.controller.renderEditPage(this.req, this.res, this.nextSpy)
      })
      it('should add a breadcrumb', () => {
        expect(this.res.breadcrumb.firstCall).to.be.calledWith('Add interaction')
      })

      it('should add a title', () => {
        expect(this.res.title.firstCall).to.be.calledWith('Add interaction for company')
      })
    })

    context('when adding a policy feedback', () => {
      beforeEach(async () => {
        const req = merge({}, this.req, {
          params: {
            kind: 'policy-feedback',
          },
        })
        await this.controller.renderEditPage(req, this.res, this.nextSpy)
      })
      it('should add a breadcrumb', () => {
        expect(this.res.breadcrumb.firstCall).to.be.calledWith('Add policy feedback')
      })

      it('should add a title', () => {
        expect(this.res.title.firstCall).to.be.calledWith('Add policy feedback for company')
      })
    })

    context('when adding a service delivery', () => {
      beforeEach(async () => {
        const req = merge({}, this.req, {
          params: {
            kind: 'service-delivery',
          },
        })
        await this.controller.renderEditPage(req, this.res, this.nextSpy)
      })
      it('should add a breadcrumb', () => {
        expect(this.res.breadcrumb.firstCall).to.be.calledWith('Add service delivery')
      })

      it('should add a title', () => {
        expect(this.res.title.firstCall).to.be.calledWith('Add service delivery for company')
      })
    })

    context('when editing an interaction', () => {
      beforeEach(async () => {
        this.res.locals.interaction = assign({}, interactionData, { id: '1' })
        await this.controller.renderEditPage(this.req, this.res, this.nextSpy)
      })

      it('should add a breadcrumb', async () => {
        expect(this.res.breadcrumb.firstCall).to.be.calledWith('Edit interaction')
      })

      it('should add a title', async () => {
        expect(this.res.title.firstCall).to.be.calledWith('Edit interaction for company')
      })
    })

    context('when editing a policy feedback', () => {
      beforeEach(async () => {
        this.res.locals.interaction = assign({}, interactionData, { id: '1' })
        const req = merge({}, this.req, {
          params: {
            kind: 'policy-feedback',
          },
        })
        await this.controller.renderEditPage(req, this.res, this.nextSpy)
      })

      it('should add a breadcrumb', () => {
        expect(this.res.breadcrumb.firstCall).to.be.calledWith('Edit policy feedback')
      })

      it('should add a title', () => {
        expect(this.res.title.firstCall).to.be.calledWith('Edit policy feedback for company')
      })
    })

    context('when editing a service delivery', () => {
      beforeEach(async () => {
        this.res.locals.interaction = assign({}, interactionData, { id: '1' })
        const req = merge({}, this.req, {
          params: {
            kind: 'service-delivery',
          },
        })
        await this.controller.renderEditPage(req, this.res, this.nextSpy)
      })

      it('should add a breadcrumb', () => {
        expect(this.res.breadcrumb.firstCall).to.be.calledWith('Edit service delivery')
      })

      it('should add a title', () => {
        expect(this.res.title.firstCall).to.be.calledWith('Edit service delivery for company')
      })
    })

    context('when there are validation errors', () => {
      it('should pre populate the errors', async () => {
        const messages = {
          subject: 'error 1',
          date: 'error 2',
        }

        const fieldLabels = {
          subject: 'Subject',
          date: 'Date of interaction',
        }

        const res = merge({}, this.res, {
          locals: {
            form: {
              errors: {
                messages,
              },
            },
          },
        })

        await this.controller.renderEditPage(this.req, res, this.nextSpy)

        const actualErrors = this.res.render.getCall(0).args[1].interactionForm.errors
        const expectedErrors = {
          summary: 'Please correct the following errors:',
          messages,
          fieldLabels,
        }

        expect(actualErrors).to.deep.equal(expectedErrors)
      })
    })
  })
})
