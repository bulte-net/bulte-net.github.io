let voidElements = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]

function isVoidElement (tag) {
  const tagName = tag.match(/<([^\s>]+)/)
  return Boolean(tagName) && voidElements.indexOf(tagName[1].toLowerCase()) > -1
}

export default {
  strip (str) {
    return str.replace(/(<([^>]+)>)/gi, '')
  },

  map (str) {
    let regexp = /<[^>]+>/gi
    let tags = []
    let openers = []
    let result
    let tag

    while ((result = regexp.exec(str))) {
      tag = {
        tagName: result[0],
        position: result.index
      }

      if (tag.tagName.charAt(1) === '/') {
        tag.opener = openers.pop()
      } else if (tag.tagName.charAt(tag.tagName.length - 2) !== '/' && !isVoidElement(tag.tagName)) {
        openers.push(tag)
      }

      tags.push(tag)
    }

    return tags
  },

  inject (str, map) {
    for (let i = 0, tag; i < map.length; i++) {
      tag = map[i]

      if (str.length > 0 && tag.position <= str.length) {
        str = str.substr(0, tag.position) + tag.tagName + str.substr(tag.position)
      } else if (tag.opener && tag.opener.position < str.length) {
        str += tag.tagName
      }
    }

    return str
  }
}
