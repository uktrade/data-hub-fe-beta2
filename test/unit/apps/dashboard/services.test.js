describe('Dashboard service', () => {
  function getDashboardService (mockData) {
    return proxyquire('~/src/apps/dashboard/services', {
      '../../lib/authorised-request': {
        authorisedRequest: () => new Promise((resolve) => {
          resolve(mockData)
        }),
      },
    })
  }

  it('returns correct homepage data with interaction companies', () => {
    const mockHomepageData = {
      interactions: [{
        id: 'int-id',
        subject: 'int-subject',
        company: {
          'id': 'comp-id',
          'name': 'comp-name',
        },
      }],
      contacts: [{
        id: 'contact-id',
        first_name: 'first-name',
        last_name: 'last-name',
        company: {
          'id': 'comp-id',
          'name': 'comp-name',
        },
      }],
    }
    const dashboardService = getDashboardService(mockHomepageData)

    return dashboardService.getHomepageData('token')
      .then((data) => {
        expect(data).to.eql({
          interactions: [{
            id: 'int-id',
            subject: 'int-subject',
            url: '/interactions/int-id',
            company: {
              url: '/companies/comp-id',
              name: 'comp-name',
            },
          }],
          contacts: [{
            id: 'contact-id',
            name: 'first-name last-name',
            url: '/contacts/contact-id',
            company: {
              url: '/companies/comp-id',
              name: 'comp-name',
              id: 'comp-id',
            },
          }],
        })
      })
  })

  it('returns correct homepage data without interaction companies', () => {
    const mockHomepageData = {
      interactions: [{
        id: 'int-id',
        subject: 'int-subject',
        company: null,
      }],
      contacts: [{
        id: 'contact-id',
        first_name: 'first-name',
        last_name: 'last-name',
        company: {
          'id': 'comp-id',
          'name': 'comp-name',
        },
      }],
    }
    const dashboardService = getDashboardService(mockHomepageData)

    return dashboardService.getHomepageData('token')
      .then((data) => {
        expect(data).to.eql({
          interactions: [{
            id: 'int-id',
            subject: 'int-subject',
            url: '/interactions/int-id',
            company: {
              url: null,
              name: null,
            },
          }],
          contacts: [{
            id: 'contact-id',
            name: 'first-name last-name',
            url: '/contacts/contact-id',
            company: {
              url: '/companies/comp-id',
              name: 'comp-name',
              id: 'comp-id',
            },
          }],
        })
      })
  })
})
