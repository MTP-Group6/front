// File: src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import { useUserStore } from '@/store/user';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '哔哩哔哩 (゜-゜)つロ 干杯~-bilibili' }
      },
      {
        path: 'popular',
        name: 'Popular',
        component: () => import('@/views/Popular.vue'),
        meta: { title: '热门视频-bilibili' }
      },
      {
        path: 'ranking',
        name: 'Ranking',
        component: () => import('@/views/Ranking.vue'),
        meta: { title: '排行榜-bilibili' }
      },
      {
        path: 'channel/:id',
        name: 'Channel',
        component: () => import('@/views/Channel.vue'),
        meta: { title: '频道-bilibili' }
      },
      {
        path: 'video/:id',
        name: 'VideoDetail',
        component: () => import('@/views/VideoDetail.vue'),
        meta: { title: '视频详情-bilibili' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录-bilibili' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册-bilibili' }
  },
  {
    path: '/user',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/Profile.vue'),
        meta: { title: '个人中心-bilibili' }
      },
      {
        path: 'favorites',
        name: 'UserFavorites',
        component: () => import('@/views/user/Favorites.vue'),
        meta: { title: '我的收藏-bilibili' }
      },
      {
        path: 'history',
        name: 'UserHistory',
        component: () => import('@/views/user/History.vue'),
        meta: { title: '历史记录-bilibili' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404 Not Found-bilibili' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Navigation guard
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = to.meta.title || '哔哩哔哩 (゜-゜)つロ 干杯~-bilibili';
  
  // Check auth for protected routes
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const userStore = useUserStore();
    if (!userStore.isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;