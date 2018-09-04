const { assign, get } = require('lodash')

const { transformPropositionFormBodyToApiRequest } = require('../transformers')
const { fetchProposition, fetchDownloadLink, fetchPropositionFiles, saveProposition } = require('../repos')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { transformObjectToOption } = require('../../transformers')

async function postDetails (req, res, next) {
  res.locals.requestBody = transformPropositionFormBodyToApiRequest(req.body)

  try {
    await saveProposition(req.session.token, res.locals.requestBody)

    req.flash('success', 'Proposition created')

    if (res.locals.returnLink) {
      return res.redirect(res.locals.returnLink)
    }

    return res.redirect(`/propositions`)
  } catch (error) {
    if (error.statusCode === 400) {
      res.locals.form = assign({}, res.locals.form, {
        errors: {
          messages: error.error,
        },
      })
      next()
    } else {
      next(error)
    }
  }
}

async function getPropositionDetails (req, res, next, propositionId) {
  try {
    const token = req.session.token
    const investmentId = get(res.locals, 'investmentData.id')
    res.locals.proposition = await fetchProposition(token, propositionId, investmentId)
    res.locals.proposition.files = await fetchPropositionFiles(token, propositionId, investmentId)

    next()
  } catch (error) {
    next(error)
  }
}

async function getPropositionOptions (req, res, next) {
  try {
    const token = req.session.token
    const advisers = await getAdvisers(token)
    const currentAdviser = get(res.locals, 'proposition.adviser.id')
    const activeAdvisers = filterActiveAdvisers({
      advisers: advisers.results,
      includeAdviser: currentAdviser,
    })

    res.locals.options = {
      advisers: activeAdvisers.map(transformObjectToOption),
    }

    next()
  } catch (error) {
    next(error)
  }
}

async function getDownloadLink (req, res, next) {
  try {
    const token = req.session.token
    const propositionId = req.params.propositionId
    const documentId = req.params.documentId
    const investmentId = res.locals.investmentData.id
    const s3 = await fetchDownloadLink(token, propositionId, investmentId, documentId)

    return res.redirect(s3.document_url)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDownloadLink,
  getPropositionDetails,
  postDetails,
  getPropositionOptions,
}
