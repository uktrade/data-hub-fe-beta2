const { addMonths, subMonths } = require('date-fns')

const { filterDisabledOption, filterNonPermittedItem } = require('../filters')

const today = new Date()
const lastMonth = subMonths(today, 1)
const nextMonth = addMonths(today, 1)

describe('filters', () => {
  describe('#filterDisabledOption', () => {
    context('when an option was disabled in the past', () => {
      beforeEach(() => {
        this.options = [
          {
            id: '1234',
            name: 'Freds',
            disabled_on: lastMonth,
          },
        ]
      })

      context('when the option is not the current field value', () => {
        beforeEach(() => {
          this.filteredOptions = this.options.filter(
            filterDisabledOption({
              currentValue: '3',
              createdOn: lastMonth,
            })
          )
        })

        it('should not include the option', () => {
          expect(this.filteredOptions).to.have.length(0)
        })
      })

      context('when the option is the current field value', () => {
        beforeEach(() => {
          this.filteredOptions = this.options.filter(
            filterDisabledOption({
              currentValue: '1234',
              createdOn: lastMonth,
            })
          )
        })

        it('should include the option', () => {
          expect(this.filteredOptions).to.have.length(1)
        })
      })

      context('when there is no current value', () => {
        beforeEach(() => {
          this.filteredOptions = this.options.filter(filterDisabledOption())
        })

        it('should not include the option', () => {
          expect(this.filteredOptions).to.have.length(0)
        })
      })
    })

    context('when an option is disabled in the future', () => {
      beforeEach(() => {
        this.options = [
          {
            id: '1234',
            name: 'Freds',
            disabled_on: nextMonth,
          },
        ]
      })

      context('when the option is not the current field value', () => {
        beforeEach(() => {
          this.filteredOptions = this.options.filter(
            filterDisabledOption({
              currentValue: '3',
              createdOn: lastMonth,
            })
          )
        })

        it('should include the option', () => {
          expect(this.filteredOptions).to.have.length(1)
        })
      })

      context('when the option is the current field value', () => {
        beforeEach(() => {
          this.filteredOptions = this.options.filter(
            filterDisabledOption({
              currentValue: '1234',
              createdOn: lastMonth,
            })
          )
        })

        it('should include the option', () => {
          expect(this.filteredOptions).to.have.length(1)
        })
      })

      context('when there is no current value', () => {
        beforeEach(() => {
          this.filteredOptions = this.options.filter(filterDisabledOption())
        })

        it('should include the option', () => {
          expect(this.filteredOptions).to.have.length(1)
        })
      })
    })

    context('when an option is not disabled', () => {
      beforeEach(() => {
        this.options = [
          {
            id: '1234',
            name: 'Freds',
            disabled_on: null,
          },
        ]
      })

      context('when the option is not the current field value', () => {
        beforeEach(() => {
          this.filteredOptions = this.options.filter(
            filterDisabledOption({
              currentValue: '3',
              createdOn: lastMonth,
            })
          )
        })

        it('should include the option', () => {
          expect(this.filteredOptions).to.have.length(1)
        })
      })

      context('when the option is the current field value', () => {
        beforeEach(() => {
          this.filteredOptions = this.options.filter(
            filterDisabledOption({
              currentValue: '1234',
              createdOn: lastMonth,
            })
          )
        })

        it('should include the option', () => {
          expect(this.filteredOptions).to.have.length(1)
        })
      })

      context('when there is no current value', () => {
        beforeEach(() => {
          this.filteredOptions = this.options.filter(filterDisabledOption())
        })

        it('should include the option', () => {
          expect(this.filteredOptions).to.have.length(1)
        })
      })
    })
  })

  describe('#filterNonPermittedItem', () => {
    beforeEach(() => {
      this.filterNonPermittedItem = filterNonPermittedItem
      this.items = [
        {
          permissions: ['permission'],
          name: 'Example',
        },
        {
          permissions: ['permission1'],
          name: 'Example one',
        },
        {
          name: 'Item without permissions',
        },
        {
          permissions: ['permission2'],
          name: 'Example two',
        },
        {
          name: 'Item with empty permissions array',
          permissions: [],
        },
        {
          permissions: ['permission3'],
          name: 'Example three',
        },
        {
          permissions: ['permission5'],
          name: 'Example five',
        },
        {
          permissions: ['permission4', 'permission6', 'permission7'],
          name: 'Example four, six and seven',
        },
        {
          name: 'Another item without permissions',
        },
      ]
    })

    it('should return expected user permitted items', () => {
      this.userPermissions = ['permission1', 'permission2', 'permission5']
      const expectItems = [
        {
          permissions: ['permission1'],
          name: 'Example one',
        },
        {
          name: 'Item without permissions',
        },
        {
          permissions: ['permission2'],
          name: 'Example two',
        },
        {
          name: 'Item with empty permissions array',
          permissions: [],
        },
        {
          permissions: ['permission5'],
          name: 'Example five',
        },
        {
          name: 'Another item without permissions',
        },
      ]
      const userPermissions = this.items.filter(
        this.filterNonPermittedItem(this.userPermissions)
      )

      expect(userPermissions).to.deep.equal(expectItems)
    })

    it('should return expected user permitted items when multiple permissions are supplied', () => {
      this.userPermissions = ['permission7']
      const expectItems = [
        {
          name: 'Item without permissions',
        },
        {
          name: 'Item with empty permissions array',
          permissions: [],
        },
        {
          permissions: ['permission4', 'permission6', 'permission7'],
          name: 'Example four, six and seven',
        },
        {
          name: 'Another item without permissions',
        },
      ]
      const userPermissions = this.items.filter(
        this.filterNonPermittedItem(this.userPermissions)
      )

      expect(userPermissions).to.deep.equal(expectItems)
    })

    it('should return items without permissions', () => {
      this.userPermissions = []
      const expectItems = [
        {
          name: 'Item without permissions',
        },
        {
          name: 'Item with empty permissions array',
          permissions: [],
        },
        {
          name: 'Another item without permissions',
        },
      ]
      const userPermissions = this.items.filter(
        this.filterNonPermittedItem(this.userPermissions)
      )

      expect(userPermissions).to.deep.equal(expectItems)
    })
  })
})
