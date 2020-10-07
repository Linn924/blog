import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import './assets/css/atom-one-dark.css'

axios.defaults.baseURL='http://139.196.210.43:0924/'
// axios.defaults.baseURL='http://127.0.0.1:8888/'

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})


Vue.prototype.$http = axios
Vue.config.productionTip = false


//解决路由跳转报错（Avoided redundant navigation to current location ）
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

//处理时间格式的过滤器
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
