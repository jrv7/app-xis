const routes = [
  {
      path: '/Dashboard',
      name: 'Dashboard',
      component: () => import('@/admin/views/Dashboard.vue' ),
  },
  {
      path: '/:mainMenuId',
      component: () => import('@/admin/views/Dashboard.vue' ),
  },
  {
      path: '/:mainMenuId/:submenuId',
      component: () => import('@/admin/views/DefaulView.vue' ),
  }
]
export default routes;
