import React, { useState } from 'react'
import axios from 'axios'

import QuotesWidget from './QuotesWidget'
import OrdersWidget from './OrdersWidget'

const getQuotes = (data) => {
  let quotes = []
  // This bit below could be tidied up with some more time taken on API design
  Object.values(data).forEach((orders) => {
    for (const item of orders.items) {
      item.quote && quotes.push(item)
    }
  })
  return quotes
}

const D3Experiment = () => {
  const [dataset, setDataset] = useState([])
  const [selectedArc, setSelectedArc] = useState()
  const [quotes, setQuotes] = useState([])

  React.useEffect(() => {
    axios.get('/api-proxy/v3/omis/order/status').then(({ data }) => {
      // yuk - this is like this because I don't have time now to update the API to something that is more straightforward to process
      setDataset(Object.entries(data).filter((d) => d[1].percent > 0))
      setQuotes(getQuotes(data))
    })
  }, [])

  const onSelectSegment = (index) =>
    selectedArc == index ? setSelectedArc(null) : setSelectedArc(index)

  return (
    <>
      {quotes && <QuotesWidget quotes={quotes} />}
      <OrdersWidget
        dataset={dataset}
        onSelectSegment={onSelectSegment}
        selectedArc={selectedArc}
      />
    </>
  )
}

export default D3Experiment
