<template>
  <button v-bind="$attrs" ref="ref_button" class="btn-style">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { } from 'vue'

const ref_button = ref<HTMLButtonElement | null>(null)

defineExpose({
  ref_button,
})

defineOptions({
  name: 'BaseButton',
})
</script>
<style scoped>
.btn-style {
  @apply text-amber-100 bg-zinc-800 rounded-lg px-3 py-1 transition-all duration-300;
  @apply hover:text-amber-300;
}
</style>