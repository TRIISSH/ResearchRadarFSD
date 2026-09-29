<template>
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

      <!-- Logo -->
      <router-link to="/" class="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-700" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
        ResearchRadar
      </router-link>

      <!-- Navigation -->
      <div class="hidden md:flex items-center gap-8">
        <router-link to="/" class="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors">Home</router-link>
        <router-link to="/papers" class="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors">Library</router-link>
        <router-link to="/bookmarks" class="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors">Bookmarks</router-link>
        <router-link 
          v-if="userStore.currentUser && (userStore.currentUser.role === 'admin' || userStore.currentUser.role === 'root')"
          to="/admin" 
          class="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors"
        >
          Admin
        </router-link>
      </div>

      <div class="flex items-center gap-4">
        <template v-if="userStore.currentUser">
          <span class="text-sm font-medium text-slate-800 hidden md:block">Welcome, {{ userStore.currentUser.name }}</span>
          <button @click="logout" class="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors">Log Out</button>
        </template>
        <template v-else>
          <router-link to="/login" class="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors hidden md:block">Log In</router-link>
          <router-link to="/signup" class="text-sm font-medium bg-slate-800 text-white px-5 py-2 hover:bg-slate-700 transition-colors shadow-sm">
            Sign Up
          </router-link>
        </template>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const logout = () => {
  userStore.logoutUser()
  router.push('/')
}
</script>