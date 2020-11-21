import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import styled from 'styled-components'
import pluralize from 'pluralize'
import { H2 } from '@govuk-react/heading'
import { BLACK, GREY_3 } from 'govuk-colours'
import { HEADING_SIZES, SPACING } from '@govuk-react/constants'

import {
  CollectionHeaderRow,
  RoutedAdviserFilterChips,
  Chip,
  RoutedOptionFilterChips,
  RoutedDateFilterChips,
  FilterReset,
} from '../../components'

import { decimal } from '../../utils/number-utils'

const StyledHeaderText = styled(H2)`
  margin-top: 0;
  font-weight: normal;
  font-size: ${HEADING_SIZES.MEDIUM}px;
  margin-bottom: 0;
`

const StyledLink = styled.a`
  margin-bottom: 0;
`

const StyledResultCount = styled('span')`
  font-size: 36px;
  font-weight: 600;
  line-height: 1;
`

const CollectionHeaderRowContainer = styled('div')`
  > div {
    border: none;
  }
  border-bottom: ${SPACING.SCALE_1} solid ${BLACK};
`

const StyledDiv = styled('div')`
  display: flex;
  flex: 50%;
  align-items: center;
  flex-flow: nowrap;

  h2 {
    flex-grow: 2;
  }

  button {
    text-align: right;
    width: auto;
    margin: 0;
  }
`

function FilteredCollectionHeader({
  totalItems,
  collectionName = 'result',
  addItemUrl = null,
  selectedAdvisers,
  selectedSectors = [],
  estimatedLandDateBefore,
  estimatedLandDateAfter,
  selectedFilters,
}) {
  const formattedTotal = decimal(totalItems)
  const counterSuffix = pluralize(collectionName, totalItems)
  // const hasFilters = selectedAdvisers && selectedAdvisers.length > 0
  // const hasOptions = selectedSectors.length > 0
  const actions = addItemUrl && (
    <Button
      as={StyledLink}
      href={addItemUrl}
      buttonColour={GREY_3}
      buttonTextColour={BLACK}
    >
      Add {collectionName}
    </Button>
  )

  return (
    <CollectionHeaderRowContainer>
      <CollectionHeaderRow actions={actions}>
        <StyledDiv>
          <StyledHeaderText>
            <StyledResultCount>{formattedTotal}</StyledResultCount>{' '}
            {counterSuffix}
          </StyledHeaderText>
          <FilterReset>Remove all filters</FilterReset>
        </StyledDiv>
      </CollectionHeaderRow>

      <CollectionHeaderRow>
        <RoutedAdviserFilterChips
          selectedAdvisers={selectedAdvisers}
          qsParamName="adviser"
        />
        <RoutedOptionFilterChips
          selectedOptions={selectedFilters.selectedSectors}
          qsParamName="sector_descends"
        />
      </CollectionHeaderRow>

      <CollectionHeaderRow>
        <RoutedDateFilterChips
          selectedOptions={selectedFilters.selectedEstimatedLandDatesBefore}
          qsParamName="estimated_land_date_before"
        />
        {/* <Chip key={estimatedLandDateBefore}>
            Estimated Land Date Before: {estimatedLandDateBefore}
          </Chip> */}
      </CollectionHeaderRow>

      {estimatedLandDateAfter && (
        <CollectionHeaderRow>
          <Chip key={estimatedLandDateAfter}>
            Estimated Land Date After: {estimatedLandDateAfter}
          </Chip>
        </CollectionHeaderRow>
      )}
    </CollectionHeaderRowContainer>
  )
}

FilteredCollectionHeader.propTypes = {
  totalItems: PropTypes.number.isRequired,
  collectionName: PropTypes.string.isRequired,
  addItemUrl: PropTypes.string,
}

export default FilteredCollectionHeader
