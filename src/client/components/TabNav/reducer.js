import { TAB_NAV__SELECT, TAB_NAV__FOCUS } from '../../actions'

export default (state = {}, { type, focusIndex, selectedIndex }) => {
  switch (type) {
    case TAB_NAV__FOCUS:
      return {
        ...state,
        focusIndex,
      }
    case TAB_NAV__SELECT:
      return {
        selectedIndex,
        focusIndex,
      }
    default:
      return state
  }
}
