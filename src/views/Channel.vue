// File: src/views/Channel.vue
<template>
  <div class="channel-page">
    <div class="channel-header">
      <h2 class="channel-title">{{ channelInfo.name }}</h2>
      <div class="channel-description">{{ channelInfo.description }}</div>
      
      <div class="filter-tabs">
        <div 
          v-for="tab in filterTabs" 
          :key="tab.value" 
          class="tab-item"
          :class="{ active: currentFilter === tab.value }"
          @click="setFilter(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>
    
    <div class="channel-content">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>
      
      <div v-else-if="!channelVideos.length" class="empty-state">
        <i class="el-icon-video-camera"></i>
        <p>该频道暂无视频</p>
      </div>
      
      <div v-else class="video-grid">
        <VideoCard 
          v-for="video in channelVideos" 
          :key="video.id" 
          :video="video" 
        />
      </div>
    </div>
    
    <div class="pagination-container" v-if="channelVideos.length">
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from '@/store/video';
import VideoCard from '@/components/video/VideoCard.vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const videoStore = useVideoStore();
const channelId = computed(() => route.params.id);

const channelInfo = ref({});
const channelVideos = computed(() => videoStore.channelVideos);
const loading = computed(() => videoStore.loading);

const currentPage = ref(1);
const pageSize = ref(20);
const totalVideos = ref(0);
const currentFilter = ref('newest');

const filterTabs = [
  { label: '最新发布', value: 'newest' },
  { label: '最多播放', value: 'most_viewed' },
  { label: '最多弹幕', value: 'most_danmaku' },
  { label: '最多收藏', value: 'most_favorites' }
];

// 设置筛选条件
const setFilter = (filter) => {
  currentFilter.value = filter;
  currentPage.value = 1; // 重置回第一页
  fetchChannelVideos();
};

// 页面切换
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchChannelVideos();
};

// 获取频道信息
const fetchChannelInfo = async () => {
  // 在实际项目中，会从API获取频道信息
  // 这里使用模拟数据
  const channels = [
    { id: '1', name: '动画', description: '动画频道，展示最新最热的动画内容', iconClass: 'el-icon-video-camera' },
    { id: '2', name: '音乐', description: '音乐频道，汇集优质音乐创作和翻唱', iconClass: 'el-icon-headset' },
    { id: '3', name: '游戏', description: '游戏频道，分享游戏实况、解说和攻略', iconClass: 'el-icon-guide' },
    { id: '4', name: '美食', description: '美食频道，展示美食制作和品鉴', iconClass: 'el-icon-dish' },
    { id: '5', name: '知识', description: '知识频道，传播各领域知识和科普内容', iconClass: 'el-icon-reading' },
    { id: '6', name: '数码', description: '数码频道，分享数码产品评测和技术资讯', iconClass: 'el-icon-mobile-phone' },
    { id: '7', name: '生活', description: '生活频道，记录日常生活和分享生活技巧', iconClass: 'el-icon-house' },
    { id: '8', name: '时尚', description: '时尚频道，展示时尚潮流和穿搭技巧', iconClass: 'el-icon-shopping-bag' }
  ];
  
  const channel = channels.find(c => c.id === channelId.value);
  
  if (channel) {
    channelInfo.value = channel;
  } else {
    ElMessage.error('频道不存在');
    channelInfo.value = { name: '未知频道', description: '' };
  }
};

// 获取频道视频
const fetchChannelVideos = async () => {
  try {
    await videoStore.fetchChannelVideos(channelId.value, {
      page: currentPage.value,
      pageSize: pageSize.value,
      sort: currentFilter.value
    });
    
    // 在实际项目中，总数应该从API获取
    totalVideos.value = 86; // 模拟总数
  } catch (error) {
    console.error('Failed to fetch channel videos', error);
    ElMessage.error('获取频道视频失败');
    
    // 使用模拟数据
    videoStore.channelVideos = Array(12).fill().map((_, idx) => ({
      id: `channel-${channelId.value}-${idx}`,
      title: `${channelInfo.value.name}频道视频 ${idx + 1}`,
      cover: `https://i0.hdslb.com/bfs/archive/sample${(idx % 3) + 1}.jpg`,
      duration: 240 + idx * 30,
      playCount: 8000 + idx * 1000,
      danmakuCount: 3000 + idx * 500,
      uploader: { id: `up-${idx}`, name: `UP主${idx + 1}` }
    }));
  }
};

// 监听频道ID变化
watch(channelId, () => {
  fetchChannelInfo();
  currentPage.value = 1;
  currentFilter.value = 'newest';
  fetchChannelVideos();
});

onMounted(() => {
  fetchChannelInfo();
  fetchChannelVideos();
});
</script>

<style lang="scss" scoped>
.channel-page {
  padding: 20px 0;
  
  .channel-header {
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    .channel-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 12px;
    }
    
    .channel-description {
      font-size: 14px;
      color: #61666d;
      margin-bottom: 20px;
    }
    
    .filter-tabs {
      display: flex;
      border-bottom: 1px solid #e3e5e7;
      
      .tab-item {
        padding: 12px 16px;
        font-size: 14px;
        cursor: pointer;
        margin-right: 16px;
        position: relative;
        
        &.active {
          color: #fb7299;
          font-weight: 600;
          
          &:after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #fb7299;
          }
        }
        
        &:hover {
          color: #fb7299;
        }
      }
    }
  }
  
  .channel-content {
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 0;
      
      i {
        font-size: 48px;
        color: #e3e5e7;
        margin-bottom: 16px;
      }
      
      p {
        color: #9499a0;
        margin-bottom: 16px;
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
  
  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>