import Vue from 'vue'
import App from './JSXEditor.vue'

if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}

new Vue({
  el: '#app',
  render: h => h(App)
})