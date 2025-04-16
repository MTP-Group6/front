// File: src/views/Home.vue
<template>
  <div class="home-page">
    <div class="carousel-section">
      <el-carousel height="300px">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <img :src="banner.imageUrl" :alt="banner.title" class="banner-img" />
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <div class="category-nav">
      <div class="category-item" v-for="category in categories" :key="category.id">
        <router-link :to="`/channel/${category.id}`">
          <div class="category-icon">
            <i :class="category.icon"></i>
          </div>
          <div class="category-name">{{ category.name }}</div>
        </router-link>
      </div>
    </div>
    
    <div class="recommend-section">
      <div class="section-header">
        <h2>推荐视频</h2>
        <router-link to="/popular" class="more-link">查看更多 <i class="el-icon-arrow-right"></i></router-link>
      </div>
      
      <div class="video-grid">
        <VideoCard 
          v-for="video in recommendedVideos" 
          :key="video.id" 
          :video="video" 
        />
      </div>
    </div>
    
    <div class="popular-section">
      <div class="section-header">
        <h2>热门视频</h2>
        <router-link to="/ranking" class="more-link">查看更多 <i class="el-icon-arrow-right"></i></router-link>
      </div>
      
      <div class="video-grid">
        <VideoCard 
          v-for="video in popularVideos" 
          :key="video.id" 
          :video="video" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useVideoStore } from '@/store/video';
import VideoCard from '@/components/video/VideoCard.vue';

const videoStore = useVideoStore();
const recommendedVideos = ref([]);
const popularVideos = ref([]);

// Mock banner data
const banners = ref([
  {
    id: 1,
    title: '2024新番',
    imageUrl: 'https://i0.hdslb.com/bfs/banner/sample1.png',
    link: '/bangumi/2024'
  },
  {
    id: 2,
    title: '游戏赛事',
    imageUrl: 'https://i0.hdslb.com/bfs/banner/sample2.png',
    link: '/game/tournament'
  },
  {
    id: 3,
    title: '音乐盛典',
    imageUrl: 'https://i0.hdslb.com/bfs/banner/sample3.png',
    link: '/music/festival'
  }
]);

// Mock category data
const categories = ref([
  { id: 1, name: '动画', icon: 'el-icon-video-camera' },
  { id: 2, name: '音乐', icon: 'el-icon-headset' },
  { id: 3, name: '游戏', icon: 'el-icon-guide' },
  { id: 4, name: '美食', icon: 'el-icon-dish' },
  { id: 5, name: '知识', icon: 'el-icon-reading' },
  { id: 6, name: '数码', icon: 'el-icon-mobile-phone' },
  { id: 7, name: '生活', icon: 'el-icon-house' },
  { id: 8, name: '时尚', icon: 'el-icon-shopping-bag' }
]);

onMounted(async () => {
  // 在实际项目中，这里会从API获取数据
  // 但在开发阶段，我们先使用模拟数据
  try {
    await videoStore.fetchRecommendedVideos();
    await videoStore.fetchPopularVideos();
    
    recommendedVideos.value = videoStore.recommendedVideos;
    popularVideos.value = videoStore.popularVideos;
  } catch (error) {
    console.error('Failed to fetch videos', error);
    
    // 使用模拟数据作为后备
    recommendedVideos.value = Array(8).fill().map((_, idx) => ({
      id: `rec-${idx}`,
      title: `推荐视频标题 ${idx + 1}`,
      cover: `https://i0.hdslb.com/bfs/archive/sample${idx % 3 + 1}.jpg`,
      duration: 360 + idx * 30,
      playCount: 10000 + idx * 1000,
      danmakuCount: 5000 + idx * 500,
      uploader: { id: `up-${idx}`, name: `UP主${idx + 1}` }
    }));
    
    popularVideos.value = Array(8).fill().map((_, idx) => ({
      id: `pop-${idx}`,
      title: `热门视频标题 ${idx + 1}`,
      cover: `https://i0.hdslb.com/bfs/archive/sample${(idx + 2) % 3 + 1}.jpg`,
      duration: 240 + idx * 60,
      playCount: 50000 + idx * 5000,
      danmakuCount: 20000 + idx * 2000,
      uploader: { id: `up-${idx + 10}`, name: `热门UP主${idx + 1}` }
    }));
  }
});
</script>

<style lang="scss" scoped>
.home-page {
  padding: 20px 0;
  
  .carousel-section {
    margin-bottom: 20px;
    
    .banner-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  }
  
  .category-nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    padding: 16px 0;
    
    .category-item {
      flex: 1;
      text-align: center;
      
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #18191c;
        text-decoration: none;
        transition: all 0.3s;
        
        &:hover {
          color: #fb7299;
        }
      }
      
      .category-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: #f6f7f8;
        margin-bottom: 8px;
        
        i {
          font-size: 24px;
        }
      }
      
      .category-name {
        font-size: 14px;
      }
    }
  }
  
  .recommend-section, .popular-section {
    margin-bottom: 40px;
    
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      
      h2 {
        font-size: 20px;
        font-weight: 700;
        color: #18191c;
        margin: 0;
      }
      
      .more-link {
        font-size: 14px;
        color: #9499a0;
        text-decoration: none;
        transition: color 0.3s;
        
        &:hover {
          color: #fb7299;
        }
      }
    }
    
    .video-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      
      @media (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
      }
      
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>