// File: src/views/user/Profile.vue
<template>
  <div class="user-profile-page">
    <div class="profile-header">
      <div class="user-info">
        <div class="avatar-container">
          <img :src="userInfo.avatar || '@/assets/images/default-avatar.png'" alt="User Avatar" class="user-avatar" />
          <div class="avatar-edit-btn">
            <i class="el-icon-camera"></i>
          </div>
        </div>
        <div class="user-details">
          <h2 class="username">{{ userInfo.username }}</h2>
          <div class="user-id">UID: {{ userInfo.id }}</div>
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ userInfo.followingCount || 0 }}</div>
              <div class="stat-label">关注</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userInfo.followerCount || 0 }}</div>
              <div class="stat-label">粉丝</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userInfo.videoCount || 0 }}</div>
              <div class="stat-label">投稿</div>
            </div>
          </div>
        </div>
        <div class="edit-profile-btn">
          <el-button size="small" @click="showEditForm = true">编辑资料</el-button>
        </div>
      </div>
    </div>
    
    <div class="profile-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="我的投稿" name="uploads">
          <div v-if="!userUploads.length" class="empty-state">
            <i class="el-icon-video-camera"></i>
            <p>还没有上传任何视频</p>
            <el-button type="primary" size="small">立即投稿</el-button>
          </div>
          <div v-else class="video-grid">
            <VideoCard 
              v-for="video in userUploads" 
              :key="video.id" 
              :video="video" 
            />
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="我的收藏" name="favorites">
          <div v-if="!userFavorites.length" class="empty-state">
            <i class="el-icon-star-off"></i>
            <p>还没有收藏任何视频</p>
            <el-button type="primary" size="small" @click="$router.push('/')">去首页看看</el-button>
          </div>
          <div v-else class="video-grid">
            <VideoCard 
              v-for="video in userFavorites" 
              :key="video.id" 
              :video="video" 
            />
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="观看历史" name="history">
          <div v-if="!userHistory.length" class="empty-state">
            <i class="el-icon-time"></i>
            <p>暂无观看历史</p>
            <el-button type="primary" size="small" @click="$router.push('/')">去首页看看</el-button>
          </div>
          <div v-else class="history-list">
            <div class="history-item" v-for="item in userHistory" :key="item.id" @click="$router.push(`/video/${item.videoId}`)">
              <div class="video-thumbnail">
                <img :src="item.videoCover" :alt="item.videoTitle" />
                <div class="video-duration">{{ formatDuration(item.videoDuration) }}</div>
              </div>
              <div class="history-video-info">
                <h4 class="video-title">{{ item.videoTitle }}</h4>
                <div class="video-uploader">UP主: {{ item.uploaderName }}</div>
                <div class="watch-time">观看于: {{ formatDate(item.watchTime) }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <!-- 编辑资料对话框 -->
    <el-dialog
      title="编辑个人资料"
      v-model="showEditForm"
      width="500px"
    >
      <el-form :model="profileForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" />
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input type="textarea" v-model="profileForm.bio" :rows="3" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="profileForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="0">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="profileForm.birthday"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditForm = false">取消</el-button>
          <el-button type="primary" @click="saveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { updateUserProfile, getFavorites, getHistory } from '@/api/user';
import VideoCard from '@/components/video/VideoCard.vue';
import { ElMessage } from 'element-plus';

const userStore = useUserStore();
const userInfo = ref({});
const activeTab = ref('uploads');
const showEditForm = ref(false);
const userUploads = ref([]);
const userFavorites = ref([]);
const userHistory = ref([]);

const profileForm = reactive({
  username: '',
  bio: '',
  gender: 0,
  birthday: ''
});

// Format video duration (seconds to MM:SS)
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format date to readable format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Load user profile data
const loadUserProfile = async () => {
  if (!userStore.user) {
    await userStore.checkAuth();
  }
  
  userInfo.value = userStore.user || {};
  
  // Update form with current user data
  profileForm.username = userInfo.value.username || '';
  profileForm.bio = userInfo.value.bio || '';
  profileForm.gender = userInfo.value.gender || 0;
  profileForm.birthday = userInfo.value.birthday ? new Date(userInfo.value.birthday) : '';
};

// Save profile changes
const saveProfile = async () => {
  try {
    await updateUserProfile(profileForm);
    await loadUserProfile(); // Reload profile data
    showEditForm.value = false;
    ElMessage.success('资料更新成功');
  } catch (error) {
    console.error('Failed to update profile', error);
    ElMessage.error('资料更新失败');
  }
};

// Load user uploads
const loadUserUploads = async () => {
  // In a real app, you would call an API here
  // For now, we'll use mock data
  userUploads.value = Array(4).fill().map((_, idx) => ({
    id: `user-upload-${idx}`,
    title: `我的投稿视频 ${idx + 1}`,
    cover: `https://i0.hdslb.com/bfs/archive/sample${idx % 3 + 1}.jpg`,
    duration: 240 + idx * 60,
    playCount: 5000 + idx * 1000,
    danmakuCount: 2000 + idx * 500,
    uploader: { id: userInfo.value.id, name: userInfo.value.username }
  }));
};

// Load user favorites
const loadUserFavorites = async () => {
  try {
    const { data } = await getFavorites();
    userFavorites.value = data;
  } catch (error) {
    console.error('Failed to load favorites', error);
    // 使用模拟数据
    userFavorites.value = Array(6).fill().map((_, idx) => ({
      id: `fav-${idx}`,
      title: `收藏的视频 ${idx + 1}`,
      cover: `https://i0.hdslb.com/bfs/archive/sample${(idx + 1) % 3 + 1}.jpg`,
      duration: 300 + idx * 45,
      playCount: 15000 + idx * 3000,
      danmakuCount: 8000 + idx * 1500,
      uploader: { id: `fav-up-${idx}`, name: `收藏UP主${idx + 1}` }
    }));
  }
};

// Load user history
const loadUserHistory = async () => {
  try {
    const { data } = await getHistory();
    userHistory.value = data;
  } catch (error) {
    console.error('Failed to load history', error);
    // 使用模拟数据
    userHistory.value = Array(8).fill().map((_, idx) => ({
      id: `history-${idx}`,
      videoId: `video-${idx}`,
      videoTitle: `历史记录视频 ${idx + 1}`,
      videoCover: `https://i0.hdslb.com/bfs/archive/sample${(idx + 2) % 3 + 1}.jpg`,
      videoDuration: 180 + idx * 30,
      uploaderName: `历史UP主${idx + 1}`,
      watchTime: new Date(Date.now() - idx * 3600 * 1000).toISOString()
    }));
  }
};

onMounted(async () => {
  await loadUserProfile();
  loadUserUploads();
  loadUserFavorites();
  loadUserHistory();
});
</script>

<style lang="scss" scoped>
.user-profile-page {
  padding: 20px 0;
  
  .profile-header {
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    .user-info {
      display: flex;
      align-items: center;
      
      .avatar-container {
        position: relative;
        margin-right: 24px;
        
        .user-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .avatar-edit-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 24px;
          height: 24px;
          background-color: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          
          i {
            color: #fff;
            font-size: 14px;
          }
        }
      }
      
      .user-details {
        flex: 1;
        
        .username {
          margin: 0 0 8px;
          font-size: 20px;
        }
        
        .user-id {
          color: #9499a0;
          font-size: 14px;
          margin-bottom: 12px;
        }
        
        .user-stats {
          display: flex;
          
          .stat-item {
            margin-right: 24px;
            
            .stat-value {
              font-size: 16px;
              font-weight: 600;
            }
            
            .stat-label {
              font-size: 12px;
              color: #9499a0;
            }
          }
        }
      }
    }
  }
  
  .profile-tabs {
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
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
    
    .history-list {
      .history-item {
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
        }
        
        .history-video-info {
          flex: 1;
          
          .video-title {
            margin: 0 0 8px;
            font-size: 16px;
            line-height: 1.3;
          }
          
          .video-uploader, .watch-time {
            font-size: 12px;
            color: #9499a0;
            margin-bottom: 4px;
          }
        }
      }
    }
  }
}
</style>