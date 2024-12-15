<template>
  <template v-if="false">
    <div class="mb-3.5">{{ arrObjTodo }}</div>
  </template>
  <div class="w-full text-right flex justify-end items-center gap-2 mb-4">
    <BaseButton type="button" @click="setAddOnErrorData">
      <span>新增一筆 onError 資料</span>
    </BaseButton>
    <BaseButton type="button" @click="getRefetchTodos">
      <span>重整資料</span>
    </BaseButton>
  </div>

  <AddTodo @getRefetchTodos="getRefetchTodos" />
  <div>
    <template v-if="todoListIsPending">
      <span>isPending...</span>
    </template>
    <template v-else-if="false && deleteTodoIsPending">
      <span>deleteTodoIsPending...</span>
    </template>
    <template v-else-if="false && editTodoIsPending">
      <span>editTodoIsPending...</span>
    </template>
    <template v-else-if="todoListIsFetching">
      <span>isFetching...</span>
    </template>
    <template v-else-if="todoListStatus === 'error'">
      <span>Error: {{ error?.message }}</span>
    </template>
    <template v-else-if="todoData">
      <ul class="mt-4">
        <template v-for="_todo in arrObjTodo" :key="_todo.id">
          <li class="my-2">
            <template v-if="_todo.isEdit">
              <EditTodo v-model:checked="_todo.checked" :todo="_todo" :onUpdateTodo="onUpdateTodo"
                :onUpdateApiTodo="onUpdateApiTodo" @onChkChange="onChkChange" @getRefetchTodos="getRefetchTodos" />
            </template>
            <template v-else>
              <div class="flex justify-center items-center gap-2">
                <BaseCheckbox :checked="_todo.checked" @change="(e) => onChkChange(_todo.id, e.target.checked)" />
                <TodoLabel :label="_todo.label" :checked="_todo.checked"
                  @click="(e) => onChkChange(_todo.id, !_todo.checked)" class="cursor-pointer " />
                <div class="ml-auto flex justify-center items-center gap-2">
                  <BaseButton type="button" @click="() => onEditTodo(_todo.id)" class="btn-edit">
                    <span>編輯</span>
                  </BaseButton type="button">
                  <BaseButton type="button" @click="() => onDeleteTodo(_todo.id)"
                    class="!text-red-400 hover:!text-red-500">
                    <span>刪除</span>
                  </BaseButton>
                </div>
              </div>
            </template>

          </li>
        </template>
      </ul>
    </template>
    <VueQuery />

  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { apiGetTodos, apiDeleteTodo, apiEditTodo, ON_ERROR_KEY } from '@/composables/useApi'
import { useMutation } from '@tanstack/vue-query';
import type { Todo } from '~/types/type';

import VueQuery from '@/components/VueQueryDevtool.vue';
import AddTodo from '@/components/AddTodo.vue';
import EditTodo from '@/components/EditTodo.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseCheckbox from '@/components/BaseCheckbox.vue';
import TodoLabel from '@/components/TodoLabel.vue';


const { isPending: deleteTodoIsPending, mutateAsync: deleteTodoMutate } = useMutation(apiDeleteTodo())
const { isPending: editTodoIsPending, mutateAsync: editTodoMutate } = useMutation(apiEditTodo())

const arrObjTodo = ref<Todo[] | null>(null)

const { isPending: todoListIsPending, isFetching: todoListIsFetching, isError, data: todoData, error, status: todoListStatus, refetch } = apiGetTodos()

watch(() => todoData.value, (newVal) => {
  arrObjTodo.value = setConvertTodoApiData(newVal)
})

const onEditTodo = (id: Todo['id']) => {

  const _todo = todoData.value?.find((todo: Todo) => todo.id === id)
  if (_todo === undefined || _todo === null) {
    return
  }

  arrObjTodo.value = arrObjTodo.value?.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        isEdit: !todo.isEdit
      }
    }
    return todo
  }) || null
}

const onDeleteTodo = async (id: Todo['id']) => {
  try {

    const _deleteTodoMutate = await deleteTodoMutate(id)
    console.log('🚀 => file: TOdo.vue:107 => onDeleteTodo => aaaa:', _deleteTodoMutate)
    getRefetchTodos()
  } catch (error: Error | unknown) {
    console.error(error)

  } finally {
  }
}

const onUpdateApiTodo = async (value: Todo) => {

  delete value.isEdit

  await editTodoMutate(value)
}

const onUpdateTodo = (value: Todo) => {
  arrObjTodo.value = arrObjTodo.value?.map(todo => {
    if (todo.id === value.id) {
      return value
    }
    return todo
  }) || null
}

const onChkChange = (id: Todo['id'], checked: Todo['checked']) => {
  const _todo = todoData.value?.find((todo: Todo) => todo.id === id)
  if (_todo === undefined || _todo === null) {
    return
  }
  onUpdateApiTodo({
    ..._todo,
    checked
  })
}

const setConvertTodoApiData = (data: Todo[]) => {
  return data.map(todo => {

    const _oldTodo = arrObjTodo.value?.find((oldTodo: Todo) => oldTodo.id === todo.id)

    return {
      ...todo,
      isEdit: _oldTodo?.isEdit ?? false, // merge old data
    }
  })
}

const setAddOnErrorData = () => {
  const _params: Todo = {
    id: crypto.randomUUID(),
    label: ON_ERROR_KEY,
    checked: false,
  }


  editTodoMutate(_params)

}

const getRefetchTodos = () => {
  refetch()
}

defineOptions({
  name: 'Todo',
})



</script>
<style scoped></style>