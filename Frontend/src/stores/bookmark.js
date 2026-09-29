import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'
import { useUserStore } from './user'

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarks = ref([])
  const userStore = useUserStore()

  async function fetchBookmarks() {
    if (!userStore.currentUser) return
    try {
      bookmarks.value = await api.getBookmarks(userStore.currentUser._id)
    } catch (error) {
      console.error('Failed to fetch bookmarks', error)
    }
  }

  async function addBookmark(paper) {
    if (!userStore.currentUser) return
    try {
      bookmarks.value = await api.addBookmark(userStore.currentUser._id, paper._id || paper.id)
    } catch (error) {
      console.error('Failed to add bookmark', error)
    }
  }

  async function removeBookmark(paperId) {
    if (!userStore.currentUser) return
    try {
      bookmarks.value = await api.removeBookmark(userStore.currentUser._id, paperId)
    } catch (error) {
      console.error('Failed to remove bookmark', error)
    }
  }

  function isBookmarked(paperId) {
    return bookmarks.value.some(
      (item) => (item._id || item.id) === paperId
    )
  }

  return {
    bookmarks,
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked
  }
})