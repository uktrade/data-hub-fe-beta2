import PropTypes from 'prop-types'

const BooleanItemRenderer = (item, index, property) => {
  return item[property].toString()
}

BooleanItemRenderer.propTypes = {
  item: PropTypes.shape.isRequired,
  index: PropTypes.number.isRequired,
  property: PropTypes.string.isRequired,
}

export default BooleanItemRenderer
