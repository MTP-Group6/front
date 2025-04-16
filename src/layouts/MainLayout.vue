<template>
  <div class="main-layout">
    <NavHeader />
    <div class="main-content">
      <router-view />
    </div>
    <NavFooter />
  </div>
</template>

<script setup>
import NavHeader from '@/components/layout/NavHeader.vue';
import NavFooter from '@/components/layout/NavFooter.vue';
</script>

<style lang="scss" scoped>
.main-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  .main-content {
    flex: 1;
    padding-top: 64px; /* Height of header */
    max-width: 1336px;
    margin: 0 auto;
    width: 100%;
    padding-left: 24px;
    padding-right: 24px;
    box-sizing: border-box;
  }
}
</style>