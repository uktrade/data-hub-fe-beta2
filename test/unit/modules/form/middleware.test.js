const { get } = require('lodash')

const {
  postDetails,
  setJourneyDetails,
  setBreadcrumbs,
  renderTemplate,
} = require('~/src/modules/form/middleware.js')
const steps = require('./steps')()

describe('#postDetails', () => {
  const buildCurrentStep = (sendSpy) => {
    const macro = () => {
      return {
        children: [
          {
            name: 'field4',
            validations: [
              {
                type: 'required',
                message: 'You must select field 4',
              },
            ],
          },
          {
            name: 'field5',
            validations: [
              {
                type: 'required',
                message: 'You must select field 5',
              },
            ],
          },
        ],
      }
    }

    const done = sendSpy ? {
      send: sendSpy,
      message: 'Data has been added',
      nextPath: ({ id }) => `/base/${id}`,
    } : null

    return {
      done,
      ...steps[0],
      macro,
    }
  }

  context('when there are partial validation errors', () => {
    beforeEach(async () => {
      this.flashSpy = sinon.spy()
      this.sendSpy = sinon.stub().callsFake((data, next) => { next() })
      this.redirectSpy = sinon.spy()
      this.req = {
        body: {},
        session: {},
        flash: this.flashSpy,
      }

      this.res = {
        locals: {
          journey: {
            currentStep: buildCurrentStep(this.sendSpy),
            key: '/base/step-1',
          },
        },
        redirect: this.redirectSpy,
      }
      this.nextSpy = sinon.spy()

      await postDetails(this.req, this.res, this.nextSpy)
    })

    it('should set the errors on locals', () => {
      expect(this.res.locals.form.errors.messages).to.deep.equal({
        field4: [
          'You must select field 4',
        ],
        field5: [
          'You must select field 5',
        ],
      })
    })

    it('should set the step completed to false', () => {
      const actual = this.req.session['multi-step']['/base/step-1'].steps['/step-1'].completed
      expect(actual).to.be.false
    })

    it('should not set the next path', () => {
      const actual = this.req.session['multi-step']['/base/step-1'].steps['/step-1'].nextPath
      expect(actual).to.be.undefined
    })

    it('should call next once', () => {
      expect(this.nextSpy).to.be.calledWithExactly()
      expect(this.nextSpy).to.have.been.calledOnce
    })

    it('should not send to the API', () => {
      expect(this.sendSpy).to.not.be.called
    })

    it('should not set a flash message', () => {
      expect(this.flashSpy).to.not.be.called
    })

    it('should not redirect', () => {
      expect(this.redirectSpy).to.not.be.called
    })
  })

  context('when the current step does not have a controller', () => {
    beforeEach(async () => {
      this.flashSpy = sinon.spy()
      this.sendSpy = sinon.stub().callsFake((data, next) => { next() })
      this.redirectSpy = sinon.spy()
      this.req = {
        baseUrl: '/base',
        body: {
          selectedAtStep1: 'step-2-value',
          field4: 'field-4',
          field5: 'field-5',
        },
        session: {},
        flash: this.flashSpy,
      }
      this.res = {
        locals: {
          journey: {
            currentStep: buildCurrentStep(),
            key: '/base/step-1',
          },
        },
        redirect: this.redirectSpy,
      }
      this.nextSpy = sinon.spy()

      await postDetails(this.req, this.res, this.nextSpy)
    })

    it('should not set the errors on locals', () => {
      const actual = get(this.res.locals, 'form.errors')
      expect(actual).to.be.undefined
    })

    it('should set the step completed to true', () => {
      const actual = this.req.session['multi-step']['/base/step-1'].steps['/step-1'].completed
      expect(actual).to.be.true
    })

    it('should set the next path', () => {
      const actual = this.req.session['multi-step']['/base/step-1'].steps['/step-1'].nextPath
      expect(actual).to.equal('/step-2')
    })

    it('should not call next', () => {
      expect(this.nextSpy).to.not.be.called
    })

    it('should not send to the API', () => {
      expect(this.sendSpy).to.not.be.called
    })

    it('should not set a flash message', () => {
      expect(this.flashSpy).to.not.be.called
    })

    it('should redirect', () => {
      expect(this.redirectSpy).to.be.calledWithExactly('/base/step-2')
      expect(this.redirectSpy).to.have.been.calledOnce
    })
  })

  context('when the current step does have a send function and the API call is successful', () => {
    beforeEach(async () => {
      this.flashSpy = sinon.spy()
      this.sendSpy = sinon.stub().callsFake(() => { return { id: 1 } })
      this.redirectSpy = sinon.spy()
      this.req = {
        baseUrl: '/base',
        body: {
          selectedAtStep1: 'step-2-value',
          field4: 'field-4',
          field5: 'field-5',
        },
        session: {
          'multi-step': {
            '/base/step-1': {
              steps: {
                '/step-1': {
                  data: {
                    selectedAtStep1: 'step-3-value',
                    field4: 'field-4',
                    field5: 'field-5',
                  },
                },
              },
            },
          },
        },
        flash: this.flashSpy,
      }
      this.res = {
        locals: {
          journey: {
            currentStep: buildCurrentStep(this.sendSpy),
            key: '/base/step-1',
          },
        },
        redirect: this.redirectSpy,
      }
      this.nextSpy = sinon.spy()

      await postDetails(this.req, this.res, this.nextSpy)
    })

    it('should not set the errors on locals', () => {
      const actual = get(this.res.locals, 'form.errors')
      expect(actual).to.be.undefined
    })

    it('should remove the journey from state', () => {
      const actual = this.req.session['multi-step']['/base/step-1']
      expect(actual).to.be.undefined
    })

    it('should not call next', () => {
      expect(this.nextSpy).to.not.be.called
    })

    it('should send to the API', () => {
      expect(this.sendSpy).to.be.calledWith({
        selectedAtStep1: 'step-3-value',
        field4: 'field-4',
        field5: 'field-5',
      })
      expect(this.sendSpy).to.have.been.calledOnce
    })

    it('should set a flash message', () => {
      expect(this.flashSpy).to.be.calledWithExactly('success', 'Data has been added')
      expect(this.flashSpy).to.have.been.calledOnce
    })

    it('should redirect', () => {
      expect(this.redirectSpy).to.be.calledWithExactly('/base/1')
      expect(this.redirectSpy).to.have.been.calledOnce
    })
  })

  context('when the controller has an error with status code 400', () => {
    beforeEach(async () => {
      this.flashSpy = sinon.spy()
      this.sendSpy = sinon.stub().callsFake(() => {
        const error = new Error()
        error.statusCode = 400
        error.error = 'error'
        throw error
      })
      this.redirectSpy = sinon.spy()
      this.req = {
        baseUrl: '/base',
        body: {
          selectedAtStep1: 'step-2-value',
          field4: 'field-4',
          field5: 'field-5',
        },
        session: {
          'multi-step': {
            '/base/step-1': {
              steps: {
                '/step-1': {
                  data: {
                    selectedAtStep1: 'step-2-value',
                    field4: 'field-4',
                    field5: 'field-5',
                  },
                },
              },
            },
          },
        },
        flash: this.flashSpy,
      }
      this.res = {
        locals: {
          journey: {
            currentStep: buildCurrentStep(this.sendSpy),
            key: '/base/step-1',
          },
        },
        redirect: this.redirectSpy,
      }
      this.nextSpy = sinon.spy()

      await postDetails(this.req, this.res, this.nextSpy)
    })

    it('should set the errors on locals', () => {
      expect(this.res.locals.form.errors.messages).to.equal('error')
    })

    it('should set the step completed to false', () => {
      const actual = this.req.session['multi-step']['/base/step-1'].steps['/step-1'].completed
      expect(actual).to.be.false
    })

    it('should not set the next path', () => {
      const actual = this.req.session['multi-step']['/base/step-1'].steps['/step-1'].nextPath
      expect(actual).to.be.undefined
    })

    it('should not remove the journey from state', () => {
      const actual = this.req.session['multi-step']['/base/step-1']
      expect(actual).to.not.be.undefined
    })

    it('should call next', () => {
      expect(this.nextSpy).to.be.calledWithExactly()
      expect(this.nextSpy).to.have.been.calledOnce
    })

    it('should send to the API', () => {
      expect(this.sendSpy).to.be.calledWith({
        selectedAtStep1: 'step-2-value',
        field4: 'field-4',
        field5: 'field-5',
      })
      expect(this.sendSpy).to.have.been.calledOnce
    })

    it('should not set a flash message', () => {
      expect(this.flashSpy).to.not.be.called
    })

    it('should not redirect', () => {
      expect(this.redirectSpy).to.not.be.called
    })
  })

  context('when the controller has another type of error', () => {
    beforeEach(async () => {
      this.flashSpy = sinon.spy()
      this.sendSpy = sinon.stub().callsFake(() => {
        throw new Error('error')
      })
      this.redirectSpy = sinon.spy()
      this.req = {
        baseUrl: '/base',
        body: {
          selectedAtStep1: 'step-2-value',
          field4: 'field-4',
          field5: 'field-5',
        },
        session: {
          'multi-step': {
            '/base/step-1': {
              steps: {
                '/step-1': {
                  data: {
                    selectedAtStep1: 'step-2-value',
                    field4: 'field-4',
                    field5: 'field-5',
                  },
                },
              },
            },
          },
        },
        flash: this.flashSpy,
      }
      this.res = {
        locals: {
          journey: {
            currentStep: buildCurrentStep(this.sendSpy),
            key: '/base/step-1',
          },
        },
        redirect: this.redirectSpy,
      }
      this.nextSpy = sinon.spy()

      await postDetails(this.req, this.res, this.nextSpy)
    })

    it('should not set the errors on locals', () => {
      const actual = get(this.res.locals, 'form.errors')
      expect(actual).to.be.undefined
    })

    it('should set the step completed to false', () => {
      const actual = this.req.session['multi-step']['/base/step-1'].steps['/step-1'].completed
      expect(actual).to.be.false
    })

    it('should not set the next path', () => {
      const actual = this.req.session['multi-step']['/base/step-1'].steps['/step-1'].nextPath
      expect(actual).to.be.undefined
    })

    it('should not remove the journey from state', () => {
      const actual = this.req.session['multi-step']['/base/step-1']
      expect(actual).to.not.be.undefined
    })

    it('should call next with the error', () => {
      expect(this.nextSpy).to.be.calledWith(sinon.match({
        message: 'error',
      }))
      expect(this.nextSpy).to.be.calledOnce
    })

    it('should send to the API', () => {
      expect(this.sendSpy).to.be.calledWith({
        selectedAtStep1: 'step-2-value',
        field4: 'field-4',
        field5: 'field-5',
      })
      expect(this.sendSpy).to.have.been.calledOnce
    })

    it('should not set a flash message', () => {
      expect(this.flashSpy).to.not.be.called
    })

    it('should not redirect', () => {
      expect(this.redirectSpy).to.not.be.called
    })
  })
})

