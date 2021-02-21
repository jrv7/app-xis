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
    {
      path: '/splash',
      name: 'SplashScreen',
      component: () => import('@/SplashScreen.vue' ),
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
    sessionStorage.setItem("accessed-main-menu", to.params.mainMenuId);
    sessionStorage.setItem("accessed-menu", to.params.submenuId);

    if (from) {
      if (from.name) {
        if (from.params) {
          if (from.params.mainMenuId) {
            if (from.params.submenuId) {
              sessionStorage.setItem("last-accessed-main-menu-hash", from.params.mainMenuId);
              sessionStorage.setItem("last-accessed-menu-hash", from.params.submenuId);
              sessionStorage.setItem("last-accessed-menu-name", from.name);
              sessionStorage.setItem("last-accessed-menu-ids", (from.params.ids || '-0:0-'));
            }
          }
        }
      }
    }

    next();
  }
});

export default router
