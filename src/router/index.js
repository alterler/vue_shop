import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import User from '../components/user/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Role'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import List from '../components/goods/List'
import Add from '../components/goods/Add'
import Order from '../components/order/Order'
import Reports from '../components/reports/Reports'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  children: [{
    path: '/users',
    component: User
  },
  {
    path: '/rights',
    component: Rights
  },
  {
    path: '/roles',
    component: Roles
  },
  {
    path: '/categories',
    component: Cate
  },
  {
    path: '/params',
    component: Params
  },
  {
    path: '/goods',
    component: List
  },
  {
    path: '/goods/add',
    component: Add
  },
  {
    path: '/orders',
    component: Order
  },
  {
    path: '/reports',
    component: Reports
  }
  ]
}
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 检查是否为登录状态
  var token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
