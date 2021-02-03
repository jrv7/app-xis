const routes = [
  {
      path: '/Dashboard',
      name: 'Dashboard',
      component: () => import('@/admin/views/Dashboard.vue' ),
  }
]
export default routes;
