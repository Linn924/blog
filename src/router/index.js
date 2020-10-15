const Blog = () => import( /* webpackChunkName: "blog_content_Article_me_NotFound" */ '../components/Blog.vue')
const Content = () => import( /* webpackChunkName: "blog_content_Article_me_NotFound" */ '../components/Content.vue')
const Article = () => import( /* webpackChunkName: "blog_content_Article_me_NotFound" */ '../components/Article.vue')
const Me = () => import(/* webpackChunkName: "blog_content_Article_me_NotFound" */ '../components/Me.vue')
const NotFound = () => import(/* webpackChunkName: "blog_content_Article_me_NotFound" */'../components/NotFound.vue')

Vue.use(VueRouter)

const routes = [
  { path: '*', component: NotFound },
  {
    path: '/',
    redirect: '/blog'
  },
  {
    path: '/blog',
    component: Blog,
    redirect: '/content',
    children: [
      { path: '/content', component: Content },
      { path: '/article', component: Article },
      { path: '/me', component: Me },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
