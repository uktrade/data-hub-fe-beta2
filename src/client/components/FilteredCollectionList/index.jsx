/* eslint-disable react/no-array-index-key */
// this is because there isn't necessarily a unique id to use as the key

import React from 'react'
import PropTypes from 'prop-types'

import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import Task from '../Task'

import CollectionSort from '../CollectionList/CollectionSort'
import CollectionItem from '../CollectionList/CollectionItem'
import RoutedDownloadDataHeader from '../RoutedDownloadDataHeader'
import RoutedPagination from '../RoutedPagination'

import FilteredCollectionHeader from './FilteredCollectionHeader'

const FilteredCollectionList = ({
  results = [],
  itemsPerPage = 10,
  sortOptions = null,
  taskProps,
  count = 0,
  isComplete,
  children,
  collectionName,
  activePage = 1,
  maxItemsToDownload,
  selectedFilters,
  baseDownloadLink,
}) => {
  const totalPages = Math.ceil(count / itemsPerPage)
  return (
    <GridRow>
      {children}
      <GridCol setWidth="two-thirds">
        <article>
          {isComplete && (
            <FilteredCollectionHeader
              totalItems={count}
              collectionName={collectionName}
              selectedFilters={selectedFilters}
            />
          )}
          {sortOptions && (
            <CollectionSort sortOptions={sortOptions} totalPages={count} />
          )}
          <RoutedDownloadDataHeader
            count={count}
            maxItems={maxItemsToDownload}
            data-test="download-data-header"
            baseDownloadLink={baseDownloadLink}
          />
          <Task.Status {...taskProps}>
            {() =>
              isComplete && (
                <>
                  {results.map((item, i) => (
                    <CollectionItem {...item} key={i} />
                  ))}
                  <RoutedPagination
                    qsParamName="page"
                    totalPages={totalPages}
                    activePage={activePage}
                  />
                </>
              )
            }
          </Task.Status>
        </article>
      </GridCol>
    </GridRow>
  )
}

FilteredCollectionList.propTypes = {
  taskProps: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    progressMessage: PropTypes.string,
    startOnRender: PropTypes.shape({
      payload: PropTypes.shape({
        page: PropTypes.number,
        filters: PropTypes.object,
        search: PropTypes.string,
      }).isRequired,
      onSuccessDispatch: PropTypes.string,
    }).isRequired,
  }),
  isComplete: PropTypes.bool,
  children: PropTypes.node,
  collectionName: PropTypes.string,
  router: PropTypes.shape({
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired,
    }),
  }),
  maxItemsToDownload: PropTypes.number,
  selectedFilters: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
}

export default FilteredCollectionList
