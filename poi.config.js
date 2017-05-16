const OfflinePlugin = require('offline-plugin')

module.exports = options => ({
  // Disable sourceMap in production mode
  sourceMap: options.mode === 'development',
  extendWebpack(config) {
    // Enable pwa support in production mode
    if (options.mode === 'production') {
      config.plugin('offline')
        .use(OfflinePlugin, [{
          ServiceWorker: {
            events: true
          },
          AppCache: {
            events: true
          }
        }])
    }
  }
})
