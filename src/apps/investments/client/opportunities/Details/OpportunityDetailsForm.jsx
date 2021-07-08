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

import Task from '../../../../../client/components/Task'
import {
  Main,
  FieldInput,
  FieldTextarea,
  FieldRadios,
  FieldDate,
  FieldAddAnother,
  MultiInstanceForm,
  FieldTypeahead,
  Typeahead,
  AdviserTypeAhead,
} from '../../../../../client/components'
import { CLEARED_REFERENCE, ISSUES_IDENTIFIED_REFERENCE } from './constants'

function OpportunityDetailsForm(state) {
  const { opportunityId, metadata, details } = state
  const { name, description, assetClasses } = details.detailsFields

  return (
    <Main>
      <Task>
        {(getTask) => {
          const saveOpportunityDetails = getTask(
            TASK_SAVE_OPPORTUNITY_DETAILS,
            ID
          )
          return (
            <MultiInstanceForm
              id={ID}
              showErrorSummary={true}
              onSubmit={(values) => {
                saveOpportunityDetails.start({
                  payload: {
                    values,
                    opportunityId,
                  },
                  onSuccessDispatch: INVESTMENT_OPPORTUNITY__DETAILS_CHANGE,
                })
              }}
              submissionError={saveOpportunityDetails.errorMessage}
            >
              {(values) => (
                <Task.Status
                  name={TASK_GET_OPPORTUNITY_DETAILS_METADATA}
                  id={ID}
                  startOnRender={{
                    onSuccessDispatch:
                      INVESTMENT_OPPORTUNITY__DETAILS_METADATA_LOADED,
                  }}
                >
                  {() => (
                    <MultiInstanceForm.Step name="updateOpportunityDetails">
                      <FieldInput
                        label="Opportunity name"
                        initialValue={name}
                        name="name"
                        type="text"
                      />
                      <FieldTextarea
                        label="Opportunity description"
                        initialValue={description}
                        name="description"
                        type="text"
                      />
                      <FieldAddAnother
                        name="ukRegions"
                        label="UK location"
                        data-test-prefix="uk-region-location-field-"
                        item-name="uk location"
                      >
                        {({ value, onChange, error }) => (
                          <Typeahead
                            name="ukRegions"
                            inputId="uk_region_locations"
                            placeholder="-- Select UK region --"
                            label=""
                            options={metadata.ukRegions}
                            aria-label="Select a uk location"
                            value={metadata.ukRegions.find(
                              ({ value: option_value }) =>
                                option_value === value
                            )}
                            onChange={onChange}
                            error={error}
                          />
                        )}
                      </FieldAddAnother>
                      <FieldAddAnother
                        name="promoters"
                        label="Promoters"
                        data-test-prefix="promoters-field-"
                        item-name="promoter"
                      >
                        {({ value, onChange, error }) => (
                          <Typeahead
                            name="promoters"
                            inputId="promoters"
                            placeholder="-- Select company --"
                            label=""
                            options={metadata.promoters}
                            aria-label="Select a promoter"
                            value={metadata.promoters.find(
                              ({ value: option_value }) =>
                                option_value === value
                            )}
                            onChange={onChange}
                            error={error}
                          />
                        )}
                      </FieldAddAnother>
                      <FieldRadios
                        name="requiredChecksConducted"
                        legend="Has this opportunity cleared the required checks?"
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
                          />
                          <AdviserTypeAhead
                            name="requiredChecksConductedBy"
                            label="Person responsible for most recent checks"
                            placeholder="-- Search for an adviser --"
                            isMulti={false}
                          />
                        </>
                      )}
                      <FieldRadios
                        name="constructionRisks"
                        legend="Construction risk"
                        options={metadata.constructionRisks}
                      />
                      <AdviserTypeAhead
                        name="leadRelationshipManager"
                        label="Lead DIT relationship manager"
                        placeholder="-- Select adviser --"
                        isMulti={false}
                      />
                      {values.values.leadRelationshipManager && (
                        <>
                          <FieldAddAnother
                            name="otherDitContacts"
                            label="Other DIT contact"
                            data-test-prefix="other-dit-contact-field-"
                            item-name="contact"
                          >
                            {({ value, onChange, error }) => (
                              <Typeahead
                                name="otherDitContacts"
                                inputId="other-dit-contacts"
                                placeholder="-- Select adviser --"
                                label=""
                                options={metadata.advisers}
                                aria-label="Search for an adviser"
                                value={metadata.advisers.find(
                                  ({ value: option_value }) =>
                                    option_value === value
                                )}
                                onChange={onChange}
                                error={error}
                              />
                            )}
                          </FieldAddAnother>
                        </>
                      )}
                      <FieldRadios
                        name="valueType"
                        legend="Value"
                        options={[
                          {
                            label: 'CapEx',
                            hint: 'For energy and infrastructure projects',
                            value: 'CapEx',
                            children: (
                              <FieldInput
                                label="CapEx"
                                hint="For energy and infrastructure projects"
                                name="opportunityValue"
                                type="number"
                              />
                            ),
                          },
                          {
                            label: 'Gross development value (GDV)',
                            hint: 'For real estate projects',
                            value: 'GDV',
                            children: (
                              <FieldInput
                                label="Gross development value (GDV)"
                                name="opportunityValue"
                                type="number"
                              />
                            ),
                          },
                        ]}
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
                </Task.Status>
              )}
            </MultiInstanceForm>
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
