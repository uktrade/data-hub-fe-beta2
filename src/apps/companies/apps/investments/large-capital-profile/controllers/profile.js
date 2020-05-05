const {
  transformProfile,
  transformAdvisers,
  transformCheckboxes,
  transformRadioButtons,
  transformInvestorTypes,
  transformRequiredChecks,
} = require('../transformers')

const {
  getInvestorDetailsOptions,
  getInvestorRequirementsOptions,
  getLocationOptions,
} = require('../options')
const {
  INVESTOR_DETAILS,
  INVESTOR_REQUIREMENTS,
  LOCATION,
} = require('../sections')
const { assetClassSectors } = require('../constants')
const { getCompanyProfiles } = require('../repos')
const { get } = require('lodash')
const { companies, dashboard } = require('../../../../../../lib/urls')

const getCompanyProfile = async (token, company, editing) => {
  const profiles = await getCompanyProfiles(token, company.id)
  const profile = profiles.results && profiles.results[0]
  return profile ? transformProfile(Object.freeze(profile), editing) : profile
}

const renderProfile = async (req, res, next) => {
  const { token } = req.session
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals
  const { editing } = req.query

  try {
    const profile = await getCompanyProfile(token, company, editing)
    const editType = get(profile, 'editing')

    if (editType === INVESTOR_DETAILS) {
      await Promise.all(getInvestorDetailsOptions(token)).then(
        ([investorTypeMD, requiredCheckMD, adviserMD]) => {
          profile.investorDetails.investorType.items = transformInvestorTypes(
            investorTypeMD,
            profile.investorDetails
          )
          profile.investorDetails.requiredChecks = transformRequiredChecks(
            requiredCheckMD,
            profile.investorDetails
          )
          profile.investorDetails.requiredChecks.cleared.advisers = transformAdvisers(
            adviserMD.results
          )
          profile.investorDetails.requiredChecks.issuesIdentified.advisers = transformAdvisers(
            adviserMD.results
          )
        }
      )
    } else if (editType === INVESTOR_REQUIREMENTS) {
      await Promise.all(getInvestorRequirementsOptions(token)).then(
        ([
          dealTicketSizeMD,
          assetClassesMD,
          investmentTypeMD,
          minimumReturnRateMD,
          timeHorizonMD,
          restrictionMD,
          constructionRiskMD,
          minimumEquityPercentageMD,
          desiredDealRoleMD,
        ]) => {
          const {
            dealTicketSizes,
            assetClasses,
            investmentTypes,
            minimumReturnRate,
            timeHorizons,
            restrictions,
            constructionRisks,
            minimumEquityPercentage,
            desiredDealRoles,
          } = profile.investorRequirements

          profile.investorRequirements.dealTicketSizes.items = transformCheckboxes(
            dealTicketSizeMD,
            dealTicketSizes
          )

          const energyAndInfrastructureMD = assetClassesMD.filter(
            (item) =>
              item.sector === assetClassSectors.ENERGY_AND_INFRASTRUCTURE
          )

          profile.investorRequirements.assetClasses.energyAndInfrastructure.items = transformCheckboxes(
            energyAndInfrastructureMD,
            assetClasses.energyAndInfrastructure
          )

          const realEstateMD = assetClassesMD.filter(
            (item) => item.sector === assetClassSectors.REAL_ESTATE
          )
          profile.investorRequirements.assetClasses.realEstate.items = transformCheckboxes(
            realEstateMD,
            assetClasses.realEstate
          )

          profile.investorRequirements.investmentTypes.items = transformCheckboxes(
            investmentTypeMD,
            investmentTypes
          )
          profile.investorRequirements.minimumReturnRate.items = transformRadioButtons(
            minimumReturnRateMD,
            minimumReturnRate
          )
          profile.investorRequirements.timeHorizons.items = transformCheckboxes(
            timeHorizonMD,
            timeHorizons
          )
          profile.investorRequirements.restrictions.items = transformCheckboxes(
            restrictionMD,
            restrictions
          )
          profile.investorRequirements.constructionRisks.items = transformCheckboxes(
            constructionRiskMD,
            constructionRisks
          )
          profile.investorRequirements.minimumEquityPercentage.items = transformRadioButtons(
            minimumEquityPercentageMD,
            minimumEquityPercentage
          )
          profile.investorRequirements.desiredDealRoles.items = transformCheckboxes(
            desiredDealRoleMD,
            desiredDealRoles
          )
        }
      )
    } else if (editType === LOCATION) {
      await Promise.all(getLocationOptions(token)).then(
        ([regions, countries]) => {
          profile.location.uk_region_locations.items = regions
          profile.location.other_countries_being_considered.items = countries
        }
      )
    }

    res.render(
      'companies/apps/investments/large-capital-profile/views/profile',
      {
        profile,
        props: {
          company,
          breadcrumbs: [
            { link: dashboard(), text: 'Home' },
            { link: companies.index(), text: 'Companies' },
            { link: companies.detail(company.id), text: company.name },
            { text: 'Investment' },
          ],
          returnUrl,
          dnbRelatedCompaniesCount,
        },
      }
    )
  } catch (error) {
    next(error)
  }
}

module.exports = renderProfile
