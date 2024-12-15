<template>
  <template v-if="props.checked">
    <span class="line-through">{{ props.label }}</span>
  </template>
  <template v-else>
    <span>{{ props.label }}</span>
  </template>
</template>

<script setup lang="ts">
import { } from 'vue';
import type { Todo } from '~/types/type';

type Props = {
  label: Todo['label']
  checked: Todo['checked']
}
const props = defineProps<Props>()

defineOptions({
  name: 'TodoLabel',
})
</script>
<style scoped></style>