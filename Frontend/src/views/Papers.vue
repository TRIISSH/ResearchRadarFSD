<template>
  <div class="h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-900">
    <!-- Left Sidebar: Topics -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 hidden md:flex">
      <div class="p-6 border-b border-slate-200">
        <router-link to="/" class="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-700" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          ResearchRadar
        </router-link>
      </div>
      <div class="p-4 flex-1 overflow-y-auto">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Active Domains</h3>
        <ul class="space-y-1">
          <li v-for="category in activeCategories" :key="category">
            <button 
              @click="selectCategory(category)" 
              class="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors font-medium"
              :class="selectedCategory === category ? 'bg-indigo-100 text-indigo-800' : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50'"
            >
              {{ category }}
            </button>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Middle: Main Content -->
    <main class="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
      <!-- Top Filter & Search Bar -->
      <div class="bg-white border-b border-slate-200 p-6 shrink-0 flex flex-col sm:flex-row gap-4 items-center">
        <div class="flex-1 w-full relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input 
            v-model="searchQuery" 
            @input="debouncedSearch"
            type="text" 
            placeholder="Search research papers, topics, authors..." 
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
        </div>
        <select v-model="filterYear" @change="applyFilter" class="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Years</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="older">Older</option>
        </select>
      </div>

      <!-- Papers Grid with Lazy Loading -->
      <div class="flex-1 overflow-y-auto p-6" @scroll="handleScroll">
        <div v-if="loading && papers.length === 0" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
          <p class="text-slate-500">Searching library...</p>
        </div>
        
        <div v-else-if="papers.length === 0" class="text-center py-20 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No papers found matching your criteria.</p>
        </div>

        <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
          <div 
            v-for="paper in papers" 
            :key="paper._id" 
            class="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all flex flex-col group"
          >
            <div class="flex justify-between items-start mb-4">
              <span class="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full">
                {{ paper.category }}
              </span>
              <span class="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">{{ paper.year }}</span>
            </div>
            
            <h2 class="text-lg font-serif font-semibold text-slate-900 leading-snug mb-2 group-hover:text-indigo-700 transition-colors">
              {{ paper.title }}
            </h2>
            <p class="text-sm text-slate-500 mb-4 line-clamp-1" :title="paper.authors">{{ paper.authors }}</p>
            <div class="mb-6 flex-grow flex items-center justify-center">
              <button @click="openPreview(paper)" class="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-4 rounded-xl text-sm font-semibold transition-colors flex flex-col items-center justify-center gap-2 border border-indigo-100 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Summarizer
              </button>
            </div>
            
            <div class="mt-auto pt-4 border-t border-slate-100 flex gap-3">
              <router-link :to="`/papers/${paper._id}`" class="flex-1 text-center bg-slate-800 text-white hover:bg-slate-900 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                Full Details
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Lazy loading indicator -->
        <div v-if="loading && papers.length > 0" class="py-6 text-center flex items-center justify-center gap-2 text-indigo-600 text-sm font-medium">
          <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          Loading more papers...
        </div>
      </div>
    </main>

    <!-- Right Sidebar: Navbar and Profile -->
    <aside class="w-64 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 hidden lg:flex">
      <div class="p-6 flex flex-col items-center border-b border-slate-200">
        <div class="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-3xl font-bold mb-4 shadow-inner">
          {{ userStore.currentUser ? userStore.currentUser.name.charAt(0).toUpperCase() : '?' }}
        </div>
        <div v-if="userStore.currentUser" class="text-center">
          <h3 class="font-bold text-slate-800">{{ userStore.currentUser.name }}</h3>
          <p class="text-xs text-slate-500 mb-4">{{ userStore.currentUser.email }}</p>
          <button @click="logout" class="text-xs font-medium bg-slate-100 px-4 py-1.5 rounded text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors">Log Out</button>
        </div>
        <div v-else class="text-center">
          <router-link to="/login" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">Log In</router-link>
          <span class="text-slate-300 mx-2">|</span>
          <router-link to="/signup" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">Sign Up</router-link>
        </div>
      </div>

      <nav class="p-4 flex-1 flex flex-col gap-2">
        <router-link to="/" class="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors flex items-center gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
           </svg>
           Home
        </router-link>
        <router-link to="/papers" class="px-4 py-2.5 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg transition-colors flex items-center gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
           </svg>
           Library
        </router-link>
        <router-link to="/bookmarks" class="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors flex items-center gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
           </svg>
           Bookmarks
        </router-link>
        <router-link v-if="userStore.currentUser?.isAdmin" to="/admin" class="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors flex items-center gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
           </svg>
           Admin Setup
        </router-link>
      </nav>
    </aside>

    <PaperPreviewModal 
      :show="showPreview" 
      :paper="selectedPaper" 
      @close="showPreview = false" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import PaperPreviewModal from '../components/PaperPreviewModal.vue'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref(route.query.search || '')
