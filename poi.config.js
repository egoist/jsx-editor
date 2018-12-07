const vueJsxVersion = require('babel-plugin-transform-vue-jsx/package').version
const babelVersion = require('@babel/standalone/package').version

module.exports = {
  chainWebpack(config) {
    config.module.set('noParse', /babel-standalone/)
  },
  envs: {
    VUE_JSX_VERSION: vueJsxVersion,
    BABEL_VERSION: babelVersion,
    // It's fine to be exposed :)
    APP_GH_TOKEN: '0b481a3c7fe634bdbb3bb16d1d157717959f67be'
  }
}
