const { assign, find, sortBy } = require('lodash')
const proxyquire = require('proxyquire')
const { endOfYesterday, subMonths } = require('date-fns')

const config = require('../../../../config')
const eventData = require('../../../../../test/unit/data/events/event.json')
const adviserFilters = require('../../../adviser/filters')
const serviceOptionData = require('../../../../../test/unit/data/interactions/service-options-data.json')
const {
  filterServiceNames,
} = require('../../../../../src/apps/events/controllers/edit')

const yesterday = endOfYesterday()
const lastMonth = subMonths(new Date(), 1)

const metadataMock = {
  teamOptions: [
    { id: '1', name: 'te1', disabled_on: null },
    { id: '2', name: 'te2', disabled_on: yesterday },
    { id: '3', name: 'te3', disabled_on: null },
  ],
  eventTypes: [
    { id: '1', name: 'et1', disabled_on: null },
    { id: '2', name: 'et2', disabled_on: yesterday },
    { id: '3', name: 'et3', disabled_on: null },
  ],
  locationTypes: [
    { id: '1', name: 'lt1', disabled_on: null },
    { id: '2', name: 'lt2', disabled_on: yesterday },
    { id: '3', name: 'lt3', disabled_on: null },
  ],
  countryOptions: [
    { id: '9999', name: 'United Kingdom', disabled_on: null },
    { id: '8888', name: 'Test', disabled_on: yesterday },
  ],
  serviceOptions: serviceOptionData,
  programmeOptions: [
    { id: '1', name: 'p1', disabled_on: null },
    { id: '2', name: 'p2', disabled_on: yesterday },
    { id: '3', name: 'p3', disabled_on: null },
  ],
  regionOptions: [
    { id: '1', name: 'r1', disabled_on: null },
    { id: '2', name: 'r2', disabled_on: yesterday },
    { id: '3', name: 'r3', disabled_on: null },
  ],
  tradeAgreementOptions: [
    { id: '1', name: 'ta1', disabled_on: null },
    { id: '2', name: 'ta2', disabled_on: yesterday },
    { id: '3', name: 'ta3', disabled_on: null },
  ],
}

function getFormFieldOptions(res, fieldName) {
  const renderOptions = res.render.firstCall.args[1]
  const formFields = renderOptions.eventForm.children
  const field = find(formFields, (field) => field.name === fieldName)
  return field.options || field.children[0].options
}

