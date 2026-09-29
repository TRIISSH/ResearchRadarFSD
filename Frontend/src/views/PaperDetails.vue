<template>
  <div class="max-w-4xl mx-auto p-6 min-h-screen bg-[#fcfcfc] text-gray-900 font-sans">
    
    <div v-if="loading" class="py-20 text-center text-slate-400 text-sm tracking-wide">
      Loading document record...
    </div>

    <div v-else-if="error" class="py-20 text-center text-red-700 bg-red-50 border border-red-100 text-sm">
      {{ error }}
    </div>

    <div v-else-if="paper" class="bg-white p-8 md:p-12 border border-slate-200 shadow-sm">
      <router-link to="/papers" class="text-xs text-slate-400 hover:text-slate-600 tracking-wide uppercase font-semibold mb-8 inline-block">
        &larr; Back to Library
      </router-link>

      <div class="mb-8 border-b border-slate-100 pb-8">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-1">
            {{ paper.category }}
          </span>
          <span v-if="paper.verificationStatus === 'demo'" class="text-xs uppercase tracking-wider bg-amber-50 text-amber-700 px-2 py-1">
            Demo Record
          </span>
        </div>
        
        <h1 class="text-3xl md:text-4xl font-serif font-medium text-slate-900 leading-tight mb-4">
          {{ paper.title }}
        </h1>
        
        <p class="text-lg text-slate-700 mb-2 font-medium">{{ paper.authors }}</p>
        <p class="text-sm text-slate-500">Published: {{ paper.year }} <span v-if="paper.journal">| {{ paper.journal }}</span></p>
      </div>

      <div class="mb-10">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Abstract</h3>
        <p class="text-base text-slate-600 leading-relaxed font-light whitespace-pre-wrap">
          {{ paper.abstract }}
        </p>
      </div>

      <div v-if="paper.methodology" class="mb-10">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Methodology</h3>
        <p class="text-base text-slate-600 leading-relaxed font-light">
          {{ paper.methodology }}
        </p>
      </div>

      <div v-if="paper.findings" class="mb-10">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Key Findings</h3>
        <p class="text-base text-slate-600 leading-relaxed font-light">
          {{ paper.findings }}
        </p>
      </div>

      <div v-if="paper.keywords && paper.keywords.length > 0" class="mb-10">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Keywords</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="kw in paper.keywords" :key="kw" class="text-xs text-slate-600 bg-slate-100 px-3 py-1 border border-slate-200">
            {{ kw }}
          </span>
        </div>
      </div>

      <div class="bg-slate-50 p-6 border border-slate-200 mt-12">
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Bibliographic Information</h3>
        <ul class="text-sm text-slate-600 space-y-2 font-light">
          <li v-if="paper.doi"><strong>DOI:</strong> {{ paper.doi }}</li>
          <li v-if="paper.publisher"><strong>Publisher:</strong> {{ paper.publisher }}</li>
          <li v-if="paper.sourceUrl">
            <strong>Source:</strong> 
            <a :href="paper.sourceUrl" target="_blank" class="text-indigo-600 hover:underline ml-1">View Original</a>
          </li>
          <li v-if="paper.pdfUrl">
            <strong>PDF:</strong> 
            <a :href="paper.pdfUrl" target="_blank" class="text-indigo-600 hover:underline ml-1">Download PDF</a>
          </li>
        </ul>
      </div>

      <div class="mt-8 flex justify-end">
        <button 
          @click="toggleBookmark"
          class="bg-slate-800 text-white px-6 py-3 text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {{ bookmarkStore.isBookmarked(paper._id) ? 'Remove Bookmark' : 'Save to Bookmarks' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import { useBookmarkStore } from '../stores/bookmark'
import { useUserStore } from '../stores/user'

const route = useRoute()
const paper = ref(null)
const loading = ref(true)
const error = ref(null)

const bookmarkStore = useBookmarkStore()
const userStore = useUserStore()

const fetchPaperDetails = async () => {
  try {
    const id = route.params.id
    paper.value = await api.getPaper(id)
  } catch (err) {
    error.value = 'Failed to load document details. It may have been removed.'
  } finally {
    loading.value = false
  }
}

const toggleBookmark = async () => {
  if (!userStore.currentUser) {
    alert('Please log in to save bookmarks.')
    return
  }
  if (bookmarkStore.isBookmarked(paper.value._id)) {
    await bookmarkStore.removeBookmark(paper.value._id)
  } else {
    await bookmarkStore.addBookmark(paper.value)
  }
}

onMounted(() => {
  fetchPaperDetails()
  if (userStore.currentUser) {
    bookmarkStore.fetchBookmarks()
  }
})
</script>