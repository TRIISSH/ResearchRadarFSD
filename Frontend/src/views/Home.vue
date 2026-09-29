<template>
  <div class="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans">
    
    <!-- Hero Section -->
    <section class="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <h1 class="text-5xl md:text-6xl font-serif font-medium tracking-tight mb-6">
          ResearchRadar
        </h1>
        <p class="text-xl md:text-2xl font-light text-slate-300 mb-10 max-w-2xl mx-auto">
          Discover • Read • Research. Your digital library for peer-reviewed academic papers and cutting-edge publications.
        </p>
        
        <div class="max-w-2xl mx-auto flex flex-col md:flex-row gap-3">
          <input 
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text" 
            placeholder="Search for research topics, authors, or keywords..." 
            class="flex-1 px-6 py-4 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg text-lg"
          />
          <button 
            @click="handleSearch"
            class="bg-indigo-600 text-white px-8 py-4 font-medium hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Search
          </button>
        </div>
      </div>
      
      <!-- Subtle background pattern -->
      <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 20px 20px;"></div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 px-6 max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Browse by Subject</h2>
        <h3 class="text-3xl font-serif text-slate-800">Popular Research Domains</h3>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div 
          v-for="category in categories" 
          :key="category"
          @click="goToCategory(category)"
          class="bg-white border border-slate-200 p-6 text-center cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
        >
          <div class="w-12 h-12 mx-auto bg-slate-50 text-slate-400 flex items-center justify-center rounded-full mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h4 class="font-medium text-slate-800 group-hover:text-indigo-700 transition-colors">{{ category }}</h4>
        </div>
      </div>
    </section>

    <!-- Recent Additions -->
    <section class="py-20 px-6 max-w-6xl mx-auto border-t border-slate-100">
      <div class="flex justify-between items-end mb-10">
        <div>
          <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Latest</h2>
          <h3 class="text-3xl font-serif text-slate-800">Recent Publications</h3>
        </div>
        <router-link to="/papers" class="text-indigo-600 hover:text-indigo-800 font-medium text-sm hidden md:block">
          View all papers &rarr;
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-10 text-slate-400 text-sm">
        Loading recent papers...
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="paper in recentPapers" 
          :key="paper._id" 
          class="bg-white p-6 border border-slate-200 hover:shadow-md transition-shadow flex flex-col"
        >
          <div class="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">
            {{ paper.category }}
          </div>
          <h2 class="text-lg font-serif font-medium text-slate-900 leading-snug mb-2">
            <router-link :to="`/papers/${paper._id}`" class="hover:text-indigo-800">{{ paper.title }}</router-link>
          </h2>
          <p class="text-sm text-slate-500 mb-4">{{ paper.authors }} &bull; {{ paper.year }}</p>
          <p class="text-sm text-slate-600 line-clamp-3 mb-6 flex-grow font-light">
            {{ paper.abstract }}
          </p>
        </div>
      </div>
      
      <div class="mt-8 text-center md:hidden">
        <router-link to="/papers" class="inline-block border border-slate-300 bg-white text-slate-700 px-6 py-3 font-medium text-sm hover:bg-slate-50">
          View all papers
        </router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const searchQuery = ref('')
const recentPapers = ref([])
const loading = ref(true)
const categories = ref([])

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Navigate to papers page with query params
    router.push({ path: '/papers', query: { search: searchQuery.value } })
  }
}

const goToCategory = (category) => {
  router.push({ path: '/papers', query: { category } })
}

onMounted(async () => {
  try {
    const data = await api.getPapers()
    
    // Just grab first 3 for home page
    recentPapers.value = data.slice(0, 3)

    // Dynamically fetch categories from DB
    const categoriesSet = new Set(data.map(p => p.category).filter(Boolean))
    categories.value = Array.from(categoriesSet).sort()
  } catch (e) {
    console.error('Failed to fetch recent papers', e)
  } finally {
    loading.value = false
  }
})
</script>