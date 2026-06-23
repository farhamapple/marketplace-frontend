import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRedirecting = false

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status !== 401) return Promise.reject(error)

    const url = error.config?.url || ''
    if (url.includes('/auth/login') || url.includes('/auth/register')) {
      return Promise.reject(error)
    }

    if (!isRedirecting) {
      isRedirecting = true
      localStorage.removeItem('authToken')
      localStorage.removeItem('userName')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

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
  const response = await api.post('/api/v1/auth/login', { email, password, device_name: generateDeviceName() })
  const token = response.data.token || response.data.data?.token
  if (token) {
    localStorage.setItem('authToken', token)
  }
  return response
}

export async function getUser() {
  return api.get('/api/v1/auth/me')
}

export async function register(name, email, password, passwordConfirmation) {
  const deviceName = generateDeviceName()
  return api.post('/api/v1/auth/register', {
    name, email, password,
    password_confirmation: passwordConfirmation,
    device_name: deviceName,
  })
}

export async function logout() {
  try {
    await api.post('/api/v1/auth/logout')
  } finally {
    localStorage.removeItem('authToken')
  }
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

export async function getCart() {
  return api.get('/api/v1/cart')
}

export async function addToCart(productId, quantity = 1) {
  return api.post('/api/v1/cart', { product_id: productId, quantity })
}

export async function updateCartItem(id, quantity) {
  return api.patch(`/api/v1/cart/${id}`, { quantity })
}

export async function removeCartItem(id) {
  return api.delete(`/api/v1/cart/${id}`)
}

export async function checkout() {
  return api.post('/api/v1/cart/checkout')
}

export async function getTransactions(params) {
  return api.get('/api/v1/transactions', { params })
}

export async function getTransaction(id) {
  return api.get(`/api/v1/transactions/${id}`)
}

export default api
