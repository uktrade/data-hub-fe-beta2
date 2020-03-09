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

export const VALIDATED_INPUT__CHANGE = 'VALIDATED_INPUT__CHANGE'

export const TAB_NAV__SELECT = 'TAB_NAV__SELECT'

export const SEND_REFERRAL_FORM__CONTINUE = 'SEND_REFERRAL_FORM__CONTINUE'
export const SEND_REFERRAL_FORM__BACK = 'SEND_REFERRAL_FORM__BACK'
export const SEND_REFERRAL_FORM__ERROR = 'SEND_REFERRAL_FORM__ERROR'
export const SEND_REFERRAL_FORM__SUBJECT_CHANGE =
  'SEND_REFERRAL_FORM__SUBJECT_CHANGE'
export const SEND_REFERRAL_FORM__ADVISER_CHANGE =
  'SEND_REFERRAL_FORM__ADVISER_CHANGE'
export const SEND_REFERRAL_FORM__CONTACT_CHANGE =
  'SEND_REFERRAL_FORM__CONTACT_CHANGE'

export const REFFERAL_LIST__LOADED = 'REFFERAL_LIST__LOADED'

export const EXPORT_WINS__LOADED = 'EXPORT_WINS__LOADED'
export const EXPORT_WINS__SELECT_PAGE = 'EXPORT_WINS__SELECT_PAGE'

export const FORM_FIELD_CHANGE = 'FORM_FIELD_CHANGE'
export const FORM_FIELD_SET_VALUE = 'FORM_FIELD_SET_VALUE'
export const FORM_FIELD_TOUCHED = 'FORM_FIELD_TOUCHED'
export const FORM_FIELD_BLUR = 'FORM_FIELD_BLUR'
export const FORM_FIELD_FOCUS = 'FORM_FIELD_FOCUS'
export const FORM_FIELD_REGISTER = 'FORM_FIELD_REGISTER'
export const FORM_FIELD_DEREGISTER = 'FORM_FIELD_DEREGISTER'
export const FORM_FIELD_ERROR = 'FORM_FIELD_ERROR'

export const FORM_STEP_REGISTER = 'FORM_STEP_REGISTER'
export const FORM_STEP_DEREGISTER = 'FORM_STEP_DEREGISTER'

export const FORM_VALIDATE = 'FORM_VALIDATE'
export const FORM_FORWARD = 'FORM_FORWARD'
export const FORM_BACK = 'FORM_BACK'
export const FORM_SUBMIT = 'FORM_SUBMIT'
