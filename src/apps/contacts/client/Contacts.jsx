import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import TabNav from '../../../client/components/TabNav/index.jsx'
import details from './images/details.png'
import interactions from './images/interactions.png'
import EditHistory from './components/edit-history/EditHistory'
import documents from './images/documents.png'

const Img = styled('img')`
  width: 960px;
  ${({ src }) => `src: ${src}`}
  ${({ alt }) => `alt: ${alt}`}
`

const Details = () => <Img src={details} alt="details" />
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
        content: <Details />,
      },
      interactions: {
        label: 'Interactions',
        content: <Interactions />,
      },
      'edit-history': {
        label: 'Edit history',
        content: <EditHistory contactId={contactId} />,
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
