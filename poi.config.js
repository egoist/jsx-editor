const OfflinePlugin = require('offline-plugin')
const pkg = require('./package')

module.exports = {
  production: {
    sourceMap: false,
    webpack: {
      plugins: [
        new OfflinePlugin({
          ServiceWorker: {
            events: true
          },
          AppCache: {
            events: true
          }
        })
      ]
    }
  }
}
