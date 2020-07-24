const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  output: {
    filename: 'js/[name].js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  plugins: [new ExtractTextPlugin('css/[name].css')],
}
