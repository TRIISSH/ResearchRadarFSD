<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleSignup = async () => {
  if (
    !name.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    alert('Please fill in all fields.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  try {
    const data = await api.register({
      name: name.value,
      email: email.value,
      password: password.value
    })

    alert(data.message || 'Account created successfully!')
    router.push('/login')

  } catch (error) {
    console.error(error)
    alert(error.message || 'Unable to connect to the server.')
  }
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 px-6 py-12">

    <div class="mx-auto max-w-md">

      <!-- Signup Card -->
      <div class="rounded-2xl bg-white p-8 shadow-sm">

        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900">
            Create Your Account
          </h1>

          <p class="mt-2 text-gray-600">
            Join ResearchRadar
          </p>
        </div>

        <!-- Form -->
        <form
          @submit.prevent="handleSignup"
          class="mt-8 space-y-5"
        >

          <!-- Full Name -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              v-model="name"
              type="text"
              placeholder="Enter your full name"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

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
              placeholder="Create a password"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <!-- Signup Button -->
          <button
            type="submit"
            class="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Sign Up
          </button>

        </form>

        <!-- Login Link -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?

          <router-link
            to="/login"
            class="font-semibold text-blue-700 hover:underline"
          >
            Login
          </router-link>
        </p>

      </div>

    </div>

  </main>
</template>