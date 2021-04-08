import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

/**
 * @function FocusMe
 * @description Focuses the HTML element selected by the {selector} when {when}
 * is truthy.
 * @param {Object} props
 * @param {string} [props.selector='*'] - A querySelector string
 * @param {any} [props.when] - If truthy, the selected element will be focused.
 */
const FocusMe = ({ children, selector = '*', when }) => {
  const ref = useRef()
  useEffect(() => {
    when &&
      requestAnimationFrame(() => ref.current?.querySelector(selector).focus())
  }, [when, selector])
  return <div ref={ref}>{children}</div>
}

FocusMe.propTypes = {
  selector: PropTypes.string,
}

export default FocusMe
