<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const email = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Please enter your email and password.')
    return
  }

  const result = await userStore.loginUser(email.value, password.value)
  if (result.success) {
    const role = userStore.currentUser.role
    if (role === 'admin' || role === 'root') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } else {
    alert(result.message)
  }
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 px-6 py-12">

    <div class="mx-auto max-w-md">

      <div class="rounded-2xl bg-white p-8 shadow-sm">

        <!-- Header -->
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p class="mt-2 text-gray-600">
            Login to your ResearchRadar account
          </p>
        </div>

        <!-- Login Form -->
        <form
          @submit.prevent="handleLogin"
          class="mt-8 space-y-5"
        >

          <!-- Email -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            class="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Login
          </button>

        </form>

        <!-- Signup Link -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?

          <router-link
            to="/signup"
            class="font-semibold text-blue-700 hover:underline"
          >
            Sign Up
          </router-link>
        </p>

      </div>

    </div>

  </main>
</template>