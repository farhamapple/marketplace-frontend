<template>
  <div class="mn-card" :class="[`mn-card--${padding}`]">
    <h2 v-if="title" class="mn-card__title">{{ title }}</h2>
    <div class="mn-card__body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
})
</script>

<style scoped>
.mn-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.mn-card--sm {
  padding: 16px;
}

.mn-card--md {
  padding: 24px;
}

.mn-card--lg {
  padding: 32px;
}

.mn-card__title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 16px;
  letter-spacing: -0.03em;
}

.mn-card__body {
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
