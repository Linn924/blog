import App from './App.vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './assets/css/global.css'
import './assets/css/atom-one-dark.css'
import './assets/js/clickLove'
import './assets/js/ribbon'

axios.defaults.baseURL='http://139.196.210.43:0926/'
// axios.defaults.baseURL='http://127.0.0.1:8888/'

axios.interceptors.request.use(config => {
  let url = config.url
  let flag = url == 'blogs' || url.includes('comments') || url == 'blogsBySort' || url == 'blogsByLabel'
  flag && NProgress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.axios = axios
Vue.config.productionTip = false

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.directive('highlight', el => {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

Vue.filter('date', function (originVal) {
  const t = new Date(originVal)
  const y = t.getFullYear()
  const m = (t.getMonth() + 1 + '').padStart(2, '0')
  const d = (t.getDate() + '').padStart(2, '0')
  const hh = (t.getHours() + '').padStart(2, '0')
  const mm = (t.getMinutes() + '').padStart(2, '0')
  const ss = (t.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
