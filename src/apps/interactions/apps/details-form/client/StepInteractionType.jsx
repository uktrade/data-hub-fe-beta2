import React from 'react'

import InsetText from '@govuk-react/inset-text'

import { FieldRadios } from '../../../../../client/components'
import { useFormContext } from '../../../../../client/components/Form/hooks'
import { THEMES, KINDS } from '../../../constants'
import { NewWindowLink } from '../../../../../client/components'
import urls from '../../../../../lib/urls'

const getOnChangeHandler = (fieldName, setFieldValue) => (e) => {
  setFieldValue('service', '')
  setFieldValue(fieldName, e.target.value)
}

const setInteractionKindFieldValues = (setFieldValue, e) => {
  setFieldValue('service', '')
  setFieldValue('theme', e.target.value)
  setFieldValue('kind', KINDS.INTERACTION)
}

const getInvestmentOnChangeHandler = (setFieldValue) => (e) => {
  setInteractionKindFieldValues(setFieldValue, e)
}

const getTradeAgreementOnChangeHandler = (setFieldValue) => (e) => {
  setInteractionKindFieldValues(setFieldValue, e)
}

const StepInteractionType = () => {
  const { setFieldValue } = useFormContext()
  const exportOption = {
    label: 'Export',
    value: THEMES.EXPORT,
    onChange: getOnChangeHandler('theme', setFieldValue),
    children: (
      <FieldRadios
        label="What would you like to record?"
        name="kind"
        required="Select what you would like to record"
        options={[
          {
            label: 'A standard interaction',
            hint: 'For example, an email, phone call or meeting',
            value: KINDS.INTERACTION,
            onChange: getOnChangeHandler('kind', setFieldValue),
          },
          {
            label: 'A service that you have provided',
            hint: 'For example, a significant assist or an event',
            value: KINDS.SERVICE_DELIVERY,
            onChange: getOnChangeHandler('kind', setFieldValue),
          },
        ]}
      />
    ),
  }
  const investmentOption = {
    label: 'Investment',
    value: THEMES.INVESTMENT,
    onChange: getInvestmentOnChangeHandler(setFieldValue),
  }
  const tradeAgreementOption = {
    label: 'Trade agreement',
    value: THEMES.TRADE_AGREEMENT,
    onChange: getTradeAgreementOnChangeHandler(setFieldValue),
  }
  const otherOption = {
    label: 'Other',
    value: THEMES.OTHER,
    onChange: getOnChangeHandler('theme', setFieldValue),
    children: (
      <FieldRadios
        label="What would you like to record?"
        name="kind"
        required="Select what you would like to record"
        onChange={getOnChangeHandler('kind', setFieldValue)}
        options={[
          {
            label: 'A standard interaction',
            hint: 'For example, an email, phone call or meeting',
            value: KINDS.INTERACTION,
            onChange: getOnChangeHandler('kind', setFieldValue),
          },
          {
            label: 'A service that you have provided',
            hint: 'For example, a significant assist or an event',
            value: KINDS.SERVICE_DELIVERY,
            onChange: getOnChangeHandler('kind', setFieldValue),
          },
        ]}
      />
    ),
  }
  const configuredFieldRadiosOptions = [
    exportOption,
    investmentOption,
    tradeAgreementOption,
    otherOption,
  ]

  return (
    <>
      <InsetText data-test="trade-agreement-guide">
        Select ‘Trade agreement’ if your interaction was set up to focus on, or
        contributes to, implementing a trade agreement.
        <br />
        <br />
        Read more{' '}
        <NewWindowLink href={urls.external.helpCentre.tradeagreementGuidance()}>
          information and guidance
        </NewWindowLink>{' '}
        on this section.
      </InsetText>

      <FieldRadios
        name="theme"
        label="What is this regarding?"
        required="Select what you would like to record"
        options={configuredFieldRadiosOptions}
      />
    </>
  )
}

export default StepInteractionType
