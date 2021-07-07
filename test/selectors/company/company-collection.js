const urls = require('../../../src/lib/urls')

module.exports = () => {
  const bodyMainContentSelector = '[data-test="bodyMainContent"]'

  return {
    interaction: {
      addButton: (companyId) =>
        `${bodyMainContentSelector} [href="${urls.companies.interactions.create(
          companyId
        )}"]`,
      referButton: (companyId) =>
        `${bodyMainContentSelector} [href="${urls.companies.referrals.send(
          companyId
        )}"]`,
    },
    contact: {
      addButton: (companyId) =>
        `${bodyMainContentSelector} [href="${urls.contacts.create(
          companyId
        )}"]`,
    },
    export: {
      editButton: (companyId) =>
        `${bodyMainContentSelector} [href="${urls.companies.exports.edit(
          companyId
        )}"]`,
    },
    archivedSummary: `${bodyMainContentSelector} .details__summary`,
  }
}
