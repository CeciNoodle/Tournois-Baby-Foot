import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path:      '/',
    name:      'home',
    component: HomeView,
  },
  {
    path:      '/login',
    name:      'login',
    component: () => import('../views/LoginView.vue'),
    meta:      { hideHeader: true },
  },
  {
    path:      '/admin/dashboard',
    name:      'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta:      { requiresAuth: true, requiresAdmin: true },
  },
];
 
const router = createRouter({
  history: createWebHistory(),
  routes,
});
 

router.beforeEach((to) => {

  const auth = router._auth;
  if (!auth) return;
 
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' };
  }
 
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'home' };
  }
});
 
export default router;
 