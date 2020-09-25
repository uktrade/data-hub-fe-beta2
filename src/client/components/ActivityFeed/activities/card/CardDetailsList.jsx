import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import UnorderedList from '@govuk-react/unordered-list'
import ListItem from '@govuk-react/list-item'

const StyledUnorderedList = styled(UnorderedList)`
  margin-bottom: 0;
`

const StyledListItem = styled(ListItem)`
  ${MEDIA_QUERIES.TABLET} {
    font-size: 16px;
  }
`

const CardDetailsList = ({ items, itemRenderer, itemPropName }) => {
  return (
    <StyledUnorderedList listStyleType="none">
      {items.map((item, index) => (
        <StyledListItem key={item.id}>
          {itemRenderer(item, index, itemPropName)}
        </StyledListItem>
      ))}
    </StyledUnorderedList>
  )
}

CardDetailsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemRenderer: PropTypes.any.isRequired,
  itemPropName: PropTypes.string,
}

CardDetailsList.defaultProps = {
  itemPropName: null,
}

export default CardDetailsList
