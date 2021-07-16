/* eslint-disable camelcase */
const { assign, capitalize, forEach, get, mapKeys, pickBy } = require('lodash')
const { formatDate, isUnparsedDateValid } = require('../../common/date')

const { transformDateObjectToDateString } = require('../transformers')
const {
  transformFilesResultsToDetails,
  transformLabelsToShowFiles,
} = require('../documents/transformers')
const labels = require('./labels')
const { PROPOSITION_STATE } = require('./constants')

function transformPropositionResponseToForm({
  id,
  adviser,
  name,
  scope,
  deadline,
  investment_project,
} = {}) {
  if (!id) return null

  const isValidDate = isUnparsedDateValid(new Date(deadline))

  return {
    id,
    name,
    scope,
    adviser: get(adviser, 'id'),
    deadline: {
      day: isValidDate ? formatDate(deadline, 'dd') : '',
      month: isValidDate ? formatDate(deadline, 'MM') : '',
      year: isValidDate ? formatDate(deadline, 'yyyy') : '',
    },
    investment_project: get(investment_project, 'id'),
  }
}

function transformPropositionToListItem({
  id,
  name,
  scope,
  deadline,
  created_on,
  adviser,
  status,
}) {
  return {
    id,
    type: 'proposition',
    name: name || 'No subject',
    scope: scope || 'No scope',
    meta: [
      {
        label: 'Type',
        type: 'badge',
        value: PROPOSITION_STATE[status],
      },
      {
        label: 'Deadline',
        value: deadline,
        type: 'date',
      },
      {
        label: 'Created On',
        value: created_on,
        type: 'date',
      },
      {
        label: 'Adviser',
        value: adviser,
      },
    ],
  }
}

function formatDetails(details = '') {
  if (details.length) {
    return getParagraph(details)
  }
}

function getStringList(string) {
  const separators = [' ', '\r', '\n']
  return string.split(new RegExp(separators.join('|'), 'g'))
}

/**
 * Returns a list of indexes where the string matches the url pattern (http, www, ftp)
 * @param list
 * @returns {Array}
 */
function getUrlListIndexes(list = []) {
  const indexes = []

  forEach(list, (item, index) => {
    const isUrl =
      item.startsWith('https://') ||
      item.startsWith('http://') ||
      item.startsWith('ftp://') ||
      item.startsWith('www.')

    if (isUrl) {
      indexes.push(index)
    }
  })

  return indexes
}

/**
 * Returns a collection with two types of objects:
 *  1. link - that matches the url pattern
 *  2. paragraph - string resulting from the union of the list elements between the 'link' type objects
 *
 * if any urls found,
 * concatenate the strings from the list in scope from next index
 * after the url index (item + 1) upto the next url position (indexes[index + 1])
 *
 * @param string
 * @returns {Array}
 */
function getParagraph(string) {
  const paragraph = []
  const stringList = getStringList(string)
  const indexes = getUrlListIndexes(stringList)

  /**

   */
  if (indexes.length) {
    forEach(indexes, (item, index) => {
      const sliceEnd = indexes[index + 1]
        ? indexes[index + 1]
        : stringList.length
      const paragraphItem = getParagraphItem(
        getStringSlice(stringList, item + 1, sliceEnd)
      )

      /**
       *  if text doesn't start with a link,
       *  concatenate the strings from the list in scope from beginning to the `item` index position
       */
      if (indexes[0] !== 0 && index === 0) {
        paragraph.push({
          type: 'paragraph',
          value: getStringSlice(stringList, 0, item),
        })
      }

      paragraph.push({
        type: 'link',
        value: {
          url: stringList[item],
          name: stringList[item],
        },
      })

      if (paragraphItem) {
        paragraph.push(paragraphItem)
      }
    })

    /**
     * else text has no urls
     */
  } else {
    paragraph.push({
      type: 'paragraph',
      value: string,
    })
  }

  return paragraph
}

function getParagraphItem(value = '') {
  if (value.length) {
    return {
      type: 'paragraph',
      value,
    }
  }
}

function getStringSlice(string, start = 0, end = string.length) {
  return string.slice(start, end).join(' ')
}

function transformPropositionResponseToViewRecord({
  scope,
  status,
  created_on,
  modified_on,
  deadline,
  adviser,
  details,
  files = {},
  id,
  investment_project,
}) {
  const detailLabels = labels.proposition
  const formattedDetails = formatDetails(details)
  const transformed = {
    scope: capitalize(scope),
    status: capitalize(status),
    created_on: {
      type: 'date',
      name: created_on,
    },
    modified_on: {
      type: 'date',
      name: modified_on,
    },
    deadline: {
      type: 'date',
      name: deadline,
    },
    adviser,
    details: formattedDetails
      ? {
          type: 'paragraph',
          value: formattedDetails,
        }
      : null,
    ...transformFilesResultsToDetails(files.results, id, investment_project.id),
  }

  return pickBy(
    mapKeys(transformed, (value, key) =>
      transformLabelsToShowFiles(key, detailLabels)
    )
  )
}

function transformPropositionFormBodyToApiRequest(props) {
  return assign({}, props, {
    deadline: transformDateObjectToDateString('deadline')(props),
  })
}

function transformPropositionListItemToHaveUrlPrefix(urlPrefix) {
  return function (item) {
    if (!urlPrefix) return item
    return assign({}, item, {
      urlPrefix:
        urlPrefix.charAt(0) === '/' ? urlPrefix.substring(1) : urlPrefix,
    })
  }
}

module.exports = {
  transformPropositionResponseToForm,
  transformPropositionToListItem,
  transformPropositionFormBodyToApiRequest,
  transformPropositionResponseToViewRecord,
  transformPropositionListItemToHaveUrlPrefix,
}
