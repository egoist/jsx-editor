const pkg = require('./package')

module.exports = {
  port: 5000,
  html: {
    title: pkg.description
  },
  transpileModules: ['babel-preset-vue'],
  postcss: {
    plugins: [
      require('postcss-nested')()
    ]
  }
}
