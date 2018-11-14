const config = require('~/config')
const { renderInteractionList, renderInteractionsForEntity } = require('~/src/apps/interactions/controllers/list')

describe('interaction list', () => {
  beforeEach(() => {
    this.error = new Error('error')

    this.req = {
      session: {
        user: {
          id: '1234',
          name: 'Fred Smith',
          permissions: [],
        },
      },
      query: {
        sortby: 'date:desc',
      },
    }

    this.res = {
      render: sinon.stub(),
      breadcrumb: sinon.stub().returnsThis(),
    }

    this.next = sinon.stub()

    this.metadataMock = {
      teamOptions: [
        { id: 'te1', name: 'te1', disabled_on: null },
        { id: 'te2', name: 'te2', disabled_on: null },
        { id: 'te', name: 'te3', disabled_on: null },
      ],
      service: [
        { id: 's1', name: 's1', disabled_on: null },
        { id: 's2', name: 's2', disabled_on: null },
        { id: 's3', name: 's3', disabled_on: null },
      ],
      sectorOptions: [
        { id: 's1', name: 's1', disabled_on: null },
        { id: 's2', name: 's2', disabled_on: null },
        { id: 's3', name: 's3', disabled_on: null },
      ],
    }

    nock(config.apiRoot)
      .get('/metadata/service/')
      .reply(200, this.metadataMock.sectorOptions)
      .get('/metadata/team/')
      .reply(200, this.metadataMock.teamOptions)
      .get('/metadata/sector/?level__lte=0')
      .reply(200, this.metadataMock.sectorOptions)
  })

  context('#renderInteractionList', () => {
    context('when the user is allowed to view policy feedback data', () => {
      beforeEach(async () => {
        this.req.session.user.permissions = ['interaction.view_policy_feedback_interaction']
        await renderInteractionList(this.req, this.res, this.next)
      })

      it('should show the policy feedback filter', () => {
        const options = this.res.render.firstCall.args[1]
        const filterFields = options.filtersFields

        const kindField = filterFields.find(field => field.name === 'kind')
        expect(kindField.options).to.deep.equal([
          { value: 'interaction', label: 'Interaction' },
          { value: 'service_delivery', label: 'Service delivery' },
          { value: 'policy_feedback', label: 'Policy feedback' },
        ])
      })
    })

    context('when the user is not allowed to view policy feedback data', () => {
      beforeEach(async () => {
        await renderInteractionList(this.req, this.res, this.next)
      })

      it('should not show the policy feedback filter', () => {
        const options = this.res.render.firstCall.args[1]
        const filterFields = options.filtersFields

        const kindField = filterFields.find(field => field.name === 'kind')
        expect(kindField.options).to.deep.equal([
          { value: 'interaction', label: 'Interaction' },
          { value: 'service_delivery', label: 'Service delivery' },
        ])
      })
    })
  })

  context('#renderInteractionsForEntity', () => {
    context('when everything is okay', () => {
      const commonTests = () => {
        it('should render breadcrumbs', () => {
          expect(this.res.breadcrumb).to.have.been.calledWith('Interactions')
          expect(this.res.breadcrumb).to.have.been.calledOnce
        })

        it('should render the view', () => {
          expect(this.res.render).to.be.calledWith('entity/interactions')
          expect(this.res.render).to.have.been.calledOnce
        })
      }

      context('when interactions can be added to the entity', () => {
        beforeEach(async () => {
          this.res = {
            ...this.res,
            locals: {
              interactions: {
                view: 'entity/interactions',
                returnLink: 'entity/interactions/',
                createKind: 'interaction',
                canAdd: true,
              },
            },
          }

          await renderInteractionsForEntity(this.req, this.res, this.next)
        })

        commonTests()

        it('should render action buttons', () => {
          const actual = this.res.render.firstCall.args[1].actionButtons[0]
          expect(actual).to.deep.equal({
            label: 'Add interaction',
            url: 'entity/interactions/create/interaction',
          })
        })
      })

      context('when interactions cannot be added to the entity', () => {
        beforeEach(async () => {
          this.res = {
            ...this.res,
            locals: {
              interactions: {
                view: 'entity/interactions',
                returnLink: 'entity/interactions/',
                createKind: 'interaction',
                canAdd: false,
              },
            },
          }

          await renderInteractionsForEntity(this.req, this.res, this.next)
        })

        commonTests()

        it('should not render action buttons', () => {
          const actual = this.res.render.firstCall.args[1].actionButtons
          expect(actual).to.be.undefined
        })
      })
    })

    context('when there is an error', () => {
      beforeEach(async () => {
        this.res = {
          breadcrumb: sinon.stub().throws(this.error),
          render: this.res.render,
          locals: {
            interactions: {
              view: 'entity/interactions',
              returnLink: 'entity/interactions/',
              createKind: 'interaction',
            },
          },
        }

        await renderInteractionsForEntity(this.req, this.res, this.next)
      })

      it('should not render the view', () => {
        expect(this.res.render).to.have.not.been.called
      })

      it('should call next with error', () => {
        expect(this.next).to.have.been.calledWith(this.error)
        expect(this.next).to.have.been.calledOnce
      })
    })
  })
})
