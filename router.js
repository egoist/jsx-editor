import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    component: () => import('./JSXEditor.vue'),
    name: 'home'
  }, {
    path: '/gist/:id',
    component: () => import('./JSXEditor.vue'),
    name: 'gist'
  }]
})
