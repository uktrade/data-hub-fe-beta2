import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  TASK_SAVE_OPPORTUNITY_DETAILS,
  TASK_GET_OPPORTUNITY_DETAILS_METADATA,
  ID,
  state2props,
} from './state'

import {
  INVESTMENT_OPPORTUNITY__DETAILS_CHANGE,
  INVESTMENT_OPPORTUNITY__DETAILS_METADATA_LOADED,
} from '../../../../../client/actions'

import { transformDateStringToDateObject } from '../../../../transformers'

import Task from '../../../../../client/components/Task'
import {
  Main,
  FieldInput,
  FieldTextarea,
  FieldRadios,
  FieldDate,
  MultiInstanceForm,
  FieldTypeahead,
  AdviserTypeAhead,
} from '../../../../../client/components'
import { CLEARED_REFERENCE, ISSUES_IDENTIFIED_REFERENCE } from './constants'

function OpportunityDetailsForm(state) {
  const { opportunityId, metadata, details } = state
  const {
    name,
    description,
    assetClasses,
    valueType,
    leadRelationshipManager,
    requiredChecksConducted,
    requiredChecksConductedBy,
    requiredChecksConductedOn,
    constructionRisks,
    opportunityValue,
    ukRegions,
    promoters,
    otherDitContacts,
  } = details.detailsFields

  function hintAdder(valueTypes) {
    const gvaOption = valueTypes.find(
      (type) => type.label == 'Gross development value (GDV)'
    )
    gvaOption.hint = 'For real estate projects'

    const capExOption = valueTypes.find(
      (type) => type.label == 'Capital expenditure'
    )
    capExOption.hint = 'For energy and infrastructure projects'

    return [gvaOption, capExOption]
  }
  return (
    <Main>
      <Task>
        {(getTask) => {
          const saveOpportunityDetails = getTask(
            TASK_SAVE_OPPORTUNITY_DETAILS,
            ID
          )
          return (
            <Task.Status
              name={TASK_GET_OPPORTUNITY_DETAILS_METADATA}
              id={ID}
              startOnRender={{
                onSuccessDispatch:
                  INVESTMENT_OPPORTUNITY__DETAILS_METADATA_LOADED,
              }}
            >
              {() =>
                !!metadata.valueTypes.length && (
                  <MultiInstanceForm
                    id={ID}
                    showErrorSummary={true}
                    onSubmit={(values) => {
                      saveOpportunityDetails.start({
                        payload: {
                          values,
                          opportunityId,
                        },
                        onSuccessDispatch:
                          INVESTMENT_OPPORTUNITY__DETAILS_CHANGE,
                      })
                    }}
                    submissionError={saveOpportunityDetails.errorMessage}
                  >
                    {(values) => (
                      <MultiInstanceForm.Step name="updateOpportunityDetails">
                        <FieldInput
                          label="Opportunity name"
                          initialValue={name}
                          name="name"
                          type="text"
                          required="Enter a name"
                        />
                        <FieldTextarea
                          label="Opportunity description"
                          initialValue={description}
                          name="description"
                          type="text"
                          required="Enter a description"
                        />
                        <FieldTypeahead
                          isMulti={true}
                          label="UK location"
                          name="ukRegions"
                          options={metadata.ukRegions}
                          placeholder="-- Select UK region --"
                          aria-label="Select a uk location"
                          initialValue={ukRegions}
                        />
                        <FieldTypeahead
                          isMulti={true}
                          label="Promoters"
                          name="promoters"
                          options={metadata.promoters}
                          placeholder="-- Select company --"
                          aria-label="Select a company"
                          initialValue={promoters}
                        />
                        <FieldRadios
                          name="requiredChecksConducted"
                          legend="Has this opportunity cleared the required checks?"
                          initialValue={requiredChecksConducted[0]?.value}
                          options={metadata.requiredChecksConducted}
                        />
                        {[
                          CLEARED_REFERENCE,
                          ISSUES_IDENTIFIED_REFERENCE,
                        ].includes(values.values.requiredChecksConducted) && (
                          <>
                            <FieldDate
                              name="requiredChecksConductedOn"
                              label="Date of most recent checks"
                              required="Enter a date"
                              initialValue={transformDateStringToDateObject(
                                requiredChecksConductedOn
                              )}
                            />
                            <AdviserTypeAhead
                              name="requiredChecksConductedBy"
                              label="Person responsible for most recent checks"
                              placeholder="-- Search for an adviser --"
                              required="Enter a name"
                              initialValue={requiredChecksConductedBy}
                            />
                          </>
                        )}
                        <FieldRadios
                          name="constructionRisks"
                          legend="Construction risk"
                          initialValue={constructionRisks[0]?.value}
                          options={metadata.constructionRisks}
                        />
                        <AdviserTypeAhead
                          name="leadRelationshipManager"
                          label="Lead DIT relationship manager"
                          initialValue={leadRelationshipManager}
                          placeholder="-- Select adviser --"
                          isMulti={false}
                        />
                        {values.values.leadRelationshipManager && (
                          <>
                            <FieldTypeahead
                              isMulti={true}
                              label="Other DIT contact"
                              name="otherDitContacts"
                              options={metadata.advisers}
                              placeholder="-- Select adviser --"
                              aria-label="Select an adviser"
                              initialValue={otherDitContacts}
                            />
                          </>
                        )}
                        <FieldRadios
                          name="valueType"
                          legend="Value"
                          initialValue={valueType.value}
                          options={hintAdder(metadata.valueTypes).map(
                            (option) => ({
                              label: option.label,
                              hint: option.hint,
                              value: option.value,
                              children: (
                                <FieldInput
                                  label={option.label}
                                  initialValue={opportunityValue.value}
                                  name="opportunityValue"
                                  type="number"
                                />
                              ),
                            })
                          )}
                        />
                        <FieldTypeahead
                          isMulti={true}
                          label="Asset classes"
                          name="assetClasses"
                          options={metadata.classesOfInterest}
                          placeholder="-- Select asset class --"
                          aria-label="Select asset classes"
                          initialValue={assetClasses}
                        />
                        <p>
                          If the asset class you wish to select is not shown
                          above, then request it from&nbsp;
                          <a href={`mailto:capitalinvestment@trade.gov.uk`}>
                            capitalinvestment@trade.gov.uk
                          </a>
                          .
                        </p>
                      </MultiInstanceForm.Step>
                    )}
                  </MultiInstanceForm>
                )
              }
            </Task.Status>
          )
        }}
      </Task>
    </Main>
  )
}

OpportunityDetailsForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
  metadata: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired,
}

export default connect(state2props)(OpportunityDetailsForm)
