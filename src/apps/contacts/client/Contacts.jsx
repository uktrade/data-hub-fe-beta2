import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import TabNav from '../../../client/components/TabNav/index.jsx'
import ContactDetails from './Details'
import interactions from './images/interactions.png'
import AuditHistory from './components/audit-history/AuditHistory'
import documents from './images/documents.png'

const Img = styled('img')`
  width: 960px;
  ${({ src }) => `src: ${src}`}
  ${({ alt }) => `alt: ${alt}`}
`

const Interactions = () => <Img src={interactions} alt="interactions" />
const Documents = () => <Img src={documents} alt="documents" />

const Contacts = ({ contactId }) => (
  <TabNav
    id={`${contactId}.TabNav`}
    label="Contacts"
    selectedIndex=""
    routed={true}
    tabs={{
      '': {
        label: 'Details',
        content: <ContactDetails id={contactId} />,
      },
      interactions: {
        label: 'Interactions',
        content: <Interactions />,
      },
      'audit-history': {
        label: 'Audit history',
        content: <AuditHistory contactId={contactId} />,
      },
      documents: {
        label: 'Documents',
        content: <Documents />,
      },
    }}
  />
)

Contacts.propTypes = {
  contactId: PropTypes.string.isRequired,
}

export default Contacts
