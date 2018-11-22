function highlight (str, words) {
  if (!words) { return str }

  const queryWords = words.split(' ').filter((word) => word.length >= 1)
  const openTag = '<span class=\'highlight\'>'
  const closeTag = '</span>'

  queryWords.forEach((word) => {
    const iQuery = new RegExp('(' + word + ')(?![^<]*>|[^<>]*</)', 'ig')
    str = str.replace(iQuery, (matchedTxt) => {
      return (openTag + matchedTxt + closeTag)
    })
  })
  return str
}

module.exports = {
  highlight,
}
