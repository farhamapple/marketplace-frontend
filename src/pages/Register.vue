<template>
  <div class="login-page">
    <div class="app__frame">
      <div class="login-page__header">
      <h1 class="login-page__brand">MWL 13</h1>
      <p class="login-page__tagline">Marketplace With Laravel 13</p>
    </div>

    <div class="login-card">
      <h2 class="login-card__title">Daftar Akun</h2>
      <form @submit.prevent="handleRegister" class="login-form">
        <MnInput
          v-model="name"
          label="Nama"
          type="text"
          placeholder="Nama lengkap"
          :error="errors.name"
        />

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
          placeholder="Minimal 8 karakter"
          :error="errors.password"
        />

        <MnInput
          v-model="passwordConfirmation"
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
          :error="errors.passwordConfirmation"
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
          Daftar
        </MnButton>

        <p class="login-form__footer">
          Sudah punya akun?
          <router-link :to="{ name: 'Login' }" class="login-form__link">Masuk</router-link>
        </p>
      </form>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import MnInput from '../components/MnInput.vue'
import MnButton from '../components/MnButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const errors = reactive({ name: '', email: '', password: '', passwordConfirmation: '' })
const authError = ref('')

async function handleRegister() {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.passwordConfirmation = ''
  authError.value = ''

  if (!name.value.trim()) errors.name = 'Nama harus diisi'
  if (!email.value) errors.email = 'Email harus diisi'
  if (!password.value) errors.password = 'Password harus diisi'
  else if (password.value.length < 8) errors.password = 'Password minimal 8 karakter'
  if (!passwordConfirmation.value) errors.passwordConfirmation = 'Konfirmasi password harus diisi'
  else if (password.value !== passwordConfirmation.value) errors.passwordConfirmation = 'Password tidak cocok'
  if (errors.name || errors.email || errors.password || errors.passwordConfirmation) return

  try {
    await authStore.register(name.value.trim(), email.value, password.value, passwordConfirmation.value)
    router.push({ name: 'Marketplace' })
  } catch (err) {
    const data = err.response?.data
    if (data?.errors) {
      errors.name = data.errors.name?.[0] || ''
      errors.email = data.errors.email?.[0] || ''
      errors.password = data.errors.password?.[0] || ''
    }
    authError.value = data?.message || 'Registrasi gagal'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: var(--color-bg);
}

.app__frame {
  width: 100%;
  max-width: 430px;
  background: var(--color-surface);
  border-radius: 20px;
  box-shadow: 0 0 40px rgba(0,0,0,0.1);
  border: 1px solid var(--color-border);
  padding: 32px;
}

@media (max-width: 430px) {
  .app__frame {
    border-radius: 0;
    box-shadow: none;
    border: none;
    padding: 24px 16px;
  }
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

.login-form__footer {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.login-form__link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}
</style>
