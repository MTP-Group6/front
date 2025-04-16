// File: src/api/user.js
import request from './request';

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  });
}

export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  });
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  });
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  });
}

export function updateUserProfile(data) {
  return request({
    url: '/user/profile',
    method: 'put',
    data
  });
}

export function getFavorites() {
  return request({
    url: '/user/favorites',
    method: 'get'
  });
}

export function addToFavorites(videoId) {
  return request({
    url: '/user/favorites',
    method: 'post',
    data: { videoId }
  });
}

export function removeFromFavorites(videoId) {
  return request({
    url: `/user/favorites/${videoId}`,
    method: 'delete'
  });
}

export function getHistory() {
  return request({
    url: '/user/history',
    method: 'get'
  });
}