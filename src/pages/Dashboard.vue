<template>
  <div class="app">
    <div class="app__frame">
      <!-- Header -->
      <header class="app-header">
      <div class="app-header__left">
        <h1 class="app-header__brand">MWL 13</h1>
      </div>
      <div class="app-header__right">
        <template v-if="authStore.isAuthenticated">
          <button class="app-header__avatar" @click="showMenu = !showMenu">
            {{ initials }}
          </button>
          <div v-if="showMenu" class="app-header__dropdown" @click="handleLogout">
            <span>{{ authStore.user?.email }}</span>
            <span class="app-header__dropdown-action">Keluar</span>
          </div>
        </template>
        <template v-else>
          <router-link :to="{ name: 'Login' }" class="app-header__link">Masuk</router-link>
        </template>
      </div>
    </header>

    <!-- Search -->
    <div class="app-search">
      <div class="app-search__bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari produk..."
          class="app-search__input"
        />
      </div>
    </div>

    <!-- Categories -->
    <div class="app-categories">
      <button
        class="cat-pill"
        :class="{ 'cat-pill--active': !activeCategory }"
        @click="activeCategory = ''"
      >Semua</button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="cat-pill"
        :class="{ 'cat-pill--active': activeCategory === cat.slug }"
        @click="activeCategory = cat.slug"
      >{{ cat.name }}</button>
    </div>

    <!-- Content -->
    <main class="app-content">
      <div v-if="loading" class="state-msg">
        <div class="spinner" />
      </div>
      <div v-else-if="filteredProducts.length === 0" class="state-msg">
        Produk tidak ditemukan
      </div>
      <div v-else class="app-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </main>

    <!-- Bottom Nav -->
    <nav class="app-bottom">
      <button class="app-bottom__item app-bottom__item--active">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <span>Beranda</span>
      </button>
      <button class="app-bottom__item">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span>Cari</span>
      </button>
      <button class="app-bottom__item">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
        <span>Keranjang</span>
      </button>
      <button class="app-bottom__item">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Profile</span>
      </button>
    </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { getProducts, getCategories } from '../services/api'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const showMenu = ref(false)
const products = ref([])
const categories = ref([])
const loading = ref(true)
const searchQuery = ref('')
const activeCategory = ref('')

const initials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

const filteredProducts = computed(() => {
  let result = products.value
  if (activeCategory.value) {
    result = result.filter(p => p.category.slug === activeCategory.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q))
  }
  return result
})

async function fetchData() {
  loading.value = true
  try {
    const [prodRes, catRes] = await Promise.all([
      getProducts({ per_page: 100 }),
      getCategories(),
    ])
    products.value = prodRes.data.data
    categories.value = catRes.data.data
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'Marketplace' })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--color-bg);
  padding-bottom: 72px;
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

/* ─── Header ─── */
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

.app-header__brand {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.app-header__right {
  position: relative;
}

.app-header__link {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
}

.app-header__avatar {
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-header__dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 12px 16px;
  min-width: 160px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.app-header__dropdown-action {
  color: var(--color-error);
  font-weight: 600;
}

/* ─── Search ─── */
.app-search {
  padding: 12px 16px 8px;
}

.app-search__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 10px 14px;
  color: var(--color-text-secondary);
}

.app-search__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background: transparent;
}

.app-search__input::placeholder {
  color: var(--color-neutral);
}

/* ─── Categories ─── */
.app-categories {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 16px 12px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.app-categories::-webkit-scrollbar {
  display: none;
}

.cat-pill {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  font-family: var(--font-sans);
}

.cat-pill--active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

/* ─── Content ─── */
.app-content {
  padding: 0 12px;
}

.app-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* ─── State ─── */
.state-msg {
  text-align: center;
  padding: 64px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
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

/* ─── Bottom Nav ─── */
.app-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 64px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.app-bottom__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 12px;
  color: var(--color-text-secondary);
  font-size: 10px;
  font-weight: 500;
  font-family: var(--font-sans);
  transition: color 0.2s;
}

.app-bottom__item--active {
  color: var(--color-primary);
}
</style>