describe('Event edit controller', () => {
  beforeEach(() => {
    this.filterActiveAdvisersSpy = sinon.spy(
      adviserFilters,
      'filterActiveAdvisers'
    )

    this.controller = proxyquire('../edit', {
      '../../adviser/filters': {
        filterActiveAdvisers: this.filterActiveAdvisersSpy,
      },
    })

    this.req = {
      session: {
        token: 'abcd',
        user: {
          id: 'user1',
        },
      },
      body: {},
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {},
    }

    this.next = sinon.spy()

    this.activeInactiveAdviserData = {
      count: 5,
      results: [
        {
          id: '1',
          name: 'Jeff Smith',
          is_active: true,
          dit_team: {
            name: 'London',
          },
        },
        {
          id: '2',
          name: 'John Smith',
          is_active: true,
          dit_team: {
            name: 'London',
          },
        },
        {
          id: '3',
          name: 'Zac Smith',
          is_active: true,
          dit_team: {
            name: 'London',
          },
        },
        {
          id: '4',
          name: 'Fred Smith',
          is_active: false,
          dit_team: {
            name: 'London',
          },
        },
        {
          id: '5',
          name: 'Jim Smith',
          is_active: false,
          dit_team: {
            name: 'London',
          },
        },
      ],
    }
  })

  describe('#renderEditPage', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get('/adviser/')
        .query({ limit: 100000, offset: 0 })
        .reply(200, this.activeInactiveAdviserData)
        .get('/v4/metadata/event-type')
        .reply(200, metadataMock.eventTypes)
        .get('/v4/metadata/location-type')
        .reply(200, metadataMock.locationTypes)
        .get('/v4/metadata/country')
        .reply(200, metadataMock.countryOptions)
        .get('/v4/metadata/team')
        .reply(200, metadataMock.teamOptions)
        .get('/v4/metadata/service?contexts__has_any=event')
        .reply(200, metadataMock.serviceOptions)
        .get('/v4/metadata/programme')
        .reply(200, metadataMock.programmeOptions)
        .get('/v4/metadata/uk-region')
        .reply(200, metadataMock.regionOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, metadataMock.adviserOptions)
        .get('/v4/metadata/trade-agreement')
        .reply(200, metadataMock.tradeAgreementOptions)
    })

    context('when rendering the page', () => {
      beforeEach(async () => {
        await this.controller.renderEditPage(this.req, this.res, this.next)
      })

      it('should render the event page', () => {
        expect(this.res.render).to.be.calledWith('events/views/edit')
        expect(this.res.render).to.have.been.calledOnce
      })

      it('should render the event page with an event form', () => {
        const actual = this.res.render.getCall(0).args[1].eventForm

        expect(actual)
          .to.be.an('object')
          .and.have.property('hiddenFields')
          .and.have.property('id')
      })
    })

    context('when adding an event', () => {
      beforeEach(async () => {
        await this.controller.renderEditPage(this.req, this.res, this.next)
      })

      it('should add a breadcrumb', () => {
        expect(this.res.breadcrumb.firstCall).to.be.calledWith('Add event')
      })

      it('should get all active advisers', () => {
        expect(this.filterActiveAdvisersSpy).to.be.calledWith({
          advisers: this.activeInactiveAdviserData.results,
          includeAdviser: undefined,
        })
      })

      it('should render the form with the active advisers', () => {
        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
        ]

        const formOrganizerFieldOptions = getFormFieldOptions(
          this.res,
          'organiser'
        )
        expect(formOrganizerFieldOptions).to.deep.equal(expectedOptions)
      })

      it('should get all active event type options', () => {
        const options = getFormFieldOptions(this.res, 'event_type')
        expect(options).to.deep.equal([
          { label: 'et1', value: '1' },
          { label: 'et3', value: '3' },
        ])
      })

      it('should get all active location type options', () => {
        const options = getFormFieldOptions(this.res, 'location_type')
        expect(options).to.deep.equal([
          { label: 'lt1', value: '1' },
          { label: 'lt3', value: '3' },
        ])
      })

      it('should get all active country type options', () => {
        const options = getFormFieldOptions(this.res, 'address_country')
        expect(options).to.deep.equal([
          { label: 'United Kingdom', value: '9999' },
        ])
      })

      it('should get all active team options', () => {
        const options = getFormFieldOptions(this.res, 'lead_team')
        expect(options).to.deep.equal([
          { label: 'te1', value: '1' },
          { label: 'te3', value: '3' },
        ])
      })

      it('should get all active service options', () => {
        const options = sortBy(getFormFieldOptions(this.res, 'service'), [
          'value',
        ])
        expect(options.length).to.equal(3)
        expect(options[0].value).to.equal('sv1')
        expect(options[1].value).to.equal('sv2')
        expect(options[2].value).to.equal('sv3')
      })

      it('should get all active programme options', () => {
        const options = getFormFieldOptions(this.res, 'related_programmes')
        expect(options).to.deep.equal([
          { label: 'p1', value: '1' },
          { label: 'p3', value: '3' },
        ])
      })

      it('should get all active uk region options', () => {
        const options = getFormFieldOptions(this.res, 'uk_region')
        expect(options).to.deep.equal([
          { label: 'r1', value: '1' },
          { label: 'r3', value: '3' },
        ])
      })
    })

    context('when editing an event', () => {
      beforeEach(async () => {
        this.currentAdviser = this.activeInactiveAdviserData.results[3]
        this.res.locals.event = assign({}, eventData, {
          created_on: lastMonth,
          organiser: this.currentAdviser,
        })

        await this.controller.renderEditPage(this.req, this.res, this.next)
      })

      it('should add a breadcrumb', () => {
        expect(this.res.breadcrumb.firstCall).to.be.calledWith(
          'name',
          '/events/123'
        )
        expect(this.res.breadcrumb.secondCall).to.be.calledWith('Edit event')
      })

      it('should get all active event type options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'event_type')
        expect(options).to.deep.equal([
          { label: 'et1', value: '1' },
          { label: 'et2', value: '2' },
          { label: 'et3', value: '3' },
        ])
      })

      it('should get all active location type options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'location_type')
        expect(options).to.deep.equal([
          { label: 'lt1', value: '1' },
          { label: 'lt2', value: '2' },
          { label: 'lt3', value: '3' },
        ])
      })

      it('should get all active country type options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'address_country')
        expect(options).to.deep.equal([
          { label: 'Test', value: '8888' },
          { label: 'United Kingdom', value: '9999' },
        ])
      })

      it('should get all active team options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'lead_team')
        expect(options).to.deep.equal([
          { label: 'te1', value: '1' },
          { label: 'te2', value: '2' },
          { label: 'te3', value: '3' },
        ])
      })

      it('should get all active service options when the event was created', () => {
        const options = sortBy(getFormFieldOptions(this.res, 'service'), [
          'value',
        ])
        expect(options.length).to.equal(3)
        expect(options[0].value).to.equal('sv1')
        expect(options[1].value).to.equal('sv2')
        expect(options[2].value).to.equal('sv3')
      })

      it('should get all active programme options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'related_programmes')
        expect(options).to.deep.equal([
          { label: 'p1', value: '1' },
          { label: 'p2', value: '2' },
          { label: 'p3', value: '3' },
        ])
      })

      it('should get all active uk region options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'uk_region')
        expect(options).to.deep.equal([
          { label: 'r1', value: '1' },
          { label: 'r2', value: '2' },
          { label: 'r3', value: '3' },
        ])
      })

      it('should get all active adviser options and the current one', () => {
        expect(this.filterActiveAdvisersSpy).to.be.calledWith({
          advisers: this.activeInactiveAdviserData.results,
          includeAdviser: this.currentAdviser.id,
        })
      })
    })

    context('when there are validation errors', () => {
      it('should pre populate the errors', async () => {
        const messages = {
          name: 'error 1',
          start_date: 'error 2',
        }

        const fieldLabels = {
          name: 'Event name',
          start_date: 'Event start date',
        }

        this.res = assign({}, this.res, {
          locals: {
            form: {
              errors: {
                messages,
              },
            },
          },
        })

        await this.controller.renderEditPage(this.req, this.res, this.next)

        const actualErrors = this.res.render.getCall(0).args[1].eventForm.errors
        const expectedErrors = {
          summary: 'Please correct the following errors:',
          messages,
          fieldLabels,
        }

        expect(actualErrors).to.deep.equal(expectedErrors)
      })
    })
  })

  describe('#filterServiceNames', () => {
    this.testData = [
      {
        label:
          'A Specific DIT Export Service or Funding : label with excluded strings',
      },
      { label: 'A Specific Service : label with excluded strings2' },
      { label: 'label without excluded strings' },
    ]

    this.expected = [
      { label: 'label with excluded strings' },
      { label: 'label with excluded strings2' },
      { label: 'label without excluded strings' },
    ]
    it('should transform labels excluding strings in exlusion list', async () => {
      expect(filterServiceNames(this.testData)).to.deep.equal(this.expected)
    })
  })
})
