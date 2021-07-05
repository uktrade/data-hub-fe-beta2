import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { H2 } from '@govuk-react/heading'
import Table from '@govuk-react/table'
import { LEVEL_SIZE } from '@govuk-react/constants'
import { TEXT_COLOUR, GREY_3 } from 'govuk-colours'
import { FormActions } from '../../../../../client/components'
import { companies } from '../../../../../lib/urls'

const ButtonSecondary = (props) => (
  <Button buttonColour={GREY_3} buttonTextColour={TEXT_COLOUR} {...props} />
)

const RenderHasAccountManager = ({
  team,
  name,
  email,
  addUrl,
  removeUrl,
  hasPermissionToAddIta,
  companyName,
  companyId,
}) => (
  <div>
    <Table caption={`Lead ITA for ${companyName}`}>
      <Table.Row>
        <Table.Header setWidth="33%">Team</Table.Header>
        <Table.Header setWidth="33%">Lead ITA</Table.Header>
        <Table.Header setWidth="33%">Email</Table.Header>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{team}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>
          {email ? <a href={`mailto:${email}`}>{email}</a> : '-'}
        </Table.Cell>
      </Table.Row>
    </Table>
    <p>
      You can{' '}
      <a href={companies.editHistory.index(companyId)}>
        see changes in the Edit history
      </a>
    </p>
    {hasPermissionToAddIta && (
      <FormActions>
        <ButtonSecondary as={Link} href={addUrl}>
          Replace Lead ITA
        </ButtonSecondary>
        <ButtonSecondary as={Link} href={removeUrl}>
          Remove Lead ITA
        </ButtonSecondary>
      </FormActions>
    )}
  </div>
)

const RenderHasNoAccountManager = ({
  hasPermissionToAddIta,
  addUrl,
  companyName,
}) => (
  <div>
    <H2 size={LEVEL_SIZE[3]}>Lead ITA for {companyName}</H2>
    <p>This company record has no Lead International Trade Adviser (ITA).</p>
    {hasPermissionToAddIta && (
      <>
        <p>
          You can add a Lead ITA. This will be visible to all Data Hub users.
        </p>
        <Button as={Link} href={addUrl}>
          Add a Lead ITA
        </Button>
      </>
    )}
  </div>
)

const LeadAdvisers = ({
  hasAccountManager,
  name,
  team,
  email,
  companyName,
  companyId,
  addUrl,
  removeUrl,
  hasPermissionToAddIta,
}) => {
  return hasAccountManager ? (
    <RenderHasAccountManager
      name={name}
      team={team}
      email={email}
      companyId={companyId}
      companyName={companyName}
      hasPermissionToAddIta={hasPermissionToAddIta}
      addUrl={addUrl}
      removeUrl={removeUrl}
    />
  ) : (
    <RenderHasNoAccountManager
      companyName={companyName}
      hasPermissionToAddIta={hasPermissionToAddIta}
      addUrl={addUrl}
      removeUrl={removeUrl}
    />
  )
}

LeadAdvisers.propTypes = {
  hasAccountManager: PropTypes.bool.isRequired,
  name: PropTypes.string,
  team: PropTypes.string,
  email: PropTypes.string,
  companyName: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
  addUrl: PropTypes.string.isRequired,
  removeUrl: PropTypes.string.isRequired,
  hasPermissionToAddIta: PropTypes.bool.isRequired,
}

RenderHasAccountManager.propTypes = {
  name: PropTypes.string.isRequired,
  team: PropTypes.string.isRequired,
  email: PropTypes.string,
  addUrl: PropTypes.string.isRequired,
  removeUrl: PropTypes.string.isRequired,
  hasPermissionToAddIta: PropTypes.bool.isRequired,
  companyName: PropTypes.string.isRequired,
  companyId: PropTypes.string.isRequired,
}

RenderHasNoAccountManager.propTypes = {
  addUrl: PropTypes.string.isRequired,
  hasPermissionToAddIta: PropTypes.bool.isRequired,
  companyName: PropTypes.string.isRequired,
}

export default LeadAdvisers
