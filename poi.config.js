const OfflinePlugin = require('offline-plugin')
const vuePresetVersion = require('babel-preset-vue/package').version
const babelVersion = require('@babel/standalone/package').version

module.exports = options => ({
  // Disable sourceMap in production mode
  sourceMap: options.mode === 'development',
  extendWebpack(config) {
    config.module.set('noParse', /babel-standalone/)
  },
  presets: [
    require('poi-preset-offline')({
      pluginOptions: {
        excludes: ['_redirects']
      }
    }),
    require('poi-preset-bundle-report')()
  ],
  env: {
    VUE_PRESET_VERSION: vuePresetVersion,
    BABEL_VERSION: babelVersion
  }
})