describe('#setJourneyDetails', () => {
  beforeEach(() => {
    this.req = {
      baseUrl: '/base',
    }
    this.res = {
      locals: {},
    }
    this.nextSpy = sinon.spy()

    setJourneyDetails({ steps }, steps[1], 1)(this.req, this.res, this.nextSpy)
  })

  it('should set the current step', () => {
    expect(this.res.locals.journey.currentStep).to.deep.equal(steps[1])
  })

  it('should set the current step ID', () => {
    expect(this.res.locals.journey.currentStepId).to.equal(1)
  })

  it('should set the steps', () => {
    expect(this.res.locals.journey.steps).to.deep.equal(steps)
  })

  it('should set the key', () => {
    expect(this.res.locals.journey.key).to.equal('/base/step-1')
  })

  it('should call next once', () => {
    expect(this.nextSpy).to.be.calledOnce
  })
})

describe('#setBreadcrumbs', () => {
  context('when there are breadcrumbs on the whole journey and the step', () => {
    beforeEach(() => {
      this.breadcrumbSpy = sinon.spy()
      this.req = {}
      this.res = {
        locals: {
          journey: {
            breadcrumbs: [
              { name: 'breadcrumb', url: '/url' },
            ],
            currentStep: steps[0],
          },
        },
        breadcrumb: this.breadcrumbSpy,
      }
      this.nextSpy = sinon.spy()

      setBreadcrumbs(this.req, this.res, this.nextSpy)
    })

    it('should set the breadcrumbs', () => {
      expect(this.breadcrumbSpy).to.be.calledWithExactly('breadcrumb', '/url')
      expect(this.breadcrumbSpy).to.be.calledWithExactly('Add something', '/url')
      expect(this.breadcrumbSpy).to.be.calledTwice
    })

    it('should call next once', () => {
      expect(this.nextSpy).to.be.calledWithExactly()
      expect(this.nextSpy).to.be.calledOnce
    })
  })

  context('when there are breadcrumbs on the whole journey and not on the step', () => {
    beforeEach(() => {
      const currentStep = {
        ...steps[0],
      }
      delete currentStep.breadcrumbs

      this.breadcrumbSpy = sinon.spy()
      this.req = {}
      this.res = {
        locals: {
          journey: {
            currentStep,
            breadcrumbs: [
              { name: 'breadcrumb', url: '/url' },
            ],
          },
        },
        breadcrumb: this.breadcrumbSpy,
      }
      this.nextSpy = sinon.spy()

      setBreadcrumbs(this.req, this.res, this.nextSpy)
    })

    it('should set the breadcrumbs', () => {
      expect(this.breadcrumbSpy).to.be.calledWithExactly('breadcrumb', '/url')
      expect(this.breadcrumbSpy).to.be.calledOnce
    })

    it('should call next once', () => {
      expect(this.nextSpy).to.be.calledWithExactly()
      expect(this.nextSpy).to.be.calledOnce
    })
  })

  context('when there are breadcrumbs on the step and not the whole journey', () => {
    beforeEach(() => {
      this.breadcrumbSpy = sinon.spy()
      this.req = {}
      this.res = {
        locals: {
          journey: {
            currentStep: steps[0],
          },
        },
        breadcrumb: this.breadcrumbSpy,
      }
      this.nextSpy = sinon.spy()

      setBreadcrumbs(this.req, this.res, this.nextSpy)
    })

    it('should set the breadcrumbs', () => {
      expect(this.breadcrumbSpy).to.be.calledWithExactly('Add something', '/url')
      expect(this.breadcrumbSpy).to.be.calledOnce
    })

    it('should call next once', () => {
      expect(this.nextSpy).to.be.calledWithExactly()
      expect(this.nextSpy).to.be.calledOnce
    })
  })

  context('when there are not any breadcrumbs on either the whole journey or the step', () => {
    beforeEach(() => {
      const currentStep = {
        ...steps[0],
      }
      delete currentStep.breadcrumbs

      this.breadcrumbSpy = sinon.spy()
      this.req = {}
      this.res = {
        locals: {
          journey: {
            currentStep,
          },
        },
        breadcrumb: this.breadcrumbSpy,
      }
      this.nextSpy = sinon.spy()

      setBreadcrumbs(this.req, this.res, this.nextSpy)
    })

    it('should not set the breadcrumbs', () => {
      expect(this.breadcrumbSpy).to.be.not.be.called
    })

    it('should call next once', () => {
      expect(this.nextSpy).to.be.calledWithExactly()
      expect(this.nextSpy).to.be.calledOnce
    })
  })
})

