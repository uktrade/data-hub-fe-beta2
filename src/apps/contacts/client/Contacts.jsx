import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import TabNav from '../../../client/components/TabNav/index.jsx'
import details from './images/details.png'
import interactions from './images/interactions.png'
import audit from './images/audit.png'
import documents from './images/documents.png'

const Img = styled('img')`
  width: 960px;
  ${({ src }) => `src: ${src}`}
  ${({ alt }) => `alt: ${alt}`}
`

const Details = () => <Img src={details} alt="details" />
const Interactions = () => <Img src={interactions} alt="interactions" />
const AuditHistory = () => <Img src={audit} alt="auditHistory" />
const Documents = () => <Img src={documents} alt="documents" />

const Contacts = ({ id }) => (
  <TabNav
    id={`${id}.TabNav`}
    label="Contacts"
    selectedIndex={0}
    tabs={[
      {
        label: 'Details',
        content: <Details />,
      },
      {
        label: 'Interactions',
        content: <Interactions />,
      },
      {
        label: 'Audit history',
        content: <AuditHistory />,
      },
      {
        label: 'Documents',
        content: <Documents />,
      },
    ]}
  />
)

Contacts.propTypes = {
  id: PropTypes.string.isRequired,
}

export default Contacts
