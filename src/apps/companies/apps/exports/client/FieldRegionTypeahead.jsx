import React from 'react'
import { FieldTypeahead } from 'data-hub-components'
import defaultStyles from 'data-hub-components/dist/typeahead/styles'
import { GREY_2 } from 'govuk-colours'
import { FONT_SIZE } from '@govuk-react/constants'

const EVENTS = {
  CHANGE: 'input-change',
  BLUR: 'input-blur',
}

function createCountryOption(id, name) {
  return {
    label: name,
    value: id,
    country: true,
  }
}

function createRegionOption(id, name) {
  return {
    label: name,
    value: id,
    region: true,
  }
}

function createRegionOptions(countries) {
  const regionCountries = {}
  const noRegion = []

  for (const {
    id: countryId,
    name: countryName,
    overseas_region: region,
    diabled_on: disbled,
  } of countries) {
    if (disbled) {
      continue
    }

    if (region) {
      const { id: regionId, name: regionName } = region

      if (!regionCountries.hasOwnProperty(regionId)) {
        regionCountries[regionId] = { regionName, countryOptions: [] }
      }

      regionCountries[regionId].countryOptions.push(
        createCountryOption(countryId, countryName)
      )
    } else {
      noRegion.push(createCountryOption(countryId, countryName))
    }
  }

  return Object.entries(regionCountries)
    .reduce((acc, [regionId, { regionName, countryOptions }]) => {
      acc.push({
        id: regionId,
        name: regionName,
        countryOptions,
      })

      return acc
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((acc, { id, name, countryOptions }) => {
      acc.push(createRegionOption(id, name), ...countryOptions)

      return acc
    }, [])
    .concat(noRegion)
}

function createFilterLists(countries) {
  return {
    regions: countries.reduce((acc, { overseas_region: region }) => {
      if (region) {
        acc.push({ id: region.id, name: region.name.toLowerCase() })
      }
      return acc
    }, []),
    countries: countries.reduce(
      (acc, { id, name, overseas_region: region }) => {
        acc.push({
          id,
          name: name.toLowerCase(),
          regionId: region?.id,
        })

        return acc
      },
      []
    ),
  }
}

export default function RegionTypeahead({ countries, ...props }) {
  const filterLists = createFilterLists(countries)
  let matchIds

  function filterOption(option, value) {
    return value ? matchIds.includes(option.value) : true
  }

  function onInputChange(value, { action }) {
    if (action === EVENTS.CHANGE) {
      const lowerCaseValue = value.toLowerCase()
      matchIds = []

      filterLists.countries.forEach(({ id, name, regionId }) => {
        if (name.includes(lowerCaseValue)) {
          matchIds.push(id)
          if (regionId) {
            matchIds.push(regionId)
          }
        }
      })

      filterLists.regions.forEach(({ id, name }) => {
        if (!matchIds.includes(id) && name.includes(lowerCaseValue)) {
          matchIds.push(id)
        }
      })
    }
  }

  function onFocus() {
    matchIds = []
  }

  function optionStyles(styles, item, ...args) {
    const { value } = item
    const isCountry = filterLists.countries.some(
      (country) => country.id === value
    )
    if (isCountry) {
      styles = {
        ...styles,
        paddingLeft: '30px',
        '&:before': {
          content: '"Country: "',
          color: GREY_2,
          fontSize: FONT_SIZE.SIZE_14,
          position: 'relative',
          top: '-1px',
        },
      }
    }

    return defaultStyles.option(styles, item, ...args)
  }

  return (
    <FieldTypeahead
      options={createRegionOptions(countries)}
      filterOption={filterOption}
      onInputChange={onInputChange}
      onFocus={onFocus}
      styles={{ option: optionStyles }}
      {...props}
    />
  )
}
