<template>
  <div class="mn-input-wrapper">
    <label v-if="label" class="mn-input__label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="mn-input"
      :class="{ 'mn-input--error': error }"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    />
    <p v-if="error" class="mn-input__error">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  error: String,
  inputId: { type: String, default: () => `input-${Math.random().toString(36).slice(2)}` },
})

defineEmits(['update:modelValue', 'blur'])
</script>

<style scoped>
.mn-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mn-input__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.mn-input {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  color: var(--color-text-primary);
  background: var(--color-surface);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.mn-input::placeholder {
  color: var(--color-neutral);
}

.mn-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}

.mn-input--error {
  border-color: var(--color-error);
}

.mn-input--error:focus {
  box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
}

.mn-input__error {
  font-size: 12px;
  color: var(--color-error);
  margin: 0;
}
</style>
