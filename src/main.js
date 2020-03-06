import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
// import './assets/fonts/iconfont'
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  if (window.sessionStorage.getItem('token')) {
    config.headers.Authorization = window.sessionStorage.getItem('token')
  }
  return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
