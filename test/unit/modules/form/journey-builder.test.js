const express = require('express')
const bodyParser = require('body-parser')
const request = require('supertest')
const { endsWith } = require('lodash')

const steps = require('./steps')

describe('#build', () => {
  beforeEach(() => {
    this.req = { session: {} }
    this.flashSpy = sinon.spy()
    this.breadcrumbSpy = sinon.spy()
    this.setOptionsStub1 = sinon.stub().callsFake((req, res, next) => { next() })
    this.setOptionsStub2 = sinon.stub().callsFake((req, res, next) => { next() })
    this.journeyBuilder = require('~/src/modules/form/journey-builder.js')

    this.app = express()
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.set('views', `${process.cwd()}/src/templates`)
    this.app.set('view engine', 'njk')
    this.app.use((req, res, next) => {
      req.baseUrl = '/base'
      req.session = this.req.session
      req.flash = this.flashSpy
      res.breadcrumb = this.breadcrumbSpy
      next()
    })
    this.app.engine('njk', (path, options, callback) => {
      callback(null, JSON.stringify({ path, options }))
    })

    this.journey = {
      steps: steps([
        this.setOptionsStub1,
        this.setOptionsStub2,
      ]),
    }
  })

  context('when rendering the form', () => {
    const commonTests = (expectedForm) => {
      it('should render the form template', () => {
        const render = JSON.parse(this.response.res.text)
        expect(endsWith(render.path, 'form.njk')).to.be.true
      })

      it('should render the heading', () => {
        const render = JSON.parse(this.response.res.text)
        expect(render.options.heading).to.equal('Add something')
      })

      it('should render the form', () => {
        const render = JSON.parse(this.response.res.text)
        expect(render.options.form).to.deep.equal(expectedForm)
      })

      it('should render the breadcrumbs', () => {
        expect(this.breadcrumbSpy).have.been.calledWith('Add something', '/url')
        expect(this.breadcrumbSpy).to.have.been.calledOnce
      })
    }

    context('when middleware has been specified', () => {
      beforeEach(async () => {
        this.app.use(this.journeyBuilder.build(this.journey))

        this.response = await request(this.app).get('/step-1')
      })

      commonTests({
        children: [],
        returnLink: '/base',
        returnText: 'Cancel',
        state: {},
      })

      it('should call the middleware', () => {
        expect(this.setOptionsStub1).to.be.calledOnce
        expect(this.setOptionsStub2).to.be.calledOnce
      })
    })

    context('when middleware has not been specified', () => {
      beforeEach(async () => {
        this.app.use((req, res, next) => {
          req.session = {
            ...req.session,
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    data: {
                      selectedAtStep1: 'step-3-value',
                    },
                    completed: true,
                  },
                },
                browseHistory: [
                  '/step-1',
                ],
              },
            },
          }

          next()
        })

        this.app.use(this.journeyBuilder.build(this.journey))

        this.response = await request(this.app).get('/step-3')
      })

      commonTests({
        children: [],
        state: {
          selectedAtStep1: 'step-3-value',
        },
        returnLink: '/base/step-1',
        returnText: 'Back',
      })
    })

    context('when rendering the first step of a multi step form having half completed another multi step form', () => {
      beforeEach(async () => {
        const stateFromAnotherFormJourney = {
          'multi-step': {
            '/base/another-step-1': {
              steps: {
                another_field_1: 'another_field_1',
              },
            },
          },
        }
        this.req.session = {
          ...this.req.session,
          ...stateFromAnotherFormJourney,
        }

        this.app.use((req, res, next) => {
          req.session = this.req.session
          next()
        })

        this.app.use(this.journeyBuilder.build(this.journey))

        this.response = await request(this.app).get('/step-1')
      })

      commonTests({
        children: [],
        returnLink: '/base',
        returnText: 'Cancel',
        state: {},
      })

      it('should not alter state for the other form', async () => {
        expect(this.req.session['multi-step']['/base/another-step-1']).to.deep.equal({
          steps: {
            another_field_1: 'another_field_1',
          },
        })
      })
    })
  })

  context('when submitting the form', () => {
    context('when middleware has been specified', () => {
      context('when the value for step 2 has been selected', () => {
        beforeEach(async () => {
          this.app.use(this.journeyBuilder.build(this.journey))

          this.response = await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-2-value' })
        })

        it('should call the middleware', async () => {
          expect(this.setOptionsStub1).to.be.calledOnce
          expect(this.setOptionsStub2).to.be.calledOnce
        })

        it('should redirect to step 2', () => {
          expect(this.response.statusCode).to.equal(302)
          expect(this.response.headers.location).to.equal('/base/step-2')
        })

        it('should not render a template', () => {
          expect(this.response.res.text).to.equal('Found. Redirecting to /base/step-2')
        })
      })

      context('when the value for step 3 has been selected', () => {
        beforeEach(async () => {
          this.app.use(this.journeyBuilder.build(this.journey))

          this.response = await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-3-value' })
        })

        it('should call the middleware', async () => {
          expect(this.setOptionsStub1).to.be.calledOnce
          expect(this.setOptionsStub2).to.be.calledOnce
        })

        it('should redirect to step 3', () => {
          expect(this.response.statusCode).to.equal(302)
          expect(this.response.headers.location).to.equal('/base/step-3')
        })

        it('should not render a template', () => {
          expect(this.response.res.text).to.equal('Found. Redirecting to /base/step-3')
        })
      })
    })

    context('when middleware has not been specified', () => {
      context('when the final value has been selected', () => {
        beforeEach(async () => {
          this.app.use(this.journeyBuilder.build(this.journey))

          this.response = await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-2-value' })
          this.response = await request(this.app).post('/step-2').send({ selectedAtStep2: 'finish' })
        })

        it('should redirect to finish', () => {
          expect(this.response.statusCode).to.equal(302)
          expect(this.response.headers.location).to.equal('/base/finish')
        })

        it('should not render a template', () => {
          expect(this.response.res.text).to.equal('Found. Redirecting to /base/finish')
        })
      })
    })

    context('when the next path is a string', () => {
      beforeEach(async () => {
        this.app.use(this.journeyBuilder.build(this.journey))

        this.response = await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-2-value' })
        this.response = await request(this.app).post('/step-2')
      })

      it('should redirect to step 2', () => {
        expect(this.response.statusCode).to.equal(302)
        expect(this.response.headers.location).to.equal('/base/finish')
      })

      it('should not render a template', () => {
        expect(this.response.res.text).to.equal('Found. Redirecting to /base/finish')
      })
    })

    context('when the first field is required', () => {
      beforeEach(async () => {
        const form = {
          children: [
            {
              name: 'selectedAtStep1',
              validations: [
                {
                  type: 'required',
                  message: 'You must enter a value for selected',
                },
              ],
            },
          ],
        }
        this.form = form
        this.journey.steps[0].macro = () => {
          return form
        }
        this.app.use(this.journeyBuilder.build(this.journey))

        this.response = await request(this.app).post('/step-1')
      })

      it('should not redirect', () => {
        expect(this.response.statusCode).to.equal(200)
        expect(this.response.headers.location).to.be.undefined
      })

      it('should render the form with errors', () => {
        const render = JSON.parse(this.response.res.text)
        const expected = {
          ...this.form,
          errors: {
            messages: {
              selectedAtStep1: [ 'You must enter a value for selected' ],
            },
          },
          state: {},
          returnLink: '/base',
          returnText: 'Cancel',
        }
        expect(render.options.form).to.deep.equal(expected)
      })
    })

    context('when completing a multi step form', () => {
      context('when the first step has been completed', () => {
        beforeEach(async () => {
          this.app.use(this.journeyBuilder.build(this.journey))

          await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-2-value' })
        })

        it('should persist state for the first step', async () => {
          expect(this.req.session).to.deep.equal({
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    completed: true,
                    nextPath: '/step-2',
                    data: {
                      selectedAtStep1: 'step-2-value',
                    },
                  },
                },
              },
            },
          })
        })
      })

      context('when the first and second steps have been completed', () => {
        beforeEach(async () => {
          this.app.use(this.journeyBuilder.build(this.journey))

          await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-2-value' })
          await request(this.app).post('/step-2').send({ selectedAtStep2: 'finish' })
        })

        it('should persist state for the second step and subsequent steps', async () => {
          expect(this.req.session).to.deep.equal({
            'multi-step': {
              '/base/step-1': {
                steps: {
                  '/step-1': {
                    completed: true,
                    data: {
                      selectedAtStep1: 'step-2-value',
                    },
                    nextPath: '/step-2',
                  },
                  '/step-2': {
                    completed: true,
                    data: {
                      selectedAtStep2: 'finish',
                    },
                    nextPath: '/finish',
                  },
                },
              },
            },
          })
        })
      })
    })

    context('when trying to start a form without completing previous steps', () => {
      beforeEach(async () => {
        this.app.use(this.journeyBuilder.build(this.journey))

        this.response = await request(this.app).get('/step-5')
      })

      it('should not call the middleware', async () => {
        expect(this.setOptionsStub1).to.not.be.called
        expect(this.setOptionsStub2).to.not.be.called
      })

      it('should redirect to step 1', () => {
        expect(this.response.statusCode).to.equal(302)
        expect(this.response.headers.location).to.equal('/base/step-1')
      })

      it('should not render a template', () => {
        expect(this.response.res.text).to.equal('Found. Redirecting to /base/step-1')
      })
    })

    context('when it is the final step and the API request is successful', () => {
      beforeEach(async () => {
        this.sendSpy = sinon.stub().callsFake(() => { return { id: 1 } })
        this.journey.steps[4].done = {
          send: this.sendSpy,
          message: 'The entity has been added',
          nextPath: ({ id }) => `/base/entities/${id}`,
        }

        this.app.use(this.journeyBuilder.build(this.journey))

        await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-3-value' })
        await request(this.app).post('/step-3').send({ selectedAtStep3: 'step-5-value' })
        this.response = await request(this.app).post('/step-5').send({ moreData: 'more' })
      })

      it('should POST to the API', () => {
        expect(this.sendSpy).have.been.calledWith({
          selectedAtStep1: 'step-3-value',
          selectedAtStep3: 'step-5-value',
          moreData: 'more',
        })
        expect(this.sendSpy).to.be.calledOnce
      })

      it('should remove state for the journey', () => {
        expect(this.req.session['multi-step']['/base/step-1']).to.be.undefined
      })

      it('should set the success message', () => {
        expect(this.flashSpy).to.be.calledWith('success', 'The entity has been added')
        expect(this.flashSpy).to.be.calledOnce
      })

      it('should redirect to the finish', () => {
        expect(this.response.statusCode).to.equal(302)
        expect(this.response.headers.location).to.equal('/base/entities/1')
      })

      it('should not render a template', () => {
        expect(this.response.res.text).to.equal('Found. Redirecting to /base/entities/1')
      })
    })

    context('when it is the final step and the API request is erroneous', () => {
      beforeEach(async () => {
        this.sendSpy = sinon.stub().callsFake(() => {
          const error = new Error()
          error.statusCode = 400
          error.error = 'Error messages'
          throw error
        })
        this.journey.steps[4].done = {
          send: this.sendSpy,
          message: 'The entity has been added',
          nextPath: ({ id }) => `/base/entities/${id}`,
        }

        this.app.use(this.journeyBuilder.build(this.journey))

        await request(this.app).get('/step-1')
        await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-3-value' })
        await request(this.app).get('/step-3')
        await request(this.app).post('/step-3').send({ selectedAtStep3: 'step-5-value' })
        await request(this.app).get('/step-5')
        this.response = await request(this.app).post('/step-5').send({ moreData: 'more' })
      })

      it('should POST to the API', () => {
        expect(this.sendSpy).have.been.calledWith({
          selectedAtStep1: 'step-3-value',
          selectedAtStep3: 'step-5-value',
          moreData: 'more',
        })
        expect(this.sendSpy).to.be.calledOnce
      })

      it('should not remove state for the journey', () => {
        expect(this.req.session).to.deep.equal({
          'multi-step': {
            '/base/step-1': {
              steps: {
                '/step-1': {
                  completed: true,
                  data: {
                    selectedAtStep1: 'step-3-value',
                  },
                  nextPath: '/step-3',
                },
                '/step-3': {
                  completed: true,
                  data: {
                    selectedAtStep3: 'step-5-value',
                  },
                  nextPath: '/step-5',
                },
                '/step-5': {
                  completed: false,
                  data: {
                    moreData: 'more',
                  },
                },
              },
              browseHistory: [
                '/step-1',
                '/step-3',
                '/step-5',
              ],
            },
          },
        })
      })

      it('should not set the success message', () => {
        expect(this.flashSpy).to.not.be.called
      })

      it('should not redirect to anywhere', () => {
        expect(this.response.statusCode).to.equal(200)
        expect(this.response.headers.location).to.be.undefined
      })

      it('should render step 5', () => {
        const render = JSON.parse(this.response.res.text)
        expect(render.options.form).to.deep.equal({
          children: [],
          returnLink: '/base/step-3',
          returnText: 'Back',
          state: {
            selectedAtStep1: 'step-3-value',
            selectedAtStep3: 'step-5-value',
            moreData: 'more',
          },
          errors: {
            messages: 'Error messages',
          },
        })
      })
    })

    context('when the user has changed direction in the journey', () => {
      beforeEach(async () => {
        this.sendSpy = sinon.stub().callsFake(() => { return { id: 1 } })
        this.journey.steps[1].done = {
          send: this.sendSpy,
          message: 'The entity has been added',
          nextPath: ({ id }) => `/base/entities/${id}`,
        }

        this.app.use(this.journeyBuilder.build(this.journey))

        await request(this.app).get('/step-1')
        await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-3-value' }) // initially select step 3
        await request(this.app).get('/step-3')
        await request(this.app).post('/step-3').send({ selectedAtStep3: 'step-5-value' })
        await request(this.app).get('/step-5')
        await request(this.app).post('/step-5').send({ moreDataAtStep5: 'more' })
        await request(this.app).get('/step-1') // go back to step 1
        await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-2-value' }) // change to step 2
        this.response = await request(this.app).post('/step-2').send({ moreDataAtStep2: 'more' })
      })

      it('should POST only valid data to the API', () => {
        expect(this.sendSpy).have.been.calledWith({
          selectedAtStep1: 'step-2-value',
          moreDataAtStep2: 'more',
        })
        expect(this.sendSpy).to.be.calledOnce
      })
    })

    context('when the user has changed a field that is depended on by a form', () => {
      context('and attempting to skip to a previously completed step', () => {
        beforeEach(async () => {
          this.sendSpy = sinon.stub().callsFake((data, next) => { next() })
          this.journey.steps[2].macro = () => {
            return {
              dependsOn: [ 'changing_field' ],
              children: [],
            }
          }
          this.app.use(this.journeyBuilder.build(this.journey))

          await request(this.app).get('/step-1')
          await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-3-value', changing_field: '1' }) // initial value
          await request(this.app).get('/step-3')
          await request(this.app).post('/step-3').send({ selectedAtStep3: 'step-5-value' })
          await request(this.app).get('/step-5')
          await request(this.app).post('/step-5').send({ moreDataAtStep5: 'more' })
          await request(this.app).get('/step-1') // go back to step 1
          await request(this.app).post('/step-1').send({ selectedAtStep1: 'step-3-value', changing_field: '2' }) // change value to invalidate
          this.response = await request(this.app).get('/step-5') // attempt to jump to step 5 which has been invalidated
        })

        it('should redirect to step 1', () => {
          expect(this.response.statusCode).to.equal(302)
          expect(this.response.headers.location).to.equal('/base/step-1')
        })

        it('should not render a template', () => {
          expect(this.response.res.text).to.equal('Found. Redirecting to /base/step-1')
        })
      })
    })
  })
})
