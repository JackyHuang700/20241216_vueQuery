<template>
  <input type="text" v-model="model" v-bind="$attrs" class="input-style" ref="ref_input" />
</template>

<script setup lang="ts">
import { } from 'vue';

type Props = {

}
const props = defineProps<Props>()

const model = defineModel({
  required: true,
  type: String,
})

const ref_input = ref<HTMLInputElement | null>(null)

const onFocus = () => ref_input.value?.focus()

defineExpose({
  ref_input,
  onFocus,
})

defineOptions({
  name: 'BaseInput',
})
</script>
<style scoped>
.input-style {
  @apply text-amber-100 bg-zinc-800 rounded-lg px-2 py-1;
}

.input-style::placeholder {
  @apply text-amber-50;
}
</style>