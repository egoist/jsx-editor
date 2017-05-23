const OfflinePlugin = require('offline-plugin')

module.exports = options => ({
  // Disable sourceMap in production mode
  sourceMap: options.mode === 'development',
  presets: [
    require('poi-preset-offline')(),
    require('poi-preset-bundle-report')()
  ]
})
