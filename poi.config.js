const OfflinePlugin = require('offline-plugin')

module.exports = options => ({
  // Disable sourceMap in production mode
  sourceMap: options.mode === 'development',
  extendWebpack(config) {
    config.module.noParse.add(/babel-standalone/)
  },
  presets: [
    require('poi-preset-offline')({
      pluginOptions: {
        excludes: ['_redirects']
      }
    }),
    require('poi-preset-bundle-report')()
  ]
})
