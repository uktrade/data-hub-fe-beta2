import PropTypes from 'prop-types'

export default {
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  'data-validator-name': PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, null]),
}
