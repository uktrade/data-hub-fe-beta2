const { getMacros } = require('~/test/unit/macro-helper')
const macros = getMacros('form')

describe('TextField component', () => {
  describe('invalid props', () => {
    it('should not render without props', () => {
      const component = macros.renderToDom('TextField')
      expect(component).to.be.null
    })

    it('should not render if label is not provided', () => {
      const component = macros.renderToDom('TextField', {
        name: 'firstName',
      })
      expect(component).to.be.null
    })

    it('should not render if name is not provided', () => {
      const component = macros.renderToDom('TextField', {
        label: 'First name',
      })
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    beforeEach(() => {
      this.component = macros.renderToDom('TextField', {
        name: 'firstName',
        label: 'First name',
        value: 'Joe',
      })
    })

    it('should render a component with group id', () => {
      expect(this.component.id).to.equal('group-field-firstName')
    })

    it('should render a component with correct group class name', () => {
      expect(this.component.className.trim()).to.equal('c-form-group')
    })

    it('should render a component with label and input field', () => {
      expect(this.component.querySelector('label').textContent.trim()).to.equal('First name')
      expect(this.component.querySelector('input')).to.not.be.null
    })

    it('should render a component which has input with name and id based on its name', () => {
      expect(this.component.querySelector('input').name).to.equal('firstName')
      expect(this.component.querySelector('input').id).to.equal('field-firstName')
    })

    it('should render a component with text input by default', () => {
      expect(this.component.querySelector('input').type).to.equal('text')
    })

    it('should render a field with value given', () => {
      expect(this.component.querySelector('input').value).to.equal('Joe')
    })
  })

  describe('customise component', () => {
    it('should render textarea field when given type "textarea"', () => {
      const component = macros.renderToDom('TextField', {
        type: 'textarea',
        name: 'description',
        label: 'Description',
      })
      expect(component.querySelector('label').textContent.trim()).to.equal('Description')
      expect(component.querySelector('textarea')).to.not.be.null
      expect(component.querySelector('textarea').id).to.equal('field-description')
    })

    it('should render label with text optional when given "optional" flag', () => {
      const component = macros.renderToDom('TextField', {
        optional: true,
        name: 'firstName',
        label: 'First name',
      })
      expect(component.querySelector('label').textContent.trim()).to.equal('First name (optional)')
    })

    it('should render label with text optional when given "optional" flag', () => {
      const component = macros.renderToDom('TextField', {
        optional: true,
        name: 'firstName',
        label: 'First name',
      })
      expect(component.querySelector('label').textContent.trim()).to.equal('First name (optional)')
    })

    it('should render label with hint when hint text is given', () => {
      const component = macros.renderToDom('TextField', {
        hint: 'Additional info',
        name: 'firstName',
        label: 'First name',
      })
      expect(component.querySelector('.c-form-group__hint').textContent.trim()).to.equal('Additional info')
    })
  })

  describe('field errors', () => {
    it('should render error message when error messages is given"', () => {
      const component = macros.renderToDom('TextField', {
        name: 'description',
        label: 'Description',
        error: 'Field has error',
      })
      expect(component.querySelector('.c-form-group__error-message').textContent.trim()).to.equal('Field has error')
    })
  })

  context('texfield has a single data attributes', () => {
    beforeEach(() => {
      this.component = macros.renderToDom('TextField', {
        name: 'description',
        label: 'Description',
        inputData: {
          test: 'text-value',
        },
      })
    })

    it('should add the data attribute to the input control', () => {
      expect(this.component.querySelector('input[data-test="text-value"]')).to.not.be.null
    })
  })

  context('texfield has a multiple data attributes', () => {
    beforeEach(() => {
      this.component = macros.renderToDom('TextField', {
        name: 'description',
        label: 'Description',
        inputData: {
          att1: 'att1-value',
          att2: 'att2-value',
        },
      })
    })

    it('should add the data attributes to the input control', () => {
      expect(this.component.querySelector('input[data-att1="att1-value"][data-att2="att2-value"]')).to.not.be.null
    })
  })

  context('textarea has a single data attributes', () => {
    beforeEach(() => {
      this.component = macros.renderToDom('TextField', {
        type: 'textarea',
        name: 'description',
        label: 'Description',
        inputData: {
          test: 'text-value',
        },
      })
    })

    it('should add the data attribute to the input control', () => {
      expect(this.component.querySelector('textarea[data-test="text-value"]')).to.not.be.null
    })
  })

  context('texfield has a multiple data attributes', () => {
    beforeEach(() => {
      this.component = macros.renderToDom('TextField', {
        type: 'textarea',
        name: 'description',
        label: 'Description',
        inputData: {
          att1: 'att1-value',
          att2: 'att2-value',
        },
      })
    })

    it('should add the data attributes to the input control', () => {
      expect(this.component.querySelector('textarea[data-att1="att1-value"][data-att2="att2-value"]')).to.not.be.null
    })
  })
})
