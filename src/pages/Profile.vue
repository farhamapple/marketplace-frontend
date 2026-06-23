<template>
  <div class="profile-page">
    <div class="app__frame">
      <!-- Header -->
      <header class="app-header">
        <div class="app-header__left">
          <button class="app-header__back" @click="router.back()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="app-header__title">Profil</h1>
        </div>
      </header>

      <!-- Profile Content -->
      <main class="profile-content">
        <div class="profile-card">
          <div class="profile-card__avatar">
            <span class="profile-card__initials">{{ initials }}</span>
          </div>
          <h2 class="profile-card__name">{{ authStore.user?.name || localStorage.getItem('userName') }}</h2>
          <p class="profile-card__email">{{ authStore.user?.email }}</p>
        </div>

        <div class="profile-actions">
          <MnButton variant="destructive" fullWidth @click="handleLogout">
            Keluar
          </MnButton>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import MnButton from '../components/MnButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const initials = computed(() => {
  const name = authStore.user?.name || localStorage.getItem('userName') || 'U'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'Marketplace' })
}
</script>

<style scoped>
.profile-page {
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

.profile-content {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  text-align: center;
  padding: 32px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
}

.profile-card__avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-card__initials {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

.profile-card__name {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px;
}

.profile-card__email {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.profile-actions {
  padding: 0 16px;
}
</style>
