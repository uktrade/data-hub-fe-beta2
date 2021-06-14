const endOfYesterday = require('date-fns/endOfYesterday')

const { omit } = require('lodash')

const config = require('../../../../config')
const {
  renderInteractionList,
  renderInteractionsForEntity,
  getInteractionOptions,
} = require('../list')
const serviceOptionData = require('../../../../../test/unit/data/interactions/service-options-data.json')

describe('interaction list', () => {
  let req, res, next
  let error
  let token
  let metadataMock

  beforeEach(() => {
    error = new Error('error')
    token = ''
    req = {
      session: {
        token,
        save: (cb) => cb(null),
        user: {
          id: '1234',
          name: 'Fred Smith',
          permissions: [],
        },
        xhr: false,
        interactions: {
          options: {
            option1: 'option1',
            option2: 'option2',
          },
        },
      },
      query: {
        sortby: 'date:desc',
      },
    }

    res = {
      render: sinon.stub(),
      breadcrumb: sinon.stub().returnsThis(),
      locals: {
        userAgent: {
          isIE: false,
        },
      },
    }

    next = sinon.stub()

    const yesterday = endOfYesterday()

    metadataMock = {
      teamOptions: [
        { id: 'te1', name: 'te1', disabled_on: null },
        { id: 'te2', name: 'te2', disabled_on: null },
        { id: 'te', name: 'te3', disabled_on: null },
      ],
      serviceOptions: serviceOptionData,
      sectorOptions: [
        { id: 's1', name: 's1', disabled_on: null },
        { id: 's2', name: 's2', disabled_on: null },
        { id: 's3', name: 's3', disabled_on: null },
      ],
      adviserOptions: {
        results: [
          {
            id: 'ad1',
            name: 'ad1',
            is_active: true,
            dit_team: { name: 'ad1' },
          },
        ],
      },
      policyAreaOptions: [
        { id: '1', name: 'pa1', disabled_on: null },
        { id: '2', name: 'pa2', disabled_on: yesterday },
        { id: '3', name: 'pa3', disabled_on: null },
      ],
      policyIssueType: [
        { id: '1', name: 'pt1', disabled_on: null },
        { id: '2', name: 'pt2', disabled_on: yesterday },
        { id: '3', name: 'pt3', disabled_on: null },
      ],
      oneListTierOptions: [
        { id: '1', name: 'tier1', disabled_on: null },
        { id: '2', name: 'tier2', disabled_on: yesterday },
        { id: '3', name: 'tier3', disabled_on: null },
      ],
    }

    nock(config.apiRoot)
      .get('/v4/metadata/service')
      .reply(200, metadataMock.serviceOptions)
      .get('/v4/metadata/team')
      .reply(200, metadataMock.teamOptions)
      .get('/v4/metadata/sector?level__lte=0')
      .reply(200, metadataMock.sectorOptions)
      .get('/adviser/?limit=100000&offset=0')
      .reply(200, metadataMock.adviserOptions)
      .get('/v4/metadata/policy-area')
      .reply(200, metadataMock.policyAreaOptions)
      .get('/v4/metadata/policy-issue-type')
      .reply(200, metadataMock.policyIssueType)
      .get('/v4/metadata/one-list-tier')
      .reply(200, metadataMock.oneListTierOptions)
  })

  context('#renderInteractionList', () => {
    beforeEach(async () => {
      await renderInteractionList(req, res, next)
    })

    it('displays the kind filters', () => {
      const options = res.render.firstCall.args[1]
      const filterFields = options.filtersFields

      const kindField = filterFields.find((field) => field.name === 'kind')
      expect(kindField.options).to.deep.equal([
        { value: 'interaction', label: 'Interaction' },
        { value: 'service_delivery', label: 'Service delivery' },
      ])
    })

    it('displays the one list group tier filters', () => {
      const options = res.render.firstCall.args[1]
      const filterFields = options.filtersFields

      const oneListGroupTierField = filterFields.find(
        (field) => field.name === 'company_one_list_group_tier'
      )
      expect(oneListGroupTierField.options).to.deep.equal([
        { value: '1', label: 'tier1' },
        { value: '3', label: 'tier3' },
      ])
    })
  })

  context('#renderInteractionsForEntity', () => {
    context('when everything is okay', () => {
      const commonTests = () => {
        it('should render breadcrumbs', () => {
          expect(res.breadcrumb).to.have.been.calledWith('Interactions')
          expect(res.breadcrumb).to.have.been.calledOnce
        })

        it('should render the view', () => {
          expect(res.render).to.be.calledWith('entity/interactions')
          expect(res.render).to.have.been.calledOnce
        })
      }

      context('when interactions can be added to the entity', () => {
        beforeEach(async () => {
          res = {
            ...res,
            locals: {
              interactions: {
                view: 'entity/interactions',
                returnLink: 'entity/interactions',
                createKind: 'interaction',
                theme: 'export',
                canAdd: true,
                isIE: false,
              },
            },
          }

          await renderInteractionsForEntity(req, res, next)
        })

        commonTests()

        it('should render action buttons', () => {
          const actual = res.render.firstCall.args[1].actionButtons[0]
          expect(actual).to.deep.equal({
            label: 'Add interaction',
            url: 'entity/interactions/create/export/interaction',
          })
        })
      })

      context('when interactions cannot be added to the entity', () => {
        beforeEach(async () => {
          res = {
            ...res,
            locals: {
              interactions: {
                view: 'entity/interactions',
                returnLink: 'entity/interactions/',
                createKind: 'interaction',
                canAdd: false,
              },
            },
          }

          await renderInteractionsForEntity(req, res, next)
        })

        commonTests()

        it('should not render action buttons', () => {
          const actual = res.render.firstCall.args[1].actionButtons
          expect(actual).to.be.undefined
        })
      })
    })

    context('when there is an error', () => {
      beforeEach(async () => {
        res = {
          breadcrumb: sinon.stub().throws(error),
          render: res.render,
          locals: {
            interactions: {
              view: 'entity/interactions',
              returnLink: 'entity/interactions/',
              createKind: 'interaction',
            },
          },
        }

        await renderInteractionsForEntity(req, res, next)
      })

      it('should not render the view', () => {
        expect(res.render).to.have.not.been.called
      })

      it('should call next with error', () => {
        expect(next).to.have.been.calledWith(error)
        expect(next).to.have.been.calledOnce
      })
    })
  })

  context('#getInteractionOptions', () => {
    const expected = {
      areas: [
        { value: '1', label: 'pa1' },
        { value: '3', label: 'pa3' },
      ],
      sectorOptions: [
        { value: 's1', label: 's1' },
        { value: 's2', label: 's2' },
        { value: 's3', label: 's3' },
      ],
      serviceOptions: [
        { value: 'sv1', label: 'Account Management' },
        { value: 'sv3', label: 'Making Introductions (Export)' },
        {
          value: 'sv2',
          label: 'Providing Export Advice & Information : Advice & information',
        },
      ],
      teamOptions: [
        { value: 'te1', label: 'te1' },
        { value: 'te2', label: 'te2' },
        { value: 'te', label: 'te3' },
      ],
      oneListTierOptions: [
        { value: '1', label: 'tier1' },
        { value: '3', label: 'tier3' },
      ],
      adviserOptions: [{ value: 'ad1', label: 'ad1', subLabel: 'ad1' }],
      types: [
        { value: '1', label: 'pt1' },
        { value: '3', label: 'pt3' },
      ],
    }

    context('when the request is not XHR', () => {
      it(`should return all interaction options`, async () => {
        expect(await getInteractionOptions(req, res)).to.deep.equal(expected)
      })
    })

    context('when there are no interaction options in session', () => {
      beforeEach(async () => {
        req = { ...omit(req, 'session.interactions'), xhr: true }
      })

      it(`should return all interaction options`, async () => {
        expect(await getInteractionOptions(req, res)).to.deep.equal(expected)
      })
    })

    context(
      'when request is XHR & interaction options exist in session',
      () => {
        beforeEach(async () => {
          req = {
            ...req,
            xhr: true,
          }
        })

        it(`should return interaction options from session key`, async () => {
          expect(await getInteractionOptions(req, res)).to.equal(
            req.session.interactions.options
          )
        })
      }
    )
  })
})
