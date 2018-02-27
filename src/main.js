// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import InstallMessage from './components/common/message/message';
import InstallFormBox from './components/common/formBox/formBox';
Vue.config.productionTip = false

Vue.use(InstallMessage);
Vue.use(InstallFormBox);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
