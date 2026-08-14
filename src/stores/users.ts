import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usersApi } from '@/features/users/users.api'
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from '@/features/users/users.types'

export const useUsersStore = defineStore('users', () => {
  const items = ref<User[]>([])
  const status = ref<'idle' | 'loading' | 'error'>('idle')
  const error = ref<string | null>(null)
  const mutating = ref(false)
  const search = ref('')

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()

    if (!q) return items.value

    return items.value.filter((u) =>
      [u.fullName, u.email, u.role, u.status].some((v) =>
        v.toLowerCase().includes(q),
      ),
    )
  })

  async function fetchAll() {
    status.value = 'loading'
    error.value = null

    try {
      const response = await usersApi.list({
        page: 1,
        pageSize: 100,
      })

      items.value = response.items
      status.value = 'idle'
    } catch (e) {
      status.value = 'error'
      error.value = e instanceof Error ? e.message : 'Không thể tải danh sách người dùng.'
    }
  }

  async function create(input: CreateUserInput) {
    mutating.value = true

    try {
      const created = await usersApi.create(input)
      items.value.unshift(created)

      return created
    } finally {
      mutating.value = false
    }
  }

  async function update(id: string, input: UpdateUserInput) {
    mutating.value = true

    try {
      const updated = await usersApi.update(id, input)

      const index = items.value.findIndex((u) => u.id === id)

      if (index !== -1) {
        items.value[index] = updated
      }

      return updated
    } finally {
      mutating.value = false
    }
  }

  async function remove(id: string) {
    mutating.value = true

    try {
      await usersApi.remove(id)
      items.value = items.value.filter((u) => u.id !== id)
    } finally {
      mutating.value = false
    }
  }

  return {
    items,
    filtered,
    status,
    error,
    mutating,
    search,
    fetchAll,
    create,
    update,
    remove,
  }
})
