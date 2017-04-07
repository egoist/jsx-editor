const OfflinePlugin = require('offline-plugin')
const pkg = require('./package')

module.exports = {
  port: 5000,
  postcss: {
    plugins: [
      require('postcss-nested')()
    ]
  },
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