describe('#renderTemplate', () => {
  beforeEach(() => {
    steps[0].macro = sinon.spy()

    this.req = {}
    this.res = {
      render: sinon.spy(),
      locals: {
        journey: {
          currentStep: steps[0],
        },
        form: {
          previouslySet: 'previously-set',
          errors: {
            messages: {
              field: [ 'error' ],
            },
          },
          returnLink: '/base',
          returnText: 'Cancel',
          state: {
            selectedAtStep1: 'step-3-value',
          },
        },
      },
    }

    renderTemplate(this.req, this.res)
  })

  it('should render the template once', () => {
    expect(this.res.render.firstCall.args[0]).to.equal('_layouts/form')
    expect(this.res.render).to.be.calledOnce
  })

  it('should set the heading', () => {
    expect(this.res.render.firstCall.args[1].heading).to.equal('Add something')
  })

  it('should maintain previously set form fields', () => {
    expect(this.res.render.firstCall.args[1].form.previouslySet).to.equal('previously-set')
  })

  it('should call the form macro once', () => {
    expect(this.res.locals.journey.currentStep.macro).to.be.calledOnce
  })

  it('should call the form macro with errors', () => {
    expect(this.res.locals.journey.currentStep.macro.firstCall.args[0].errors).to.deep.equal({ field: [ 'error' ] })
  })

  it('should call the form macro with return link', () => {
    expect(this.res.locals.journey.currentStep.macro.firstCall.args[0].returnLink).to.equal('/base')
  })

  it('should call the form macro with return text', () => {
    expect(this.res.locals.journey.currentStep.macro.firstCall.args[0].returnText).to.equal('Cancel')
  })

  it('should call the form macro with state', () => {
    expect(this.res.locals.journey.currentStep.macro.firstCall.args[0].state).to.deep.equal({ selectedAtStep1: 'step-3-value' })
  })
})
