const Blog = () => import( /* webpackChunkName: "blog_content_Article_me" */ '../components/Blog.vue')
const Content = () => import( /* webpackChunkName: "blog_content_Article_me" */ '../components/Content.vue')
const Article = () => import( /* webpackChunkName: "blog_content_Article_me" */ '../components/Article.vue')
const Me = () => import(/* webpackChunkName: "blog_content_Article_me" */ '../components/Me.vue')

Vue.use(VueRouter)

const routes = [
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
  routes
})

export default router
