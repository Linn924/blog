const Home = () => import(/* webpackChunkName: "home" */'../components/Home.vue')
const ArticleList = () => import(/* webpackChunkName: "articlelist" */'../components/ArticleList.vue')
const Article = () => import(/* webpackChunkName: "article" */'../components/Article.vue')

const Login = () => import(/* webpackChunkName: "login" */'../components/function/Login.vue')
const Register = () => import(/* webpackChunkName: "register" */'../components/function/Register.vue')
const ReSetPwd = () => import(/* webpackChunkName: "resetpwd" */'../components/function/ReSetPwd.vue')
const PersonalCenter = () => import(/* webpackChunkName: "personalcenter" */'../components/function/PersonalCenter.vue')

const NotFound = () => import(/* webpackChunkName: "notfound" */'../components/basic/NotFound.vue')

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
