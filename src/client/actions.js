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

export const REFERRAL_LIST__LOADED = 'REFERRAL_LIST__LOADED'
export const REFERRAL_LIST__FILTER_CHANGE = 'REFERRAL_LIST__FILTER_CHANGE'

export const EXPORT_WINS__LOADED = 'EXPORT_WINS__LOADED'
export const EXPORT_WINS__SELECT_PAGE = 'EXPORT_WINS__SELECT_PAGE'

export const EXPORT_COUNTRIES_EDIT__SAVE = 'EXPORT_COUNTRIES_EDIT__SAVE'

export const ADD_INTERACTION_FORM__SUBMIT = 'ADD_INTERACTION_FORM__SUBMIT'
export const ADD_INTERACTION_FORM__CONTACT_FORM_OPENED =
  'ADD_INTERACTION_FORM__CONTACT_FORM_OPENED'

export const FORM__FIELD_SET_VALUE = 'FORM__FIELD_SET_VALUE'
export const FORM__FIELD_TOUCHED = 'FORM__FIELD_TOUCHED'

export const FORM__FIELD_REGISTER = 'FORM__FIELD_REGISTER'
export const FORM__FIELD_DEREGISTER = 'FORM__FIELD_DEREGISTER'

export const FORM__STEP_REGISTER = 'FORM__STEP_REGISTER'
export const FORM__STEP_DEREGISTER = 'FORM__STEP_DEREGISTER'

export const FORM__FORWARD = 'FORM__FORWARD'
export const FORM__BACK = 'FORM__BACK'

export const FORM__VALIDATE = 'FORM__VALIDATE'

export const INVESTMENT_PROJECT_ADMIN__UPDATE_STAGE =
  'INVESTMENT_PROJECT_ADMIN__UPDATE_STAGE'
