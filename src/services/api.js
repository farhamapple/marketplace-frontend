import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export async function getCsrfCookie() {
  await api.get('/sanctum/csrf-cookie')
}

function generateDeviceName() {
  const id = crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36)
  return `web-${id}`
}

export async function login(email, password) {
  await getCsrfCookie()
  return api.post('/api/v1/auth/login', { email, password, device_name: generateDeviceName() })
}

export async function getUser() {
  return api.get('/api/v1/auth/me')
}

export async function logout() {
  return api.post('/api/v1/auth/logout')
}

export async function getProducts(params) {
  return api.get('/api/v1/products', { params })
}

export async function getProduct(id) {
  return api.get(`/api/v1/products/${id}`)
}

export async function getCategories() {
  return api.get('/api/v1/categories')
}

export default api
