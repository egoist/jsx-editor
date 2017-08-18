import Vue from 'vue'
import router from './router'

new Vue({
  el: '#app',
  router,
  render() {
    return <router-view />
  }
})
