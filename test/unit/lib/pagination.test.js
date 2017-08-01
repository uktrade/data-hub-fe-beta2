const { getPageLink, buildPagination } = require('~/src/lib/pagination')

describe('Pagination', () => {
  describe('#getPageLink', () => {
    const query = { term: 'samsung' }

    it('should return a query string for query object', () => {
      expect(getPageLink(1, query)).to.equal('?term=samsung&page=1')
    })
  })

  describe('#buildPagination', () => {
    const query = { term: 'samsung' }

    it('should return null if current page is not given', () => {
      const actual = buildPagination(query, { limit: 10, count: 20 })
      expect(actual).to.be.null
    })

    it('should return null if count is not given', () => {
      const actual = buildPagination(query, { limit: 10 })
      expect(actual).to.be.null
    })

    it('should return pagination object when all required props a given', () => {
      const actual = buildPagination(query, { count: 10, limit: 5, page: 1 })
      const expected = {
        totalPages: 2,
        currentPage: 1,
        prev: null,
        next: '?term=samsung&page=2',
        pages: [
          { label: 1, url: '?term=samsung&page=1' },
          { label: 2, url: '?term=samsung&page=2' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })

    it('should return pagination object with correct current page', () => {
      const actual = buildPagination(query, { count: 10, limit: 5, page: 2 })
      const expected = {
        totalPages: 2,
        currentPage: 2,
        prev: '?term=samsung&page=1',
        next: null,
        pages: [
          { label: 1, url: '?term=samsung&page=1' },
          { label: 2, url: '?term=samsung&page=2' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })

    it('should return pagination object with truncation', () => {
      const actual = buildPagination(query, { count: 10, limit: 2, page: 1 }, 2)
      const expected = {
        totalPages: 5,
        currentPage: 1,
        prev: null,
        next: '?term=samsung&page=2',
        pages: [
          { label: 1, url: '?term=samsung&page=1' },
          { label: 2, url: '?term=samsung&page=2' },
          { label: '…' },
          { label: 5, url: '?term=samsung&page=5' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })

    it('should return pagination object without truncation when it’s not needed', () => {
      const actual = buildPagination(query, { count: 10, limit: 2, page: 1 }, 4)
      const expected = {
        totalPages: 5,
        currentPage: 1,
        prev: null,
        next: '?term=samsung&page=2',
        pages: [
          { label: 1, url: '?term=samsung&page=1' },
          { label: 2, url: '?term=samsung&page=2' },
          { label: 3, url: '?term=samsung&page=3' },
          { label: 4, url: '?term=samsung&page=4' },
          { label: 5, url: '?term=samsung&page=5' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })

    it('should return pagination object with truncation in right place when current page is changed', () => {
      const actual = buildPagination(query, { count: 10, limit: 2, page: 4 }, 2)
      const expected = {
        totalPages: 5,
        currentPage: 4,
        prev: '?term=samsung&page=3',
        next: '?term=samsung&page=5',
        pages: [
          { label: 1, url: '?term=samsung&page=1' },
          { label: '…' },
          { label: 4, url: '?term=samsung&page=4' },
          { label: 5, url: '?term=samsung&page=5' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })

    it('should return pagination object with no truncation when block start page is close to first or last pages', () => {
      const actual = buildPagination(query, { count: 21, limit: 3, page: 4 }, 4)
      const expected = {
        totalPages: 7,
        currentPage: 4,
        prev: '?term=samsung&page=3',
        next: '?term=samsung&page=5',
        pages: [
          { label: 1, url: '?term=samsung&page=1' },
          { label: 2, url: '?term=samsung&page=2' },
          { label: 3, url: '?term=samsung&page=3' },
          { label: 4, url: '?term=samsung&page=4' },
          { label: 5, url: '?term=samsung&page=5' },
          { label: 6, url: '?term=samsung&page=6' },
          { label: 7, url: '?term=samsung&page=7' },
        ],
      }
      expect(actual).to.deep.equal(expected)
    })
  })
})
