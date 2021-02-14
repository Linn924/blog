const Home = () => import(/* webpackChunkName: "home" */'../components/Home.vue')
const ArticleList = () => import(/* webpackChunkName: "articlelist" */'../components/dynamic/ArticleList.vue')
const Article = () => import(/* webpackChunkName: "article" */'../components/dynamic/Article.vue')
const Login = () => import(/* webpackChunkName: "login" */'../components/dynamic/Login.vue')
const Register = () => import(/* webpackChunkName: "register" */'../components/dynamic/Register.vue')
const ReSetPwd = () => import(/* webpackChunkName: "resetpwd" */'../components/dynamic/ReSetPwd.vue')
const PersonalCenter = () => import(/* webpackChunkName: "personalcenter" */'../components/dynamic/PersonalCenter.vue')
const NotFound = () => import(/* webpackChunkName: "notfound" */'../components/dynamic/NotFound.vue')

Vue.use(VueRouter)

const routes = [
  { path: '*', component: NotFound },
  { path:'/', redirect: '/home' },
  { path: '/home', 
    redirect: '/articlelist', 
    component: Home,
    children:[
      { path:'/articlelist', component:ArticleList},
      { path:'/article', component:Article}
    ]
  },
  { path:'/login', component:Login },
  { path:'/register', component:Register },
  { path:'/resetpwd', component:ReSetPwd },
  { path:'/personalcenter', component:PersonalCenter }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path === '/personalcenter' && !sessionStorage.getItem('token')){
    next('/login')
  }else{
    next()
  }
})

export default router
