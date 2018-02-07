import Vue from 'vue'
import Router from 'vue-router'
import Accounts from '@/components/pages/accounts'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path : '/',
      name : 'accounts',
      component : Accounts
    }
  ]
})
