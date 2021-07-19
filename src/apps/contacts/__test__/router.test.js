const router = require('../router')

describe('Contacts router', () => {
  it('should define contacts routes', () => {
    const paths = router.stack.filter((r) => r.route).map((r) => r.route.path)
    expect(paths).to.deep.equal([
      '/',
      ['/create', '/:contactId/edit'],
      '/export',
      '/:contactId',
      '/:contactId/details',
      '/:id/archive',
      '/:id/unarchive',
      '/:contactId/audit',
      '/:contactId/documents',
    ])
  })
})
