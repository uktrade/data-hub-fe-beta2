const webpack = require('webpack')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'

const webpackConfig = {
  devtool: 'source-map',
  entry: {
    app: './src/javascripts/app.js',
    ie: ['html5shiv'],
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: './babel_cache',
        },
      },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build/javascripts'),
    filename: '[name].bundle.js',
  },
  plugins: [],
}

if (isProd) {
  webpackConfig.devtool = 'hidden-source-map'

  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: false,
      dead_code: true,
    }),
  )
}

module.exports = webpackConfig
