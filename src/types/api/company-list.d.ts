import common from '.'

export interface CompanyListsPayload extends common.PayloadGET {
  items__company_id?: string
}

export interface CompanyList {
  id: string
  item_count: string
  name: string
  created_on: string
}

export type CompanyListsResult = common.ResultGET<CompanyList>

export type CompanyListPayload = common.PayloadGET

export interface CompanyListItem {
  company: {
    id: string,
    name: string,
    archived: boolean,
    trading_names: string[],
  },
  created_on: string
  latest_interaction?: {
    id: string,
    date: string,
    created_on: string,
    subject: string,
    dit_participants: {
      adviser: common.NameId,
      team: common.NameId,
    }[],
  }
}

export type CompanyListResult = common.ResultGET<CompanyListItem>