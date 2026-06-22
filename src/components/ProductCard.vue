<template>
  <div class="card">
    <div class="card__image">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        loading="lazy"
      />
      <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="card__icon"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
    </div>
    <div class="card__body">
      <span class="card__category">{{ product.category.name }}</span>
      <h3 class="card__name">{{ product.name }}</h3>
      <p class="card__price">{{ formatPrice(product.price) }}</p>
      <div class="card__meta">
        <span class="card__sold">{{ product.sold }} terjual</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
})

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}
</script>

<style scoped>
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
}

.card__image {
  width: 100%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99,102,241,0.04), rgba(32,151,11,0.04));
  overflow: hidden;
}

.card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__icon {
  color: rgba(99,102,241,0.25);
}

.card__body {
  padding: 10px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card__category {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.card__name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__price {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 2px 0 0;
}

.card__meta {
  margin-top: 4px;
}

.card__sold {
  font-size: 11px;
  color: var(--color-text-secondary);
}
</style>
