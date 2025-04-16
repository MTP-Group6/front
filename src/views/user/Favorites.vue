// File: src/views/user/Favorites.vue
<template>
  <div class="user-favorites-page">
    <div class="section-header">
      <h2>我的收藏</h2>
    </div>
    
    <div class="favorites-content">
      <div class="favorites-list">
        <div class="empty-state" v-if="!favorites.length">
          <i class="el-icon-star-off"></i>
          <p>您还没有收藏任何视频</p>
          <el-button type="primary" @click="$router.push('/')">去首页看看</el-button>
        </div>
        
        <div v-else class="video-grid">
          <div class="favorite-item" v-for="video in favorites" :key="video.id">
            <VideoCard :video="video" />
            <div class="favorite-actions">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="removeFavorite(video.id)">
                移除收藏
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pagination-container" v-if="favorites.length">
      <el-pagination
        layout="prev, pager, next"
        :total="totalFavorites"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getFavorites, removeFromFavorites } from '@/api/user';
import VideoCard from '@/components/video/VideoCard.vue';

const favorites = ref([]);
const currentPage = ref(1);
const pageSize = ref(12);
const totalFavorites = ref(0);

// Load favorites
const loadFavorites = async () => {
  try {
    const { data } = await getFavorites({
      page: currentPage.value,
      pageSize: pageSize.value
    });
    
    favorites.value = data.items || [];
    totalFavorites.value = data.total || 0;
  } catch (error) {
    console.error('Failed to load favorites', error);
    ElMessage.error('加载收藏失败');
    
    // 使用模拟数据
    favorites.value = Array(8).fill().map((_, idx) => ({
      id: `fav-${idx}`,
      title: `收藏的视频 ${idx + 1}`,
      cover: `https://i0.hdslb.com/bfs/archive/sample${(idx + 1) % 3 + 1}.jpg`,
      duration: 300 + idx * 45,
      playCount: 15000 + idx * 3000,
      danmakuCount: 8000 + idx * 1500,
      uploader: { id: `fav-up-${idx}`, name: `收藏UP主${idx + 1}` }
    }));
    totalFavorites.value = 26; // 假设总共有26个收藏
  }
};

// Remove a favorite
const removeFavorite = async (videoId) => {
  try {
    await ElMessageBox.confirm('确定要移除该收藏吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    await removeFromFavorites(videoId);
    ElMessage.success('已从收藏中移除');
    loadFavorites(); // 重新加载收藏列表
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to remove favorite', error);
      ElMessage.error('移除收藏失败');
    }
  }
};

// Handle page change
const handlePageChange = (page) => {
  currentPage.value = page;
  loadFavorites();
};

onMounted(() => {
  loadFavorites();
});
</script>

<style lang="scss" scoped>
.user-favorites-page {
  padding: 20px 0;
  
  .section-header {
    margin-bottom: 20px;
    
    h2 {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }
  }
  
  .favorites-content {
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
      
      .favorite-item {
        .favorite-actions {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }
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