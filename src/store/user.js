// File: src/store/user.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login, logout, getUserInfo } from '@/api/user';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || '');
  
  const isLoggedIn = computed(() => !!token.value);
  
  // Check if user is authenticated
  async function checkAuth() {
    if (token.value) {
      try {
        const userData = await getUserInfo();
        user.value = userData;
      } catch (error) {
        // Token invalid, clear auth
        user.value = null;
        token.value = '';
        localStorage.removeItem('token');
      }
    }
  }
  
  // Login
  async function loginUser(credentials) {
    try {
      const { data } = await login(credentials);
      token.value = data.token;
      localStorage.setItem('token', data.token);
      user.value = data.user;
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Logout
  async function logoutUser() {
    try {
      await logout();
    } finally {
      user.value = null;
      token.value = '';
      localStorage.removeItem('token');
    }
  }
  
  return { 
    user, 
    token,
    isLoggedIn,
    checkAuth,
    loginUser,
    logoutUser
  };
});