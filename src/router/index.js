import Vue from 'vue'
import Router from 'vue-router'
import Accounts from '@/components/pages/accounts'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path : '/',
      redirect : '/accounts'
    },
    {
      path : '/accounts',
      name : 'accounts',
      component : Accounts
    }
  ]
})
