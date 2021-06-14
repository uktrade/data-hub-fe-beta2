/**
 * Resuable test functions - these combine an action with an assertion.
 *
 * These are distinct from assertions because unlike an assertion, these have
 * side effects as a result of the action taken.
 */
import { selectFirstTypeaheadOption } from './actions'
import {
  assertTypeaheadHints,
  assertTypeaheadOptionSelected,
} from './assertions'

/**
 * Tests that a typeahead functions correctly by inputing a value and selecting
 */
export const testTypeahead = ({
  element,
  legend,
  placeholder,
  input,
  expectedOption,
}) => {
  assertTypeaheadHints({ element, legend, placeholder })
  selectFirstTypeaheadOption({ element, input })
  assertTypeaheadOptionSelected({ element, expectedOption })
}

/**
 * Tests that clicking the first indicator button clears a filter element
 */
export const testRemoveChip = ({ element, placeholder = null }) => {
  cy.get('#filter-chips').as('filterChips').find('button').click()
  cy.get('@filterChips').should('be.empty')
  placeholder && cy.get(element).should('contain', placeholder)
}
