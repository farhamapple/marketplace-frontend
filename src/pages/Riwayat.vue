<template>
  <div class="riwayat-page">
    <div class="app__frame">
      <header class="app-header">
        <div class="app-header__left">
          <button class="app-header__back" @click="router.back()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="app-header__title">Riwayat</h1>
        </div>
      </header>

      <main class="riwayat-content">
        <div v-if="!isLoggedIn" class="state-msg">
          <p>Silakan masuk terlebih dahulu</p>
          <router-link :to="{ name: 'Login' }" class="riwayat-link">Masuk</router-link>
        </div>

        <div v-else-if="loading" class="state-msg">
          <div class="spinner" />
        </div>

        <div v-else-if="transactions.length === 0" class="state-msg">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="riwayat-empty-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <p>Belum ada transaksi</p>
          <router-link :to="{ name: 'Marketplace' }" class="riwayat-link">Belanja Sekarang</router-link>
        </div>

        <div v-else class="riwayat-list">
          <div
            v-for="tx in transactions"
            :key="tx.id"
            class="riwayat-item"
          >
            <img
              v-if="tx.product?.image"
              :src="tx.product.image"
              :alt="tx.product.name"
              class="riwayat-item__image"
            />
            <div v-else class="riwayat-item__image-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
            <div class="riwayat-item__body">
              <span class="riwayat-item__category">{{ tx.product?.category?.name }}</span>
              <h3 class="riwayat-item__name">{{ tx.product?.name }}</h3>
              <div class="riwayat-item__detail">
                <span class="riwayat-item__qty">{{ tx.quantity }}x</span>
                <span class="riwayat-item__price">{{ formatPrice(tx.total) }}</span>
              </div>
              <div class="riwayat-item__footer">
                <span class="riwayat-item__date">{{ formatDate(tx.created_at) }}</span>
                <span class="riwayat-item__label">{{ tx.type_label === 'Penjualan' ? 'Berhasil' : tx.type_label }}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { getTransactions } from '../services/api'

const router = useRouter()
const authStore = useAuthStore()

const transactions = ref([])
const loading = ref(true)

const isLoggedIn = computed(() => authStore.isAuthenticated || !!localStorage.getItem('userName'))

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

async function fetchTransactions() {
  loading.value = true
  try {
    const res = await getTransactions({ per_page: 50 })
    transactions.value = res.data.data || []
  } catch {
    transactions.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchTransactions()
  } else {
    loading.value = false
  }
})
</script>

<style scoped>
.riwayat-page {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.app__frame {
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  background: var(--color-surface);
  box-shadow: 0 0 40px rgba(0,0,0,0.1);
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  position: relative;
}

@media (max-width: 430px) {
  .app__frame {
    box-shadow: none;
    border: none;
  }
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 52px;
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-border);
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-header__back {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-header__back:hover {
  background: var(--color-bg);
}

.app-header__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.riwayat-content {
  padding: 12px;
}

.state-msg {
  text-align: center;
  padding: 80px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.riwayat-empty-icon {
  color: var(--color-neutral);
  margin-bottom: 8px;
}

.riwayat-link {
  display: inline-flex;
  padding: 10px 24px;
  border-radius: 12px;
  background: var(--color-primary);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(99,102,241,0.15);
  border-top-color: var(--color-primary);
  border-radius: 9999px;
  animation: spin 0.7s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.riwayat-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.riwayat-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.riwayat-item__image {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.riwayat-item__image-placeholder {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(99,102,241,0.04), rgba(32,151,11,0.04));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: rgba(99,102,241,0.25);
}

.riwayat-item__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.riwayat-item__category {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.riwayat-item__name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.riwayat-item__detail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.riwayat-item__qty {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.riwayat-item__price {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.riwayat-item__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.riwayat-item__date {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.riwayat-item__label {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-secondary);
  text-transform: uppercase;
}
</style>
