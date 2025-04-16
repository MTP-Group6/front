<template>
  <div class="video-card" @click="navigateToVideo">
    <div class="thumbnail-container">
      <img :src="video.cover" :alt="video.title" class="thumbnail" />
      <div class="duration">{{ formatDuration(video.duration) }}</div>
    </div>
    <div class="video-info">
      <h3 class="video-title" :title="video.title">{{ video.title }}</h3>
      <div class="uploader-info">
        <router-link :to="`/user/${video.uploader.id}`" class="uploader-name" @click.stop>
          {{ video.uploader.name }}
        </router-link>
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
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
});

const router = useRouter();

// src/components/video/VideoCard.vue - Check the navigateToVideo function
const navigateToVideo = () => {
  // Make sure this function is being called when clicked
  console.log('Navigating to video:', props.video.id);
  router.push(`/video/${props.video.id}`);
};

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
</script>

<style lang="scss" scoped>
.video-card {
  cursor: pointer;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    
    .thumbnail {
      transform: scale(1.05);
    }
  }
  
  .thumbnail-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; // 16:9 aspect ratio
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 10px;
    
    .thumbnail {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    
    .duration {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background-color: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 12px;
    }
  }
  
  .video-info {
    .video-title {
    font-size: 14px;
    margin: 0 0 6px;
    line-height: 1.3;
    height: 2.6em; // 必须设置固定高度
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box; // 必须与 -webkit-line-clamp 配合使用
    -webkit-line-clamp: 2; // 限制行数为2
    -webkit-box-orient: vertical; // 设置盒子方向为垂直
    line-clamp: 2; // 标准属性，用于支持现代浏览器
    box-orient: vertical; // 标准属性，配合 line-clamp 使用
    }
    
    .uploader-info {
      margin-bottom: 6px;
      
      .uploader-name {
        font-size: 12px;
        color: #9499a0;
        text-decoration: none;
        
        &:hover {
          color: #fb7299;
        }
      }
    }
    
    .video-stats {
      display: flex;
      font-size: 12px;
      color: #9499a0;
      
      .play-count {
        margin-right: 12px;
      }
      
      i {
        margin-right: 4px;
      }
    }
  }
}
</style>