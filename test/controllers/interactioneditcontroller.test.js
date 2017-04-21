/* globals expect: true, describe: true, it: true, beforeEach: true */
/* eslint handle-callback-err: 0 */
const stubs = require('../stubs')
const { render } = require('../nunjucks')
const proxyquire = require('proxyquire')
const { expectTextFieldWithLabel, expectTextAreaWithLabel, expectDropdownWithLabel, expectDateFieldWithLabel } = require('../formhelpers')
const interactionLabels = require('../../src/labels/interactionlabels')

describe('Interaction controller, edit', function () {
  let interactionEditController
  let getInteractionAsFormDataStub
  let createBlankInteractionForCompanyStub
  let createBlankInteractionForContactStub
  let getContactsForCompanyStub
  let getInteractionTypeStub
  let getDitCompanyStub
  let getAdvisorStub
  let getServiceOffersStub
  let saveInteractionFormStub
  let company
  let emailInteractionType
  let newContactInteraction
  let newCompanyInteraction

  beforeEach(function () {
    company = {
      id: '1234',
      name: 'Fred ltd.'
    }

    emailInteractionType = {
      id: '444',
      name: 'Email'
    }

    newContactInteraction = {
      contact: {
        id: '888',
        name: 'Fred Smith',
        first_name: 'Fred',
        last_name: 'Smith'
      },
      company,
      interaction_type: emailInteractionType
    }

    newCompanyInteraction = {
      company,
      interaction_type: emailInteractionType
    }

    getInteractionAsFormDataStub = stubs.getInteractionAsFormDataStub()
    createBlankInteractionForCompanyStub = stubs.createBlankInteractionForCompanyStub(newCompanyInteraction)
    createBlankInteractionForContactStub = stubs.createBlankInteractionForContactStub(newContactInteraction)
    getContactsForCompanyStub = stubs.getContactsForCompanyStub()
    getAdvisorStub = stubs.getAdvisorStub()
    getServiceOffersStub = stubs.getServiceOffersStub()
    getDitCompanyStub = stubs.getDitCompanyStub(company)
    getInteractionTypeStub = stubs.getInteractionTypeStub(emailInteractionType)
    saveInteractionFormStub = stubs.saveStub()

    interactionEditController = proxyquire('../../src/controllers/interactioneditcontroller', {
      '../services/interactionformservice': {
        getInteractionAsFormData: getInteractionAsFormDataStub,
        saveInteractionForm: saveInteractionFormStub
      },
      '../services/interactiondataservice': {
        createBlankInteractionForCompany: createBlankInteractionForCompanyStub,
        createBlankInteractionForContact: createBlankInteractionForContactStub,
        getInteractionType: getInteractionTypeStub
      },
      '../repositorys/contactrepository': {
        getContactsForCompany: getContactsForCompanyStub
      },
      '../repositorys/companyrepository': {
        getDitCompany: getDitCompanyStub
      },
      '../repositorys/advisorrepository': {
        getAdvisor: getAdvisorStub
      },
      '../repositorys/metadatarepository': {
        getServiceOffers: getServiceOffersStub
      }
    })
  })

  describe('get', function () {
    describe('existing interaction', function () {
      let req
      let res
      const next = function (error) {
        throw error
      }
      let interaction

      beforeEach(function () {
        interaction = {
          id: '1234',
          subject: 'test'
        }
        req = {
          session: {
            token: '1234'
          },
          query: {}
        }
        res = {
          locals: {
            interaction
          }
        }
      })

      it('should create a form based on the existing interaction', function (done) {
        res.render = function () {
          expect(getInteractionAsFormDataStub).to.have.been.calledWith(interaction)
          expect(res.locals).to.have.property('formData')
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
      it('should include an expanded company', function (done) {
        res.render = function () {
          expect(res.locals.company).to.deep.equal(interaction.company)
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
      it('should include an expanded interaction type', function (done) {
        res.render = function () {
          expect(res.locals.interaction_type).to.deep.equal(interaction.interaction_type)
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
      it('should include a back link to the interaction', function (done) {
        res.render = function () {
          expect(res.locals.backUrl).to.deep.equal('/interaction/1234/details')
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
    })
    describe('create a new interaction for a contact', function () {
      let user
      let req
      let res
      const next = function (error) {
        throw error
      }

      beforeEach(function () {
        user = {id: '1111', first_name: 'John', last_name: 'Brown'}
        req = {
          session: {
            token: '1234',
            user
          },
          query: {
            contact: '888',
            interaction_type: '999'
          }
        }
        res = {
          locals: {}
        }
      })
      it('should create a new interaction for a contact if just a contact is passed', function (done) {
        res.render = function () {
          expect(createBlankInteractionForContactStub).to.have.been.calledWith('1234', user, '999', '888')
          expect(res.locals).to.have.property('formData')
          done()
        }

        interactionEditController.editDetails(req, res, next)
      })
      it('should include an expanded company', function (done) {
        res.render = function () {
          expect(res.locals.company).to.deep.equal(company)
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
      it('should include an expanded interaction type', function (done) {
        res.render = function () {
          expect(res.locals.interaction_type).to.deep.equal(emailInteractionType)
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
      it('should provide a link back to contact', function (done) {
        res.render = function () {
          expect(res.locals.backUrl).to.equal('/contact/888/interactions')
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
    })
    describe('create a new interaction for a company', function () {
      let user
      let req
      let res
      const next = function (error) {
        throw error
      }

      beforeEach(function () {
        user = {id: '1111', first_name: 'John', last_name: 'Brown'}
        req = {
          session: {
            token: '1234',
            user
          },
          query: {
            company: '888',
            interaction_type: '999'
          }
        }
        res = {
          locals: {}
        }
      })

      it('should create a new interaction for a company if just a company is passed', function (done) {
        res.render = function () {
          expect(createBlankInteractionForCompanyStub).to.have.been.calledWith('1234', user, '999', '888')
          expect(res.locals).to.have.property('formData')
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
      it('should include an expanded company', function (done) {
        res.render = function () {
          expect(res.locals.company).to.deep.equal(company)
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
      it('should include an expanded interaction type', function (done) {
        res.render = function () {
          expect(res.locals.interaction_type).to.deep.equal(emailInteractionType)
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
      it('should provide a link back to company', function (done) {
        res.render = function () {
          expect(res.locals.backUrl).to.equal('/company/company_company/888/interactions')
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
    })
    describe('handle editing a form post that produced errors', function () {
      let req
      let body
      let user
      let res
      const next = function (error) {
        throw error
      }

      beforeEach(function () {
        user = {id: '1111', first_name: 'John', last_name: 'Brown'}
        body = {
          id: '222',
          interaction_type: '111',
          company: '333',
          contact: '444',
          subject: 'test subject',
          dit_advisor: '7811'
        }
        req = {
          session: {
            token: '1234',
            user
          },
          body,
          query: {
            company: '888',
            interaction_type: '999'
          }
        }
        res = { locals: {} }
      })
      it('should use the pre posted form for edit', function (done) {
        res.render = function () {
          expect(res.locals.formData).to.deep.equal(body)
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
      it('should include an expanded company', function (done) {
        res.render = function () {
          expect(res.locals.company).to.deep.equal(company)
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
      it('should include an expanded interaction type', function (done) {
        res.render = function () {
          expect(res.locals.interaction_type).to.deep.equal(emailInteractionType)
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
      it('should lookup a DIT advisor details for display if required', function (done) {
        res.render = function () {
          expect(getAdvisorStub).to.be.calledWith('1234', '7811')
          expect(res.locals).to.have.property('dit_advisor')
          done()
        }
        interactionEditController.editDetails(req, res, next)
      })
    })
    it('should get contacts for the company for dropdown', function (done) {
      const next = function (error) {
        throw error
      }
      const interaction = {
        id: '1234',
        subject: 'test',
        company,
        contact: {
          id: '1234',
          name: 'Fred Smith',
          first_name: 'Fred',
          last_name: 'Smith'
        }
      }
      const req = {
        session: {
          token: '1234'
        },
        query: {}
      }
      const res = {
        locals: { interaction },
        render: function () {
          expect(getContactsForCompanyStub).to.be.calledWith(company.id)
          expect(res.locals).to.have.property('contacts')
          done()
        }
      }

      interactionEditController.editDetails(req, res, next)
    })
    describe('render', function () {
      const locals = {
        formData: {
          id: '222',
          interaction_type: '111',
          company: '333',
          contact: '444',
          subject: 'test subject',
          dit_advisor: '7811'
        },
        company: {
          id: '1234',
          name: 'Freds'
        },
        interaction_type: {
          id: '333',
          name: 'Email'
        },
        labels: interactionLabels
      }

      it('should render all the required fields on the page', function () {
        return render(`${__dirname}/../../src/views/interaction/interaction-edit.html`, locals)
        .then((document) => {
          expect(document.querySelector('[type=hidden][name=id]')).to.not.be.null
          expect(document.querySelector('[type=hidden][name=interaction_type]')).to.not.be.null
          expect(document.querySelector('[type=hidden][name=company][type=hidden]')).to.not.be.null
          expectTextFieldWithLabel(document, 'subject', 'Subject')
          expectTextAreaWithLabel(document, 'notes', 'Interaction notes')
          expectDropdownWithLabel(document, 'contact', 'Company contact')
          expectDateFieldWithLabel(document, 'date', 'Date of interaction')
          expectDropdownWithLabel(document, 'dit_advisor', 'DIT advisor')
          expectDropdownWithLabel(document, 'service', 'Service offer')
          expectDropdownWithLabel(document, 'dit_team', 'Service provider')
        })
      })
      it('should show the company name and the interaction type', function () {
        return render(`${__dirname}/../../src/views/interaction/interaction-edit.html`, locals)
        .then((document) => {
          const companyElement = document.getElementById('company-wrapper')
          expect(companyElement.textContent).to.include('Company')
          expect(companyElement.textContent).to.include('Freds')
        })
      })
      it('should not include the id field for new interactions', function () {
        delete locals.formData.id
        return render(`${__dirname}/../../src/views/interaction/interaction-edit.html`, locals)
        .then((document) => {
          expect(document.querySelector('[type=hidden][name=id]')).to.be.null
        })
      })
      it('should include a csrf token', function () {
        return render(`${__dirname}/../../src/views/interaction/interaction-edit.html`, locals)
        .then((document) => {
          expect(document.querySelector('[type=hidden][name=_csrf_token]')).to.not.be.null
        })
      })
      it('should render errors in a list if there are any', function () {
        locals.errors = {
          name: ['test']
        }
        return render(`${__dirname}/../../src/views/interaction/interaction-edit.html`, locals)
        .then((document) => {
          expect(document.querySelector('.error-summary-list')).to.not.be.null
        })
      })
    })
  })
  describe('post', function () {
    let body
    let req
    let res
    const next = function (error) {
      throw (error)
    }

    beforeEach(function () {
      body = {
        id: '222',
        interaction_type: '111',
        company: '333',
        contact: '444',
        subject: 'test subject',
        dit_advisor: '7811'
      }

      req = {
        session: {
          token: '1234'
        },
        body
      }

      res = {
        locals: {}
      }
    })

    it('should save the form data to the back end', function (done) {
      res.redirect = function () {
        expect(saveInteractionFormStub).to.be.calledWith('1234', body)
        done()
      }

      interactionEditController.postDetails(req, res, next)
    })
    it('should redirect the user to the view page if successful', function (done) {
      res.redirect = function (url) {
        expect(url).to.equal('/interaction/222/details')
        done()
      }

      interactionEditController.postDetails(req, res, next)
    })
    it('should re-render the edit page with the original form data on validation errors', function (done) {
      req.body.id = 'XXX'
      res.render = function (url) {
        done()
      }
      interactionEditController.postDetails(req, res, next)
    })
    it('should show errors when the save fails for a non-validation related reason', function (done) {
      req.body.id = 'YYY'
      interactionEditController.postDetails(req, res, function (error) {
        done()
      })
    })
  })
})
