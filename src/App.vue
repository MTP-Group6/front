<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> -->

// File: src/App.vue
<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './store/user';

const userStore = useUserStore();

onMounted(() => {
  // Check if user is logged in (from localStorage token)
  userStore.checkAuth();
});
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: "Microsoft YaHei", "Segoe UI", Helvetica, Arial, sans-serif;
  background-color: #f1f2f3;
}

.app-container {
  width: 100%;
  min-height: 100vh;
}
</style>