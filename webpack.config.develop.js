const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { spawn } = require('child_process')

const StartServerAfterBuild = () => ({
  apply: (compiler) => {
    compiler.plugin('done', () => {
      spawn('npm run watch:js:server', {
        stdio: 'inherit',
        shell: true,
      })
    })
  },
})

module.exports = {
  output: {
    filename: 'js/[name].js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  plugins: [new ExtractTextPlugin('css/[name].css'), StartServerAfterBuild()],
}
