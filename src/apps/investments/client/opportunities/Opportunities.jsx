import React from 'react'

import TabNav from '../../../../client/components/TabNav'
import ToggleSection from '../../../../client/components/ToggleSection'

const Opportunities = () => (
  <TabNav
    id="TabNav"
    label="Dashboard"
    selectedIndex={'details'}
    tabs={{
      details: {
        label: 'Details',
        content: (
          <>
            <ToggleSection label="Opportunity details" id="t.details" />
            <ToggleSection label="Opportunity requirements" id="t.req" />
          </>
        ),
      },
    }}
  />
)

export default Opportunities
