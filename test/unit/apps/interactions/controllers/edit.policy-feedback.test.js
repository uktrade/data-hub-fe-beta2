const moment = require('moment')
const { find, pick } = require('lodash')

const config = require('~/config')
const interactionData = require('../../../data/interactions/policy-feedback.json')

const controller = require('~/src/apps/interactions/controllers/edit')

const currentUserTeam = '99887766553'

describe('Interaction edit controller (Policy feedback)', () => {
  beforeEach(() => {
    this.req = {
      session: {
        token: 'abcd',
        user: {
          id: 'user1',
          dit_team: {
            id: currentUserTeam,
          },
        },
      },
      body: {},
      params: {},
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      title: sinon.stub().returnsThis(),
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {},
    }

    this.nextStub = sinon.stub()

    const yesterday = moment().subtract(1, 'days').toISOString()

    this.metadataMock = {
      teamOptions: [
        { id: '1', name: 'te1', disabled_on: null },
        { id: '2', name: 'te2', disabled_on: yesterday },
        { id: '3', name: 'te3', disabled_on: null },
      ],
      serviceOptions: [
        {
          id: 's1',
          name: 'sv1',
          disabled_on: null,
          contexts: [
            'service_delivery',
            'investment_project_interaction',
            'interaction',
            'event',
          ],
        },
        {
          id: 's2',
          name: 'sv2',
          disabled_on: yesterday,
          contexts: [
            'service_delivery',
            'investment_project_interaction',
            'interaction',
            'event',
          ],
        },
        {
          id: 's3',
          name: 'sv3',
          disabled_on: null,
          contexts: [
            'service_delivery',
            'investment_project_interaction',
            'interaction',
            'event',
          ],
        },
        {
          id: 's4',
          name: 'sv4 (TAP)',
          disabled_on: null,
          contexts: [
            'service_delivery',
            'investment_project_interaction',
            'interaction',
            'event',
          ],
        },
        {
          id: 's5',
          name: 'Policy feedback',
          disabled_on: null,
          contexts: [
            'policy_feedback',
          ],
        },
      ],
      channelOptions: [
        { id: '1', name: 'c1', disabled_on: null },
        { id: '2', name: 'c2', disabled_on: yesterday },
        { id: '3', name: 'c3', disabled_on: null },
      ],
      serviceDeliveryOptions: [
        { id: '1', name: 'sds1', disabled_on: null },
        { id: '2', name: 'sds2', disabled_on: yesterday },
        { id: '3', name: 'sds3', disabled_on: null },
      ],
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
    }

    this.activeInactiveAdviserData = [{
      id: '1',
      name: 'Jeff Smith',
      is_active: true,
    }, {
      id: '2',
      name: 'John Smith',
      is_active: true,
    }, {
      id: '3',
      name: 'Zac Smith',
      is_active: true,
    }, {
      id: '4',
      name: 'Fred Smith',
      is_active: false,
    }, {
      id: '5',
      name: 'Jim Smith',
      is_active: false,
    }]

    this.contactsData = [
      { id: '999', first_name: 'Fred', last_name: 'Smith', job_title: 'Manager' },
      { id: '998', first_name: 'Emily', last_name: 'Brown', job_title: 'Director' },
    ]
  })

  context('When adding a policy feedback from company contact', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        kind: 'policy-feedback',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        contact: {
          id: '2',
          name: 'Fred Bloggs',
        },
        returnLink: '/',
        entityName: 'Fred Bloggs',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=policy_feedback')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should render the interaction page', async () => {
      expect(this.res.render).to.be.calledWith('interactions/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should add a breadcrumb', () => {
      expect(this.res.breadcrumb.firstCall).to.be.calledWith('Add policy feedback')
    })

    it('should add a title', () => {
      expect(this.res.title.firstCall).to.be.calledWith('Add policy feedback for Fred Bloggs')
    })

    it('should include a policy feedback form', async () => {
      const actual = this.res.render.firstCall.args[1].interactionForm.children
      expect(actual).to.be.an('array')
    })

    it('should generate a form with the required fields', () => {
      const fieldNames = this.interactionForm.children.map(field => pick(field, ['name', 'label', 'macroName', 'type']))
      expect(fieldNames).to.deep.equal([
        { name: 'contact', label: 'Contact', macroName: 'MultipleChoiceField' },
        { name: 'dit_team', label: 'Service provider', macroName: 'MultipleChoiceField' },
        { name: 'policy_issue_type', label: 'Policy issue type', macroName: 'MultipleChoiceField' },
        { name: 'policy_area', label: 'Policy area', macroName: 'MultipleChoiceField' },
        { name: 'subject', label: 'Subject', macroName: 'TextField' },
        { name: 'notes', label: 'Notes', macroName: 'TextField', type: 'textarea' },
        { name: 'date', label: 'Date of interaction', macroName: 'DateFieldset' },
        { name: 'dit_adviser', label: 'DIT adviser', macroName: 'MultipleChoiceField' },
        { name: 'communication_channel', label: 'Communication channel', macroName: 'MultipleChoiceField' },
      ])
    })

    it('should provide a list of contacts', () => {
      const contactField = find(this.interactionForm.children, ({ name }) => name === 'contact')
      expect(contactField.options).to.deep.equal([
        { value: '999', label: 'Fred Smith, Manager' },
        { value: '998', label: 'Emily Brown, Director' },
      ])
    })

    it('should provide a list of service providers', () => {
      const serviceProviderField = find(this.interactionForm.children, ({ name }) => name === 'dit_team')
      expect(serviceProviderField.options).to.deep.equal([
        { value: '1', label: 'te1' },
        { value: '3', label: 'te3' },
      ])
    })

    it('should provide a list of advisers', () => {
      const adviserField = find(this.interactionForm.children, ({ name }) => name === 'dit_adviser')
      expect(adviserField.options).to.deep.equal([
        { value: '1', label: 'Jeff Smith' },
        { value: '2', label: 'John Smith' },
        { value: '3', label: 'Zac Smith' },
      ])
    })

    it('should provide a list of communication channels', () => {
      const communicationChannelField = find(this.interactionForm.children, ({ name }) => name === 'communication_channel')
      expect(communicationChannelField.options).to.deep.equal([
        { value: '1', label: 'c1' },
        { value: '3', label: 'c3' },
      ])
    })

    it('should provide a list of policy issue types', () => {
      const policyIssueTypeField = find(this.interactionForm.children, ({ name }) => name === 'policy_issue_type')
      expect(policyIssueTypeField.options).to.deep.equal([
        { value: '1', label: 'pt1' },
        { value: '3', label: 'pt3' },
      ])
    })

    it('should provide a list of policy areas', () => {
      const policyAreaField = find(this.interactionForm.children, ({ name }) => name === 'policy_area')
      expect(policyAreaField.options).to.deep.equal([
        { value: '1', label: 'pa1' },
        { value: '3', label: 'pa3' },
      ])
    })

    it('should set the company id as a hidden field', () => {
      const companyField = this.interactionForm.hiddenFields.company
      expect(companyField).to.equal('1')
    })

    it('should set the service as a hidden field with the correct value', () => {
      const serviceField = this.interactionForm.hiddenFields.service
      expect(serviceField).to.equal('s5')
    })

    it('should set the default contact to the current contact', () => {
      const contactField = find(this.interactionForm.children, ({ name }) => name === 'contact')
      expect(contactField.value).to.equal('2')
    })

    it('should set the default for the service provider to the users team', () => {
      const teamField = find(this.interactionForm.children, ({ name }) => name === 'dit_team')
      expect(teamField.value).to.equal(currentUserTeam)
    })

    it('should set the default for the adviser to the current user', () => {
      const adviserField = find(this.interactionForm.children, ({ name }) => name === 'dit_adviser')
      expect(adviserField.value).to.equal('user1')
    })

    it('should set the interaction date to the current date', () => {
      const dateField = find(this.interactionForm.children, ({ name }) => name === 'date')

      const now = moment()

      expect(dateField.value).to.have.property('year', now.format('YYYY'))
      expect(dateField.value).to.have.property('month', now.format('MM'))
      expect(dateField.value).to.have.property('day', now.format('DD'))
    })

    it('should set the return link source of the add action', () => {
      expect(this.interactionForm.returnLink).to.equal('/')
    })

    it('should set the appropriate return text', () => {
      expect(this.interactionForm.returnText).to.equal('Cancel')
    })

    it('should set the appropriate save button text', () => {
      expect(this.interactionForm.buttonText).to.equal('Add policy feedback')
    })
  })

  context('When adding a policy feedback from a company', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        kind: 'policy-feedback',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        returnLink: '/',
        entityName: 'Fred ltd.',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=policy_feedback')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should set the company id as a hidden field', () => {
      const companyField = this.interactionForm.hiddenFields.company
      expect(companyField).to.equal('1')
    })

    it('should include a contact dropdown with no preselected value', () => {
      const contactField = find(this.interactionForm.children, ({ name }) => name === 'contact')
      expect(contactField.value).to.be.undefined
    })
  })

  context('when editing a policy feedback from a company', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        kind: 'policy-feedback',
        interactionId: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interaction: interactionData,
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=policy_feedback')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should render the interaction page', async () => {
      expect(this.res.render).to.be.calledWith('interactions/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should add a breadcrumb', () => {
      expect(this.res.breadcrumb.firstCall).to.be.calledWith('Edit policy feedback')
    })

    it('should add a title', () => {
      expect(this.res.title.firstCall).to.be.calledWith('Edit policy feedback')
    })

    it('should include a policy feedback form', async () => {
      const actual = this.res.render.firstCall.args[1].interactionForm.children
      expect(actual).to.be.an('array')
    })

    it('should generate a form with the required fields and values populated', () => {
      const fieldNames = this.interactionForm.children.map(field => pick(field, ['name', 'label', 'macroName', 'type', 'value']))
      expect(fieldNames).to.deep.equal([
        { name: 'contact', label: 'Contact', macroName: 'MultipleChoiceField', value: '7701587b-e88f-4f39-874f-0bd06321f7df' },
        { name: 'dit_team', label: 'Service provider', macroName: 'MultipleChoiceField', value: '16362a92-9698-e211-a939-e4115bead28a' },
        { name: 'policy_issue_type', label: 'Policy issue type', macroName: 'MultipleChoiceField', value: 'pit1' },
        { name: 'policy_area', label: 'Policy area', macroName: 'MultipleChoiceField', value: 'pa1' },
        { name: 'subject', label: 'Subject', macroName: 'TextField', value: 'ad' },
        { name: 'notes', label: 'Notes', macroName: 'TextField', type: 'textarea', value: 'Labore culpa quas cupiditate voluptatibus magni.' },
        {
          name: 'date',
          label: 'Date of interaction',
          macroName: 'DateFieldset',
          value: {
            day: '25',
            month: '11',
            year: '2058',
          },
        },
        { name: 'dit_adviser', label: 'DIT adviser', macroName: 'MultipleChoiceField', value: '537df876-5062-e311-8255-e4115bead28a' },
        { name: 'communication_channel', label: 'Communication channel', macroName: 'MultipleChoiceField', value: '70c226d7-5d95-e211-a939-e4115bead28a' },
      ])
    })

    it('should provide a list of contacts', () => {
      const contactField = find(this.interactionForm.children, ({ name }) => name === 'contact')
      expect(contactField.options).to.deep.equal([
        { value: '999', label: 'Fred Smith, Manager' },
        { value: '998', label: 'Emily Brown, Director' },
      ])
    })

    it('should provide a list of service providers at creation time', () => {
      const serviceProviderField = find(this.interactionForm.children, ({ name }) => name === 'dit_team')
      expect(serviceProviderField.options).to.deep.equal([
        { value: '1', label: 'te1' },
        { value: '2', label: 'te2' },
        { value: '3', label: 'te3' },
      ])
    })

    it('should provide a list of advisers', () => {
      const adviserField = find(this.interactionForm.children, ({ name }) => name === 'dit_adviser')
      expect(adviserField.options).to.deep.equal([
        { value: '1', label: 'Jeff Smith' },
        { value: '2', label: 'John Smith' },
        { value: '3', label: 'Zac Smith' },
      ])
    })

    it('should provide a list of communication channels at creation time', () => {
      const communicationChannelField = find(this.interactionForm.children, ({ name }) => name === 'communication_channel')
      expect(communicationChannelField.options).to.deep.equal([
        { value: '1', label: 'c1' },
        { value: '2', label: 'c2' },
        { value: '3', label: 'c3' },
      ])
    })

    it('should set the company id as a hidden field', () => {
      const companyField = this.interactionForm.hiddenFields.company
      expect(companyField).to.equal('1')
    })

    it('should set the id in a hidden field', () => {
      const idField = this.interactionForm.hiddenFields.id
      expect(idField).to.equal('af4aac84-4d6a-47df-a733-5a54e3008c32')
    })

    it('should set the return link to the detail view', () => {
      expect(this.interactionForm.returnLink).to.equal('/interactions/af4aac84-4d6a-47df-a733-5a54e3008c32')
    })

    it('should set the appropriate return text', () => {
      expect(this.interactionForm.returnText).to.equal('Return without saving')
    })

    it('should set the appropriate save button text', () => {
      expect(this.interactionForm.buttonText).to.equal('Save and return')
    })
  })

  context('when displaying a policy feedback that failed to save', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        kind: 'policy-feedback',
        interactionId: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        investmentData: {
          id: '3',
        },
        interaction: interactionData,
        form: {
          errors: {
            messages: {
              subject: ['Error message'],
            },
          },
        },
        requestBody: {
          subject: 'a',
        },
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=policy_feedback')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should merge the changes on top of the original record', () => {
      const fieldNames = this.interactionForm.children.map(field => pick(field, ['name', 'label', 'macroName', 'type', 'value']))
      expect(fieldNames).to.deep.equal([
        { name: 'contact', label: 'Contact', macroName: 'MultipleChoiceField', value: '7701587b-e88f-4f39-874f-0bd06321f7df' },
        { name: 'dit_team', label: 'Service provider', macroName: 'MultipleChoiceField', value: '16362a92-9698-e211-a939-e4115bead28a' },
        { name: 'policy_issue_type', label: 'Policy issue type', macroName: 'MultipleChoiceField', value: 'pit1' },
        { name: 'policy_area', label: 'Policy area', macroName: 'MultipleChoiceField', value: 'pa1' },
        { name: 'subject', label: 'Subject', macroName: 'TextField', value: 'a' },
        { name: 'notes', label: 'Notes', macroName: 'TextField', type: 'textarea', value: 'Labore culpa quas cupiditate voluptatibus magni.' },
        {
          name: 'date',
          label: 'Date of interaction',
          macroName: 'DateFieldset',
          value: {
            day: '25',
            month: '11',
            year: '2058',
          },
        },
        { name: 'dit_adviser', label: 'DIT adviser', macroName: 'MultipleChoiceField', value: '537df876-5062-e311-8255-e4115bead28a' },
        { name: 'communication_channel', label: 'Communication channel', macroName: 'MultipleChoiceField', value: '70c226d7-5d95-e211-a939-e4115bead28a' },
      ])
    })

    it('should include the error in the form', () => {
      const subjectField = find(this.interactionForm.children, ({ name }) => name === 'subject')
      expect(subjectField.error).to.deep.equal(['Error message'])
    })
  })
})
