function highlight (str, words) {
  if (!words) { return str }

  const queryWords = words.split(' ').filter((word) => word.length >= 1)
  const start = '~'
  const end = '§'
  const openTag = '<span class=\'highlight\'>'
  const closeTag = '</span>'

  queryWords.forEach((word) => {
    const iQuery = new RegExp(word, 'ig')
    str = str.replace(iQuery, (matchedTxt) => {
      return (start + matchedTxt + end)
    })
  })

  str = str.replace(new RegExp(start, 'g'), openTag).replace(new RegExp(end, 'g'), closeTag)
  return str
}

module.exports = {
  highlight,
}
