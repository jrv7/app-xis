import Vue from 'vue'
import VueRouter from 'vue-router'
// import trainingRoutes from '@/training/router'
import loginRoutes from '@/login/router'
import adminRoutes from '@/admin/router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    ...loginRoutes,
    ...adminRoutes,
    // ...trainingRoutes 
  ]
});

router.beforeEach((to, from, next) => {
  const localAuth = localStorage.getItem("api_token") && localStorage.getItem("api_token") !== 'null';
  const sessionAuth = sessionStorage.getItem("api_token") && sessionStorage.getItem("api_token") !== 'null';
  const isAuthenticated = localAuth || sessionAuth;

  if (to.name !== "Login" && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === "Login" && isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next();
  }
});

export default router
