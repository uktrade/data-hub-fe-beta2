import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { escape } from 'lodash'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { SPACING, MEDIA_QUERIES, FONT_SIZE } from '@govuk-react/constants'
import { BLUE, GREY_1, BLACK } from 'govuk-colours'
import { Card } from 'data-hub-components/dist/activity-feed/activities/card'
import { NumberUtils } from 'data-hub-components'

import { newlineToBr } from '../../../lib/text-formatting'
import { PipeLineItemPropType } from './types'
import urls from '../../../lib/urls'
import Tag from '../Tag'
import LIKELIHOOD_TO_SUCCEED from './constants'

const StyledH3 = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_27};
  font-weight: bold;
  margin-bottom: ${SPACING.SCALE_2};
  color: ${(props) => (props.archived ? GREY_1 : BLACK)};
`

const StyledGridCol = styled(GridCol)`
  display: flex;
  flex-direction: column-reverse;
  align-items: stretch;
  &:last-child {
    justify-content: space-between;
  }
  a,
  div {
    margin: ${SPACING.SCALE_3} 0 0 0;
  }
  ${MEDIA_QUERIES.TABLET} {
    align-items: flex-end;
  }
`

const StyledListItem = styled('li')`
  display: grid;
  ${MEDIA_QUERIES.TABLET} {
    display: block;
  }
  margin-bottom: ${SPACING.SCALE_2};
  &:last-child {
    margin-bottom: 0;
  }
`

const StyledLabel = styled('span')`
  color: ${GREY_1};
  font-size: ${FONT_SIZE.SIZE_19};
`

const StyledValueSubtle = styled(StyledLabel)`
  ${MEDIA_QUERIES.TABLET} {
    margin-left: ${SPACING.SCALE_1};
  }
`

const StyledValue = styled(StyledValueSubtle)`
  color: ${BLACK};
`

const StyledGridRow = styled(GridRow)`
  padding-top: ${SPACING.SCALE_3};

  ${MEDIA_QUERIES.TABLET} {
    padding-top: 0;
  }
`

const StyledTagSpacing = styled('span')`
  display: flex;
  margin: ${SPACING.SCALE_3} 0 0 0;
  strong + strong {
    margin-left: ${SPACING.SCALE_3};
  }
  & > span {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }
  ${MEDIA_QUERIES.TABLET} {
    flex-direction: column;
    margin: 0;
    strong + strong {
      margin-left: 0;
      margin-top: ${SPACING.SCALE_3};
    }
  }
  ${MEDIA_QUERIES.DESKTOP} {
    flex-direction: row;
    strong + strong {
      margin-left: ${SPACING.SCALE_3};
      margin-top: 0;
    }
  }
`

const StyledLink = styled(Link)`
  text-decoration-line: none;
`

const StyledUnderlinedLink = styled(Link)`
  margin-left: ${SPACING.SCALE_2};
`

const StyledLinkWrapper = styled('div')`
  a + a {
    margin-left: ${SPACING.SCALE_5};
  }
`

function buildMetaList({
  company,
  potential_value,
  sector,
  contact,
  expected_win_date,
  created_on,
  archived,
  archived_on,
  archived_reason,
}) {
  const list = [
    {
      label: 'Company',
      value: company.name,
      href: urls.companies.detail(company.id),
    },
    sector && { label: 'Export sector', value: sector.segment },
    contact && {
      label: 'Company contact',
      value: contact.name,
      href: urls.contacts.contact(contact.id),
    },
    potential_value && {
      label: 'Potential export value',
      value: NumberUtils.currencyGBP(potential_value),
    },
    expected_win_date && {
      label: 'Expected date for win',
      value: moment(expected_win_date).format('MMM Y'),
    },
    {
      label: 'Created',
      value: moment(created_on).format('DD MMM Y'),
      subtle: true,
      showArchived: true,
    },
    archived &&
      archived_reason && {
        label: 'Archive reason',
        value: (
          <span
            dangerouslySetInnerHTML={{
              __html: newlineToBr(escape(archived_reason)),
            }}
          />
        ),
      },
    archived && {
      label: 'Archived',
      value: moment(archived_on).format('DD MMM Y'),
      subtle: true,
    },
  ]
  // remove falsy values
  return list.filter(Boolean)
}

const PipelineItemMeta = ({
  label,
  value,
  href,
  subtle,
  id,
  archived,
  showArchived,
}) => {
  const Wrapper = subtle ? StyledValueSubtle : StyledValue

  return (
    <StyledListItem>
      <StyledLabel>{label}</StyledLabel>
      <Wrapper>
        {href ? <StyledLink href={href}>{value}</StyledLink> : value}
        {!archived && showArchived && (
          <StyledUnderlinedLink href={urls.pipeline.archive(id)}>
            Archive this project
          </StyledUnderlinedLink>
        )}
      </Wrapper>
    </StyledListItem>
  )
}

const PipelineItem = ({
  item: {
    id,
    name,
    likelihood_to_win,
    archived,
    archived_on,
    archived_reason,
    ...meta
  },
}) => {
  const metaListItems = buildMetaList({
    ...meta,
    archived,
    archived_on,
    archived_reason,
  })

  return (
    <Card>
      <StyledH3 archived={archived}>{name}</StyledH3>
      <StyledGridRow>
        <GridCol>
          <ul>
            {metaListItems.map(
              ({ label, value, href, subtle, showArchived }) => (
                <PipelineItemMeta
                  key={label}
                  label={label}
                  value={value}
                  href={href}
                  subtle={subtle}
                  id={id}
                  archived={archived}
                  showArchived={showArchived}
                />
              )
            )}
          </ul>
        </GridCol>
        <StyledGridCol>
          {archived ? (
            <StyledLinkWrapper>
              <Link href={urls.pipeline.delete(id)}>Delete</Link>
              <Link href={urls.pipeline.unarchive(id)}>Unarchive</Link>
            </StyledLinkWrapper>
          ) : (
            <Button as={Link} href={urls.pipeline.edit(id)} buttonColour={BLUE}>
              Edit
            </Button>
          )}
          {LIKELIHOOD_TO_SUCCEED[likelihood_to_win] && (
            <StyledTagSpacing aria-label="Likelihood to succeed">
              <Tag
                colour={LIKELIHOOD_TO_SUCCEED[likelihood_to_win].colour}
              >{`${LIKELIHOOD_TO_SUCCEED[likelihood_to_win].text}`}</Tag>
              {archived && <Tag colour="grey">Archived</Tag>}
            </StyledTagSpacing>
          )}
        </StyledGridCol>
      </StyledGridRow>
    </Card>
  )
}

PipelineItem.propTypes = {
  item: PipeLineItemPropType,
}

export default PipelineItem
