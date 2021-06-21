import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import axios from 'axios'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

import {
  FormStateful,
  FieldInput,
  FieldRadios,
  FormActions,
  FieldTextarea,
  FieldCheckboxes,
  FieldAddress,
  ErrorSummary,
  Main,
} from '..'

import { addMessage } from '../../utils/flash-messages'
import LocalHeader from '../LocalHeader/LocalHeader'
import FlashMessages from '../LocalHeader/FlashMessages'
import Contact from '../Resource/Contact'
import Company from '../Resource/Company'
import ReferrerLink from '../ReferrerLink'
import * as validators from '../Form/validators'

const boolToYesNo = (x) => (x === true ? 'yes' : x === false ? 'no' : x)

const ContactForm = ({
  method,
  edit,
  contactId,
  // Needed for linking the newly created contact to a company and breadcrumbs
  companyId,
  // We need to convert these to 'yes' / 'no' strings
  primary,
  addressSameAsCompany,
  acceptsDitEmailMarketing,
  // These need to be renamed, so that they are compatible with the fields of
  // the address sub-form
  addressPostcode: postcode,
  addressTown: city,
  addressCounty: county,
  ...props
}) => (
  <Company id={companyId}>
    {(company) => (
      <>
        <LocalHeader
          superheading={
            edit && (
              <Link href={`/companies/${company.id}`}>{company.name}</Link>
            )
          }
          heading={`${edit ? 'Edit' : 'Add'} contact`}
          breadcrumbs={[
            { link: '/', text: 'Home' },
            { link: '/contacts/', text: 'Contacts' },
            ...(edit
              ? [{ text: props.name }, { text: 'Edit' }]
              : [{ text: `Add contact at ${company.name}` }]),
          ]}
        />
        <Main>
          <FormStateful
            id="add-contact-form"
            showErrorSummary={true}
            initialValues={{
              ...props,
              postcode,
              county,
              city,
              primary: boolToYesNo(primary),
              addressSameAsCompany: boolToYesNo(addressSameAsCompany),
              acceptsDitEmailMarketing: [boolToYesNo(acceptsDitEmailMarketing)],
            }}
            onSubmit={async ({
              address1,
              address2,
              city,
              county,
              postcode,
              acceptsDitEmailMarketing,
              addressSameAsCompany,
              primary,
              ...values
            }) => {
              const payload = {
                ..._.mapKeys(values, (v, k) => _.snakeCase(k)),
                // The checkbox's value is for some odd reason at index 1
                accepts_dit_email_marketing:
                  acceptsDitEmailMarketing[1] === 'yes',
                primary: primary === 'yes',
                company,
                address_same_as_company: addressSameAsCompany === 'yes',
                // The API is complaining if we send the address fields when address_same_as_company is true
                ...(addressSameAsCompany !== 'yes' && {
                  address_1: address1 || ' ',
                  address_2: address2,
                  address_town: city || ' ',
                  address_county: county,
                  address_postcode: postcode,
                  address_country: company.address.country,
                }),
              }

              const response = await axios({
                url: edit
                  ? `/api-proxy/v3/contact/${contactId}`
                  : '/api-proxy/v3/contact',
                method,
                data: payload,
              })

              // Flash message for the next request
              addMessage(
                'success',
                method === 'POST'
                  ? 'Added new contact'
                  : 'Contact record updated'
              )

              // Redirect
              return `/contacts/${response.data.id}/details`
            }}
          >
            {({ submissionError, values, errors }) => (
              <>
                {_.isEmpty(errors) || (
                  <ErrorSummary
                    errors={Object.entries(errors).map(
                      ([targetName, text]) => ({
                        targetName,
                        text,
                      })
                    )}
                  />
                )}
                {submissionError && (
                  <FlashMessages
                    flashMessages={{
                      'error:with-body': [
                        {
                          heading: 'Something went wrong',
                          body:
                            submissionError.message ||
                            submissionError.toString(),
                        },
                      ],
                    }}
                  />
                )}
                <FieldInput
                  label="First name"
                  name="firstName"
                  type="text"
                  required="This field may not be null."
                  data-test="group-field-first_name"
                />
                <FieldInput
                  label="Last name"
                  name="lastName"
                  type="text"
                  required="This field may not be null."
                />
                <FieldInput
                  label="Job title"
                  name="jobTitle"
                  type="text"
                  required="This field may not be null."
                />
                <FieldRadios
                  legend="Is this person a primary contact?"
                  name="primary"
                  required="This field is required."
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />
                <FieldInput
                  label="Telephone country code"
                  name="telephoneCountrycode"
                  type="number"
                  required="This field may not be null."
                  validate={(x) =>
                    !x?.match(/^\d{1,4}$/) &&
                    'Country code should consist of one to four numbers'
                  }
                />
                <FieldInput
                  label="Telephone number"
                  name="telephoneNumber"
                  type="number"
                  required="This field may not be null."
                />
                <FieldInput
                  label="Email"
                  name="email"
                  type="email"
                  required="This field may not be null."
                  validate={validators.email}
                />
                <FieldCheckboxes
                  name="acceptsDitEmailMarketing"
                  options={[
                    {
                      value: 'yes',
                      label: 'The company contact does accept email marketing',
                      hint:
                        !!values.accepts_dit_email_marketing?.length &&
                        'By checking this box, you confirm that the contact has opted in to email marketing.',
                    },
                  ]}
                />
                <FieldRadios
                  legend="Is the contact’s address the same as the company address?"
                  name="addressSameAsCompany"
                  options={[
                    { value: 'yes', label: 'Yes' },
                    {
                      value: 'no',
                      label: 'No',
                      children: (
                        <fieldset>
                          <legend>Contact address</legend>
                          <FieldAddress
                            country={company.address.country}
                            apiEndpoint="/api/postcodelookup"
                          />
                        </fieldset>
                      ),
                    },
                  ]}
                />
                <FieldInput
                  label="Alternative telephone number (optional)"
                  name="telephoneAlternative"
                  type="number"
                />
                <FieldInput
                  label="Alternative email (optional)"
                  name="emailAlternative"
                  type="email"
                  validate={(x) => x && validators.email(x)}
                />
                <FieldTextarea label="Notes (optional)" name="notes" />
                <FormActions>
                  <Button data-test="submit">
                    {edit ? 'Save and return' : 'Add contact'}
                  </Button>
                  <ReferrerLink data-test="return-link">
                    {edit ? 'Return without saving' : 'Cancel'}
                  </ReferrerLink>
                </FormActions>
              </>
            )}
          </FormStateful>
        </Main>
      </>
    )}
  </Company>
)

const idNameShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
})

const requiredProps = {
  method: PropTypes.oneOf(['POST', 'PATCH']),
  addressCountry: idNameShape,
  company: idNameShape,
}

ContactForm.propTypes = {
  ...requiredProps,
  contactId: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  jobTitle: PropTypes.string,
  primary: PropTypes.bool,
  telephoneCountrycode: PropTypes.string,
  telephoneNumber: PropTypes.string,
  email: PropTypes.string,
  acceptsDitEmailMarketing: PropTypes.bool,
  addressSameAsCompany: PropTypes.bool,
  address1: PropTypes.string,
  address2: PropTypes.string,
  addressTown: PropTypes.string,
  addressCounty: PropTypes.string,
  addressPostcode: PropTypes.string,
  telephoneAlternative: PropTypes.string,
  emailAlternative: PropTypes.string,
  notes: PropTypes.string,
}

export const CreateContactForm = ({ companyId }) => (
  <ContactForm companyId={companyId} method="POST" />
)

CreateContactForm.propTypes = requiredProps

export const UpdateContactForm = ({ contactId }) => (
  <Contact id={contactId}>
    {(contact) => (
      <ContactForm
        {...contact}
        contactId={contact.id}
        edit={true}
        companyId={contact.company.id}
        method="PATCH"
      />
    )}
  </Contact>
)

UpdateContactForm.propTypes = {
  ...requiredProps,
  contactId: PropTypes.string.isRequired,
}

export default ({ contactId, companyId }) =>
  contactId ? (
    <UpdateContactForm contactId={contactId} />
  ) : (
    <CreateContactForm companyId={companyId} />
  )
