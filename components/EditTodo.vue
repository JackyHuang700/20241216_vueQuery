<template>
  <div class="flex justify-between items-center gap-2">
    <template v-if="false">
      <span class="">{{ props.todo }}</span>
    </template>
    <BaseCheckbox :checked="isChecked" @change="onChkChange" />
    <BaseInput type="text" v-model="strLabel" class="w-full" />
    <BaseButton type="button" class="btn-edit ml-auto shrink-0" @click="onConfirmEdit">
      <span>確認</span>
    </BaseButton>
    <BaseButton type="button" @click="onCancelIsEdit" class="!text-white hover:!text-gray-300 shrink-0">
      <span>取消</span>
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import type { Todo } from '~/types/type';

import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '~/components/BaseInput.vue';
import BaseCheckbox from '@/components/BaseCheckbox.vue';

type Props = {
  todo: Todo
  onUpdateTodo: (value: Todo) => void
  onUpdateApiTodo: (value: Todo) => void
}
const props = defineProps<Props>()

type Emit = {
  onChkChange: [id: Todo['id'], checked: boolean]
  getRefetchTodos: []
}
const emit = defineEmits<Emit>()

const isChecked = defineModel('checked', {
  required: true,
  type: Boolean,
})

const strLabel = ref(props.todo.label)

watch(() => props.todo.label, (newVal) => {
  strLabel.value = newVal
})

const onConfirmEdit = async () => {
  await props.onUpdateApiTodo({
    ...props.todo,
    label: strLabel.value,
    isEdit: false
  })
  await props.onUpdateTodo({
    ...props.todo,
    isEdit: false
  })
  false && emit('getRefetchTodos')
}

const onCancelIsEdit = async () => {
  await props.onUpdateTodo({
    ...props.todo,
    isEdit: false
  })
}

const onChkChange = () => {
  emit('onChkChange', props.todo.id, !isChecked.value)
}

defineOptions({
  name: 'EditTodo',
})
</script>
<style scoped></style>