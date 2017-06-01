const jsdom = require('jsdom')
const { JSDOM } = jsdom
const TableSort = require(`${root}/src/javascripts/sortable-table`)

const FIRST_NAME_SELECTOR = '.js-sortable-table tbody tr:first-child td:first-child'
const LAST_NAME_SELECTOR = '.js-sortable-table tbody tr:last-child td:first-child'
const HOOK = '.js-sortable-table'

const HTML = `<html><body><table class="js-sortable-table">
    <thead>
      <tr>
          <th id="name-header">Name</th>
          <th id="role-header">Role</th>
          <th id="phone-header">Phone</th>
          <th id="email-header">Email</th>
      </tr>
    </thead>
    <tbody>
        <tr>
          <td>Fred Bloggs</td>
          <td>Director</td>
          <td>+44 7888 777 333</td>
          <td>fred@acme.org</td>
        </tr>
        <tr>
          <td>Wilma Bloggs</td>
          <td>Director</td>
          <td>+44 7888 777 333</td>
          <td>wilma@acme.org</td>
        </tr>
        <tr>
          <td>Chris Bloggs</td>
          <td>Architect</td>
          <td>+44 7888 777 333</td>
          <td>chris@acme.org</td>
        </tr>
    </tbody>
  </table></body></html>`

function domTokenToArray (obj) {
  let array = []
  // iterate backwards ensuring that length is an UInt32
  for (let i = obj.length >>> 0; i--;) {
    array[i] = obj[i]
  }
  return array
}

describe('Sortable Table', () => {
  let document

  beforeEach(() => {
    const { window } = new JSDOM(HTML)
    document = window.document
  })

  describe('Keys', () => {
    it('should generate unique keys for columns and decorate the markup', () => {
      const headingElements = document.querySelectorAll('table thead th')
      const keys = TableSort.assignTableKeys(headingElements)

      expect(keys).to.have.length(4)
      for (let pos = 0; pos < headingElements.length; pos += 1) {
        expect(headingElements.item(pos).getAttribute('data-key')).to.equal(keys[pos])
      }
    })
  })
  describe('Parse table data', () => {
    let data
    beforeEach(() => {
      const keys = ['name', 'role', 'phone', 'email']
      data = TableSort.parseTableBody(document.querySelector('table'), keys)
    })

    it('parse the correct number of records in a table', () => {
      expect(data.length).to.eq(3)
    })
    it('parses a record with the correct keys and values', () => {
      expect(data[0]).to.deep.equal({
        name: 'Fred Bloggs',
        email: 'fred@acme.org',
        phone: '+44 7888 777 333',
        role: 'Director'
      })
    })
  })
  describe('Sort data', () => {
    const data = [
      {
        name: 'Fred Bloggs',
        email: 'fred@acme.org',
        phone: '+44 7888 777 333',
        role: 'Director',
        created: '28/01/2016'
      },
      {
        name: 'Wilma Bloggs',
        email: 'Wilma@acme.org',
        phone: '+44 7888 777 333',
        role: 'Computer Analyst',
        created: '10/10/2016'
      },
      {
        name: 'Chris Bloggs',
        email: 'chris@acme.org',
        phone: '+44 7888 777 333',
        role: 'Architect',
        created: '10/05/2016'
      }
    ]

    it('should sort ascending', () => {
      const sorted = TableSort.sort(data, 'name')
      expect(sorted[0].name).to.equal('Chris Bloggs')
      expect(sorted[2].name).to.equal('Wilma Bloggs')
    })
    it('should sort descending', () => {
      const sorted = TableSort.sort(data, 'name', false)
      expect(sorted[2].name).to.equal('Chris Bloggs')
      expect(sorted[0].name).to.equal('Wilma Bloggs')
    })
    it('should detect dates and sort asc', () => {
      const sorted = TableSort.sort(data, 'created')
      expect(sorted[0].name).to.equal('Fred Bloggs')
      expect(sorted[2].name).to.equal('Wilma Bloggs')
    })
    it('should detect dates and sort desc', () => {
      const sorted = TableSort.sort(data, 'created', false)
      expect(sorted[2].name).to.equal('Fred Bloggs')
      expect(sorted[0].name).to.equal('Wilma Bloggs')
    })
  })
  describe('Re-order table when selected', () => {
    let tableSort
    let nameHeaderElement
    let event

    beforeEach(() => {
      const tableElement = document.querySelector(HOOK)
      tableSort = new TableSort(tableElement, document)  // eslint-disable-line no-new
      nameHeaderElement = document.getElementById('name-header')
      event = {
        target: nameHeaderElement
      }
    })
    it('should order the table by name when I click on name', () => {
      tableSort.handleHeadingClick(event)

      // Get the first row and the last row to check.
      const firstName = document.querySelector(FIRST_NAME_SELECTOR).textContent
      const lastName = document.querySelector(LAST_NAME_SELECTOR).textContent

      expect(firstName).to.equal('Chris Bloggs')
      expect(lastName).to.equal('Wilma Bloggs')
    })
    it('should order by name desc if I click on name twice', () => {
      tableSort.handleHeadingClick(event)
      tableSort.handleHeadingClick(event)

      // Get the first row and the last row to check.
      const firstName = document.querySelector(FIRST_NAME_SELECTOR).textContent
      const lastName = document.querySelector(LAST_NAME_SELECTOR).textContent

      expect(firstName).to.equal('Wilma Bloggs')
      expect(lastName).to.equal('Chris Bloggs')
    })
  })
  describe('indicate sort order in table heading', () => {
    let tableSort
    let nameHeaderElement
    let roleHeaderElement

    beforeEach(() => {
      const tableElement = document.querySelector(HOOK)
      tableSort = new TableSort(tableElement, document)  // eslint-disable-line no-new
      nameHeaderElement = document.getElementById('name-header')
      roleHeaderElement = document.getElementById('role-header')
    })
    it('should indicate sort ascending when clicking on a column', () => {
      tableSort.handleHeadingClick({ target: nameHeaderElement })
      expect(domTokenToArray(nameHeaderElement.classList)).to.include('table--sortable__sort-asc')
    })
    it('should indicate sort descending when clicking on a column twice', () => {
      tableSort.handleHeadingClick({ target: nameHeaderElement })
      tableSort.handleHeadingClick({ target: nameHeaderElement })

      expect(domTokenToArray(nameHeaderElement.classList)).to.include('table--sortable__sort-desc')
    })
    it('should indicate sort ascending on a column and clear previous if previous ascending', () => {
      tableSort.handleHeadingClick({ target: nameHeaderElement })
      tableSort.handleHeadingClick({ target: roleHeaderElement })

      expect(nameHeaderElement.className).to.equal('')
      expect(domTokenToArray(roleHeaderElement.classList)).to.include('table--sortable__sort-asc')
    })
    it('should indicate sort ascending on a column and clear previous if previous descending', () => {
      tableSort.handleHeadingClick({ target: nameHeaderElement })
      tableSort.handleHeadingClick({ target: nameHeaderElement })
      tableSort.handleHeadingClick({ target: roleHeaderElement })

      expect(nameHeaderElement.className).to.equal('')
      expect(domTokenToArray(roleHeaderElement.classList)).to.include('table--sortable__sort-asc')
    })
  })
})
