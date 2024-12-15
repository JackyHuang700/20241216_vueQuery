<template>
  <template v-if="false">
    <input type="checkbox" v-model="model" v-bind="$attrs" ref="ref_chk" />
  </template>
  <template v-else>
    <input type="checkbox" v-bind="$attrs" ref="ref_chk" />
  </template>

</template>

<script setup lang="ts">
import { } from 'vue';

const model = defineModel({
  required: false,
  type: Boolean,
})

const ref_chk = ref<HTMLInputElement | null>(null)

defineExpose({
  ref_chk
})

defineOptions({
  name: 'BaseCheckbox',
})
</script>
<style scoped></style>