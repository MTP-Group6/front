<!-- src/views/Ranking.vue -->
<template>
  <div class="ranking-page">
    <div class="section-header">
      <h2>排行榜</h2>
    </div>
    
    <div class="ranking-content">
      <div class="ranking-sidebar">
        <div class="category-list">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-item"
            :class="{ active: currentCategory === category.id }"
            @click="setCategory(category.id)"
          >
            {{ category.name }}
          </div>
        </div>
      </div>
      
      <div class="ranking-main">
        <div class="time-filter">
          <div 
            v-for="period in timePeriods" 
            :key="period.value"
            class="period-item"
            :class="{ active: currentPeriod === period.value }"
            @click="setPeriod(period.value)"
          >
            {{ period.label }}
          </div>
        </div>
        
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="10" animated />
        </div>
        
        <div v-else class="ranking-list">
          <div 
            v-for="(video, index) in rankingVideos" 
            :key="video.id"
            class="ranking-item"
            @click="navigateToVideo(video.id)"
          >
            <div class="ranking-number" :class="{ 'top-three': index < 3 }">
              {{ index + 1 }}
            </div>
            <div class="video-thumbnail">
              <img :src="video.cover" :alt="video.title" />
              <div class="video-duration">{{ formatDuration(video.duration) }}</div>
            </div>
            <div class="video-info">
              <h3 class="video-title">{{ video.title }}</h3>
              <div class="video-uploader">
                <span>{{ video.uploader.name }}</span>
              </div>
              <div class="video-stats">
                <span class="play-count">
                  <i class="el-icon-video-play"></i> {{ formatNumber(video.playCount) }}
                </span>
                <span class="danmaku-count">
                  <i class="el-icon-chat-dot-round"></i> {{ formatNumber(video.danmakuCount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
// Instead of making actual API calls, we'll use mock data directly
// import { getRankingVideos } from '@/api/video';

const router = useRouter();
const loading = ref(false);
const rankingVideos = ref([]);

const categories = [
  { id: 0, name: '全站' },
  { id: 1, name: '动画' },
  { id: 2, name: '音乐' },
  { id: 3, name: '游戏' },
  { id: 4, name: '美食' },
  { id: 5, name: '知识' },
  { id: 6, name: '数码' },
  { id: 7, name: '生活' },
  { id: 8, name: '时尚' }
];

const timePeriods = [
  { label: '日排行', value: 'day' },
  { label: '周排行', value: 'week' },
  { label: '月排行', value: 'month' }
];

const currentCategory = ref(0);
const currentPeriod = ref('week');

// Format video duration
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format large numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Navigate to video detail
const navigateToVideo = (videoId) => {
  router.push(`/video/${videoId}`);
};

// Set category
const setCategory = (categoryId) => {
  currentCategory.value = categoryId;
};

// Set time period
const setPeriod = (period) => {
  currentPeriod.value = period;
};

// Fetch ranking videos using mock data
const fetchRankingVideos = async () => {
  loading.value = true;
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data based on current category and period
    const categoryName = categories.find(c => c.id === currentCategory.value)?.name || '全站';
    const periodName = timePeriods.find(p => p.value === currentPeriod.value)?.label || '周排行';
    
    // Create mock data with slightly different values based on category and period
    rankingVideos.value = Array(20).fill().map((_, idx) => ({
      id: `ranking-${currentCategory.value}-${currentPeriod.value}-${idx}`,
      title: `${categoryName}${periodName} Top${idx + 1}: 视频标题示例`,
      cover: 'https://via.placeholder.com/320x180',
      duration: 180 + (idx * 20) + (currentCategory.value * 10),
      playCount: 100000 - (idx * 4000) + (currentCategory.value * 5000),
      danmakuCount: 50000 - (idx * 2000) + (currentCategory.value * 2500),
      uploader: { 
        id: `up-${idx}`, 
        name: `排行榜UP主${idx + 1}` 
      }
    }));
  } catch (error) {
    console.error('Failed to fetch ranking videos', error);
    ElMessage.error('获取排行榜数据失败');
    
    // Fallback mock data in case something goes wrong
    rankingVideos.value = Array(20).fill().map((_, idx) => ({
      id: `ranking-fallback-${idx}`,
      title: `视频排行 ${idx + 1}`,
      cover: 'https://via.placeholder.com/320x180',
      duration: 240 + idx * 30,
      playCount: 50000 - idx * 2000,
      danmakuCount: 25000 - idx * 1000,
      uploader: { id: `up-${idx}`, name: `UP主${idx + 1}` }
    }));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRankingVideos();
});

// Watch for changes in category or period to refresh data
watch([currentCategory, currentPeriod], () => {
  fetchRankingVideos();
});
</script>

<style lang="scss" scoped>
.ranking-page {
  padding: 20px 0;
  
  .section-header {
    margin-bottom: 20px;
    
    h2 {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }
  }
  
  .ranking-content {
    display: flex;
    
    .ranking-sidebar {
      width: 200px;
      margin-right: 20px;
      
      .category-list {
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        
        .category-item {
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            background-color: #f6f7f8;
            color: #fb7299;
          }
          
          &.active {
            background-color: #fb7299;
            color: #fff;
          }
        }
      }
    }
    
    .ranking-main {
      flex: 1;
      
      .time-filter {
        display: flex;
        background-color: #fff;
        border-radius: 8px;
        margin-bottom: 16px;
        padding: 12px 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        
        .period-item {
          margin-right: 24px;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
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
      
      .ranking-list {
        background-color: #fff;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        
        .ranking-item {
          display: flex;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e3e5e7;
          cursor: pointer;
          
          &:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }
          
          &:hover {
            .video-title {
              color: #fb7299;
            }
          }
          
          .ranking-number {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 700;
            color: #9499a0;
            margin-right: 16px;
            
            &.top-three {
              color: #fb7299;
              font-size: 24px;
            }
          }
          
          .video-thumbnail {
            position: relative;
            width: 160px;
            height: 90px;
            margin-right: 16px;
            border-radius: 4px;
            overflow: hidden;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .video-duration {
              position: absolute;
              bottom: 4px;
              right: 4px;
              background-color: rgba(0, 0, 0, 0.7);
              color: #fff;
              padding: 2px 4px;
              border-radius: 2px;
              font-size: 12px;
            }
          }
          
          .video-info {
            flex: 1;
            
            .video-title {
              margin: 0 0 8px;
              font-size: 16px;
              line-height: 1.3;
              transition: color 0.3s;
            }
            
            .video-uploader {
              margin-bottom: 8px;
              font-size: 14px;
              color: #9499a0;
            }
            
            .video-stats {
              font-size: 12px;
              color: #9499a0;
              
              .play-count {
                margin-right: 16px;
              }
              
              i {
                margin-right: 4px;
              }
            }
          }
        }
      }
    }
  }
}
</style>