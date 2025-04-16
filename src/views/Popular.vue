
<template>
  <div class="popular-page">
    <div class="section-header">
      <h2>热门视频</h2>
    </div>
    
    <div class="filter-bar">
      <div class="filter-item" 
           v-for="(filter, index) in filters" 
           :key="index"
           :class="{ active: currentFilter === filter.value }"
           @click="setFilter(filter.value)">
        {{ filter.label }}
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <div v-else class="video-grid">
      <VideoCard 
        v-for="video in popularVideos" 
        :key="video.id" 
        :video="video" 
      />
    </div>
    
    <div class="pagination-container">
      <el-pagination
        layout="prev, pager, next"
        :total="totalVideos"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useVideoStore } from '@/store/video';
import VideoCard from '@/components/video/VideoCard.vue';

const videoStore = useVideoStore();
const loading = computed(() => videoStore.loading);
const popularVideos = ref([]);

const currentPage = ref(1);
const pageSize = ref(20);
const totalVideos = ref(100); // Mock total for pagination

const filters = [
  { label: '全部', value: 'all' },
  { label: '动画', value: 'animation' },
  { label: '音乐', value: 'music' },
  { label: '游戏', value: 'game' },
  { label: '美食', value: 'food' },
  { label: '知识', value: 'knowledge' }
];

const currentFilter = ref('all');

const setFilter = (filter) => {
  currentFilter.value = filter;
  currentPage.value = 1; // Reset to first page when changing filters
  fetchPopularVideos();
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchPopularVideos();
};

const fetchPopularVideos = async () => {
  try {
    await videoStore.fetchPopularVideos({
      page: currentPage.value,
      pageSize: pageSize.value,
      filter: currentFilter.value
    });
    
    popularVideos.value = videoStore.popularVideos;
    
    // If the videos aren't loading, use this fallback
    if (popularVideos.value.length === 0) {
      popularVideos.value = Array(12).fill().map((_, idx) => ({
        id: `pop-${idx}`,
        title: `热门视频标题 ${idx + 1}`,
        cover: 'https://via.placeholder.com/320x180',
        duration: 240 + idx * 60,
        playCount: 50000 + idx * 5000,
        danmakuCount: 20000 + idx * 2000,
        uploader: { id: `up-${idx + 10}`, name: `热门UP主${idx + 1}` }
      }));
    }
  } catch (error) {
    console.error('Failed to fetch popular videos', error);
    
    // Use mock data if API fails
    popularVideos.value = Array(12).fill().map((_, idx) => ({
      id: `pop-${idx}`,
      title: `热门视频标题 ${idx + 1}`,
      cover: 'https://via.placeholder.com/320x180',
      duration: 240 + idx * 60,
      playCount: 50000 + idx * 5000,
      danmakuCount: 20000 + idx * 2000,
      uploader: { id: `up-${idx + 10}`, name: `热门UP主${idx + 1}` }
    }));
  }
};

onMounted(() => {
  fetchPopularVideos();
});

watch(currentFilter, () => {
  fetchPopularVideos();
});
</script>

<style lang="scss" scoped>
.popular-page {
  padding: 20px 0;
  
  .section-header {
    margin-bottom: 20px;
    
    h2 {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }
  }
  
  .filter-bar {
    display: flex;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    .filter-item {
      margin-right: 20px;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 14px;
      border-radius: 4px;
      transition: all 0.3s;
      
      &:hover {
        color: #fb7299;
      }
      
      &.active {
        background-color: #fb7299;
        color: #fff;
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
  
  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>