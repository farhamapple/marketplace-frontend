import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, getUser, logout as apiLogout } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      await apiLogin(email, password)
      await fetchUser()
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(name, email, password, passwordConfirmation) {
    loading.value = true
    error.value = null
    try {
      await apiRegister(name, email, password, passwordConfirmation)
      await fetchUser()
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    try {
      const response = await getUser()
      user.value = response.data.data || response.data
    } catch {
      user.value = null
    }
  }

  async function logout() {
    try {
      await apiLogout()
    } finally {
      user.value = null
    }
  }

  return { user, loading, error, isAuthenticated, login, register, fetchUser, logout }
})
