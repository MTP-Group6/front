// File: src/components/layout/NavFooter.vue
<template>
  <footer class="nav-footer">
    <div class="footer-content">
      <div class="footer-links">
        <div class="link-group" v-for="(group, index) in linkGroups" :key="index">
          <h4>{{ group.title }}</h4>
          <ul>
            <li v-for="(link, i) in group.links" :key="i">
              <a :href="link.url" target="_blank">{{ link.name }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-info">
        <div class="logo">
          <img src="@/assets/images/footer-logo.svg" alt="Bilibili Logo" />
        </div>
        <div class="copyright">
          <p>© 2009-{{ currentYear }} Bilibili Clone</p>
          <p>此站点仅作为Vue3学习示例，不作任何商业用途</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentYear = new Date().getFullYear();

const linkGroups = [
  {
    title: '关于我们',
    links: [
      { name: '关于哔哩哔哩', url: '#' },
      { name: '加入我们', url: '#' },
      { name: '联系我们', url: '#' },
      { name: '友情链接', url: '#' }
    ]
  },
  {
    title: '传送门',
    links: [
      { name: '帮助中心', url: '#' },
      { name: '高级弹幕', url: '#' },
      { name: '活动专题页', url: '#' },
      { name: '侵权申诉', url: '#' }
    ]
  },
  {
    title: '常用功能',
    links: [
      { name: '分区首页', url: '#' },
      { name: '活动中心', url: '#' },
      { name: '专栏投稿', url: '#' },
      { name: '活动投稿', url: '#' }
    ]
  }
];
</script>

<style lang="scss" scoped>
.nav-footer {
  background-color: #f6f7f8;
  padding: 40px 0;
  margin-top: 60px;
  
  .footer-content {
    max-width: 1336px;
    margin: 0 auto;
    padding: 0 24px;
  }
  
  .footer-links {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    
    .link-group {
      h4 {
        font-size: 16px;
        color: #18191c;
        margin-bottom: 20px;
      }
      
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          margin-bottom: 12px;
          
          a {
            font-size: 14px;
            color: #61666d;
            text-decoration: none;
            transition: color 0.3s;
            
            &:hover {
              color: #fb7299;
            }
          }
        }
      }
    }
  }
  
  .footer-info {
    display: flex;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid #e3e5e7;
    
    .logo {
      margin-right: 24px;
      
      img {
        height: 32px;
      }
    }
    
    .copyright {
      p {
        margin: 4px 0;
        font-size: 12px;
        color: #9499a0;
      }
    }
  }
}
</style>