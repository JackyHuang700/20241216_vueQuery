<template>
  <div class="flex justify-between items-center">
    <BaseInput type="text" v-model="strLabel" class="w-full" :ref="(_ref: HTMLInputElement) => ref_label = _ref"
      placeholder="請輸入..." @keyup.enter="onAddTodo" />

    <BaseButton @click="onAddTodo" class="ml-2 shrink-0">
      <span>新增</span>
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { } from 'vue';
import { apiPostTodo } from '@/composables/useApi'
import { useMutation } from '@tanstack/vue-query';
import type { Todo } from '~/types/type';

import BaseInput from '~/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

type TEmit = {
  getRefetchTodos: []
}

const emit = defineEmits<TEmit>()

const mutation = useMutation(apiPostTodo())

const strLabel = ref('')
const ref_label = ref<HTMLInputElement | null>(null)

const onAddTodo = () => {
  const _params: Todo = {
    id: crypto.randomUUID(),
    label: strLabel.value,
    checked: false,
  }

  mutation.mutate(_params)
  emit('getRefetchTodos')
  strLabel.value = ''
  ref_label.value?.onFocus()
}


defineOptions({
  name: 'AddTodo',
})
</script>
<style scoped></style>