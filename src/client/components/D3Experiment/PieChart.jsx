import React from 'react'
import * as d3 from 'd3'

// based on: https://codesandbox.io/s/r5wp0v08xq?file=/src/PieSVG.js

// This is for an individual segment of the pie chart
// TODO: explore accessibility - e.g. make it keyboard navigable
const Arc = ({ data, index, createArc, colors, format, onSelectSegment }) =>
  data.value > 0 && (
    <g key={index} className="arc" onClick={() => onSelectSegment(data.index)}>
      {/* the d attribute in the path is the series of commands defining its shape - d3's main magic is calculating these for us! */}
      <path className="arc" d={createArc(data)} fill={colors(index)} />
      {/* text is optional - not sure if it's helpful or not */}
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

const PieChart = ({
  innerRadius,
  outerRadius,
  width,
  height,
  dataset,
  onSelectSegment,
}) => {
  // Returns the function d3 uses to calculate pie chart geometry
  const createPie = d3
    .pie()
    .value((data) => data[1].count) // could be made clearer with a tidier DH API response design
    .sort(null)

  // Returns a function defining the svg path used in each piechart segment
  const createArc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)

  // Could replace d3.schemeCategory10 with an array of GovUK colours
  const colors = d3.scaleOrdinal(d3.schemeCategory10)

  // How numbers are rendered (here with nothing after a decimal point)
  const format = d3.format('')

  // Calls the function we defined above, with our current data
  const data = createPie(dataset)

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${outerRadius} ${outerRadius})`}>
        {data.map((d, i) => (
          <Arc
            key={`pie-arc-${i}`}
            data={d}
            index={i}
            createArc={createArc}
            colors={colors}
            format={format}
            onSelectSegment={onSelectSegment}
          />
        ))}
      </g>
    </svg>
  )
}

export default PieChart
