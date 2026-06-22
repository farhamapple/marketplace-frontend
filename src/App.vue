<template>
  <router-view />
</template>

<style>
:root {
  --font-sans: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'General Sans', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;

  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-secondary: #20970b;
  --color-neutral: #9c9c9c;
  --color-bg: #fafafa;
  --color-surface: #fff;
  --color-text-primary: #0a0a0a;
  --color-text-secondary: #6b6b6b;
  --color-border: #e8e8ec;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--color-bg);
  color: var(--color-text-primary);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
}

p {
  line-height: 1.6;
}
</style>
