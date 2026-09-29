<script setup>
import { onMounted } from 'vue'
import { useBookmarkStore } from '../stores/bookmark'

const bookmarkStore = useBookmarkStore()

onMounted(() => {
  bookmarkStore.fetchBookmarks()
})
</script>

<template>
  <main class="min-h-screen bg-gray-50 px-6 py-10">

    <div class="mx-auto max-w-7xl">

      <h1 class="text-3xl font-bold text-gray-900">
        My Bookmarks
      </h1>

      <p class="mt-2 text-gray-600">
        Research papers you have saved
      </p>

      <!-- No Bookmarks -->
      <div
        v-if="bookmarkStore.bookmarks.length === 0"
        class="mt-10 rounded-xl bg-white p-10 text-center shadow-sm"
      >
        <p class="text-gray-500">
          You haven't bookmarked any papers yet.
        </p>

        <router-link
          to="/papers"
          class="mt-4 inline-block font-semibold text-blue-700 hover:underline"
        >
          Browse Research Papers →
        </router-link>
      </div>

      <!-- Bookmarked Papers -->
      <div
        v-else
        class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >

        <article
          v-for="paper in bookmarkStore.bookmarks"
          :key="paper._id || paper.id"
          class="rounded-xl bg-white p-6 shadow-sm"
        >

          <span class="text-sm font-medium text-blue-700">
            {{ paper.category }}
          </span>

          <h2 class="mt-3 text-xl font-bold text-gray-900">
            {{ paper.title }}
          </h2>

          <p class="mt-2 text-sm text-gray-500">
            {{ paper.authors }}
          </p>

          <p class="mt-1 text-sm text-gray-500">
            Published: {{ paper.year }}
          </p>

          <div class="mt-6 flex items-center justify-between">

            <router-link
              :to="`/papers/${paper._id || paper.id}`"
              class="font-semibold text-blue-700 hover:text-blue-900"
            >
              Read More →
            </router-link>

            <button
              @click="bookmarkStore.removeBookmark(paper._id || paper.id)"
              class="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Remove
            </button>

          </div>

        </article>

      </div>

    </div>

  </main>
</template>