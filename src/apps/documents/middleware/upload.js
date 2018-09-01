/* eslint-disable camelcase */
const { filter } = require('lodash')
const formidable = require('formidable')

const { chainUploadSequence } = require('../repos')

function parseForm (req, res, apiConfig) {
  const form = new formidable.IncomingForm()
  const fiveGigabytes = 5000 * 1024 * 1024

  form.maxFileSize = fiveGigabytes

  form.parse(req, async (err, fields, files) => {
    let index = 1

    if (apiConfig.collectTextFields) {
      await apiConfig.collectTextFields(req, res, fields)
    }

    if (err) {
      return res.status(500).json({ error: err })
    }

    res.locals.documents = {
      fields,
      id: fields.id,
      parent_id: fields[fields.app],
      url: apiConfig.url,
    }

    files.forEach(async (file, value, collection) => {
      res.locals.documents = {
        ...res.locals.documents,
        ...{
          files,
          numberOfDocuments: filter(collection, (document) => document.name.length).length,
        },
      }

      if (!file.name.length) { return }
      index++

      await chainUploadSequence(req, res, index)
    })
  })
}

function postUpload (req, res, next) {
  const apiConfig = this

  try {
    parseForm(req, res, apiConfig)
  } catch (error) {
    if (error.statusCode !== 400) {
      return next(error)
    }
  }
}

module.exports = {
  postUpload,
}
