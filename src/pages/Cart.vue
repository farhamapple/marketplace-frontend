<template>
  <div class="cart-page">
    <div class="app__frame">
      <header class="app-header">
        <div class="app-header__left">
          <button class="app-header__back" @click="router.back()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="app-header__title">Keranjang</h1>
        </div>
      </header>

      <main class="cart-content">
        <div v-if="!isLoggedIn" class="state-msg">
          <p>Silakan masuk terlebih dahulu</p>
          <router-link :to="{ name: 'Login' }" class="cart-login-link">Masuk</router-link>
        </div>

        <div v-else-if="cartStore.loading" class="state-msg">
          <div class="spinner" />
        </div>

        <div v-else-if="cartStore.items.length === 0" class="state-msg">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="cart-empty-icon"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
          <p>Keranjang kosong</p>
          <router-link :to="{ name: 'Marketplace' }" class="cart-shop-link">Belanja Sekarang</router-link>
        </div>

        <div v-else class="cart-list">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="cart-item"
          >
            <img
              v-if="item.product?.image"
              :src="item.product.image"
              :alt="item.product.name"
              class="cart-item__image"
            />
            <div v-else class="cart-item__image-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
            <div class="cart-item__body">
              <span class="cart-item__category">{{ item.product?.category?.name }}</span>
              <h3 class="cart-item__name">{{ item.product?.name }}</h3>
              <p class="cart-item__price">{{ formatPrice(item.product?.price) }}</p>
              <div class="cart-item__actions">
                <div class="cart-qty">
                  <button class="cart-qty__btn" @click="decreaseQty(item)" :disabled="item.quantity <= 1">-</button>
                  <span class="cart-qty__value">{{ item.quantity }}</span>
                  <button class="cart-qty__btn" @click="increaseQty(item)">+</button>
                </div>
                <span class="cart-item__subtotal">{{ formatPrice(item.subtotal) }}</span>
              </div>
            </div>
            <button class="cart-item__remove" @click="handleRemove(item.id)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </main>

      <div v-if="isLoggedIn && cartStore.items.length > 0" class="cart-footer">
        <div class="cart-footer__summary">
          <span class="cart-footer__label">Total</span>
          <span class="cart-footer__total">{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        <MnButton
          variant="primary"
          fullWidth
          @click="showConfirm = true"
        >
          Bayar
        </MnButton>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <Teleport to="body">
      <div v-if="showConfirm" class="overlay" @click.self="showConfirm = false">
        <div class="dialog">
          <h3 class="dialog__title">Konfirmasi Pembayaran</h3>
          <p class="dialog__text">Anda akan membayar <strong>{{ formatPrice(cartStore.totalPrice) }}</strong> untuk {{ cartStore.items.length }} item.</p>
          <div class="dialog__actions">
            <MnButton variant="secondary" fullWidth @click="showConfirm = false">Batal</MnButton>
            <MnButton variant="primary" fullWidth :loading="checkoutLoading" @click="handleCheckout">Ya, Bayar</MnButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Success Dialog -->
    <Teleport to="body">
      <div v-if="showSuccess" class="overlay">
        <div class="dialog dialog--success">
          <div class="dialog__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 class="dialog__title">Pembayaran Berhasil!</h3>
          <p class="dialog__text">Transaksi Anda telah diproses.</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../store/cart'
import { useAuthStore } from '../store/auth'
import MnButton from '../components/MnButton.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isAuthenticated || !!localStorage.getItem('userName'))

const showConfirm = ref(false)
const showSuccess = ref(false)
const checkoutLoading = ref(false)

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

async function increaseQty(item) {
  await cartStore.update(item.id, item.quantity + 1)
}

async function decreaseQty(item) {
  if (item.quantity > 1) {
    await cartStore.update(item.id, item.quantity - 1)
  }
}

async function handleRemove(id) {
  await cartStore.remove(id)
}

async function handleCheckout() {
  checkoutLoading.value = true
  try {
    await cartStore.doCheckout()
    showConfirm.value = false
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
      router.push({ name: 'Riwayat' })
    }, 1500)
  } catch {
    showConfirm.value = false
  } finally {
    checkoutLoading.value = false
  }
}

onMounted(() => {
  if (isLoggedIn.value) {
    cartStore.fetchCart()
  }
})
</script>

<style scoped>
.cart-page {
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
  padding-bottom: 100px;
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

.cart-content {
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

.cart-empty-icon {
  color: var(--color-neutral);
  margin-bottom: 8px;
}

.cart-login-link,
.cart-shop-link {
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

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  position: relative;
}

.cart-item__image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.cart-item__image-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(99,102,241,0.04), rgba(32,151,11,0.04));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: rgba(99,102,241,0.25);
}

.cart-item__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cart-item__category {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.cart-item__name {
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

.cart-item__price {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 2px 0 0;
}

.cart-item__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.cart-qty {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.cart-qty__btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}

.cart-qty__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.cart-qty__value {
  min-width: 28px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
}

.cart-item__subtotal {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.cart-item__remove {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item__remove:hover {
  background: var(--color-bg);
  color: var(--color-error);
}

.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-footer__summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-footer__label {
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.cart-footer__total {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}

/* ─── Overlay & Dialog ─── */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.dialog {
  width: 100%;
  max-width: 320px;
  background: var(--color-surface);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog--success {
  align-items: center;
  text-align: center;
}

.dialog__icon {
  color: var(--color-success);
}

.dialog__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.dialog__text {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

.dialog__actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
</style>
