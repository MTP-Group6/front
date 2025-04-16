// File: src/api/video.js
import request from './request';

export function getRecommendedVideos(params) {
  return request({
    url: '/videos/recommended',
    method: 'get',
    params
  });
  
}

export function getPopularVideos(params) {
  return request({
    url: '/videos/popular',
    method: 'get',
    params
  });
}

export function getRankingVideos(params) {
  return request({
    url: '/videos/ranking',
    method: 'get',
    params
  });
}

export function getChannelVideos(channelId, params) {
  return request({
    url: `/channels/${channelId}/videos`,
    method: 'get',
    params
  });
}

export function getVideoDetail(videoId) {
  return request({
    url: `/videos/${videoId}`,
    method: 'get'
  });
}

export function getRelatedVideos(videoId) {
  return request({
    url: `/videos/${videoId}/related`,
    method: 'get'
  });
}

export function getVideoComments(videoId, params) {
  return request({
    url: `/videos/${videoId}/comments`,
    method: 'get',
    params
  });
}

export function addComment(videoId, content) {
  return request({
    url: `/videos/${videoId}/comments`,
    method: 'post',
    data: { content }
  });
}

export function likeVideo(videoId) {
  return request({
    url: `/videos/${videoId}/like`,
    method: 'post'
  });
}

export function unlikeVideo(videoId) {
  return request({
    url: `/videos/${videoId}/unlike`,
    method: 'post'
  });
}