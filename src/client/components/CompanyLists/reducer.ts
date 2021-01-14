import { mapValues } from 'lodash'
import {
  COMPANY_LISTS__LISTS_LOADED,
  COMPANY_LISTS__SELECT,
  COMPANY_LISTS__COMPANIES_LOADED,
  COMPANY_LISTS__FILTER,
  COMPANY_LISTS__ORDER,
} from '../../actions'
import {OrderBy, CompanyList, CompanyListAction} from './types'
import {RECENT} from './Filters'
import {Reducer} from '../types'

interface State {
  orderBy: OrderBy,
  query?: string,
  lists: Record<string, {name: string, companies?: CompanyList}>,
  selectedId?: string,
}

const initialState: State = {
  orderBy: RECENT,
  lists: {},
}

type CompanyListReducer = Reducer<State, CompanyListAction>

const reducer: CompanyListReducer = (state = initialState, action) => {
  switch (action.type) {
    case COMPANY_LISTS__LISTS_LOADED:
      return {
        ...state,
        lists: mapValues(action.result, (name) => ({ name })),
        selectedId: Object.keys(action.result)[0],
      }
    case COMPANY_LISTS__COMPANIES_LOADED:
      return {
        ...state,
        lists: {
          ...state.lists,
          [action.payload]: {
            ...state.lists[action.payload],
            companies: action.result,
          },
        },
      }
    case COMPANY_LISTS__SELECT:
      return {
        ...state,
        selectedId: action.id,
        query: '',
      }
    case COMPANY_LISTS__FILTER:
      return { ...state, query: action.query }
    case COMPANY_LISTS__ORDER:
      return { ...state, orderBy: action.orderBy }
    default:
      return state
  }
}

export default reducer