import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import React from 'react'

const ContactItemRenderer = (item) => {
  const name = <Link href={item.url}>{item.name}</Link>
  const jobTitle = item.jobTitle ? <span>({item.jobTitle})</span> : null

  return (
    <>
      {name} {jobTitle}
    </>
  )
}

ContactItemRenderer.propTypes = {
  contact: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string, // Can't set this as 'isRequired'
    jobTitle: PropTypes.string,
  }).isRequired,
}

export default ContactItemRenderer
