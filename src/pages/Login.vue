<template>
  <div class="login-page">
    <div class="login-page__header">
      <h1 class="login-page__brand">MWL 13</h1>
      <p class="login-page__tagline">Marketplace With Laravel 13</p>
    </div>

    <div class="login-card">
      <h2 class="login-card__title">Sign In</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <MnInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          :error="errors.email"
        />

        <MnInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          :error="errors.password"
        />

        <div v-if="authError" class="login-form__alert">
          {{ authError }}
        </div>

        <MnButton
          type="submit"
          variant="primary"
          :loading="authStore.loading"
          fullWidth
        >
          Sign In
        </MnButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import MnCard from '../components/MnCard.vue'
import MnInput from '../components/MnInput.vue'
import MnButton from '../components/MnButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errors = reactive({ email: '', password: '' })
const authError = ref('')

async function handleLogin() {
  errors.email = ''
  errors.password = ''
  authError.value = ''

  if (!email.value) errors.email = 'Email is required'
  if (!password.value) errors.password = 'Password is required'
  if (errors.email || errors.password) return

  try {
    await authStore.login(email.value, password.value)
    router.push({ name: 'Marketplace' })
  } catch (err) {
    const data = err.response?.data
    if (data?.errors) {
      errors.email = data.errors.email?.[0] || ''
      errors.password = data.errors.password?.[0] || ''
    }
    authError.value = data?.message || 'Invalid email or password'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--color-bg);
}

.login-page__header {
  text-align: center;
  margin-bottom: 32px;
}

.login-page__brand {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
  letter-spacing: -0.04em;
}

.login-page__tagline {
  font-size: 18px;
  color: var(--color-text-secondary);
  margin: 8px 0 0;
}

.login-card {
  width: 100%;
  max-width: 420px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  padding: 32px;
}

.login-card__title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 24px;
  letter-spacing: -0.03em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-form__alert {
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid var(--color-error);
  border-radius: 8px;
  color: var(--color-error);
  font-size: 14px;
  font-weight: 500;
}
</style>
