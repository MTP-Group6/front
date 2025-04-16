// File: src/views/NotFound.vue
<template>
  <div class="not-found-page">
    <div class="content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面不存在</h1>
      <p class="error-message">抱歉，您访问的页面不存在或已被删除。</p>
      <div class="actions">
        <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
        <el-button @click="$router.go(-1)">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  
  .content {
    text-align: center;
    padding: 40px;
    
    .error-code {
      font-size: 120px;
      font-weight: 700;
      color: #fb7299;
      line-height: 1;
      margin-bottom: 16px;
    }
    
    .error-title {
      font-size: 24px;
      margin-bottom: 16px;
    }
    
    .error-message {
      color: #61666d;
      margin-bottom: 24px;
    }
    
    .actions {
      .el-button {
        margin: 0 8px;
      }
    }
  }
}
</style>