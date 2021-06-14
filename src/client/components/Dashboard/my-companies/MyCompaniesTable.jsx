import { orderBy } from 'lodash'
import { format, parseISO } from 'date-fns'
import React from 'react'
import styled from 'styled-components'
import LinesEllipsis from 'react-lines-ellipsis'
import { typography } from '@govuk-react/lib'
import Table from '@govuk-react/table'
import Link from '@govuk-react/link'
import { GREY_1, GREY_3, TEXT_COLOUR } from 'govuk-colours'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import Button from '@govuk-react/button'
import { useMyCompaniesContext } from './useMyCompaniesContext'
import Filters from './MyCompaniesFilters'
import urls from '../../../../lib/urls'

const StyledCellHeader = styled(Table.CellHeader)(
  typography.font({ size: 14, weight: 'bold' }),
  {
    [MEDIA_QUERIES.DESKTOP]: {
      overflow: 'hidden',
      'white-space': 'nowrap',
    },
  }
)

const StyledButtonTableCell = styled(Table.CellHeader)`
  white-space: nowrap;
`

const StyledDateCell = styled(Table.Cell)(typography.font({ size: 14 }), {
  color: GREY_1,
})

const StyledLink = styled.a`
  margin-bottom: 0;
`

function sortCompanies(companies, sortType) {
  switch (sortType) {
    case 'recent':
      return orderBy(
        companies,
        [(c) => c.latestInteraction.date || ''],
        ['desc']
      )
    case 'least-recent':
      return orderBy(
        companies,
        [(c) => c.latestInteraction.date || ''],
        ['asc']
      )
    case 'alphabetical':
      return orderBy(companies, [(c) => c.company.name], ['asc'])
  }
}

const filterCompanyName = (companies, filterText) =>
  filterText.length
    ? companies.filter((c) =>
        c.company.name.toLowerCase().includes(filterText.toLowerCase())
      )
    : companies

function MyCompaniesTable() {
  const {
    state: { lists, selectedIdx, sortBy, filter },
    addInteractionPropsAccessor = () => ({}),
  } = useMyCompaniesContext()

  const list = lists[selectedIdx]
  const filteredSortedCompanies = sortCompanies(
    filterCompanyName(list.companies, filter),
    sortBy
  )

  const header = (
    <Table.Row>
      <StyledCellHeader>Company name</StyledCellHeader>
      <StyledCellHeader>Last interaction</StyledCellHeader>
      <StyledCellHeader colSpan="2">&nbsp;</StyledCellHeader>
    </Table.Row>
  )

  const rows = filteredSortedCompanies.map(({ company, latestInteraction }) => {
    return (
      <Table.Row key={company.id}>
        <Table.Cell setWidth="25%">
          <Link href={urls.companies.detail(company.id)}>
            <LinesEllipsis
              text={company.name}
              maxLine="2"
              ellipsis="..."
              trimRight={true}
              basedOn="words"
            />
          </Link>
        </Table.Cell>
        <StyledDateCell setWidth="15%">
          {latestInteraction.date
            ? format(parseISO(latestInteraction.date), 'd MMM yyyy')
            : '-'}
        </StyledDateCell>
        <Table.Cell setWidth="50%">
          {latestInteraction.id ? (
            <Link href={urls.interactions.detail(latestInteraction.id)}>
              <LinesEllipsis
                text={latestInteraction.subject}
                maxLine="2"
                ellipsis="..."
                trimRight={true}
                basedOn="words"
              />
            </Link>
          ) : (
            latestInteraction.subject
          )}
        </Table.Cell>
        <StyledButtonTableCell>
          <Button
            as={StyledLink}
            buttonColour={GREY_3}
            buttonTextColour={TEXT_COLOUR}
            {...addInteractionPropsAccessor(company)}
          >
            Add interaction
          </Button>
        </StyledButtonTableCell>
      </Table.Row>
    )
  })

  return (
    <>
      {list.companies.length > 1 && <Filters />}
      <Table head={header}>{rows}</Table>
    </>
  )
}

export default MyCompaniesTable
