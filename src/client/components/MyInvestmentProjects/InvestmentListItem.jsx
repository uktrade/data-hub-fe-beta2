import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import { BLUE, GREY_1 } from 'govuk-colours'
import styled from 'styled-components'
import {
  MEDIA_QUERIES,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHTS,
} from '@govuk-react/constants'

import { investments } from '../../../lib/urls'
import { STAGES } from './constants'

import InvestmentEstimatedLandDate from './InvestmentEstimatedLandDate'
import InvestmentTimeline from './InvestmentTimeline'
import InvestmentDetails from './InvestmentDetails'
import InvestmentNextSteps from './InvestmentNextSteps'
import { NoHighlightToggleSection } from '../ToggleSection'
import Tag from '../Tag'

const ListItem = styled('li')`
  padding: ${SPACING.SCALE_2} 0;
  border-bottom: 2px solid ${GREY_1};
  details {
    &[open] {
      padding-bottom: ${SPACING.SCALE_5};
    }
  }
  &:last-child {
    border-bottom: none;
  }
`

const Row = styled('div')`
  margin-bottom: ${SPACING.SCALE_3};

  ${MEDIA_QUERIES.LARGESCREEN} {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  ${MEDIA_QUERIES.DESKTOP} {
    flex-wrap: nowrap;
  }
`
const Col = styled('div')`
  margin-bottom: ${SPACING.SCALE_3};
  ${MEDIA_QUERIES.LARGESCREEN} {
    width: ${({ fullWidth }) =>
      fullWidth ? '100%' : `calc(50% - ${SPACING.SCALE_2})`};
    margin-bottom: 0;
  }
`

const ListItemHeaderContainer = styled('div')`
  display: flex;
  align-items: top;
  align-content: stretch;
`

const ListItemHeader = styled('h2')`
  flex-grow: 1;
  font-size: ${FONT_SIZE.SIZE_19};
  font-weight: ${FONT_WEIGHTS.bold};
  margin: 0;
`

const ListItemHeaderTagContainer = styled('div')`
  padding: 0 ${SPACING.SCALE_5};
`

const ListItemHeaderActionContainer = styled('div')`
  flex: 0 1 152px;
  box-sizing: border-box;
  white-space: nowrap;

  a {
    width: 100%;
    margin-bottom: 0;
  }
`

const StyledInvestmentTimeline = styled(InvestmentTimeline)`
  display: none;
  box-sizing: border-box;

  ${MEDIA_QUERIES.LARGESCREEN} {
    display: flex;
    flex: 1 0 100%;
  }

  ${MEDIA_QUERIES.DESKTOP} {
    flex: 1 0 348px;
  }
`

const StyledInvestmentEstimatedLandDate = styled(InvestmentEstimatedLandDate)`
  flex: 1 1 100%;
  box-sizing: border-box;
  min-height: 93px;

  ${MEDIA_QUERIES.DESKTOP} {
    flex: 0 1 152px;
  }
`

const InvestmentListItem = ({
  id,
  name,
  stage,
  estimated_land_date,
  investor_company,
  project_code,
  sector,
  country_investment_originates_from,
  latest_interaction,
  incomplete_fields,
}) => {
  const hasStepsToComplete = !!incomplete_fields.length
  return (
    <ListItem data-test="projects-list-item">
      <ListItemHeaderContainer>
        <ListItemHeader data-test="project-header">
          <a href={`${investments.projects.details(id)}`}>{name}</a>
        </ListItemHeader>
        <ListItemHeaderTagContainer>
          <Tag
            colour="grey"
            data-test="project-stage-tag"
            aria-label="project stage"
          >
            {stage.name}
          </Tag>
        </ListItemHeaderTagContainer>
        <ListItemHeaderActionContainer>
          <Button
            buttonColour={BLUE}
            href={investments.projects.interactions.index(id)}
            as="a"
            data-test="add-interaction"
          >
            View interactions
          </Button>
        </ListItemHeaderActionContainer>
      </ListItemHeaderContainer>
      <NoHighlightToggleSection
        id={id}
        label={project_code}
        data-test="project-details"
      >
        <Row>
          <StyledInvestmentTimeline stage={stage} />
          <StyledInvestmentEstimatedLandDate
            estimatedLandDate={estimated_land_date}
          />
        </Row>
        <Row>
          <Col fullWidth={!hasStepsToComplete}>
            <InvestmentDetails
              investor={investor_company}
              sector={sector}
              countryOrigin={country_investment_originates_from}
              latestInteraction={latest_interaction}
            />
          </Col>
          {hasStepsToComplete && (
            <Col>
              <InvestmentNextSteps
                nextSteps={incomplete_fields}
                nextStage={STAGES[STAGES.indexOf(stage.name) + 1]}
                projectId={id}
              />
            </Col>
          )}
        </Row>
      </NoHighlightToggleSection>
    </ListItem>
  )
}

InvestmentListItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  project_code: PropTypes.string.isRequired,
  stage: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  estimated_land_date: PropTypes.string.isRequired,
  investor_company: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default InvestmentListItem
