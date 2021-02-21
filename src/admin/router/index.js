const routes = [
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: () => import('@/admin/views/Dashboard.vue' ),
  },
  {
    name: 'main-screen',
    path: '/:mainMenuId',
    component: () => import('@/admin/views/Dashboard.vue' ),
  },
  {
    name: 'default-list',
    path: '/:mainMenuId/:submenuId',
    component: () => import('@/admin/views/DefaultView.vue' ),
  },
  {
    name: 'default-view',
    path: '/:mainMenuId/:submenuId/:ids',
    component: () => import('@/admin/views/DefaultCrud.vue' ),
  }
]
export default routes;
