/**
 * This module is a registry of all Redux action types used within the app.
 * Redux actions are shared by all components/reducers so their names must not
 * collide. Having them defined as constants in a single module is a simple
 * measure to prevent such hard to debug cases.
 *
 * The name and value of the constants must be the same.
 * The name should be the name of the component the action relates to and a verb
 * describing what it does, concattenated by double underscore.
 */
export const COMPANY_LISTS__LISTS_LOADED = 'COMPANY_LISTS__LISTS_LOADED'
export const COMPANY_LISTS__SELECT = 'COMPANY_LISTS__SELECT'
export const COMPANY_LISTS__COMPANIES_LOADED = 'COMPANY_LISTS__COMPANIES_LOADED'
export const COMPANY_LISTS__FILTER = 'COMPANY_LISTS__FILTER'
export const COMPANY_LISTS__ORDER = 'COMPANY_LISTS__ORDER'

export const REFERRAL_DETAILS = 'REFERRAL_DETAILS'

export const TASK__START = 'TASK__START'
export const TASK__PROGRESS = 'TASK__PROGRESS'
export const TASK__ERROR = 'TASK__ERROR'
export const TASK__CLEAR = 'TASK__CLEAR'

export const EXPORTS_HISTORY__LOADED = 'EXPORTS_HISTORY__LOADED'
export const EXPORTS_HISTORY__SELECT_PAGE = 'EXPORTS_HISTORY__SELECT_PAGE'

export const TAB_NAV__SELECT = 'TAB_NAV__SELECT'
export const TAB_NAV__FOCUS = 'TAB_NAV__FOCUS'

export const SEND_REFERRAL_FORM__CONTINUE = 'SEND_REFERRAL_FORM__CONTINUE'
export const SEND_REFERRAL_FORM__BACK = 'SEND_REFERRAL_FORM__BACK'
export const SEND_REFERRAL_FORM__ERROR = 'SEND_REFERRAL_FORM__ERROR'
export const SEND_REFERRAL_FORM__SUBJECT_CHANGE =
  'SEND_REFERRAL_FORM__SUBJECT_CHANGE'
export const SEND_REFERRAL_FORM__ADVISER_CHANGE =
  'SEND_REFERRAL_FORM__ADVISER_CHANGE'
export const SEND_REFERRAL_FORM__CONTACT_CHANGE =
  'SEND_REFERRAL_FORM__CONTACT_CHANGE'
export const SEND_REFERRAL_FORM__TEXTAREA_CHANGE =
  'SEND_REFERRAL_FORM__TEXTAREA_CHANGE'

export const REFFERAL_LIST__LOADED = 'REFFERAL_LIST__LOADED'

export const EXPORT_WINS__LOADED = 'EXPORT_WINS__LOADED'
export const EXPORT_WINS__SELECT_PAGE = 'EXPORT_WINS__SELECT_PAGE'

export const EXPORT_COUNTRIES_EDIT__SAVE = 'EXPORT_COUNTRIES_EDIT__SAVE'

export const AUDIT_HISTORY__LOADED = 'AUDIT_HISTORY__LOADED'

export const CONTACT_DETAILS__LOADED = 'CONTACT_DETAILS__LOADED'
