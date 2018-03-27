const { getMacros } = require('~/test/unit/macro-helper')
const macros = getMacros('form/multiple-choice-field')

describe('MultipleChoice component', () => {
  const minimumProps = {
    label: 'Multiple choice field',
    name: 'multiple-choice',
    fieldId: 'multiple-choice',
    type: 'radio',
    options: [
      {
        label: 'Foo',
        value: 'bar',
      },
      {
        label: 'Fizz',
        value: 'buzz',
      },
    ],
  }

  describe('invalid props', () => {
    context('no props', () => {
      it('should not render', () => {
        const component = macros.renderToDom('MultipleChoice')
        expect(component).to.be.null
      })
    })

    context('type not a checkbox or radio', () => {
      it('should not render', () => {
        const component = macros.renderToDom('MultipleChoice', {
          type: 'bar',
        })
        expect(component).to.be.null
      })
    })
  })

  describe('valid props', () => {
    beforeEach(() => {
      this.component = macros.renderToDom('MultipleChoice', minimumProps).parentElement
      this.options = this.component.querySelectorAll('.c-multiple-choice')
    })

    it('should render 2 items', () => {
      expect(this.options).to.have.lengthOf(2)
    })

    it('should render correct output for first option', () => {
      expect(this.options[0].querySelector('.c-multiple-choice__label-text').textContent).to.equal('Foo')
      expect(this.options[0].querySelector('.c-multiple-choice__input').getAttribute('value')).to.equal('bar')
    })

    it('should render correct output for second option', () => {
      expect(this.options[1].querySelector('.c-multiple-choice__label-text').textContent).to.equal('Fizz')
      expect(this.options[1].querySelector('.c-multiple-choice__input').getAttribute('value')).to.equal('buzz')
    })
  })

  describe('customise component', () => {
    context('value is passed', () => {
      beforeEach(() => {
        this.valueProps = Object.assign({}, minimumProps, {
          options: [
            {
              label: 'Boolean (True)',
              value: 'true',
            },
            {
              label: 'Boolean (False)',
              value: 'false',
            },
            {
              label: 'String',
              value: 'string',
            },
          ],
        })
      })

      context('value is a boolean', () => {
        it('should set option to selected if matches true', () => {
          const component = macros.renderToDom('MultipleChoice', Object.assign({}, this.valueProps, {
            value: true,
          })).parentElement
          const options = component.querySelectorAll('.c-multiple-choice__input')

          expect(options[0].getAttribute('checked')).to.equal('checked')
          expect(options[1].getAttribute('checked')).to.be.null
          expect(options[2].getAttribute('checked')).to.be.null
        })

        it('should set option to selected if matches false', () => {
          const component = macros.renderToDom('MultipleChoice', Object.assign({}, this.valueProps, {
            value: false,
          })).parentElement
          const options = component.querySelectorAll('.c-multiple-choice__input')

          expect(options[0].getAttribute('checked')).to.be.null
          expect(options[1].getAttribute('checked')).to.equal('checked')
          expect(options[2].getAttribute('checked')).to.be.null
        })

        it('should set option to selected if matches a string', () => {
          const component = macros.renderToDom('MultipleChoice', Object.assign({}, this.valueProps, {
            value: 'string',
          })).parentElement
          const options = component.querySelectorAll('.c-multiple-choice__input')

          expect(options[0].getAttribute('checked')).to.be.null
          expect(options[1].getAttribute('checked')).to.be.null
          expect(options[2].getAttribute('checked')).to.equal('checked')
        })
      })
    })

    context('children are set', () => {
      beforeEach(() => {
        this.valueProps = Object.assign({}, minimumProps, {
          children: [
            {
              macroName: 'TextField',
              name: 'first-child',
              label: 'First child',
            },
            {
              macroName: 'TextField',
              name: 'second-child',
              label: 'Second child',
            },
          ],
        })
      })

      it('should display first child within form group inner', () => {
        const component = macros.renderToDom('MultipleChoiceField', Object.assign({}, this.valueProps)).parentElement
        const children = component.querySelectorAll('.c-form-group__inner .c-form-group')
        const firstChild = children[0]

        expect(firstChild.querySelector('input').name).to.equal('first-child')
      })

      it('should display second child within form group inner', () => {
        const component = macros.renderToDom('MultipleChoiceField', Object.assign({}, this.valueProps)).parentElement
        const children = component.querySelectorAll('.c-form-group__inner .c-form-group')
        const secondChild = children[1]

        expect(secondChild.querySelector('input').name).to.equal('second-child')
      })

      it('should display the correct number of children', () => {
        const component = macros.renderToDom('MultipleChoiceField', Object.assign({}, this.valueProps)).parentElement
        const children = component.querySelectorAll('.c-form-group__inner .c-form-group')

        expect(children).to.have.length(2)
      })
    })
  })

  context('multiple choice select with data attribute', () => {
    beforeEach(() => {
      const props = {
        ...minimumProps,
        type: 'select',
        inputData: {
          att1: 'att1-value',
        },
      }

      this.component = macros.renderToDom('MultipleChoiceField', props)
    })

    it('should attach data attributes to the select control', () => {
      expect(this.component.querySelector('select[data-att1="att1-value"]')).to.not.be.null
    })
  })

  context('multiple choice select with data attributes', () => {
    beforeEach(() => {
      const props = {
        ...minimumProps,
        type: 'select',
        inputData: {
          att1: 'att1-value',
          att2: 'att2-value',
        },
      }

      this.component = macros.renderToDom('MultipleChoiceField', props)
    })

    it('should attach data attributes to the select control', () => {
      expect(this.component.querySelector('select[data-att1="att1-value"][data-att2="att2-value"]')).to.not.be.null
    })
  })
})