const selectedCategory = ref(route.query.category || '')
const filterYear = ref('')
const papers = ref([])
const activeCategories = ref([])
const loading = ref(false)

// Pagination for lazy loading
const page = ref(1)
const limit = 4
const hasMore = ref(true)

const showPreview = ref(false)
const selectedPaper = ref(null)
let debounceTimeout = null

// Fetch ALL categories once to populate the sidebar regardless of current filters
const initializeCategories = async () => {
  try {
    const allPapers = await api.getPapers()
    const categoriesSet = new Set(allPapers.map(p => p.category).filter(Boolean))
    activeCategories.value = Array.from(categoriesSet).sort()
  } catch (e) {
    console.error('Failed to fetch categories', e)
  }
}

const fetchPapers = async (isLoadMore = false) => {
  if (loading.value || (!hasMore.value && isLoadMore)) return
  
  loading.value = true
  try {
    const query = new URLSearchParams()
    if (searchQuery.value) query.append('search', searchQuery.value)
    if (selectedCategory.value) query.append('category', selectedCategory.value)
    
    const allPapers = await api.getPapers(`?${query.toString()}`)
    
    // Filter by year if selected (frontend-side filter since API doesn't support it)
    let filtered = allPapers
    if (filterYear.value) {
      if (filterYear.value === 'older') {
        filtered = filtered.filter(p => p.year < 2023)
      } else {
        filtered = filtered.filter(p => p.year.toString() === filterYear.value)
      }
    }

    // Manual Pagination for lazy loading
    const start = (page.value - 1) * limit
    const end = start + limit
    const paginated = filtered.slice(start, end)
    
    if (paginated.length < limit) {
      hasMore.value = false
    } else {
      hasMore.value = true
    }

    if (isLoadMore) {
      papers.value = [...papers.value, ...paginated]
    } else {
      papers.value = paginated
    }
  } catch (e) {
    console.error('Failed to fetch papers', e)
  } finally {
    loading.value = false
  }
}

const selectCategory = (cat) => {
  // Toggle category off if clicked again, otherwise set it
  selectedCategory.value = selectedCategory.value === cat ? '' : cat
  searchQuery.value = '' // clear search bar when category is clicked
  page.value = 1
  fetchPapers()
}

const debouncedSearch = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    page.value = 1
    fetchPapers()
  }, 300)
}

const applyFilter = () => {
  page.value = 1
  fetchPapers()
}

const handleScroll = (e) => {
  const { scrollTop, clientHeight, scrollHeight } = e.target
  if (scrollHeight - scrollTop <= clientHeight + 100) {
    if (hasMore.value && !loading.value) {
      page.value++
      fetchPapers(true)
    }
  }
}

const openPreview = (paper) => {
  selectedPaper.value = paper
  showPreview.value = true
}

const logout = () => {
  userStore.logoutUser()
  router.push('/')
}

onMounted(() => {
  initializeCategories()
  fetchPapers()
})
</script>