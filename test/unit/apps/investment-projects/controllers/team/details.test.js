const investmentData = require('~/test/unit/data/investment/investment-data.json')
const {
  projectManagementLabels,
  clientRelationshipManagementLabels,
} = require('~/src/apps/investment-projects/labels')

describe('Investment team details controller', () => {
  beforeEach(() => {
    this.nextStub = sinon.stub()
    this.breadcrumbStub = sinon.stub().returnsThis()
    this.reqStub = sinon.stub()
    this.nextStub = sinon.stub()
    this.clientRelationshipManagementData = { name: 'fred' }
    this.teamMembersData = { adviser: 'Fred' }
    this.projectManagementData = [{ name: 'fred' }]
    this.transformProjectManagementForViewStub = sinon.stub().returns(this.projectManagementData)
    this.transformClientRelationshipManagementForViewStub = sinon.stub().returns(this.clientRelationshipManagementData)
    this.transformTeamMembersForViewStub = sinon.stub().returns(this.teamMembersData)

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/team/details', {
      '../../transformers': {
        transformProjectManagementForView: this.transformProjectManagementForViewStub,
        transformClientRelationshipManagementForView: this.transformClientRelationshipManagementForViewStub,
        transformTeamMembersForView: this.transformTeamMembersForViewStub,
      },
    })
  })

  it('should get formatted project management data', (done) => {
    const data = Object.assign({}, investmentData)
    this.controller.getDetailsHandler(this.reqStub, {
      locals: {
        investmentData: data,
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, options) => {
        expect(this.transformProjectManagementForViewStub).to.be.calledWith(data)
        expect(options.projectManagementData).to.deep.equal(this.projectManagementData)
        done()
      },
    }, (error) => {
      done(error)
    })
  })

  it('should get formatted client relationship management data', (done) => {
    const data = Object.assign({}, investmentData)
    this.controller.getDetailsHandler(this.reqStub, {
      locals: {
        investmentData: data,
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, options) => {
        expect(this.transformClientRelationshipManagementForViewStub).to.be.calledWith(data)
        expect(options.clientRelationshipManagementData).to.deep.equal(this.clientRelationshipManagementData)
        done()
      },
    }, (error) => {
      done(error)
    })
  })

  it('should get formatted team member data', (done) => {
    const data = Object.assign({}, investmentData)
    data.team_members = [{
      name: 'Fred Smith',
    }]

    this.controller.getDetailsHandler(this.reqStub, {
      locals: {
        investmentData: data,
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, options) => {
        expect(options.teamMembersData).to.deep.equal([this.teamMembersData])
        done()
      },
    }, (error) => {
      done(error)
    })
  })

  it('should return labels for the project management table', (done) => {
    this.controller.getDetailsHandler(this.reqStub, {
      locals: {
        investmentData: Object.assign({}, investmentData),
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, options) => {
        expect(options.projectManagementLabels).to.deep.equal(projectManagementLabels)
        done()
      },
    }, this.nextStub)
  })

  it('should return labels for the client relationship management table', (done) => {
    this.controller.getDetailsHandler(this.reqStub, {
      locals: {
        investmentData: Object.assign({}, investmentData),
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, options) => {
        expect(options.clientRelationshipManagementLabels).to.deep.equal(clientRelationshipManagementLabels)
        done()
      },
    }, this.nextStub)
  })

  it('should use the correct template to render', (done) => {
    this.controller.getDetailsHandler(this.reqStub, {
      locals: {
        investmentData: Object.assign({}, investmentData),
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, options) => {
        expect(template).to.equal('investment-projects/views/team/details')
        done()
      },
    }, this.nextStub)
  })
})
