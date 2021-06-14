import axios from 'axios'

const HQ_TYPE_LABELS = {
  ukhq: 'UK HQ',
  ghq: 'Global HQ',
  ehq: 'European HQ',
}

/**
 * Get metadata options as a list of values and labels
 */
const getMetadataOptions = (url) =>
  axios
    .get(url)
    .then(({ data }) =>
      data.map(({ id, name }) => ({ value: id, label: name }))
    )

/**
 * Get the hq type options as a list of values and labels
 */
const getHeadquarterTypeOptions = (url) =>
  getMetadataOptions(url).then((items) =>
    items
      .map(({ value, label }) => ({
        value,
        label: HQ_TYPE_LABELS[label] || label,
      }))
      .sort((item1, item2) => (item1.label > item2.label ? 1 : -1))
  )

/**
 * Get the top-level sector options as a list of values and labels
 *
 * Specifying a searchString uses the autocomplete feature to only show
 * matching results.
 */
const getSectorOptions = (url, searchString) =>
  axios
    .get(url, {
      params: searchString ? { autocomplete: searchString } : {},
    })
    .then(({ data }) =>
      data
        .filter(({ level }) => level === 0)
        .map(({ id, name }) => ({ value: id, label: name }))
    )

export { getMetadataOptions, getHeadquarterTypeOptions, getSectorOptions }
