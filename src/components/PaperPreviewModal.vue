<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col">
      <div class="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
        <h2 class="text-xl font-serif font-medium text-slate-900 pr-8">
          {{ paper?.title }}
        </h2>
        <button @click="$emit('close')" class="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-50 p-2 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-6 flex-1">
        <div class="mb-6">
          <span class="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            {{ paper?.category }}
          </span>
          <p class="text-sm text-slate-600 mb-2 font-medium">Authors: {{ paper?.authors }}</p>
          <p class="text-sm text-slate-500 mb-4">Published: {{ paper?.year }} <span v-if="paper?.doi">| DOI: {{ paper?.doi }}</span></p>
        </div>

        <div class="mb-8">
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Original Abstract</h3>
          <p class="text-slate-700 leading-relaxed font-light text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
            {{ paper?.abstract }}
          </p>
        </div>

        <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <div class="flex items-center gap-3 mb-4 relative z-10">
            <div class="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-indigo-900 uppercase tracking-widest">AI Summarizer</h3>
          </div>

          <div v-if="isSummarizing" class="flex items-center gap-3 py-6 relative z-10">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
            <span class="text-indigo-600 font-medium text-sm">Generating intelligent summary...</span>
          </div>
          <div v-else-if="summary" class="relative z-10 flex flex-col gap-3">
            <p :class="hasError ? 'text-red-600' : 'text-indigo-950'" class="leading-relaxed text-sm">
              {{ summary }}
            </p>
            <button v-if="hasError" @click="generateSummary" class="self-start py-2 px-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
          <div v-else class="relative z-10">
            <button @click="generateSummary" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate AI Summary
            </button>
          </div>
        </div>
      </div>
      
      <div class="p-6 border-t border-slate-100 bg-slate-50 mt-auto flex justify-between items-center">
        <a v-if="paper?.sourceUrl" :href="paper.sourceUrl" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
          View Original Source
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <span v-else class="text-slate-400 text-sm">No source link available</span>
        
        <router-link :to="`/papers/${paper?._id}`" class="px-5 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
          Full Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import api from '../services/api'

const props = defineProps({
  show: Boolean,
  paper: Object
})

const emit = defineEmits(['close'])

const isSummarizing = ref(false)
const summary = ref(null)
const hasError = ref(false)

watch(() => props.paper, () => {
  // Reset state when paper changes
  summary.value = null
  isSummarizing.value = false
  hasError.value = false
})

const generateSummary = async () => {
  if (!props.paper || !props.paper._id) return
  
  isSummarizing.value = true
  summary.value = null
  hasError.value = false
  
  try {
    const data = await api.summarizePaper(props.paper._id)
    summary.value = data.summary
  } catch (error) {
    hasError.value = true
    summary.value = `Error generating summary: ${error.message}. Wait a few moments and try again.`
  } finally {
    isSummarizing.value = false
  }
}
</script>
