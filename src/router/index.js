import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import Home from '../views/Home.vue'
import Papers from '../views/Papers.vue'
import PaperDetails from '../views/PaperDetails.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Bookmarks from '../views/Bookmarks.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UserDetails from '../views/UserDetails.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/papers',
      name: 'papers',
      component: Papers,
      meta: { hideNavbar: true }
    },
    {
      path: '/papers/:id',
      name: 'paper-details',
      component: PaperDetails
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: Bookmarks
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard
    },
    {
      path: '/admin/users/:id',
      name: 'user-details',
      component: UserDetails
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin')) {
    const userStore = useUserStore()
    const role = userStore.currentUser?.role
    if (!userStore.currentUser || (role !== 'admin' && role !== 'root')) {
      // Redirect to login if not authenticated or not an admin
      return next({ name: 'login' })
    }
  }
  next()
})

export default router