<template>
  <button
    :class="[
      'mn-btn',
      `mn-btn--${variant}`,
      { 'mn-btn--full': fullWidth, 'mn-btn--loading': loading },
    ]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="mn-btn__spinner" />
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'destructive'].includes(v),
  },
  fullWidth: Boolean,
  disabled: Boolean,
  loading: Boolean,
})

defineEmits(['click'])
</script>

<style scoped>
.mn-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: 1px solid transparent;
  border-radius: 12px;
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, opacity 0.2s;
}

.mn-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mn-btn--primary {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.mn-btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.mn-btn--secondary {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.mn-btn--secondary:hover:not(:disabled) {
  background: var(--color-bg);
}

.mn-btn--ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: transparent;
}

.mn-btn--ghost:hover:not(:disabled) {
  background: var(--color-bg);
}

.mn-btn--destructive {
  background: var(--color-error);
  color: #fff;
  border-color: var(--color-error);
}

.mn-btn--destructive:hover:not(:disabled) {
  background: #dc2626;
}

.mn-btn--full {
  width: 100%;
}

.mn-btn--loading {
  position: relative;
}

.mn-btn__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 9999px;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
