import postcss from 'postcss'
import preset from 'postcss-preset-env'
import enhance from './postcss-enhance.mjs'
import prettify from 'postcss-prettify'

export default function styleTransform(options) {
  const { attrs = [], raw = '', tagName = '', context = '' } = options
  const scope = attrs?.find((i) => i.name === 'scope')?.value
  if (scope === 'global' && context === 'markup') {
    return raw
  } else if (scope === 'global' && context === 'template') {
    return ''
  } else if (context === 'markup') {
    return processBlock({ scopeTo: tagName, css: raw })
  } else {         // for context==='template' and any other case
    return raw
  }

  function processBlock({
    css = '',
    scopeTo = '',
    disabled = false,
  }) {
    if (disabled || !scopeTo) {
      return css
    }

    return postcss([
      preset({ stage: 4 }),
      enhance({ scopeTo }),
      prettify()
    ])
      .process(css, { from: 'undefined' })
      .toString()
  }
}

