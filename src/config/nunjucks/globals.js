const nunjucks = require('nunjucks')
const { assign, omit, isFunction, map } = require('lodash')
const queryString = require('qs')
const config = require('../')
const urls = require('../../lib/urls')

module.exports = {
  serviceTitle: 'Data Hub',
  projectPhase: config.projectPhase,
  description: 'Data Hub is a customer relationship, project management and analytical tool for Department for International Trade.',
  feedbackLink: '/support',
  findExportersUrl: config.findExportersUrl,

  assign,
  urls,

  callAsMacro (name) {
    const macro = this.ctx[name]

    if (!isFunction(macro)) { return }

    return macro
  },

  // Constructs macro from a specially formatted object or array of objects:
  // { MacroName: { prop1: 'A', prop2: 'B' } }
  applyMacro (config, sharedProps) {
    function renderMacro (macroConfig) {
      return map(macroConfig, (props, name) => {
        const macro = this.env.globals.callAsMacro.call(this, name)

        if (!macro) { return }

        return macro({ ...sharedProps, ...props })
      })[0]
    }

    if (Array.isArray(config)) {
      const macroOutputs = config.map(renderMacro.bind(this))
      return new nunjucks.runtime.SafeString(macroOutputs.join('\r'))
    }

    return renderMacro.call(this, config)
  },

  // Renders macro with object passed as props
  // { macroName: 'TextField', type: 'textarea', modifier: 'small' }
  renderAsMacro (config, additionalProps) {
    function renderMacro (props = {}) {
      const macroName = props.macroName
      if (!macroName) { return }

      const macro = this.env.globals.callAsMacro.call(this, macroName)
      if (!isFunction(macro)) {
        throw Error(`${macroName} macro not found`)
      }

      return macro({ ...props, ...additionalProps })
    }

    if (Array.isArray(config)) {
      const macroOutputs = config.map(renderMacro.bind(this))
      return new nunjucks.runtime.SafeString(macroOutputs.join('\r'))
    }

    return renderMacro.call(this, config)
  },

  buildQuery (query = {}, include = {}, excludeKeys = []) {
    return queryString.stringify(Object.assign(
      include,
      omit(query, [...excludeKeys], 'page'),
    ))
  },
}
