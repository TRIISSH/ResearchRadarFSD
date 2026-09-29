const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export default {
  async getPapers(queryParams = '') {
    const res = await fetch(`${API_URL}/papers${queryParams}`)
    if (!res.ok) throw new Error('Failed to fetch papers')
    return res.json()
  },
  async getPaper(id) {
    const res = await fetch(`${API_URL}/papers/${id}`)
    if (!res.ok) throw new Error('Failed to fetch paper')
    return res.json()
  },
  async summarizePaper(id) {
    const res = await fetch(`${API_URL}/papers/${id}/summarize`, { method: 'POST' })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to summarize paper')
    }
    return res.json()
  },
  async createPaper(paper) {
    const res = await fetch(`${API_URL}/papers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paper)
    })
    if (!res.ok) throw new Error('Failed to create paper')
    return res.json()
  },
  async updatePaper(id, paper) {
    const res = await fetch(`${API_URL}/papers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paper)
    })
    if (!res.ok) throw new Error('Failed to update paper')
    return res.json()
  },
  async deletePaper(id) {
    const res = await fetch(`${API_URL}/papers/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete paper')
    return res.json()
  },
  async login(credentials) {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || 'Login failed')
    }
    return res.json()
  },
  async register(user) {
    const res = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || 'Registration failed')
    }
    return res.json()
  },
  async getUsers() {
    const res = await fetch(`${API_URL}/users`)
    if (!res.ok) throw new Error('Failed to fetch users')
    return res.json()
  },
  async updateUserRole(id, role) {
    const res = await fetch(`${API_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    })
    if (!res.ok) throw new Error('Failed to update role')
    return res.json()
  },
  async getBookmarks(userId) {
    const res = await fetch(`${API_URL}/users/${userId}/bookmarks`)
    if (!res.ok) throw new Error('Failed to fetch bookmarks')
    return res.json()
  },
  async addBookmark(userId, paperId) {
    const res = await fetch(`${API_URL}/users/${userId}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paperId })
    })
    if (!res.ok) throw new Error('Failed to add bookmark')
    return res.json()
  },
  async removeBookmark(userId, paperId) {
    const res = await fetch(`${API_URL}/users/${userId}/bookmarks/${paperId}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Failed to remove bookmark')
    return res.json()
  }
}
