import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, omitBy } from 'lodash'
import styled from 'styled-components'
import pluralize from 'pluralize'
import {
  useFormContext,
  StatusMessage,
  FieldUneditable,
  FieldInput,
  ButtonLink,
  useEntitySearch,
  useDnbSearch,
  FormActions,
  EntityList,
} from 'data-hub-components'
import FieldWrapper from 'data-hub-components/dist/forms/elements/FieldWrapper'

import { WIDTHS, SPACING } from '@govuk-react/constants'
import { Search } from '@govuk-react/icons'
import UnorderedList from '@govuk-react/unordered-list'
import Details from '@govuk-react/details'
import Button from '@govuk-react/button'
import Paragraph from '@govuk-react/paragraph'
import ListItem from '@govuk-react/list-item'

const COMPANY_NAME_MIN_LENGTH = 2
const COMPANY_NAME_MAX_LENGTH = 30

const StyledUnorderedList = styled(UnorderedList)`
  list-style-type: disc;
  padding-left: ${SPACING.SCALE_5};
`

const validateMinLength = (minLength) => (value) =>
  value && value.length < minLength
    ? `Enter at least ${pluralize('character', minLength, true)}`
    : null

const validateMaxLength = (maxLength) => (value) =>
  value && value.length > maxLength
    ? `${pluralize('character', value.length - maxLength, true)} too long`
    : null

const FieldDnbCompany = ({
  name,
  label,
  legend,
  hint,
  country,
  apiEndpoint,
  queryParams,
  entityRenderer,
  onCannotFind,
  searchResultsMessage,
}) => {
  const { values, goBack } = useFormContext()
  const { findCompany } = useDnbSearch(apiEndpoint)
  const { onEntitySearch, searched, error, entities } = useEntitySearch(
    findCompany
  )

  function onSearchClick(e) {
    e.preventDefault()
    return onEntitySearch(
      omitBy(
        {
          ...queryParams,
          search_term: values.dnbCompanyName,
          postal_code: values.dnbPostalCode,
        },
        isEmpty
      )
    )
  }

  //   useEffect(() => setIsLoading(searching), [searching])

  return (
    <FieldWrapper {...{ name, label, legend, hint }}>
      {country && (
        <FieldUneditable
          legend="Country"
          name="dnbCountry"
          onChangeClick={goBack}
        >
          {country}
        </FieldUneditable>
      )}

      <FieldInput
        label="Company name"
        name="dnbCompanyName"
        type="search"
        required="Enter company name"
        validate={[
          validateMinLength(COMPANY_NAME_MIN_LENGTH),
          validateMaxLength(COMPANY_NAME_MAX_LENGTH),
        ]}
      />

      <FieldInput
        label="Company postcode (optional)"
        name="dnbPostalCode"
        style={{ width: WIDTHS['one-third'] }}
        type="search"
      />

      <FormActions>
        <Button icon={<Search />} onClick={onSearchClick}>
          Find company
        </Button>
      </FormActions>

      {searched && (
        <>
          {entities.length > 0 && (
            <>
              {searchResultsMessage && (
                <StatusMessage>{searchResultsMessage}</StatusMessage>
              )}

              <EntityList entities={entities} entityRenderer={entityRenderer} />
            </>
          )}
          {!error && entities.length === 0 && (
            <StatusMessage>
              No match found. Try one of the options below.
            </StatusMessage>
          )}
          {error && (
            <StatusMessage>
              Error occurred while searching for company.
            </StatusMessage>
          )}
          <Details summary="I can't find what I'm looking for">
            <Paragraph>Try:</Paragraph>

            <StyledUnorderedList>
              <ListItem>checking or removing the postcode</ListItem>
              <ListItem>
                removing &quot;limited&quot; or &quot;ltd&quot;
              </ListItem>
              <ListItem>checking for spelling errors</ListItem>
              {country && (
                <ListItem>checking if the right country was selected</ListItem>
              )}
              <ListItem>
                check you&apos;re using the company&apos;s registered name
              </ListItem>
            </StyledUnorderedList>

            {onCannotFind && (
              <ButtonLink onClick={onCannotFind}>
                I still can&apos;t find what I&apos;m looking for
              </ButtonLink>
            )}
          </Details>
        </>
      )}
    </FieldWrapper>
  )
}
FieldDnbCompany.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  country: PropTypes.string,
  apiEndpoint: PropTypes.string.isRequired,
  queryParams: PropTypes.shape({}),
  entityRenderer: PropTypes.func,
  onCannotFind: PropTypes.func,
  searchResultsMessage: PropTypes.string,
}
FieldDnbCompany.defaultProps = {
  label: null,
  legend: null,
  hint: null,
  country: null,
  queryParams: {},
  entityRenderer: undefined,
  onCannotFind: null,
  searchResultsMessage:
    'The search results below are verified company records from an external and verified source of company information.',
}
export default FieldDnbCompany
