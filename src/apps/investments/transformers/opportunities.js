const getArrayNames = (data) => data.map((d) => d.name)
const getArrayNamesAndIds = (data) =>
  data.map((d) => ({ name: d.name, id: d.id }))

const transformInvestmentOpportunity = ({
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
  detailsFields: {
    name: { label: 'Opportunity name', value: name },
    description: { label: 'Opportunity description', value: description },
    ukRegions: {
      label: 'UK location',
      value: getArrayNames(uk_region_locations),
    },
    promoters: {
      label: 'Promoters',
      value: getArrayNamesAndIds(promoters), // TODO - update to add contact
    },
    requiredChecks: {
      label: 'Has this opportunity cleared the required checks?',
      value: required_checks_conducted?.name,
    },
    leadRelationshipManager: {
      label: 'Lead DIT relationship manager',
      value: lead_dit_relationship_manager?.name, // TODO - update to add email
    },
    assetClasses: {
      label: 'Asset classes',
      value: getArrayNames(asset_classes),
    },
    value: {
      label: opportunity_value_type?.name || 'Opportunity value',
      value: opportunity_value?.name,
    },
    constructionRisks: {
      label: 'Construction risk',
      value: getArrayNames(construction_risks),
    },
  },
  requirementsFields: {
    totalInvestmentSought: {
      label: 'Total investment sought',
      value: total_investment_sought,
    },
    currentInvestmentSecured: {
      label: 'Current investment secured',
      value: current_investment_secured,
    },
    investmentTypes: {
      label: 'Types of investment',
      value: getArrayNames(investment_types),
    },
    returnRate: {
      label: 'Estimated return rate',
      value: estimated_return_rate?.name,
    },
    timeHorizons: {
      label: 'Timescales',
      value: getArrayNames(time_horizons),
    },
  },
})

export default transformInvestmentOpportunity

// incomplete_details_fields:
// name
// description
// uk_region_locations
// promoters
// required_checks_conducted
// lead_dit_relationship_manager
// asset_classes
// opportunity_value (type changes label!!!)
// construction_risks


// incomplete_requirements_fields:
// total_investment_sought
// current_investment_secured
// investment_types
// estimated_return_rate
// time_horizons



// {
  //     "id": "a84f8405-c419-40a6-84c8-642b7c3209b2",
  //     "created_on": "2019-05-13T14:01:11.187838Z",
  //     "modified_on": "2019-05-13T14:01:11.187885Z",
  //     "name": "Battersea power station regeneration",
  //     "incomplete_details_fields": [],
  //     "incomplete_requirements_fields": [],
  //     "type": {},
  //     "description": "Here is a lengthy description of an investment opportunity. Here is a lengthy description of an investment opportunity. Here is a lengthy description of an investment opportunity.",
  //     "uk_region_locations": [
  //         {
  //             "id": "7703f30f-20e0-49b7-b4e0-c23c80f5a205",
  //             "name": "Benzonia"
  //         }
  //     ],
  //     "promoters": [
  //         {
  //             "name": "Lambda plc",
  //             "id": "0fb3379c-341c-4da4-b825-bf8d47b26baa"
  //         }
  //     ],
  //     "required_checks_conducted": {
  //         "id": "02d6fc9b-fbb9-4621-b247-d86f2487898e",
  //         "name": "Cleared"
  //     },
  //     "required_checks_conducted_by": {
  //         "name": "John Rogers",
  //         "first_name": "John",
  //         "last_name": "Rogers",
  //         "id": "7bad8082-4978-4fe8-a018-740257f01637"
  //         },
  //     "required_checks_conducted_on": "2018-07-06T10:44:56Z",
  //     "lead_dit_relationship_manager": {
  //         "name": "Travis Greene",
  //         "first_name": "Travis",
  //         "last_name": "Greene",
  //         "id": "8eefe6b4-2816-4e47-94b5-a13409dcef70"
  //     },
  //     "other_dit_contacts": [
  //         {
  //             "name": "John Rogers",
  //             "first_name": "John",
  //             "last_name": "Rogers",
  //             "id": "7bad8082-4978-4fe8-a018-740257f01637"
  //             }
  //     ], 
  //     "asset_classes": [
  //         {
  //             "name": "Biofuel",
  //             "id": "66507830-595d-432e-8521-9daf11785265"
  //         },
  //         {
  //             "name": "Nuclear",
  //             "id": "9e619e8d-af51-4abf-a83a-5c139851de82"
  //         }
  //     ],
  //     "opportunity_value_type": {},
  //     "opportunity_value": 12345789,
  //     "construction_risks": [
  //         {
  //             "id": "79cc3963-9376-4771-9cba-c1b3cc0ade33",
  //             "name": "Greenfield (construction risk)"
  //         }
  //     ],
  //     "total_investment_sought": 24000000,
  //     "current_investment_secured": 120000,
  //     "investment_types": [
  //         {
  //             "id": "4170d99a-02fc-46ee-8fd4-3fe786717708",
  //             "name": "Direct Investment in Project Equity"
  //         },
  //         {
  //             "id": "8feb6087-d61c-43bd-9bf1-3d9e1129432b",
  //             "name": "Venture capital funds",
  //             "disabled_on": null
  //         }
  //     ],
  //     "estimated_return_rate": {
  //         "id": "65c9bc7a-af68-4549-a9c9-70cd73109617",
  //         "name": "5-10%",
  //         "disabled_on": null
  //     },
  //     "time_horizons": [
  //         {
  //             "id": "d2d1bdbb-c42a-459c-adaa-fce45ce08cc9",
  //             "name": "Up to 5 years"
  //         }
  //     ],
  //     "investment_projects": [],
  //     "status": {},
  //     "sources_of_funding": [],
  //     "funding_supporting_details": "",
  //     "dit_support_provided": "True",
  //     "reasons_for_abandonment": [],
  //     "why_abandoned": "",
  //     "why_suspended": ""
  // }
