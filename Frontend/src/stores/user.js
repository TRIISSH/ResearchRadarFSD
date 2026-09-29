import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useUserStore = defineStore('user', () => {
  const storedUser = localStorage.getItem('currentUser')
  const currentUser = ref(storedUser ? JSON.parse(storedUser) : null)

  // Login user
  async function loginUser(email, password) {
    try {
      const data = await api.login({ email, password })
      currentUser.value = data
      localStorage.setItem('currentUser', JSON.stringify(data))
      return {
        success: true,
        message: 'Login successful!'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Invalid email or password.'
      }
    }
  }

  // Logout
  function logoutUser() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  // Admin permission update
  async function updateUserRole(id, role) {
    try {
      await api.updateUserRole(id, role)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  return {
    currentUser,
    loginUser,
    logoutUser,
    updateUserRole
  }
})
