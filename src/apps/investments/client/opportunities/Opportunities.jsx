import React from 'react'

import TabNav from '../../../../client/components/TabNav'
import ToggleSection from '../../../../client/components/ToggleSection'
import SummaryList from '../../../../client/components/SummaryList'
import ButtonLink from '../../../../client/components/ButtonLink'

const rows = [
  { label: 'Some Label 1', value: 'Example Ltd' },
  { label: 'Some Label 2', value: 'Incomplete' },
]

class WipButton extends React.Component {
  onButtonPress = () => {
    this.setState({
      isOpen: true,
    })
  }

  render() {
    return (
      <ButtonLink onClick={this.onButtonPress} float="right">
        Open All
      </ButtonLink>
    )
  }
}

const Opportunities = () => (
  <>
    <WipButton />
    <TabNav
      id="TabNav"
      label="Dashboard"
      selectedIndex={'details'}
      tabs={{
        details: {
          label: 'Details',
          content: (
            <>
              <ToggleSection
                label="Opportunity details"
                id="toggle_details"
                fieldCount={rows.length}
                showRequiredField={true}
              >
                <SummaryList rows={rows} />
              </ToggleSection>
              <ToggleSection
                label="Opportunity requirements"
                id="toggle_requirements"
                fieldCount={rows.length}
                showRequiredField={true}
              >
                <SummaryList rows={rows} />
              </ToggleSection>
            </>
          ),
        },
      }}
    />
  </>
)

export default Opportunities
