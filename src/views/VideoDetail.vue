// File: src/views/VideoDetail.vue
<template>
  <div class="video-detail-page" v-if="currentVideo">
    <div class="video-container">
      <div class="video-player">
        <!-- Video player placeholder -->
        <div class="player-placeholder">
          <img :src="currentVideo.cover" :alt="currentVideo.title" class="video-cover" />
          <div class="play-button">
            <i class="el-icon-video-play"></i>
          </div>
        </div>
      </div>
      
      <div class="video-info">
        <h1 class="video-title">{{ currentVideo.title }}</h1>
        
        <div class="video-stats">
          <span class="play-count">
            <i class="el-icon-video-play"></i> {{ formatNumber(currentVideo.playCount) }} 播放
          </span>
          <span class="danmaku-count">
            <i class="el-icon-chat-dot-round"></i> {{ formatNumber(currentVideo.danmakuCount) }} 弹幕
          </span>
          <span class="publish-date">{{ formatDate(currentVideo.publishDate) }} 发布</span>
        </div>
        
        <div class="uploader-info">
          <div class="uploader-avatar">
            <img :src="currentVideo.uploader.avatar" :alt="currentVideo.uploader.name" />
          </div>
          <div class="uploader-details">
            <router-link :to="`/user/${currentVideo.uploader.id}`" class="uploader-name">
              {{ currentVideo.uploader.name }}
            </router-link>
            <div class="subscriber-count">{{ formatNumber(currentVideo.uploader.subscribers) }} 粉丝</div>
          </div>
          <el-button type="primary" class="subscribe-btn" size="small">
            <i class="el-icon-plus"></i> 关注
          </el-button>
        </div>
        
        <div class="video-description">
          <p>{{ currentVideo.description }}</p>
        </div>
        
        <div class="action-bar">
          <div class="action-button like-btn">
            <i class="el-icon-thumb"></i>
            <span>{{ formatNumber(currentVideo.likes) }}</span>
          </div>
          <div class="action-button dislike-btn">
            <i class="el-icon-thumb" style="transform: rotate(180deg)"></i>
          </div>
          <div class="action-button favorite-btn">
            <i class="el-icon-star-off"></i>
            <span>收藏</span>
          </div>
          <div class="action-button share-btn">
            <i class="el-icon-share"></i>
            <span>分享</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="video-content">
      <div class="comments-section">
        <div class="section-header">
          <h3>评论 ({{ formatNumber(currentVideo.commentCount) }})</h3>
        </div>
        
        <div class="comment-form">
          <div class="commenter-avatar">
            <img src="@/assets/images/default-avatar.png" alt="User Avatar" />
          </div>
          <div class="comment-input">
            <el-input
              v-model="commentText"
              placeholder="发一条友善的评论"
              type="textarea"
              :rows="2"
            ></el-input>
            <div class="comment-actions">
              <el-button type="primary" size="small" @click="submitComment" :disabled="!commentText.trim()">
                发布
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="comments-list">
          <div class="comment-item" v-for="comment in comments" :key="comment.id">
            <div class="commenter-avatar">
              <img :src="comment.user.avatar" :alt="comment.user.name" />
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="commenter-name">{{ comment.user.name }}</span>
                <span class="comment-time">{{ formatDate(comment.createTime) }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-actions">
                <span class="like-action">
                  <i class="el-icon-thumb"></i> {{ formatNumber(comment.likes) }}
                </span>
                <span class="reply-action">回复</span>
              </div>
            </div>
          </div>
          
          <div class="load-more" v-if="hasMoreComments">
            <el-button type="text" @click="loadMoreComments">
              查看更多评论 <i class="el-icon-arrow-down"></i>
            </el-button>
          </div>
        </div>
      </div>
      
      <div class="recommended-section">
        <div class="section-header">
          <h3>相关推荐</h3>
        </div>
        
        <div class="related-videos-list">
          <div class="related-video-item" v-for="video in relatedVideos" :key="video.id" @click="navigateToVideo(video.id)">
            <div class="video-thumbnail">
              <img :src="video.cover" :alt="video.title" />
              <div class="video-duration">{{ formatDuration(video.duration) }}</div>
            </div>
            <div class="video-info">
              <h4 class="video-title">{{ video.title }}</h4>
              <div class="video-uploader">{{ video.uploader.name }}</div>
              <div class="video-stats">
                <span>{{ formatNumber(video.playCount) }} 播放</span>
                <span>{{ formatNumber(video.danmakuCount) }} 弹幕</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="loading-container" v-else>
    <el-skeleton :loading="true" animated>
      <template #template>
        <div style="padding: 20px;">
          <el-skeleton-item variant="image" style="width: 100%; height: 400px;" />
          <div style="margin-top: 16px;">
            <el-skeleton-item variant="p" style="width: 80%;" />
            <div style="display: flex; justify-content: space-between; margin-top: 16px;">
              <el-skeleton-item variant="text" style="width: 100px;" />
              <el-skeleton-item variant="text" style="width: 100px;" />
              <el-skeleton-item variant="text" style="width: 100px;" />
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVideoStore } from '@/store/video';
import { getVideoComments, getRelatedVideos, addComment } from '@/api/video';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const videoStore = useVideoStore();
const videoId = computed(() => route.params.id);

const currentVideo = computed(() => videoStore.currentVideo);
const relatedVideos = ref([]);
const comments = ref([]);
const commentText = ref('');
const commentPage = ref(1);
const hasMoreComments = ref(true);

// Format video duration from seconds to MM:SS
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format large numbers with K/M suffix
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Format date to relative time
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // Difference in seconds
  
  if (diff < 60) {
    return `${diff}秒前`;
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}小时前`;
  } else if (diff < 2592000) {
    return `${Math.floor(diff / 86400)}天前`;
  } else {
    return date.toLocaleDateString();
  }
};

// Navigate to another video
const navigateToVideo = (id) => {
  router.push(`/video/${id}`);
  window.scrollTo(0, 0);
};

// Load video comments
const loadComments = async () => {
  try {
    const { data } = await getVideoComments(videoId.value, { page: commentPage.value, limit: 10 });
    comments.value = [...comments.value, ...data.comments];
    hasMoreComments.value = commentPage.value < data.totalPages;
  } catch (error) {
    console.error('Failed to load comments', error);
  }
};

// Load more comments
const loadMoreComments = () => {
  commentPage.value += 1;
  loadComments();
};

// Submit a new comment
const submitComment = async () => {
  try {
    await addComment(videoId.value, commentText.value.trim());
    ElMessage.success('评论发布成功');
    commentText.value = '';
    commentPage.value = 1;
    comments.value = [];
    loadComments();
  } catch (error) {
    ElMessage.error('评论发布失败');
  }
};

onMounted(async () => {
  // Fetch video details
  await videoStore.fetchVideoDetail(videoId.value);
  
  // Fetch related videos
  try {
    const { data } = await getRelatedVideos(videoId.value);
    relatedVideos.value = data;
  } catch (error) {
    console.error('Failed to fetch related videos', error);
  }
  
  // Load initial comments
  loadComments();
});
</script>