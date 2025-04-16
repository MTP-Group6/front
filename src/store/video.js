// // File: src/store/video.js
// import { defineStore } from 'pinia';
// import { ref } from 'vue';
// import {
//   getRecommendedVideos,
//   getPopularVideos,
//   getChannelVideos,
//   getVideoDetail
// } from '@/api/video';

// export const useVideoStore = defineStore('video', () => {
//   const recommendedVideos = ref([]);
//   const popularVideos = ref([]);
//   const channelVideos = ref([]);
//   const currentVideo = ref(null);
//   const loading = ref(false);
  
//   async function fetchRecommendedVideos() {
//     loading.value = true;
//     try {
//       // Comment out the API call
//       // const { data } = await getRecommendedVideos();
      
//       // Instead, use mock data
//       recommendedVideos.value = Array(8).fill().map((_, idx) => ({
//         id: `rec-${idx}`,
//         title: `推荐视频标题 ${idx + 1}`,
//         cover: 'https://via.placeholder.com/320x180',
//         duration: 360 + idx * 30,
//         playCount: 10000 + idx * 1000,
//         danmakuCount: 5000 + idx * 500,
//         uploader: { id: `up-${idx}`, name: `UP主${idx + 1}` }
//       }));
//     } catch (error) {
//       console.error('Failed to fetch recommended videos', error);
//     } finally {
//       loading.value = false;
//     }
//   }
  
//   async function fetchPopularVideos() {
//     loading.value = true;
//     try {
//       const { data } = await getPopularVideos();
//       popularVideos.value = data;
//     } catch (error) {
//       console.error('Failed to fetch popular videos', error);
//     } finally {
//       loading.value = false;
//     }
//   }
  
//   async function fetchChannelVideos(channelId) {
//     loading.value = true;
//     try {
//       const { data } = await getChannelVideos(channelId);
//       channelVideos.value = data;
//     } catch (error) {
//       console.error('Failed to fetch channel videos', error);
//     } finally {
//       loading.value = false;
//     }
//   }
  
//   async function fetchVideoDetail(videoId) {
//     loading.value = true;
//     try {
//       const { data } = await getVideoDetail(videoId);
//       currentVideo.value = data;
//     } catch (error) {
//       console.error('Failed to fetch video detail', error);
//     } finally {
//       loading.value = false;
//     }
//   }
  
//   return {
//     recommendedVideos,
//     popularVideos,
//     channelVideos,
//     currentVideo,
//     loading,
//     fetchRecommendedVideos,
//     fetchPopularVideos,
//     fetchChannelVideos,
//     fetchVideoDetail
//   };
// });

// src/store/video.js
import { defineStore } from 'pinia';
import { getVideoDetail, getRelatedVideos, getVideoComments, addComment } from '../api/video';

export const useVideoStore = defineStore('video', {
  state: () => ({
    currentVideo: null,
    relatedVideos: [],
    comments: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchVideoDetail(videoId) {
      this.loading = true;
      try {
        const video = await getVideoDetail(videoId);
        this.currentVideo = video;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchRelatedVideos(videoId) {
      try {
        const { data } = await getRelatedVideos(videoId);
        this.relatedVideos = data;
      } catch (error) {
        this.error = error.message;
      }
    },

    async fetchComments(videoId, page = 1, limit = 10) {
      try {
        const { data } = await getVideoComments(videoId, { page, limit });
        this.comments = data.comments;
        return data;
      } catch (error) {
        this.error = error.message;
        return null;
      }
    },

    async submitComment(videoId, content) {
      try {
        const { data } = await addComment(videoId, content);
        return data;
      } catch (error) {
        this.error = error.message;
        return null;
      }
    }
  }
});