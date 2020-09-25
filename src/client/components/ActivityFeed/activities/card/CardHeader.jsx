import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BLUE, GREY_1, GREY_4 } from 'govuk-colours'
import { H3 } from '@govuk-react/heading'
import ListItem from '@govuk-react/list-item'
import {
  BODY_SIZES,
  FONT_SIZE,
  HEADING_SIZES,
  MEDIA_QUERIES,
  SPACING,
  SPACING_POINTS,
} from '@govuk-react/constants'

import { Badge } from '../../../../../client/components/'
import { SOURCE_TYPES } from '../../constants'

const StyledBlockText = styled(H3)`
  display: inline-block;
  font-weight: normal;
  color: white;
  padding: 2px 5px;
  background-color: ${({ sourceType }) =>
    sourceType === SOURCE_TYPES.external ? GREY_1 : BLUE};
  margin-bottom: ${SPACING.SCALE_2};
`

const StyledCardHeader = styled('div')`
  display: flex;
  flex-flow: row wrap;
`

const StyledCompanyName = styled('div')`
  margin: -${SPACING.SCALE_3} -${SPACING.SCALE_3} ${SPACING.SCALE_4} -${SPACING.SCALE_3};
  padding: ${SPACING.SCALE_2} ${SPACING.SCALE_3};
  background: ${GREY_4};
  font-size: initial;
`

const StyledHeadingWrapper = styled('div')`
  width: 100%;

  ${MEDIA_QUERIES.TABLET} {
    width: 0;
    flex-grow: 1;
  }
`

const StyledHeading = styled(H3)`
  font-weight: normal;
  font-size: ${HEADING_SIZES.MEDIUM}px;

  & > a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
    color: ${BLUE};
  }

  ${MEDIA_QUERIES.TABLET} {
    margin-bottom: ${SPACING.SCALE_5};
  }
`

const StyledSubHeading = styled('span')`
  font-weight: normal;
  font-size: ${BODY_SIZES.MEDIUM}px;
  margin-left: ${SPACING_POINTS['1']}px;
  color: ${GREY_1};
`

const StyledMetaItems = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: ${FONT_SIZE.SIZE_16};
    margin-bottom: ${SPACING.SCALE_2};
    text-align: right;
    display: inline;

    ${MEDIA_QUERIES.TABLET} {
      display: block;
    }
  }
`

const CardHeader = ({
  blockText,
  subHeading,
  company,
  sourceType,
  heading,
  startTime,
  badge,
}) => (
  <>
    {company && company.name && (
      <StyledCompanyName>{company.name}</StyledCompanyName>
    )}
    <StyledCardHeader>
      <StyledHeadingWrapper>
        {blockText && (
          <StyledBlockText sourceType={sourceType}>{blockText}</StyledBlockText>
        )}

        {subHeading && <StyledSubHeading>{subHeading}</StyledSubHeading>}

        {heading && <StyledHeading>{heading}</StyledHeading>}
      </StyledHeadingWrapper>

      <StyledMetaItems>
        {startTime && (
          <ListItem>{moment(startTime).format('DD MMM YYYY')}</ListItem>
        )}

        {badge && (
          <ListItem>
            <Badge borderColour={badge.borderColour}>{badge.text}</Badge>
          </ListItem>
        )}
      </StyledMetaItems>
    </StyledCardHeader>
  </>
)

CardHeader.propTypes = {
  startTime: PropTypes.string,
  heading: PropTypes.node,
  blockText: PropTypes.string,
  subHeading: PropTypes.string,
  company: PropTypes.shape({
    name: PropTypes.string,
  }),
  sourceType: PropTypes.oneOf(Object.values(SOURCE_TYPES)),
  badge: PropTypes.shape({
    text: PropTypes.string,
    borderColour: PropTypes.string,
  }),
}

CardHeader.defaultProps = {
  startTime: null,
  heading: null,
  blockText: null,
  subHeading: null,
  company: null,
  badge: null,
  sourceType: null,
}

export default CardHeader
