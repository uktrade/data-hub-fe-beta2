import PropTypes from 'prop-types'

// String and number
const DefaultItemRenderer = (item, index, property) => {
  return item[property]
}

DefaultItemRenderer.propTypes = {
  item: PropTypes.shape.isRequired,
  index: PropTypes.number.isRequired,
  property: PropTypes.string.isRequired,
}

export default DefaultItemRenderer
