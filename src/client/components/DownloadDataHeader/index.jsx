import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button } from 'govuk-react'
import { MEDIA_QUERIES, SPACING_POINTS } from '@govuk-react/constants'

import { decimal } from '../../utils/number-utils'
import CollectionHeaderRow from '../CollectionList/CollectionHeaderRow'

const StyledLink = styled('a')`
  margin-bottom: 0;
  ${MEDIA_QUERIES.TABLET}: {
    margin-left: ${SPACING_POINTS[2]}px;
  },
`

const DownloadDataHeader = ({
  downloadLink,
  count = 0,
  maxItems = 5000,
  entityName = '',
  entityNamePlural = `${entityName}s`,
  ...props
}) => {
  if (!count || !downloadLink) {
    return null
  }

  if (count >= maxItems) {
    return (
      <CollectionHeaderRow {...props}>
        Filter to fewer than {decimal(maxItems)} {entityNamePlural} to download
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
      {count === 1
        ? `this ${entityName}`
        : `these ${count} ${entityNamePlural}`}
    </CollectionHeaderRow>
  )
}

DownloadDataHeader.propTypes = {
  downloadLink: PropTypes.string,
  count: PropTypes.number,
  maxItems: PropTypes.number,
  entityName: PropTypes.string,
  entityNamePlural: PropTypes.string,
}

export default DownloadDataHeader
