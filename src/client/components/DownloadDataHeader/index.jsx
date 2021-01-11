import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Button from '@govuk-react/button'
import { SPACING_POINTS } from '@govuk-react/constants'

import { decimal } from '../../utils/number-utils'
import CollectionHeaderRow from '../CollectionList/CollectionHeaderRow'

const StyledLink = styled('a')`
  margin-bottom: 0;
  margin-left: ${SPACING_POINTS[2]}px;
`

const DownloadDataHeader = ({
  downloadLink,
  count = 0,
  maxItems = 5000,
  ...props
}) => {
  if (!count) {
    return null
  }

  if (count >= maxItems) {
    return (
      <CollectionHeaderRow {...props}>
        Filter to fewer than {decimal(maxItems)} projects to download
      </CollectionHeaderRow>
    )
  }

  const downloadAction = (
    <Button key="download" as={StyledLink} href={downloadLink} download={true}>
      Download
    </Button>
  )

  return (
    <CollectionHeaderRow actions={[downloadAction]} {...props}>
      You can now download{' '}
      {count === 1 ? 'this project' : `these ${count} projects`}
    </CollectionHeaderRow>
  )
}

DownloadDataHeader.propTypes = {
  downloadLink: PropTypes.string,
  count: PropTypes.number,
  maxItems: PropTypes.number,
}

export default DownloadDataHeader
