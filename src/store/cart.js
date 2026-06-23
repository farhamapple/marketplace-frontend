import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCart, addToCart, updateCartItem, removeCartItem, checkout as apiCheckout } from '../services/api'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalItems = computed(() => items.value.length)
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + (item.subtotal || 0), 0)
  )

  async function fetchCart() {
    loading.value = true
    error.value = null
    try {
      const res = await getCart()
      items.value = res.data.data || []
    } catch {
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function add(productId, quantity = 1) {
    error.value = null
    try {
      await addToCart(productId, quantity)
      await fetchCart()
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Gagal menambahkan ke keranjang'
      throw err
    }
  }

  async function update(id, quantity) {
    error.value = null
    try {
      await updateCartItem(id, quantity)
      await fetchCart()
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Gagal memperbarui keranjang'
      throw err
    }
  }

  async function remove(id) {
    error.value = null
    try {
      await removeCartItem(id)
      await fetchCart()
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Gagal menghapus item'
      throw err
    }
  }

  async function doCheckout() {
    error.value = null
    try {
      const res = await apiCheckout()
      items.value = []
      return res.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Checkout gagal'
      throw err
    }
  }

  return { items, loading, error, totalItems, totalPrice, fetchCart, add, update, remove, doCheckout }
})
