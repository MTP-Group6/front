// File: src/components/layout/NavHeader.vue
<template>
  <header class="nav-header">
    <div class="header-content">
      <div class="header-left">
        <div class="logo">
          <router-link to="/">
            <img src="@/assets/images/logo.svg" alt="Bilibili Logo" />
          </router-link>
        </div>
        <nav class="main-nav">
          <ul>
            <li v-for="item in navItems" :key="item.name">
              <router-link :to="item.path">{{ item.name }}</router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="header-center">
        <div class="search-box">
          <input type="text" placeholder="搜索视频、番剧、用户" v-model="searchQuery" @keyup.enter="handleSearch" />
          <button class="search-btn" @click="handleSearch">
            <i class="el-icon-search"></i>
          </button>
        </div>
      </div>
      <div class="header-right">
        <template v-if="userStore.isLoggedIn">
          <div class="user-menu">
            <el-dropdown trigger="click">
              <div class="avatar-container">
                <img :src="userStore.user?.avatar || '@/assets/images/default-avatar.png'" alt="Avatar" class="user-avatar" />
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <router-link to="/user/profile">个人中心</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link to="/user/favorites">我的收藏</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link to="/user/history">历史记录</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="upload-btn">
            <el-button type="primary" size="small" icon="el-icon-upload">投稿</el-button>
          </div>
        </template>
        <template v-else>
          <div class="auth-btns">
            <router-link to="/login" class="login-btn">登录</router-link>
            <router-link to="/register" class="register-btn">注册</router-link>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const searchQuery = ref('');

const navItems = [
  { name: '首页', path: '/' },
  { name: '热门', path: '/popular' },
  { name: '排行榜', path: '/ranking' },
  { name: '直播', path: '/live' },
  { name: '番剧', path: '/bangumi' },
  { name: '游戏中心', path: '/game' }
];

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索内容');
    return;
  }
  
  router.push({
    path: '/search',
    query: { q: searchQuery.value }
  });
};

const handleLogout = async () => {
  await userStore.logoutUser();
  ElMessage.success('退出登录成功');
  router.push('/');
};
</script>

<style lang="scss" scoped>
.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  z-index: 100;
  
  .header-content {
    max-width: 1336px;
    height: 100%;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    
    .logo {
      margin-right: 24px;
      
      img {
        height: 38px;
      }
    }
    
    .main-nav {
      ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        
        li {
          margin-right: 20px;
          
          a {
            font-size: 14px;
            color: #18191c;
            text-decoration: none;
            transition: all 0.3s;
            
            &:hover, &.router-link-active {
              color: #fb7299;
            }
          }
        }
      }
    }
  }
  
  .header-center {
    flex: 1;
    max-width: 500px;
    margin: 0 24px;
    
    .search-box {
      position: relative;
      width: 100%;
      
      input {
        width: 100%;
        height: 36px;
        padding: 0 38px 0 12px;
        border: 1px solid #e3e5e7;
        border-radius: 6px;
        background-color: #f1f2f3;
        transition: all 0.3s;
        
        &:focus {
          border-color: #fb7299;
          background-color: #fff;
          outline: none;
        }
      }
      
      .search-btn {
        position: absolute;
        right: 0;
        top: 0;
        width: 38px;
        height: 36px;
        border: none;
        background: none;
        cursor: pointer;
        color: #757575;
        transition: all 0.3s;
        
        &:hover {
          color: #fb7299;
        }
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    
    .user-menu {
      margin-right: 16px;
      
      .avatar-container {
        cursor: pointer;
        
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }
      }
    }
    
    .auth-btns {
      display: flex;
      
      .login-btn, .register-btn {
        padding: 0 16px;
        height: 32px;
        line-height: 32px;
        border-radius: 4px;
        font-size: 14px;
        text-decoration: none;
        transition: all 0.3s;
      }
      
      .login-btn {
        color: #18191c;
        margin-right: 8px;
        
        &:hover {
          background-color: #f6f7f8;
        }
      }
      
      .register-btn {
        background-color: #fb7299;
        color: #fff;
        
        &:hover {
          background-color: #fc8bab;
        }
      }
    }
  }
}
</style>