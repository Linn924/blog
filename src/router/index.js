const Blog = () => import( /* webpackChunkName: "blog_content_template" */ '../components/Blog.vue')
// import Content from '../components/Blog/Content.vue'
const Content = () => import( /* webpackChunkName: "blog_content_template" */ '../components/Content.vue')
// import Template from '../components/Blog/Template.vue'
const Template = () => import( /* webpackChunkName: "blog_content_template" */ '../components/Template.vue')

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
      { path: '/template', component: Template }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
