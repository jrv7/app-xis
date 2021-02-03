const routes = [
  {
      path: '/login',
      name: 'Login',
      component: () => import('@/login/views/Login.vue' ),
  }
]
export default routes;
