const axios = require('axios')
const createHistory = require('history').createBrowserHistory
const queryString = require('query-string')
const uniqWith = require('lodash/uniqWith')
const isEqual = require('lodash/isEqual')

const history = createHistory()

history.listen((location, action) => {
  if (action === 'POP') {
    if (location.state) {
      XHR.injectResponseInHtml(location.state.data)
    } else if (window.location.pathname !== location.pathname && window.location.search !== location.search) {
      window.location.href = location.pathname + location.search
    }
  }
})

const XHR = {
  getOutlet () {
    return document.getElementById('xhr-outlet')
  },

  injectResponseInHtml (data) {
    const outlet = this.getOutlet()
    if (!outlet) { return }

    outlet.outerHTML = data
  },

  updateOutlet (res, params) {
    this.injectResponseInHtml(res.data)

    if (params) {
      const url = `?${queryString.stringify(params)}`
      try {
        history.replace(url, { data: res.data })
      } catch (err) {
        // state was too large for browser to handle. Do full page load.
        window.location.assign(url)
      }
    }

    return res
  },

  request (url, params = {}, showLoader = true) {
    const outlet = this.getOutlet()
    if (!outlet) { return }

    const uniqueParams = uniqWith(params, isEqual)

    if (showLoader) {
      outlet.classList.add('u-loading')
    }

    if (params) {
      const historyUrl = `?${queryString.stringify(uniqueParams)}`
      history.push(historyUrl)
    }

    return axios
      .get(`${url}?${queryString.stringify(uniqueParams)}`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then(res => this.updateOutlet(res, uniqueParams))
  },
}

module.exports = XHR
