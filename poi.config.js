const vueJsxVersion = require('babel-plugin-transform-vue-jsx/package').version
const babelVersion = require('@babel/standalone/package').version

const isProd = process.env.POI_COMMAND === 'build'

module.exports = {
  // Disable sourceMap in production mode
  sourceMap: !isProd,
  chainWebpack(config) {
    config.module.set('noParse', /babel-standalone/)
  },
  envs: {
    VUE_JSX_VERSION: vueJsxVersion,
    BABEL_VERSION: babelVersion,
    // Read from netlify
    APP_GH_TOKEN: process.env.APP_GH_TOKEN
  }
}
