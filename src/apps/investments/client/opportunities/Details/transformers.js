const getArrayNamesAndIds = (data) =>
  data.map((d) => ({ label: d.name, value: d.id }))

const getNameAndId = (data) =>
  data ? { value: data.id, label: data.name } : {}

const idNameToValueLabel = ({ id, name }) => ({ value: id, label: name })

export const transformInvestmentOpportunityDetails = ({
  incomplete_details_fields,
  incomplete_requirements_fields,
  name,
  description,
  uk_region_locations,
  promoters,
  required_checks_conducted,
  lead_dit_relationship_manager,
  asset_classes,
  opportunity_value_type,
  opportunity_value,
  construction_risks,
  total_investment_sought,
  current_investment_secured,
  investment_types,
  estimated_return_rate,
  time_horizons,
}) => ({
  incompleteDetailsFields: incomplete_details_fields.length,
  incompleteRequirementsFields: incomplete_requirements_fields.length,
  isEditingDetails: false,
  isEditingRequirements: false,
  detailsFields: {
    name,
    description,
    ukRegions: uk_region_locations.map(idNameToValueLabel),
    promoters: getArrayNamesAndIds(promoters),
    requiredChecks: getNameAndId(required_checks_conducted),
    leadRelationshipManager: getNameAndId(lead_dit_relationship_manager),
    assetClasses: asset_classes.map(idNameToValueLabel),
    opportunityValue: {
      label: opportunity_value_type?.name || 'Opportunity value',
      value: opportunity_value,
    },
    constructionRisks: construction_risks.map(idNameToValueLabel),
  },
  requirementsFields: {
    totalInvestmentSought: total_investment_sought,
    currentInvestmentSecured: current_investment_secured,
    investmentTypes: investment_types.map(idNameToValueLabel),
    returnRate: getNameAndId(estimated_return_rate),
    timeHorizons: time_horizons.map(idNameToValueLabel),
  },
})
