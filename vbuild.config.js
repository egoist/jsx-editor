const pkg = require('./package')

module.exports = {
  port: 5000,
  html: {
    title: pkg.description
  },
  postcss: {
    plugins: [
      require('postcss-nested')()
    ]
  }
}
