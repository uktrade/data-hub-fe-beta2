const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')
const companyMock = require('~/test/unit/data/companies/company-v4.json')
const { renderRegion, updateRegion } = require('~/src/apps/companies/controllers/business-details-region')
const config = require('~/config')

const regionOptions = [{
  id: '1',
  name: 'East of England',
}, {
  id: '2',
  name: 'London',
}, {
  id: '3',
  name: 'North East' },
]

describe('#renderRegion', () => {
  context('when the view renders successfully', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/v4/metadata/uk-region')
        .reply(200, regionOptions)

      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      await renderRegion(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should render the "Edit DIT region" view', () => {
      const view = 'companies/views/business-details-edit'

      expect(this.middlewareParameters.resMock.render).to.be.calledOnceWithExactly(view, {
        props: {
          companyId: 'a73efeba-8499-11e6-ae22-56b6b6499611',
          csrfToken: 'csrf',
          ukRegions: [
            { value: '1', label: 'East of England' },
            { value: '2', label: 'London' },
            { value: '3', label: 'North East' },
          ],
        },
      })
    })

    it('should add three breadcrumbs', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledThrice
    })

    it('should add the company breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith(companyMock.name, `/companies/${companyMock.id}`)
    })

    it('should add the "Mercury" breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith('Mercury Ltd')
    })

    it('should add the "Business details" breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith('Business details')
    })

    it('should add the "Edit the DIT region" breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith('Edit the DIT region')
    })

    it('should not call next() with an error', () => {
      expect(this.middlewareParameters.nextSpy).to.not.have.been.called
    })
  })

  context('when there is an error', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/v4/metadata/uk-region')
        .reply(400, { message: 'Error message' })

      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      await renderRegion(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should call next() with an error', async () => {
      expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
    })
  })
})

describe('#updateRegion', () => {
  context('when the company update is successful', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .patch(`/v4/company/${companyMock.id}`)
        .reply(200, {})

      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
        requestBody: {
          uk_region: '1',
        },
        requestParams: {
          companyId: companyMock.id,
        },
      })

      this.resMock = {
        status: sinon.stub().returns({
          json: sinon.spy(),
        }),
      }

      await updateRegion(
        this.middlewareParameters.reqMock,
        this.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should call status', async () => {
      expect(this.resMock.status).to.have.been.calledOnce
      expect(this.resMock.status).to.have.been.calledWith(200)
    })

    it('should flash a message', async () => {
      expect(this.middlewareParameters.reqMock.flash).to.have.been.calledOnce
      expect(this.middlewareParameters.reqMock.flash).to.have.been.calledWith('success', 'Company region updated')
    })

    it('should not call next() with an error', () => {
      expect(this.middlewareParameters.nextSpy).to.not.have.been.called
    })
  })

  context('when the company update is unsuccessful', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .patch(`/v4/company/${companyMock.id}`)
        .reply(400, { error: 'Error message' })

      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
        requestBody: {
          uk_region: 'London',
        },
        requestParams: {
          companyId: companyMock.id,
        },
      })

      this.resMock = {
        status: sinon.stub().returns({
          json: sinon.spy(),
        }),
      }

      await updateRegion(
        this.middlewareParameters.reqMock,
        this.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should flash a message', async () => {
      expect(this.middlewareParameters.reqMock.flash).to.have.been.calledOnce
      expect(this.middlewareParameters.reqMock.flash).to.have.been.calledWith('error', 'Company region could not be updated')
    })

    it('should call status', async () => {
      expect(this.resMock.status).to.have.been.calledOnce
      expect(this.resMock.status).to.have.been.calledWith(400)
    })

    it('should not call next() with an error', () => {
      expect(this.middlewareParameters.nextSpy).to.not.have.been.called
    })
  })
})
