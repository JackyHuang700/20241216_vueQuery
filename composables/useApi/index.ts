import { } from 'vue'
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/vue-query'
import { type MutationOptions } from '@tanstack/vue-query'
import { apiNameTodo } from '@/composables/useApi/apiKey'
import { type Todo } from '~/types/type'

const BASE_URL = 'http://localhost:3001/todos'
const SLEEP_SEC = 1500
export const ON_ERROR_KEY = 'test onError'

//
export const apiGetTodos = () => useQuery({
  queryKey: [apiNameTodo],
  queryFn: async () => {
    const response = await fetch(`${BASE_URL}`)
    await sleep(SLEEP_SEC)
    return response.json()
  },
  // staleTime: 1000 * 60 * 5, // unmount => mount, 視窗重新取得焦點，重新取得資料
  // staleTime: Infinity, // 一直保持資料，不會重新取得資料
  // refetchInterval: 1000 * 60 * 5, // 重新取得資料的間隔時間
  // gcTime: 1000 * 600, // 快取時間，超過這個時間會被清除，到serve重新獲取
  // retry: 3, // 錯誤後，重新嘗試的次數
  // placeholderData: keepPreviousData, // 保持前一次的資料
  // placeholderData: [{  }] // mock data

})

export const apiPostTodo = () => {

  const queryClient = useQueryClient()

  // 資料無效化，重新進行請求
  const setTodoListInvalidateQueries = () => queryClient.invalidateQueries({ queryKey: [apiNameTodo] })

  return {
    mutationFn: async (params: unknown | Todo) => {

      const _isGoError = (params as Todo).label.trim().includes(ON_ERROR_KEY)
      if(_isGoError) {
        await sleep(1000)
        return Promise.reject({
          data: params,
          msg: 'api error test'
        })
      }

      const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      await sleep(SLEEP_SEC)
      return response.json()
    },
    onMutate: async (params: unknown | Todo) => {
      await queryClient.cancelQueries([apiNameTodo])
      const previousTodos = queryClient.getQueryData([apiNameTodo]) // 取得更新那一筆的資料
      return { previousTodos }
    },
    onError: (error, variables, context) => {
      console.log('🚀 => file: index.ts:67 => apiPostTodo => context.previousTodos:', context.previousTodos)
      queryClient.setQueryData([apiNameTodo], context.previousTodos) // 將資料回復到前一次的狀態
    },

    onSuccess: (data, variables, context) => {
      false && setTodoListInvalidateQueries() // Invalidate and refetch
      queryClient.setQueriesData([apiNameTodo], (oldData: Todo[]) => {
        return [...oldData, data as Todo]
      })
    },
    onSettled: (data, error, variables, context) => {
      // 類似try...catch的finally
      console.log('🚀 => file: AddTodo.vue:47 => data:', data)
    }
  } as MutationOptions
}

export const apiEditTodo = () => {

  const queryClient = useQueryClient()

  // 資料無效化，重新進行請求
  const setTodoListInvalidateQueries = () => queryClient.invalidateQueries({ queryKey: [apiNameTodo] })

  return {
    mutationFn: async (params: unknown | Todo) => {

      const _isGoError = (params as Todo).label.trim().includes(ON_ERROR_KEY)
      if(_isGoError) {
        await sleep(1000)
        return Promise.reject({
          data: params,
          msg: 'api error test'
        })
      }

      const response = await fetch(`${BASE_URL}/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      await sleep(SLEEP_SEC)
      return response.json()
    },
    onMutate: async (params: unknown | Todo) => {
      console.log('🚀 => file: index.ts:88 => onMutate: => unknown | Todo:', params)
      await queryClient.cancelQueries([apiNameTodo])
      const previousTodos = queryClient.getQueryData([apiNameTodo]) // 取得更新那一筆的資料
      return { previousTodos }
    },
    onSuccess: (data, variables, context) => {
      setTodoListInvalidateQueries() // Invalidate and refetch
    },
    onError: (error, variables, context) => {
      console.log('🚀 => 從 onMutate return 過來的資料: ', context)
      console.log('🚀 => file: index.ts:54 => apiPostTodo => variables:', variables)
      console.log('🚀 => 接收 mutationFn return 的東西: ', error)
      queryClient.setQueryData([apiNameTodo], context.previousTodos) // 將資料回復到前一次的狀態
      },
    onSettled: (data, error, variables, context) => {
      // 類似try...catch的finally
      console.log('🚀 => file: AddTodo.vue:47 => data:', data)
      false && setTodoListInvalidateQueries() // Invalidate and refetch
    }
  } as MutationOptions
}

export const apiDeleteTodo = () => {

  const queryClient = useQueryClient()
  // 資料無效化，重新進行請求
  const setTodoListInvalidateQueries = () => queryClient.invalidateQueries({ queryKey: [apiNameTodo] })

  return {
    mutationFn: async (params: unknown | Todo['id']) => {

      const _strArrError = ['49df90ac-b103-5b03-8126-b14d38d0510b']
      const _isGoError = _strArrError.includes(params as string)
      if(_isGoError) {
        await sleep(1000)
        return Promise.reject({
          data: params,
          msg: 'api error test'
        })
      }

      const response = await fetch(`${BASE_URL}/${params}`, {
        method: 'DELETE',
      })
      await sleep(SLEEP_SEC)
      return response.json()
    },
    onMutate: async (params: unknown | Todo) => {
      console.log('🚀 => file: index.ts:88 => onMutate: => unknown | Todo:', params)
        await queryClient.cancelQueries([apiNameTodo])
        const previousTodos = queryClient.getQueryData([apiNameTodo]) // 取得更新那一筆的資料
        return { previousTodos }
      },
    onSuccess: (data, variables, context) => {
      setTodoListInvalidateQueries() // Invalidate and refetch
    },
    onError: (error, variables, context) => {
      console.log('🚀 => 從 onMutate return 過來的資料: ', context)
      console.log('🚀 => file: index.ts:54 => apiPostTodo => variables:', variables)
      console.log('🚀 => 接收 mutationFn return 的東西: ', error)
      queryClient.setQueryData([apiNameTodo], context.previousTodos) // 將資料回復到前一次的狀態
      },
    onSettled: (data, error, variables, context) => {
      // 類似try...catch的finally
      console.log('🚀 => file: AddTodo.vue:47 => data:', data)
      false && setTodoListInvalidateQueries() // Invalidate and refetch

    }
  } as MutationOptions
}

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}