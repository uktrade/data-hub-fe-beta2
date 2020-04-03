import PropTypes from 'prop-types'
import React from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { GREY_4, TEXT_COLOUR, BORDER_COLOUR, FOCUS_COLOUR } from 'govuk-colours'

import multiInstance from '../../utils/multiinstance'
import focusable from '../../utils/focusable'
import { TAB_NAV__SELECT, TAB_NAV__FOCUS } from '../../actions'
import reducer from './reducer'

const LEFT_ARROW_KEY = 37
const RIGHT_ARROW_KEY = 39

const FocusableButton = focusable('button')

const buttonStyle = {
  color: TEXT_COLOUR,
  fontSize: 19,
  fontFamily: 'Arial, sans-serif',
}

const focusStyle = {
  '&:focus': {
    outline: `3px solid ${FOCUS_COLOUR}`,
  },
}

const StyledButton = styled(FocusableButton)({
  ...buttonStyle,
  padding: '10px 20px',
  margin: '5px 0 5px',
  background: GREY_4,
  border: 'none',
  cursor: 'pointer',
  ...focusStyle,
})

const StyledSelectedButton = styled(FocusableButton)({
  ...buttonStyle,
  border: `1px solid ${BORDER_COLOUR}`,
  borderBottom: 'none',
  // The negative margin is here so that it overcasts tabpane's top border
  marginBottom: -1,
  // The 19px include compensation for the 1px negative margin above
  padding: '14px 19px 16px',
  background: 'white',
  ...focusStyle,
})

const StyledTablist = styled.div({
  borderBottom: `1px solid ${BORDER_COLOUR}`,
  '& > *:not(:last-child)': {
    marginRight: 5,
  },
})

const StyledTabpanel = styled.div({
  ...focusStyle,
  marginTop: 30,
})

const createId = (id, index) => `${id}.tab-${index}`

// Based on https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
const TabNav = ({
  selectedIndex,
  focusIndex,
  tabs,
  label,
  onChange,
  onFocusChange,
  id,
  routed,
  // We are only destructuring dispatch from the props so that <div> won't
  // complain about it being an unexpected prop.
  // eslint-disable-next-line no-unused-vars
  dispatch,
  ...props
}) => (
  <div {...props}>
    <Route>
      {({ location: { pathname }, history }) => {
        selectedIndex = routed ? pathname.replace(/^\//, '') : selectedIndex

        return (
          <>
            <StyledTablist
              tabindex={0}
              role="tablist"
              aria-label={label}
              onKeyUp={({ keyCode }) => {
                const totalTabs = Object.keys(tabs).length
                const currentFocusIndex = focusIndex || 0

                if (keyCode === RIGHT_ARROW_KEY) {
                  onFocusChange((currentFocusIndex + 1) % totalTabs)
                }

                if (keyCode === LEFT_ARROW_KEY) {
                  onFocusChange(
                    ((currentFocusIndex < 1 ? totalTabs : currentFocusIndex) -
                      1) %
                      totalTabs
                  )
                }
              }}
            >
              {Object.entries(tabs).map(([key, { label }], index) => {
                const selected = key == selectedIndex
                const Button = selected ? StyledSelectedButton : StyledButton
                return (
                  <Button
                    key={key}
                    role="tab"
                    focused={index === focusIndex}
                    aria-selected={selected}
                    id={createId(id, key)}
                    tabIndex={
                      // If no tab is selected...
                      selectedIndex === undefined && !index
                        ? // ...only the first tab participates in the tabindex
                          0
                        : // Otherwise, only the selected tab participates in tabindex
                        selected
                        ? 0
                        : -1
                    }
                    onClick={() =>
                      selected || routed
                        ? (history.push('/' + key), onFocusChange(index))
                        : onChange(key, index)
                    }
                  >
                    {label}
                  </Button>
                )
              })}
            </StyledTablist>
            <StyledTabpanel
              role="tabpanel"
              tabIndex={0}
              aria-labelledby={createId(id, selectedIndex)}
            >
              {tabs[selectedIndex]?.content}
            </StyledTabpanel>
          </>
        )
      }}
    </Route>
  </div>
)

const tabPropType = PropTypes.shape({
  label: PropTypes.node.isRequired,
  content: PropTypes.node,
})

TabNav.propTypes = {
  label: PropTypes.string.isRequired,
  routed: PropTypes.any,
  tabs: PropTypes.oneOfType([
    PropTypes.arrayOf(tabPropType),
    PropTypes.objectOf(tabPropType),
  ]).isRequired,
}

export default multiInstance({
  name: 'TabNav',
  dispatchToProps: (dispatch) => ({
    onChange: (selectedIndex, focusIndex) =>
      dispatch({
        type: TAB_NAV__SELECT,
        selectedIndex,
        focusIndex,
      }),
    onFocusChange: (focusIndex) =>
      dispatch({
        type: TAB_NAV__FOCUS,
        focusIndex,
      }),
  }),
  component: TabNav,
  reducer,
})
