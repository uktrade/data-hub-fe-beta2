const investmentProjectAuditData = require('~/test/unit/data/investment/audit-log.json')

const token = 'abcd'

describe('Investment audit controller', () => {
  beforeEach(() => {
    this.next = sinon.stub()
    this.getInvestmentProjectAuditLog = sinon.stub().resolves(investmentProjectAuditData.results)
    this.breadcrumbStub = sinon.stub().returnsThis()

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/audit', {
      '../repos': {
        getInvestmentProjectAuditLog: this.getInvestmentProjectAuditLog,
      },
    })
  })

  it('should get the audit log from the API', (done) => {
    this.controller.getInvestmentAudit({
      session: {
        token,
      },
      params: {
        investmentId: '9999',
      },
    }, {
      locals: {
        investment: {},
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        try {
          expect(this.getInvestmentProjectAuditLog).to.be.calledWith(token, '9999')
          done()
        } catch (error) {
          done(error)
        }
      },
    }, this.next)
  })
  it('should send a parsed copy of audit data to the view', (done) => {
    const expected = [{
      name: 'Duke Ellington',
      timestamp: '2017-06-02T13:18:06',
      changes: [{ 'ChangeFromDesc': 'name 1 - changed', 'ChangeName': 'name', 'ChangeToDesc': 'name 1 - changed again' },
        { 'ChangeFromDesc': 'desc 3', 'ChangeName': 'description', 'ChangeToDesc': 'desc 3 changed' }],
    }, {
      name: 'Fred Smith',
      timestamp: '2017-06-02T11:01:05',
      changes: [{ 'ChangeFromDesc': 'name 2', 'ChangeName': 'name', 'ChangeToDesc': 'name 2 - changed' },
        { 'ChangeFromDesc': null, 'ChangeName': 'anonymous_description', 'ChangeToDesc': '' },
        { 'ChangeFromDesc': null, 'ChangeName': 'client_requirements', 'ChangeToDesc': '' }],
    }]
    this.controller.getInvestmentAudit({
      session: {
        token,
      },
      params: {
        investmentId: '9999',
      },
    }, {
      locals: {
        investment: {},
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        try {
          expect(data.auditLog).to.deep.equal(expected)
          done()
        } catch (error) {
          done(error)
        }
      },
    }, this.next)
  })
  it('should handle when changes is null', (done) => {
    const nullChangeSet = [{
      user: {
        id: '41212312312321',
        name: 'Fred Smith',
      },
      timestamp: '2017-02-14T14:49:17',
      comment: 'Optional changeset comment - we can stick anything here',
      changes: null,
    }]

    this.getInvestmentProjectAuditLog = sinon.stub().resolves(nullChangeSet)

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/audit', {
      '../repos': {
        getInvestmentProjectAuditLog: this.getInvestmentProjectAuditLog,
      },
    })

    const expected = [{
      name: 'Fred Smith',
      timestamp: '2017-02-14T14:49:17',
      changes: [],
    }]

    this.controller.getInvestmentAudit({
      session: {
        token,
      },
      params: {
        investmentId: '9999',
      },
    }, {
      locals: {
        investment: {},
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        try {
          expect(data.auditLog).to.deep.equal(expected)
          done()
        } catch (error) {
          done(error)
        }
      },
    }, this.next)
  })
  it('should handle when the changeset is empty', (done) => {
    const emptyChangeSet = [{
      user: {
        id: '41212312312321',
        name: 'Fred Smith',
      },
      timestamp: '2017-02-14T14:49:17',
      comment: 'Optional changeset comment - we can stick anything here',
      changes: {},
    }]

    this.getInvestmentProjectAuditLog = sinon.stub().resolves(emptyChangeSet)

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/audit', {
      '../repos': {
        getInvestmentProjectAuditLog: this.getInvestmentProjectAuditLog,
      },
    })

    const expected = [{
      name: 'Fred Smith',
      timestamp: '2017-02-14T14:49:17',
      changes: [],
    }]

    this.controller.getInvestmentAudit({
      session: {
        token,
      },
      params: {
        investmentId: '9999',
      },
    }, {
      locals: {
        investment: {},
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        try {
          expect(data.auditLog).to.deep.equal(expected)
          done()
        } catch (error) {
          done(error)
        }
      },
    }, this.next)
  })

  describe('formatAuditLog', () => {
    beforeEach(() => {
      this.timestamp = '2017-08-09T12:25:29.568665Z'
      this.formattedDate = '2017-08-09T13:25:29'
      this.changes = { 'thing': ['a', 'n'],
        'other thing': ['a', 'n'] }
    })

    it('should return the user name', () => {
      const actual = this.controller.formatAuditLog({
        user: { name: 'James Example' },
        timestamp: this.timestamp,
        changes: this.changes,
      })
      expect(actual).to.deep.equal({
        name: 'James Example',
        timestamp: this.formattedDate,
        changes: [ { ChangeName: 'thing', ChangeFromDesc: 'a', ChangeToDesc: 'n' },
          { ChangeName: 'other thing', ChangeFromDesc: 'a', ChangeToDesc: 'n' }],
      })
    })
    it('should handle absent users', () => {
      const actual = this.controller.formatAuditLog({
        timestamp: this.timestamp,
        changes: this.changes,
      })
      expect(actual.name).to.be.undefined
    })
    it('should handle empty users', () => {
      const actual = this.controller.formatAuditLog({
        user: {},
        timestamp: this.timestamp,
        changes: this.changes,
      })
      expect(actual.name).to.be.undefined
    })
  })
})
