import React, { useState } from 'react'
import * as d3 from 'd3'

// based on: https://codesandbox.io/s/r5wp0v08xq?file=/src/PieSVG.js
const Arc = ({ data, index, createArc, colors, format }) => (
  <g key={index} className="arc">
    <path className="arc" d={createArc(data)} fill={colors(index)} />
    <text
      transform={`translate(${createArc.centroid(data)})`}
      textAnchor="middle"
      alignmentBaseline="middle"
      fill="white"
      fontSize="10"
    >
      {format(data.value)}
    </text>
  </g>
)

const Pie = ({ innerRadius, outerRadius, width, height, dataset }) => {
  const createPie = d3
    .pie()
    .value((d) => d.value)
    .sort(null)
  const createArc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)
  const colors = d3.scaleOrdinal(d3.schemeCategory10)
  const format = d3.format('.2f')
  const data = createPie(dataset)

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${outerRadius} ${outerRadius})`}>
        {data.map((d, i) => (
          <Arc
            key={i}
            data={d}
            index={i}
            createArc={createArc}
            colors={colors}
            format={format}
          />
        ))}
      </g>
    </svg>
  )
}

const D3Experiment = () => {
  const [dataset, setDataset] = useState(() => [
    { label: 'one', value: 20 },
    { label: 'two', value: 50 },
    { label: 'three', value: 30 },
  ])

  return (
    <svg viewBox="0 0 300 150">
      <Pie
        innerRadius="30"
        outerRadius="70"
        width="300"
        height="150"
        dataset={dataset}
      />
    </svg>
  )
}

export default D3Experiment
