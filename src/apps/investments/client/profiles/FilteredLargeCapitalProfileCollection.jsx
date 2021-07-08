import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import qs from 'qs'

import {
  FilteredCollectionList,
  CollectionFilters,
  RoutedTypeahead,
  ToggleSection,
} from '../../../../client/components/'
import RoutedInputField from '../../../../client/components/RoutedInputField'
import RoutedNumericRangeField from '../../../../client/components/RoutedNumericRangeField'
import { TASK_GET_PROFILES_LIST, ID } from './state'
import { INVESTMENTS__PROFILES_LOADED } from '../../../../client/actions'

const QS_PARAMS = {
  countryOfOrigin: 'country_of_origin',
  assetClassesOfInterest: 'asset_classes_of_interest',
  investorCompanyName: 'investor_company_name',
  investorTypes: 'investor_type',
  requiredChecksConducted: 'required_checks_conducted',
  dealTicketSize: 'deal_ticket_size',
  investmentTypes: 'investment_type',
  minimumReturnRate: 'minimum_return_rate',
  timeHorizon: 'time_horizon',
  restrictions: 'restriction',
  constructionRisk: 'construction_risk',
  minimumEquityPercentage: 'minimum_equity_percentage',
  desiredDealRole: 'desired_deal_role',
  investableCapital: 'investable_capital',
  globalAssetsUnderManagement: 'global_assets_under_management',
  ukRegionsOfInterest: 'uk_regions_of_interest',
}

const resolveSelectedOptions = (values = [], options = []) =>
  values
    .map((id) => options.filter(({ value }) => value === id)[0])
    .filter(Boolean)

