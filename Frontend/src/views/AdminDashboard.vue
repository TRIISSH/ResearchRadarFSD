<template>
  <div class="max-w-6xl mx-auto p-6 min-h-screen bg-[#fcfcfc] text-gray-900 font-sans">
    
    <header class="mb-10 flex justify-between items-end border-b border-slate-200 pb-6">
      <div>
        <h1 class="text-3xl font-serif text-slate-800 tracking-tight">Admin Dashboard</h1>
        <p class="text-slate-500 font-light mt-2">Manage research database</p>
      </div>
      <button 
        @click="showAddForm = !showAddForm"
        class="bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
      >
        {{ showAddForm ? 'Cancel' : '+ Add Paper' }}
      </button>
    </header>

    <!-- Tabs -->
    <div class="flex gap-4 mb-6 border-b border-slate-200">
      <button 
        @click="activeTab = 'papers'"
        :class="['pb-2 px-2 text-sm font-medium', activeTab === 'papers' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700']"
      >
        Papers
      </button>
      <button 
        v-if="userStore.currentUser?.role === 'root'"
        @click="activeTab = 'users'"
        :class="['pb-2 px-2 text-sm font-medium', activeTab === 'users' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700']"
      >
        Users (Root Only)
      </button>
    </div>

    <div v-if="activeTab === 'papers'">
      <!-- Add/Edit Form -->
      <div v-if="showAddForm" class="bg-white p-6 border border-slate-200 shadow-sm mb-10">
        <h2 class="text-lg font-serif font-medium mb-6">Add New Research Paper</h2>
        <form @submit.prevent="submitPaper" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Title *</label>
              <input v-model="form.title" type="text" required class="w-full p-2 border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Authors *</label>
              <input v-model="form.authors" type="text" required class="w-full p-2 border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Category *</label>
              <input v-model="form.category" type="text" required class="w-full p-2 border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Year *</label>
              <input v-model="form.year" type="number" required class="w-full p-2 border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">DOI</label>
              <input v-model="form.doi" type="text" class="w-full p-2 border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Source URL</label>
              <input v-model="form.sourceUrl" type="url" class="w-full p-2 border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Abstract *</label>
            <textarea v-model="form.abstract" required rows="4" class="w-full p-2 border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showAddForm = false" class="px-4 py-2 text-sm text-slate-600 border border-slate-300 hover:bg-slate-50">Cancel</button>
            <button type="submit" class="px-6 py-2 text-sm bg-slate-800 text-white hover:bg-slate-700">Save Paper</button>
          </div>
        </form>
      </div>

      <!-- Papers List -->
      <div class="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-slate-400">Loading database records...</div>
        <table v-else class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th class="p-4">Title</th>
              <th class="p-4">Category</th>
              <th class="p-4">Year</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="paper in papers" :key="paper._id" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="p-4">
                <div class="font-medium text-slate-800 line-clamp-1">{{ paper.title }}</div>
                <div class="text-xs text-slate-500 line-clamp-1">{{ paper.authors }}</div>
              </td>
              <td class="p-4 text-sm text-slate-600">{{ paper.category }}</td>
              <td class="p-4 text-sm text-slate-600">{{ paper.year }}</td>
              <td class="p-4 text-right text-sm">
                <button @click="deletePaper(paper._id)" class="text-red-600 hover:text-red-800 font-medium">Delete</button>
              </td>
            </tr>
            <tr v-if="papers.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-500">No papers found in database.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Users List -->
    <div v-if="activeTab === 'users'" class="bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="loadingUsers" class="p-8 text-center text-slate-400">Loading users...</div>
      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
            <th class="p-4">Role</th>
            <th class="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id" class="border-b border-slate-100 hover:bg-slate-50">
            <td class="p-4 font-medium text-slate-800">{{ user.name }}</td>
            <td class="p-4 text-sm text-slate-600">{{ user.email }}</td>
            <td class="p-4 text-sm text-slate-600">
              <select v-model="user.role" :disabled="user.role === 'root'" class="p-1 border border-slate-300 rounded text-sm">
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option v-if="user.role === 'root'" value="root">Root</option>
              </select>
            </td>
            <td class="p-4 text-sm">
              <button 
                @click="updateRole(user._id, user.role)" 
                :disabled="user.role === 'root'"
                class="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 disabled:opacity-50"
              >
                Update Role
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="4" class="p-8 text-center text-slate-500">No users found.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const activeTab = ref('papers')

const papers = ref([])
const loading = ref(true)
const showAddForm = ref(false)

const users = ref([])
const loadingUsers = ref(false)

const form = ref({
  title: '',
  authors: '',
  category: '',
  year: new Date().getFullYear(),
  doi: '',
  sourceUrl: '',
  abstract: '',
  verificationStatus: 'verified'
})

const fetchPapers = async () => {
  loading.value = true
  try {
    papers.value = await api.getPapers()
  } catch (err) {
    console.error('Error fetching papers:', err)
  } finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  if (userStore.currentUser?.role !== 'root') return
  loadingUsers.value = true
  try {
    users.value = await api.getUsers()
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    loadingUsers.value = false
  }
}

const submitPaper = async () => {
  try {
    await api.createPaper(form.value)
    showAddForm.value = false
    form.value = {
      title: '', authors: '', category: '', year: new Date().getFullYear(),
      doi: '', sourceUrl: '', abstract: '', verificationStatus: 'verified'
    }
    fetchPapers()
  } catch (err) {
    alert('Error saving paper')
  }
}

const deletePaper = async (id) => {
  if (confirm('Are you sure you want to delete this paper?')) {
    try {
      await api.deletePaper(id)
      fetchPapers()
    } catch (err) {
      alert('Error deleting paper')
    }
  }
}

const updateRole = async (id, newRole) => {
  const result = await userStore.updateUserRole(id, newRole)
  if (result.success) {
    alert('Role updated successfully')
  } else {
    alert(result.message || 'Failed to update role')
  }
}

onMounted(() => {
  fetchPapers()
  fetchUsers()
})
</script>