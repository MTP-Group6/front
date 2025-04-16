// File: src/views/Login.vue
<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <img src="@/assets/images/logo.svg" alt="Bilibili Logo" class="logo">
        <h2>登录账号</h2>
      </div>
      
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-position="top">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        
        <div class="form-actions">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <a href="#" class="forgot-password">忘记密码?</a>
        </div>
        
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>
        
        <div class="register-link">
          还没有账号? <router-link to="/register">立即注册</router-link>
        </div>
        
        <div class="alternative-login">
          <div class="divider">
            <span>其他方式登录</span>
          </div>
          <div class="login-icons">
            <i class="el-icon-mobile-phone"></i>
            <i class="el-icon-chat-dot-round"></i>
            <i class="el-icon-s-platform"></i>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const loginFormRef = ref(null);

const loginForm = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ]
};

const rememberMe = ref(false);
const loading = ref(false);

const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    loading.value = true;
    try {
      const success = await userStore.loginUser({
        username: loginForm.username,
        password: loginForm.password,
        remember: rememberMe.value
      });
      
      if (success) {
        ElMessage.success('登录成功');
        
        // Redirect to the page that required authentication, or home page
        const redirectPath = route.query.redirect || '/';
        router.push(redirectPath);
      } else {
        ElMessage.error('登录失败，请检查账号和密码');
      }
    } catch (error) {
      console.error('Login error:', error);
      ElMessage.error('登录时发生错误');
    } finally {
      loading.value = false;
    }
  });
};
</script>