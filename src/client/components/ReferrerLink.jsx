import React from 'react'
import Link from '@govuk-react/link'

import State from './State'

/**
 * @function ReferrerLink
 * @description Same as {@govuk-react/link} but with {href} set to the referrer
 * URL that linked to this page. You can use this as a cancel button on forms
 * which act like modals.
 * @example
 * <ReferrerLink>Back</ReferrerLink>
 */
export default (props) => (
  <State>{({ referrerUrl }) => <Link {...props} href={referrerUrl} />}</State>
)
