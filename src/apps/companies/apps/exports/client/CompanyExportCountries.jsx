import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { H2 } from '@govuk-react/heading'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import { SPACING_POINTS, LINE_HEIGHT } from '@govuk-react/constants'

import { CollectionList } from 'data-hub-components'

/* const TableDetails = styled('div')`
  display: flex;
  flex-flow: row wrap;
  * {
    font-size: inherit;
    line-height: inherit;
  }
  & > span {
    flex: 1;
    padding-left: ${SPACING_POINTS[5]}px;
    line-height: ${LINE_HEIGHT.SIZE_24};
  }
  & > details {
    flex: 1;
    padding-left: ${SPACING_POINTS[5]}px;
    line-height: ${LINE_HEIGHT.SIZE_24};
    margin-bottom: 0;
  }
` */
const DEFAULT_ITEMS_PER_PAGE = 50

function CompanyExportCountries({ data }) {
  const [activePage, setActivePage] = useState(1)

  const index = activePage - 1
  const offset = index * DEFAULT_ITEMS_PER_PAGE
  const limit = (index + 1) * DEFAULT_ITEMS_PER_PAGE

  return (
    <>
      <H2>Export markets history</H2>
      <CollectionList
        items={data.results}
        onPageClick={(page, event) => {
          setActivePage(page)
          event.preventDefault()
        }}
        activePage={activePage}
        totalItems={data.count}
        itemName="result"
      />
    </>
  )
}

CompanyExportCountries.propTypes = {
  data: PropTypes.object.isRequired,
}

export default CompanyExportCountries
