import {
  COMPANY_LISTS__LISTS_LOADED,
  COMPANY_LISTS__SELECT,
  COMPANY_LISTS__COMPANIES_LOADED,
  COMPANY_LISTS__FILTER,
  COMPANY_LISTS__ORDER,
} from '../../actions'
import {Task, TaskSuccessAction} from '../Task/types'
import { ALPHABETICAL, LEAST_RECENT, RECENT } from './Filters'

type ListId = string
type ListName = string
type CompanyListIdNameMap = Record<ListId, ListName>

export type CompanyListsTask = Task<any, CompanyListIdNameMap>

export interface CompanyListItem {
  id: string
  name: string
  date: string
  subject: string
  interactionId: string
  ditParticipants: {
    name: string,
    team: string,
  }[]
}

export type CompanyList = CompanyListItem[]

export type CompanyListTask = Task<string, CompanyList>

export type OrderBy = typeof RECENT | typeof LEAST_RECENT | typeof ALPHABETICAL

export type CompanyListsListsLoadedAction = TaskSuccessAction<
  typeof COMPANY_LISTS__LISTS_LOADED,
  CompanyListIdNameMap
>

export interface CompanyListSelectAction {
  type: typeof COMPANY_LISTS__SELECT
  id: string
}

export type CompanyListCompaniesLoaded = TaskSuccessAction<
  typeof COMPANY_LISTS__COMPANIES_LOADED,
  CompanyList,
  string
>

export interface CompanyListFilterAction {
  type: typeof COMPANY_LISTS__FILTER
  query: string
}

export interface CompanyListOrderAction {
  type: typeof COMPANY_LISTS__ORDER
  orderBy: OrderBy
}

export type CompanyListAction
  = CompanyListOrderAction
  | CompanyListFilterAction 
  | CompanyListCompaniesLoaded 
  | CompanyListSelectAction 
  | CompanyListsListsLoadedAction 
