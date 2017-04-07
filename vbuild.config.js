const pkg = require('./package')

module.exports = {
  port: 5000,
  html: {
    title: pkg.description
  },
  transpileModules: ['babel-plugin-transform-vue-jsx'],
  postcss: {
    plugins: [
      require('postcss-nested')()
    ]
  }
}