const LargeCapitalProfileCollection = ({
  count,
  results,
  isComplete,
  filterOptions,
}) => (
  <Route>
    {({ location }) => {
      const qsParams = qs.parse(location.search.slice(1))
      const selectedCountries = resolveSelectedOptions(
        qsParams[QS_PARAMS.countryOfOrigin],
        filterOptions.countries
      )
      const selectedAssetClassesOfInterest = resolveSelectedOptions(
        qsParams[QS_PARAMS.assetClassesOfInterest],
        filterOptions.assetClassesOfInterest
      )
      const selectedInvestorTypes = resolveSelectedOptions(
        qsParams[QS_PARAMS.investorTypes],
        filterOptions.investorTypes
      )
      const selectedRequiredChecksConducted = resolveSelectedOptions(
        qsParams[QS_PARAMS.requiredChecksConducted],
        filterOptions.requiredChecksConducted
      )
      const selectedDealTicketSize = resolveSelectedOptions(
        qsParams[QS_PARAMS.dealTicketSize],
        filterOptions.dealTicketSize
      )
      const selectedInvestmentTypes = resolveSelectedOptions(
        qsParams[QS_PARAMS.investmentTypes],
        filterOptions.investmentTypes
      )
      const selectedMinimumReturnRate = resolveSelectedOptions(
        qsParams[QS_PARAMS.minimumReturnRate],
        filterOptions.minimumReturnRate
      )
      const selectedTimeHorizon = resolveSelectedOptions(
        qsParams[QS_PARAMS.timeHorizon],
        filterOptions.timeHorizon
      )
      const selectedRestrictions = resolveSelectedOptions(
        qsParams[QS_PARAMS.restrictions],
        filterOptions.restrictions
      )
      const selectedConstructionRisk = resolveSelectedOptions(
        qsParams[QS_PARAMS.constructionRisk],
        filterOptions.constructionRisk
      )
      const selectedMinimumEquityPercentage = resolveSelectedOptions(
        qsParams[QS_PARAMS.minimumEquityPercentage],
        filterOptions.minimumEquityPercentage
      )
      const selectedDesiredDealRole = resolveSelectedOptions(
        qsParams[QS_PARAMS.desiredDealRole],
        filterOptions.desiredDealRole
      )
      const selectedUkRegionsOfInterest = resolveSelectedOptions(
        qsParams[QS_PARAMS.ukRegionsOfInterest],
        filterOptions.ukRegionsOfInterest
      )

      const resolveSelectedInvestorCompanyName = () => {
        const companyName = qsParams[QS_PARAMS.investorCompanyName]
        return companyName ? [{ label: companyName, value: companyName }] : []
      }

      const investableCapital = {
        min: parseFloat(qsParams[`${QS_PARAMS.investableCapital}_min`]),
        max: parseFloat(qsParams[`${QS_PARAMS.investableCapital}_max`]),
      }

      const globalAssetsUnderManagement = {
        min: parseFloat(
          qsParams[`${QS_PARAMS.globalAssetsUnderManagement}_min`]
        ),
        max: parseFloat(
          qsParams[`${QS_PARAMS.globalAssetsUnderManagement}_max`]
        ),
      }

      return (
        <FilteredCollectionList
          count={count}
          results={results}
          isComplete={isComplete}
          collectionName="profile"
          taskProps={{
            name: TASK_GET_PROFILES_LIST,
            id: ID,
            progressMessage: 'Loading profiles',
            startOnRender: {
              payload: {
                page: parseInt(qsParams.page, 10),
                countryOfOrigin: qsParams[QS_PARAMS.countryOfOrigin],
                investorTypes: qsParams[QS_PARAMS.investorTypes],
                assetClassesOfInterest:
                  qsParams[QS_PARAMS.assetClassesOfInterest],
                investorCompanyName: qsParams[QS_PARAMS.investorCompanyName],
                requiredChecksConducted:
                  qsParams[QS_PARAMS.requiredChecksConducted],
                dealTicketSize: qsParams[QS_PARAMS.dealTicketSize],
                investmentTypes: qsParams[QS_PARAMS.investmentTypes],
                minimumReturnRate: qsParams[QS_PARAMS.minimumReturnRate],
                timeHorizon: qsParams[QS_PARAMS.timeHorizon],
                restrictions: qsParams[QS_PARAMS.restrictions],
                constructionRisk: qsParams[QS_PARAMS.constructionRisk],
                minimumEquityPercentage:
                  qsParams[QS_PARAMS.minimumEquityPercentage],
                desiredDealRole: qsParams[QS_PARAMS.desiredDealRole],
                investableCapital,
                globalAssetsUnderManagement,
                ukRegionsOfInterest: qsParams[QS_PARAMS.ukRegionsOfInterest],
              },
              onSuccessDispatch: INVESTMENTS__PROFILES_LOADED,
            },
          }}
          baseDownloadLink="/investments/profiles/export"
          entityName="profile"
          selectedFilters={{
            countryOfOrigin: {
              queryParam: QS_PARAMS.countryOfOrigin,
              options: selectedCountries,
            },
            assetClassesOfInterest: {
              queryParam: QS_PARAMS.assetClassesOfInterest,
              options: selectedAssetClassesOfInterest,
            },
            investorCompanyName: {
              queryParam: QS_PARAMS.investorCompanyName,
              options: resolveSelectedInvestorCompanyName(),
            },
            investorTypes: {
              queryParam: QS_PARAMS.investorTypes,
              options: selectedInvestorTypes,
            },
            requiredChecksConducted: {
              queryParam: QS_PARAMS.requiredChecksConducted,
              options: selectedRequiredChecksConducted,
            },
            dealTicketSize: {
              queryParam: QS_PARAMS.dealTicketSize,
              options: selectedDealTicketSize,
            },
            investmentTypes: {
              queryParam: QS_PARAMS.investmentTypes,
              options: selectedInvestmentTypes,
            },
            minimumReturnRate: {
              queryParam: QS_PARAMS.minimumReturnRate,
              options: selectedMinimumReturnRate,
            },
            timeHorizon: {
              queryParam: QS_PARAMS.timeHorizon,
              options: selectedTimeHorizon,
            },
            restrictions: {
              queryParam: QS_PARAMS.restrictions,
              options: selectedRestrictions,
            },
            constructionRisk: {
              queryParam: QS_PARAMS.constructionRisk,
              options: selectedConstructionRisk,
            },
            minimumEquityPercentage: {
              queryParam: QS_PARAMS.minimumEquityPercentage,
              options: selectedMinimumEquityPercentage,
            },
            desiredDealRole: {
              queryParam: QS_PARAMS.desiredDealRole,
              options: selectedDesiredDealRole,
            },
            investableCapitalMin: {
              queryParam: 'investable_capital_min',
              options: investableCapital.min
                ? [
                    {
                      categoryLabel: 'Investable capital min',
                      label: investableCapital.min,
                    },
                  ]
                : [],
            },
            investableCapitalMax: {
              queryParam: 'investable_capital_max',
              options: investableCapital.max
                ? [
                    {
                      categoryLabel: 'Investable capital max',
                      label: investableCapital.max,
                    },
                  ]
                : [],
            },
            globalAssetsUnderManagementMin: {
              queryParam: 'global_assets_under_management_min',
              options: globalAssetsUnderManagement.min
                ? [
                    {
                      categoryLabel: 'Global assets under management min',
                      label: globalAssetsUnderManagement.min,
                    },
                  ]
                : [],
            },
            globalAssetsUnderManagementMax: {
              queryParam: 'global_assets_under_management_max',
              options: globalAssetsUnderManagement.max
                ? [
                    {
                      categoryLabel: 'Global assets under management max',
                      label: globalAssetsUnderManagement.max,
                    },
                  ]
                : [],
            },
            ukRegionsOfInterest: {
              queryParam: QS_PARAMS.ukRegionsOfInterest,
              options: selectedUkRegionsOfInterest,
            },
          }}
        >
          <CollectionFilters
            taskProps={{
              name: 'Large investment profiles filters',
              id: 'investments/profiles',
              progressMessage: 'Loading filters',
              startOnRender: {
                onSuccessDispatch:
                  'INVESTMENTS_PROFILES__FILTER_OPTIONS_LOADED',
              },
            }}
          >
            <ToggleSection
              id="FilteredLargeCapitalProfileCollection.core-filters"
              label="Core filters"
            >
              <RoutedTypeahead
                isMulti={true}
                legend="Sector of interest"
                name="asset-class"
                qsParam={QS_PARAMS.assetClassesOfInterest}
                placeholder="Search sector of interest"
                options={filterOptions.assetClassesOfInterest}
                selectedOptions={selectedAssetClassesOfInterest}
                data-test="asset-class-filter"
              />
              <RoutedTypeahead
                isMulti={true}
                legend="Country of origin"
                name="country"
                qsParam={QS_PARAMS.countryOfOrigin}
                placeholder="Search country"
                options={filterOptions.countries}
                selectedOptions={selectedCountries}
                data-test="country-filter"
              />
              <RoutedInputField
                id="LargeCapitalProfileCollection.investor-company-name"
                qsParam="investor_company_name"
                name="investor-company-name"
                label="Company name"
                placeholder="Search company name"
              />
            </ToggleSection>
            <ToggleSection
              id="FilteredLargeCapitalProfileCollection.investor-details-filters"
              label="Investor details"
            >
              <RoutedTypeahead
                isMulti={true}
                legend="Investor type"
                name="investor-type"
                qsParam={QS_PARAMS.investorTypes}
                placeholder="Search investor type"
                options={filterOptions.investorTypes}
                selectedOptions={selectedInvestorTypes}
                data-test="investor-type-filter"
              />
              <RoutedNumericRangeField
                qsParam={QS_PARAMS.globalAssetsUnderManagement}
                id="LargeCapitalProfileCollection.global-assets-under-management"
                label="Global assets under management £"
              />
              <RoutedNumericRangeField
                qsParam={QS_PARAMS.investableCapital}
                id="LargeCapitalProfileCollection.investable-capital"
                label="Investable capital £"
              />
              <RoutedTypeahead
                isMulti={true}
                legend="Check clearance"
                name="required-checks-conducted"
                qsParam={QS_PARAMS.requiredChecksConducted}
                placeholder="Search clearance"
                options={filterOptions.requiredChecksConducted}
                selectedOptions={selectedRequiredChecksConducted}
                data-test="required-checks-conducted-filter"
              />
            </ToggleSection>
            <ToggleSection
              id="FilteredLargeCapitalProfileCollection.investor-requirements-filters"
              label="Investor requirements"
            >
              <RoutedTypeahead
                isMulti={true}
                legend="Deal ticket size"
                name="deal-ticket-size"
                qsParam={QS_PARAMS.dealTicketSize}
                placeholder="Search deal ticket size"
                options={filterOptions.dealTicketSize}
                selectedOptions={selectedDealTicketSize}
                data-test="deal-ticket-size-filter"
              />
              <RoutedTypeahead
                isMulti={true}
                legend="Types of investment"
                name="types-of-investment"
                qsParam={QS_PARAMS.investmentTypes}
                placeholder="Search types of investment"
                options={filterOptions.investmentTypes}
                selectedOptions={selectedInvestmentTypes}
                data-test="types-of-investment-filter"
              />
              <RoutedTypeahead
                isMulti={true}
                legend="Minimum return rate"
                name="minimum-return-rate"
                qsParam={QS_PARAMS.minimumReturnRate}
                placeholder="Search return rate"
                options={filterOptions.minimumReturnRate}
                selectedOptions={selectedMinimumReturnRate}
                data-test="minimum-return-rate-filter"
              />
              <RoutedTypeahead
                isMulti={true}
                legend="Time horizon"
                name="time-horizon-tenor"
                qsParam={QS_PARAMS.timeHorizon}
                placeholder="Search time horizon"
                options={filterOptions.timeHorizon}
                selectedOptions={selectedTimeHorizon}
                data-test="time-horizon-tenor-filter"
              />
              <RoutedTypeahead
                isMulti={true}
                legend="Restrictions and conditions"
                name="restrictions-conditions"
                qsParam={QS_PARAMS.restrictions}
                placeholder="Search restrictions"
                options={filterOptions.restrictions}
                selectedOptions={selectedRestrictions}
                data-test="restrictions-conditions-filter"
              />
              <RoutedTypeahead
                isMulti={true}
                legend="Construction risk"
                name="construction-risk"
                qsParam={QS_PARAMS.constructionRisk}
                placeholder="Search construction risk"
                options={filterOptions.constructionRisk}
                selectedOptions={selectedConstructionRisk}
                data-test="construction-risk-filter"
              />
              <RoutedTypeahead
                isMulti={true}
                legend="Minimum equity percentage"
                name="minimum-equity-percentage"
                qsParam={QS_PARAMS.minimumEquityPercentage}
                placeholder="Search equity percentage"
                options={filterOptions.minimumEquityPercentage}
                selectedOptions={selectedMinimumEquityPercentage}
                data-test="minimum-equity-percentage-filter"
              />
              <RoutedTypeahead
                isMulti={true}
                legend="Desired deal role"
                name="desired-deal-role"
                qsParam={QS_PARAMS.desiredDealRole}
                placeholder="Search desired deal role"
                options={filterOptions.desiredDealRole}
                selectedOptions={selectedDesiredDealRole}
                data-test="desired-deal-role-filter"
              />
            </ToggleSection>
            <ToggleSection
              id="FilteredLargeCapitalProfileCollection.location-filters"
              label="Location"
            >
              <RoutedTypeahead
                isMulti={true}
                legend="UK regions of interest"
                name="uk-regions-of-interest"
                qsParam={QS_PARAMS.ukRegionsOfInterest}
                placeholder="Search UK region"
                options={filterOptions.ukRegionsOfInterest}
                selectedOptions={selectedUkRegionsOfInterest}
                data-test="uk-regions-of-interest"
              />
            </ToggleSection>
          </CollectionFilters>
        </FilteredCollectionList>
      )
    }}
  </Route>
)

export default connect((state) => state[ID])(LargeCapitalProfileCollection)
