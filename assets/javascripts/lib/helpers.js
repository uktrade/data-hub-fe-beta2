/* eslint no-useless-escape: 0 */
const regularExp1 = '(\\s|^)'
const regularExp2 = '(\\s|$)'

function addClass (element, className) {
  if (!element) return
  if (isNodeList(element)) {
    for (let pos = element.length - 1; pos > -1; pos -= 1) {
      addClass(element.item(pos), className)
    }
  } else if (element.classList) {
    element.classList.add(className)
  } else if (!hasClass(element, className)) {
    element.className += ' ' + className
  }
}

function removeClass (element, className) {
  if (!element) return
  if (isNodeList(element)) {
    for (let pos = element.length - 1; pos > -1; pos -= 1) {
      removeClass(element.item(pos), className)
    }
  } else if (element.classList) {
    element.classList.remove(className)
  } else if (hasClass(element, className)) {
    const regClass = new RegExp(regularExp1 + className + regularExp2)
    element.className = element.className.replace(regClass, ' ')
  }
}

function hasClass (element, className) {
  if (!element) return
  if (element.classList) {
    return element.classList.contains(className)
  }
  return element.className.match(new RegExp(regularExp1 + className + regularExp2))
}

function toggleClass (element, className) {
  if (!element) return
  if (isNodeList(element)) {
    for (let pos = element.length - 1; pos > -1; pos -= 1) {
      toggleClass(element.item(pos), className)
    }
  } else if (hasClass(element, className)) {
    removeClass(element, className)
  } else {
    addClass(element, className)
  }
}

/**
 * generateId
 *
 * Create an ID string unique enough to use as an element ID in a page.
 * The prefix is required as ID's cannot start with a number or a hyphen
 *
 * @param {string} prefix
 * @returns {string} a unique string to use to indentify an element
 */
function generateID (prefix) {
  const _prefix = (prefix && prefix.length > 0) ? prefix : 'dh'
  return `${_prefix}-${Math.floor(Math.random() * 1000000) + 1}`
}

function isNodeList (nodes) {
  const stringRepr = Object.prototype.toString.call(nodes)

  return typeof nodes === 'object' &&
    /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
    (typeof nodes.length === 'number') &&
    (nodes.length === 0 || (typeof nodes[0] === 'object' && nodes[0].nodeType > 0))
}

function findDoc (el) {
  while (el.parentNode) {
    el = el.parentNode
  }
  return el
}

function insertAfter (newElement, targetElement) {
  // target is what you want it to go after. Look for this elements parent.
  const parent = targetElement.parentNode

  // if the parents lastchild is the targetElement...
  if (parent.lastChild === targetElement) {
    // add the newElement after the target element.
    parent.appendChild(newElement)
  } else {
    // else the target has siblings, insert the new element between the target and it's next sibling.
    parent.insertBefore(newElement, targetElement.nextSibling)
  }
}

function hide (element) {
  addClass(element, 'u-hidden')
  element.setAttribute('aria-hidden', true)
}

function show (element) {
  removeClass(element, 'u-hidden')
  element.setAttribute('aria-hidden', false)
}

function createElementFromMarkup (markup, docToCreateIn) {
  const documentRef = docToCreateIn || document
  let tmp = documentRef.createElement('body')
  tmp.innerHTML = markup
  return tmp.firstElementChild
}

function removeElement (element) {
  if (!element) return
  element.parentNode.removeChild(element)
}

/**
 * resetFieldValues
 *
 * Scans the content of a dom fragment for fields
 * and resets their values back to nothing.
 *
 * Useful when copying fields to use as new fields
 *
 * @param {nodeElement} fragment
 *
 * @returns {nodeElement}
 */
function resetFieldValues (element) {
  Array.from(element.querySelectorAll('option:checked'))
    .forEach(selectedElement => {
      selectedElement.selected = false
    })

  Array.from(element.querySelectorAll('input:checked'))
    .forEach(checkedElement => {
      checkedElement.checked = false
    })

  Array.from(element.querySelectorAll('input[type="text"], textarea'))
    .forEach(textField => {
      textField.value = ''
    })

  Array.from(element.querySelectorAll('select'))
    .forEach(field => {
      field.selectedIndex = 0
    })

  return element
}

/**
 * regenIds
 * *
 * Get all the all the elements in a fragment that have an ID
 * attribute, generate a new one to replace it and look for related
 * label tags to update their 'for' attribute
 *
 * @param {nodeElement} wrapper
 *
 * @returns {nodeElement}
 */
function regenIds (wrapper, attr = 'id') {
  Array
    .from(wrapper.querySelectorAll('*[id]'))
    .forEach((element) => {
      const oldId = element[attr]

      // If the element has a name, use that as part of the new ID
      const item = element[attr] || ''
      const newItem = generateID(item)

      element[attr] = newItem

      const relatedLabel = wrapper.querySelector(`[for="${oldId}"]`)
      if (relatedLabel) {
        relatedLabel.setAttribute('for', newItem)
      }
    })

  return wrapper
}

function closest (element, selector) {
  if (!element) {
    return
  }

  if (!element.matches) {
    element.prototype.matches = element.prototype.msMatchesSelector || element.prototype.webkitMatchesSelector
  }

  let parent

  // traverse parents
  while (element) {
    parent = element.parentElement
    if (parent && parent.matches(selector)) {
      return parent
    }
    element = parent
  }

  return null
}

/**
 * matchWords
 *
 * breaks your search query into an array containing a word/character or words/characters
 * loops through your array and increments a count whenever it gets a match
 * returns true when the count value matches the array length
 * Useful when doing a fuzzy search on a string
 *
 * @param {string} str is the data to search on
 * @param {string} words is your query
 *
 * @returns {boolean}
 */

function matchWords (str, words) {
  const queryWords = words.split(' ')
  const count = queryWords.reduce((allWords, word) => {
    if (str.search(new RegExp(word, 'i')) !== -1) {
      allWords++
    }
    return allWords
  }, 0)

  return queryWords.length === count
}

module.exports = {
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  generateID,
  isNodeList,
  findDoc,
  insertAfter,
  hide,
  show,
  createElementFromMarkup,
  removeElement,
  regenIds,
  resetFieldValues,
  closest,
  matchWords,
}
