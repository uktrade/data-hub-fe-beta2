const path = require('path')
const { spawn } = require('child_process')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')

const config = require('./src/config')

/**
 * A webpack plugin that starts a node.js server after the assets are compiled.
 * This is a required step, because the node server is parsing manifest.json
 * when booting up.
 */
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

module.exports = (env) => ({
  devtool: config.isProd ? 'false' : 'source-map',
  mode: config.isProd ? 'production' : 'development',
  entry: {
    styles: './assets/stylesheets/application.scss',
    app: [
      './assets/javascripts/govuk-frontend-all.js',
      './assets/javascripts/app.js',
      './assets/javascripts/app-vue.js',
    ],
    'react-app': [
      'react-app-polyfill/ie9',
      'react-app-polyfill/stable',
      'details-element-polyfill',
      './src/client/index.jsx',
    ],
  },
  output: {
    path: config.buildDir,
    publicPath: '/',
    filename: config.isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  optimization: { sideEffects: false },
  plugins: [
    new MiniCssExtractPlugin({
      filename: config.isProd
        ? 'css/[name].[contenthash:8].css'
        : 'css/[name].css',
      chunkFilename: 'css/[name].[id].css',
    }),
    new VueLoaderPlugin(),
    new WebpackAssetsManifest(),
    env && env.backend ? StartServerAfterBuild() : undefined,
  ].filter(Boolean),
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'src', 'client', 'components'),
    ],
    alias: {
      vue$: 'vue/dist/vue.common.js',
    },
    extensions: ['*', '.tsx', '.ts', '.js', '.jsx', '.vue', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        // Packages "hex-rgb" and "set-harmonic-interval" are not transpiled to ES5 by default so we need to transpile them again.
        // See: https://stackoverflow.com/questions/51289261/babel-does-not-transpile-imported-modules-from-node-modules
        exclude: /node_modules\/(?!(.*(hex-rgb|set-harmonic-interval))\/).*/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: './babel_cache',
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[hash:8].[ext]',
      },
      {
        test: /\.(png|svg|jpe?g)$/,
        loader: [
          'file-loader?name=images/[name].[hash:8].[ext]',
          'image-webpack-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // the below loaders load in reverse order
          // 3. turns css into commonjs
          {
            loader: 'css-loader',
            options: {
              sourceMap: !config.isProd,
              importLoaders: 3,
              url: (url) => {
                const files = [
                  '/assets/images/icon-pointer.png',
                  '/assets/images/icon-pointer-2x.png',
                  '/assets/images/govuk-crest.png',
                  '/assets/images/govuk-crest-2x.png',
                ]

                return !files.some((file) => url.includes(file))
              },
            },
          },
          {
            loader: 'postcss-loader',
          },
          // 2. rewrites relative paths in url() statements based on the original source file
          'resolve-url-loader',
          // 1. turns sass into css
          {
            loader: 'sass-loader',
            options: { sourceMap: true }, // needed for resolve-url-loader
          },
        ],
      },
    ],
  },
  node: {
    fs: 'empty',
    child_process: 'empty',
    module: 'empty',
    net: 'empty',
    tls: 'empty',
  },
})
