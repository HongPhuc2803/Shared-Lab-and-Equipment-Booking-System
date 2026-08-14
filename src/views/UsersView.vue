<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/users'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import UserFormDialog from '@/features/users/UserFormDialog.vue'

import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from '@/features/users/users.types'

const store = useUsersStore()

const {
  filtered,
  status,
  mutating,
  search,
} = storeToRefs(store)

const dialogOpen = ref(false)
const editing = ref<User | null>(null)

onMounted(() => {
  if (store.items.length === 0) {
    store.fetchAll()
  }
})

function openCreate() {
  editing.value = null
  dialogOpen.value = true
}

function openEdit(user: User) {
  editing.value = user
  dialogOpen.value = true
}

async function handleSubmit(input: CreateUserInput | UpdateUserInput) {
  if (editing.value) {
    await store.update(editing.value.id, input as UpdateUserInput)
  } else {
    await store.create(input as CreateUserInput)
  }

  dialogOpen.value = false
}

async function removeUser(id: string) {
  try {
    await store.remove(id)
  } catch (error) {
    console.error('DELETE USER ERROR:', error)
  }
}

function roleText(role: string) {
  switch (role) {
    case 'Admin':
      return 'Quản trị viên'

    case 'LabManager':
      return 'Quản lý Lab'

    case 'Requester':
      return 'Người dùng'

    default:
      return role
  }
}

function statusText(status: string) {
  switch (status) {
    case 'Active':
      return 'Hoạt động'

    case 'Restricted':
      return 'Bị hạn chế'

    case 'Inactive':
      return 'Không hoạt động'

    default:
      return status
  }
}

function statusClass(status: string) {
  if (status === 'Active') {
    return 'badge-green'
  }

  if (status === 'Restricted') {
    return 'badge-yellow'
  }

  return 'badge-gray'
}
</script>

<template>
  <section class="users-page">
    <div class="users-header">
      <h1>Users</h1>

      <BaseButton @click="openCreate">
        New user
      </BaseButton>
    </div>

    <BaseInput
      v-model="search"
      placeholder="Search users..."
      class="search-input"
    />

    <BaseSpinner v-if="status === 'loading'" />

    <div
      v-else-if="status === 'error'"
      class="state-box"
    >
      <p>Không thể tải danh sách người dùng.</p>

      <BaseButton
        variant="secondary"
        @click="store.fetchAll()"
      >
        Thử lại
      </BaseButton>
    </div>

    <BaseCard v-else>
      <table class="users-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th class="actions-column">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="filtered.length === 0">
            <td
              colspan="5"
              class="empty-cell"
            >
              Không có người dùng.
            </td>
          </tr>

          <tr
            v-for="user in filtered"
            :key="user.id"
          >
            <td>
              <strong>
                {{ user.fullName }}
              </strong>
            </td>

            <td>
              {{ user.email }}
            </td>

            <td>
              {{ roleText(user.role) }}
            </td>

            <td>
              <span
                class="badge"
                :class="statusClass(user.status)"
              >
                {{ statusText(user.status) }}
              </span>
            </td>

            <td>
              <div class="actions">
                <BaseButton
                  size="sm"
                  variant="secondary"
                  @click="openEdit(user)"
                >
                  Edit
                </BaseButton>

                <BaseButton
                  size="sm"
                  variant="danger"
                  @click="removeUser(user.id)"
                >
                  Delete
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <UserFormDialog
      :open="dialogOpen"
      :initial="editing"
      :submitting="mutating"
      @close="dialogOpen = false"
      @submit="handleSubmit"
    />
  </section>
</template>

<style scoped>
.users-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.users-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.users-header h1 {
  margin: 0;
  font-size: 24px;
}

.search-input {
  max-width: 420px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.users-table th,
.users-table td {
  padding: 13px 16px;
  text-align: left;
  border-bottom: 1px solid #edf0f4;
}

.users-table th {
  color: #788397;
  font-weight: 600;
}

.actions-column {
  text-align: right !important;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.empty-cell {
  padding: 30px !important;
  text-align: center !important;
  color: #788397;
}

.state-box {
  padding: 30px;
  text-align: center;
}
</style>
