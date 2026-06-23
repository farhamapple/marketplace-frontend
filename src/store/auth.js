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
       const loginRes = await apiLogin(email, password)
       const token = loginRes.data.token || loginRes.data.data?.token
       if (token) {
         localStorage.setItem('authToken', token)
       }
       await fetchUser()
       if (user.value) {
         localStorage.setItem('userName', user.value.name)
       }
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
       if (user.value) {
         localStorage.setItem('userName', user.value.name)
       }
     } catch {
       user.value = null
       localStorage.removeItem('userName')
       localStorage.removeItem('authToken')
     }
   }

   async function logout() {
     try {
       await apiLogout()
     } finally {
       user.value = null
       localStorage.removeItem('userName')
       localStorage.removeItem('authToken')
     }
   }

  return { user, loading, error, isAuthenticated, login, register, fetchUser, logout }
})
