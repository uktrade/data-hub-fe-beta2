import common from '.'

export interface PayloadGET extends common.PayloadGET {
  company_id: string,
  contacts__id: string,
  event_id: string,
  investment_project_id: string,
}

export type Interaction = {
  id: string,
  company: string,
  contacts: string[],
  created_on: string,
  created_by: string,
  event?: string,
  is_event?: string,
  status: 'draft' | 'complete',
  kind: 'interaction' | 'service_delivery',
  modified_by: string,
  modified_on: string,
  date: string,
  dit_participants: {adviser: string, team: string}[],
  communication_channel?: string,
  grant_amount_offered?: string,
  investment_project?: string,
  net_company_receipt?: string,
  service?: string,
  service_anwsers: {},
  service_delivery_status?: string,
  subject: string,
  theme?: 'export' | 'investment' | 'other',
  notes: string,
  archived_documents_url_path: string,
  policy_areas: string[],
  policy_feedback_notes: string,
  policy_issue_types: string[],
  was_policy_feedback_provided: boolean,
  were_countries_discussed: boolean,
  export_countries: {
    country: string,
    status: 'not_interested' | 'currently_exporting' | 'future_interest',
  }[],
  archived: boolean,
  archived_by: string,
  archived_on: string,
  archived_reason: string,
  company_referral: string,
}

export type ResultGET = common.ResultGET<Interaction>