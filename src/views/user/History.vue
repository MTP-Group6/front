// File: src/views/user/History.vue
<template>
  <div class="user-history-page">
    <div class="section-header">
      <h2>观看历史</h2>
      <div class="header-actions">
        <el-button type="danger" size="small" @click="clearAllHistory" :disabled="!history.length">
          清空历史记录
        </el-button>
      </div>
    </div>
    
    <div class="history-content">
      <div class="empty-state" v-if="!history.length">
        <i class="el-icon-time"></i>
        <p>暂无观看历史</p>
        <el-button type="primary" @click="$router.push('/')">去首页看看</el-button>
      </div>
      
      <div v-else class="history-list">
        <div v-for="(item, index) in history" :key="item.id" class="history-item">
          <div class="history-date" v-if="showDateHeader(item, index)">
            {{ formatDateHeader(item.watchTime) }}
          </div>
          
          <div class="history-video" @click="$router.push(`/video/${item.videoId}`)">
            <div class="video-thumbnail">
              <img :src="item.videoCover" :alt="item.videoTitle" />
              <div class="video-duration">{{ formatDuration(item.videoDuration) }}</div>
              <div class="progress-bar" :style="{ width: `${item.watchProgress}%` }"></div>
            </div>
            
            <div class="video-info">
              <h3 class="video-title">{{ item.videoTitle }}</h3>
              <div class="video-uploader">UP主: {{ item.uploaderName }}</div>
              <div class="watch-details">
                <span class="watch-time">{{ formatTime(item.watchTime) }}</span>
                <span class="watch-progress">观看至 {{ formatProgress(item.watchProgress) }}</span>
              </div>
            </div>
            
            <div class="history-actions">
              <el-button 
                type="text" 
                icon="el-icon-delete"
                @click.stop="removeHistoryItem(item.id)"
              ></el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="load-more" v-if="hasMore && history.length">
      <el-button type="text" @click="loadMoreHistory" :loading="loading">
        加载更多 <i class="el-icon-arrow-down"></i>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getHistory, clearHistory, removeHistoryItem as removeItem } from '@/api/user';
import { ElMessage, ElMessageBox } from 'element-plus';

const history = ref([]);
const page = ref(1);
const pageSize = ref(20);
const hasMore = ref(true);
const loading = ref(false);

// 格式化视频时长（秒到MM:SS）
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// 格式化日期为日期头部
const formatDateHeader = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return '今天';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天';
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
};

// 格式化时间为时:分
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 格式化观看进度
const formatProgress = (progress) => {
  return `${Math.floor(progress)}%`;
};

// 判断是否显示日期头部
const showDateHeader = (item, index) => {
  if (index === 0) return true;
  
  const currentDate = new Date(item.watchTime).toDateString();
  const prevDate = new Date(history.value[index - 1].watchTime).toDateString();
  
  return currentDate !== prevDate;
};

// 加载观看历史
const loadHistory = async () => {
  loading.value = true;
  try {
    const { data } = await getHistory({
      page: page.value,
      pageSize: pageSize.value
    });
    
    if (page.value === 1) {
      history.value = data.items || [];
    } else {
      history.value = [...history.value, ...(data.items || [])];
    }
    
    hasMore.value = data.hasMore || false;
  } catch (error) {
    console.error('Failed to load history', error);
    ElMessage.error('加载历史记录失败');
    
    // 使用模拟数据
    const mockData = Array(10).fill().map((_, idx) => {
      const watchDate = new Date();
      watchDate.setHours(watchDate.getHours() - idx * 3);
      
      // 每3个条目使用不同的日期，模拟不同日期的分组
      if (idx > 0 && idx % 3 === 0) {
        watchDate.setDate(watchDate.getDate() - 1);
      }
      
      return {
        id: `history-${page.value}-${idx}`,
        videoId: `video-${idx}`,
        videoTitle: `历史记录视频 ${(page.value - 1) * pageSize.value + idx + 1}`,
        videoCover: `https://i0.hdslb.com/bfs/archive/sample${(idx + 2) % 3 + 1}.jpg`,
        videoDuration: 180 + idx * 30,
        uploaderName: `UP主${idx + 1}`,
        watchTime: watchDate.toISOString(),
        watchProgress: 10 + Math.floor(Math.random() * 90)
      };
    });
    
    if (page.value === 1) {
      history.value = mockData;
    } else {
      history.value = [...history.value, ...mockData];
    }
    
    hasMore.value = page.value < 3; // 模拟只有3页数据
  } finally {
    loading.value = false;
  }
};

// 加载更多历史记录
const loadMoreHistory = () => {
  page.value += 1;
  loadHistory();
};

// 清空所有历史记录
const clearAllHistory = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有历史记录吗？此操作不可恢复。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    await clearHistory();
    ElMessage.success('历史记录已清空');
    history.value = [];
    hasMore.value = false;
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to clear history', error);
      ElMessage.error('清空历史记录失败');
    }
  }
};

// 删除单个历史记录
const removeHistoryItem = async (id) => {
  try {
    await removeItem(id);
    history.value = history.value.filter(item => item.id !== id);
    ElMessage.success('已删除该条历史记录');
  } catch (error) {
    console.error('Failed to remove history item', error);
    ElMessage.error('删除失败');
  }
};

onMounted(() => {
  loadHistory();
});
</script>

<style lang="scss" scoped>
.user-history-page {
  padding: 20px 0;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }
  }
  
  .history-content {
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
    
    .history-list {
      .history-date {
        padding: 8px 0;
        font-size: 16px;
        font-weight: 600;
        color: #18191c;
        border-bottom: 1px solid #e3e5e7;
        margin-bottom: 16px;
      }
      
      .history-video {
        display: flex;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e3e5e7;
        cursor: pointer;
        
        &:last-child {
          border-bottom: none;
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
          
          .progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background-color: #fb7299;
          }
        }
        
        .video-info {
          flex: 1;
          
          .video-title {
            margin: 0 0 8px;
            font-size: 16px;
            line-height: 1.3;
          }
          
          .video-uploader {
            font-size: 12px;
            color: #9499a0;
            margin-bottom: 8px;
          }
          
          .watch-details {
            font-size: 12px;
            color: #9499a0;
            
            .watch-time {
              margin-right: 16px;
            }
          }
        }
        
        .history-actions {
          display: flex;
          align-items: center;
          
          .el-button {
            color: #9499a0;
            
            &:hover {
              color: #fb7299;
            }
          }
        }
      }
    }
  }
  
  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
}
</style>