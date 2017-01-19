const pkg = require('./package')

module.exports = {
  port: 5000,
  entry: 'JSXEditor.vue',
  html: {
    title: pkg.description
  },
  postcss: {
    plugins: [
      require('postcss-nested')()
    ]
  },
  webpack(config, options, webpack) {
    if (options.production && !options.lib) {
      // Split vendor code and app code
      config.entry.vendor = [
        'vue',
        'axios',
        'lodash.throttle',
        'prismjs',
        'vue-windows',
        'codemirror',
        'codemirror/mode/javascript/javascript',
        'codemirror/mode/jsx/jsx'
      ]
      config.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          names: ['vendor', 'manifest']
        })
      )
    }
    return config
  }
}
