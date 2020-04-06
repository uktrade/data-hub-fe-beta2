import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import { H3 } from '@govuk-react/heading'
import { SummaryTable } from 'data-hub-components'
import { SPACING } from '@govuk-react/constants'

import urls from '../../../../../lib/urls'
import ExportWins from './ExportWins/'
import GreatProfile from './GreatProfile'

const StyledSummaryTable = styled(SummaryTable)`
  margin-top: 0;
`

const StyledLink = styled(Link)`
  display: inline-block;
  margin-bottom: ${SPACING.SCALE_5};
`

const ExportsIndex = ({
  isArchived,
  exportWinCategory,
  greatProfile,
  exportPotential,
  exportCountriesInformation,
  exportRegionsInformation,
  exportPotentials,
  companyId,
  companyNumber,
}) => {
  return (
    <>
      <SummaryTable
        caption="Exports"
        actions={
          !isArchived && (
            <Link href={urls.companies.exports.edit(companyId)}>Edit</Link>
          )
        }
      >
        <SummaryTable.Row
          heading={exportWinCategory.name}
          key={exportWinCategory.name}
        >
          {exportWinCategory.value ? exportWinCategory.value : 'None'}
        </SummaryTable.Row>
        <SummaryTable.Row heading={greatProfile.name} key={greatProfile.name}>
          <GreatProfile profile={greatProfile} companyNumber={companyNumber} />
        </SummaryTable.Row>
        <SummaryTable.Row
          heading={exportPotential.name}
          key={exportPotential.name}
        >
          {exportPotential.value ? exportPotential.value : 'No score given'}
        </SummaryTable.Row>
      </SummaryTable>

      <Details summary="What is export potential">
        The export potential score is a prediction of a company's likelihood of
        exporting, and was originally created for the{' '}
        <Link
          href={urls.external.findExporters()}
          target="_blank"
          aria-label="opens in a new tab"
        >
          Find Exporters tool
        </Link>
        . DIT's data science team compared all HMRC export information with the
        features of all UK companies to find patterns; they then repeatedly
        tested their model against a subset of known-good data to improve it.
        The scores are as follows:
        <ol>
          {exportPotentials.map((category) => (
            <li key={category.text}>
              <strong>{category.text}</strong> - {category.description}
            </li>
          ))}
        </ol>
        <br />
        We are continuing to improve the algorithm so please do share your
        feedback or let us know of any anomalies through the{' '}
        <a href={urls.support()}>support channel</a>.
      </Details>

      <StyledSummaryTable
        caption="Export countries information"
        actions={
          !isArchived && (
            <Link
              href={urls.companies.exports.editCountries(companyId)}
              data-test-id="edit-export-countries"
            >
              Edit
            </Link>
          )
        }
      >
        {exportCountriesInformation.map(({ name, values }) => {
          const regions = exportRegionsInformation.find(
            (region) => region.name === name
          )
          return (
            <SummaryTable.Row heading={name} key={name}>
              <>
                {values?.length
                  ? values.map(({ id, name }, i) => {
                      const isLastItem = i === values.length - 1
                      return (
                        <React.Fragment key={id}>
                          <Link
                            href={urls.companies.exports.history.country(
                              companyId,
                              id
                            )}
                          >
                            {name}
                          </Link>
                          {isLastItem ? null : ', '}
                        </React.Fragment>
                      )
                    })
                  : 'None'}
                {regions?.values?.length ? (
                  <div>
                    Regions:
                    <p>{regions.values.map(({ name }) => name).join(', ')}</p>
                  </div>
                ) : null}
              </>
            </SummaryTable.Row>
          )
        })}
      </StyledSummaryTable>

      <StyledLink href={urls.companies.exports.history.index(companyId)}>
        View full export countries history
      </StyledLink>

      <H3>Export wins</H3>
      <p>
        <Link
          data-test-id="exportWinsLink"
          href={urls.external.exportWins()}
          target="_blank"
          aria-label="opens in a new tab"
        >
          Record your win
        </Link>{' '}
        on our Export Wins site
      </p>
      <Details summary="What is an Export Win">
        <p>
          Export wins capture the export deals that Department of International
          Trade (DIT) support and quantify their expected export value. If
          applicable, they also quantify the non-export and outward direct
          investment (ODI) value, up to a 5-year period. They give a picture of
          DIT support for business.
        </p>
        <p>
          The export win metric is currently the only way the department
          measures export activity.
        </p>
      </Details>
      <ExportWins companyId={companyId}></ExportWins>
    </>
  )
}

ExportsIndex.propTypes = {
  isArchived: PropTypes.bool.isRequired,
  exportWinCategory: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  greatProfile: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  exportPotential: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  exportCountriesInformation: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          id: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  exportPotentials: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  companyId: PropTypes.string.isRequired,
  companyNumber: PropTypes.string,
}

ExportsIndex.defaultProps = {
  companyNumber: null,
}

export default ExportsIndex
