import React, { useState } from 'react'
import Chart from '../Chart'

const InvestmentProjectSummary = () => {
  // Todo: remove after task component is set up
  const data = [
    {
      date: '2021',
      results: [
        {
          key: 'Prospect',
          param: 1,
          value: 2,
        },
        {
          key: 'Assigned',
          param: 2,
          value: 3,
        },
        {
          key: 'Active',
          param: 3,
          value: 2,
        },
        {
          key: 'Verfiy win',
          param: 4,
          value: 2,
        },
        {
          key: 'Won',
          param: 5,
          value: 2,
        },
      ],
    },
    {
      date: '2020',
      results: [
        {
          key: 'Prospect',
          param: 1,
          value: 14,
        },
        {
          key: 'Assigned',
          param: 2,
          value: 3,
        },
        {
          key: 'Active',
          param: 3,
          value: 19,
        },
        {
          key: 'Verfiy win',
          param: 4,
          value: 2,
        },
        {
          key: 'Won',
          param: 5,
          value: 10,
        },
      ],
    },
  ]

  const [projectsData, setProjectsData] = useState(data[0])

  const onChange = (e) => {
    const [selectedProjects] = data.filter(
      ({ date }) => date === e.target.value
    )
    setProjectsData(selectedProjects)
  }

  return (
    <Chart
      title="My project summary"
      sortName="sortBy"
      sortLabel="Date range"
      sortOptions={[
        { label: 'Current financial year', value: '2021' },
        { label: '2019-2020', value: '2020' },
      ]}
      subject="Projects"
      description="Projects in the current financial year"
      headers={['Stage', 'Amount']}
      name="stage"
      url="/investments/projects"
      onChange={onChange}
      data={projectsData}
    />
  )
}

export default InvestmentProjectSummary
