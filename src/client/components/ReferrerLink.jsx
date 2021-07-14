import React from 'react'
import Link from '@govuk-react/link'

import State from './State'

const stripHost = (u) => {
  const url = new URL(u)
  return url.pathname + url.search
}

/**
 * @function ReferrerLink
 * @description Same as {@govuk-react/link} but with {href} set to the referrer
 * URL that linked to this page. You can use this as a cancel button on forms
 * which act like modals.
 * @example
 * <ReferrerLink>Back</ReferrerLink>
 */
export default (props) => (
  <State>
    {({ referrerUrl }) => (
      <Link {...props} href={referrerUrl ? stripHost(referrerUrl) : '/'} />
    )}
  </State>
)
