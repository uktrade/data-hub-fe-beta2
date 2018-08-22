/* eslint camelcase: 0 */
const { assign, get } = require('lodash')
const { getOptions } = require('../../../../../lib/options')

const { buildFormWithStateAndErrors } = require('../../../../builders')
const { evidenceForm } = require('../macros/index')

async function renderAddEvidence (req, res) {
  const investment = get(res.locals, 'investmentData.id')
  const tags = await getOptions(req.session.token, 'evidence-tag')

  const addEvidenceForm = buildFormWithStateAndErrors(evidenceForm(
    assign({}, res.locals.options, res.locals.conditions, {
      returnLink: res.locals.returnLink,
      returnText: 'Cancel',
      buttonText: 'Add evidence',
      tags,
      hiddenFields: {
        investment,
      },
    })),
  get(res.locals, 'form.errors.messages'),
  )

  res
    .breadcrumb('Choose files')
    .title('Choose files')
    .render('investment-projects/apps/evidence/views/create', {
      addEvidenceForm,
    })
}

module.exports = {
  renderAddEvidence,
}
