const filters = require('~/config/nunjucks/filters')

describe('nunjucks filters', () => {
  describe('#highlight', () => {
    it('should render string with highlight', () => {
      const searchTerm = 'example term'
      const mockString = `we should see ${searchTerm} highlighted here`

      const highlightedString = filters.highlight(mockString, searchTerm)

      expect(highlightedString.val).to.equal(`we should see <span class="u-highlight">${searchTerm}</span> highlighted here`)
    })

    it('should render string without highlight', () => {
      const searchTerm = 'example term'
      const mockString = 'we should not see another term highlighted here'

      const highlightedString = filters.highlight(mockString, searchTerm)

      expect(highlightedString.val).to.equal(mockString)
    })
  })

  describe('#removeNilAndEmpty', () => {
    it('should remove nil and empty values from array', () => {
      const mockArrayWithEmpties = [
        0,
        null,
        undefined,
        '',
        'example value',
        false,
        'another example value',
      ]

      const actual = filters.removeNilAndEmpty(mockArrayWithEmpties)

      expect(actual).to.deep.equal([
        0,
        'example value',
        false,
        'another example value',
      ])
    })

    it('should remove nil and empty values from object', () => {
      const mockObjectWithEmpties = {
        a: true,
        b: null,
        c: undefined,
        d: 'false',
        e: 'value',
        f: '',
        g: false,
        h: [],
        i: {},
      }

      const actual = filters.removeNilAndEmpty(mockObjectWithEmpties)

      expect(actual).to.deep.equal({
        a: true,
        d: 'false',
        e: 'value',
        g: false,
      })
    })
  })

  describe('#pluralise', () => {
    it('should return pluralised string when count is 0', () => {
      const singularString = 'result'

      const pluralisedString = filters.pluralise(singularString, 0)

      expect(pluralisedString).to.equal(`${singularString}s`)
    })

    it('should return singular string string when count is 1', () => {
      const singularString = 'result'

      const pluralisedString = filters.pluralise(singularString, 1)

      expect(pluralisedString).to.equal(singularString)
    })

    it('should return pluralised custom string when count is 0', () => {
      const singularString = 'company'
      const customPluralisedString = 'companies'

      const pluralisedString = filters.pluralise(singularString, 0, customPluralisedString)

      expect(pluralisedString).to.equal(customPluralisedString)
    })

    it('should return singular custom string when count is 1', () => {
      const singularString = 'company'
      const customPluralisedString = 'companies'

      const pluralisedString = filters.pluralise(singularString, 1, customPluralisedString)

      expect(pluralisedString).to.equal(singularString)
    })
  })

  describe('#formatNumber', () => {
    it('should correctly format number for "en-GB" locale', () => {
      const formattedNumber = filters.formatNumber(12345678)

      expect(formattedNumber).to.equal('12,345,678')
    })

    it('should correctly format number for "de-DE" locale', () => {
      const formattedNumber = filters.formatNumber(12345678, 'de-DE')

      expect(formattedNumber).to.equal('12,345,678')
    })
  })
})
