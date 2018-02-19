/* eslint-disable camelcase */
const { transformInvestmentFDIForView } = require('./fdi')
const { transformInvestmentLandingForView } = require('./landing')
const { transformInvestmentRequirementsForView } = require('./requirements')
const { transformInvestmentValueForView } = require('./value')

const {
  transformToApi,
  transformFromApi,
  transformInvestmentDataForView,
  transformBriefInvestmentSummary,
} = require('./project')

const {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
  transformInvestmentListItemToDisableMetaLinks,
  transformInvestmentProjectToDashItem,
} = require('./collection')

const {
  transformClientRelationshipManagementForView,
  transformProjectManagementForView,
  transformTeamMembersForView,
} = require('./team')

module.exports = {
  transformInvestmentDataForView,
  transformInvestmentValueForView,
  transformInvestmentRequirementsForView,
  transformInvestmentFDIForView,
  transformInvestmentLandingForView,
  transformToApi,
  transformFromApi,
  transformBriefInvestmentSummary,
  transformProjectManagementForView,
  transformClientRelationshipManagementForView,
  transformTeamMembersForView,
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
  transformInvestmentListItemToDisableMetaLinks,
  transformInvestmentProjectToDashItem,
}
