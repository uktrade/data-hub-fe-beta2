import React from 'react'

import { Main } from 'govuk-react'
import LocalHeader from '../../../../../client/components/LocalHeader.jsx'

import { dashboard, investments } from '../../../../../lib/urls'

const InvestmentProjectAdmin = ({ id, name }) => (
  <>
    <LocalHeader
      heading={'Change the project stage'}
      breadcrumbs={[
        { link: dashboard(), text: 'Home' },
        { link: investments.index(), text: 'Investments' },
        { link: investments.projects.index(), text: 'Projects' },
        { link: investments.projects.project(id), text: name },
        { text: 'Admin' },
      ]}
    />
    <Main></Main>
  </>
)

export default InvestmentProjectAdmin
