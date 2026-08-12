<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { resourcesApi } from '@/features/resources/resources.api'
import { departmentsApi } from '@/features/departments/departments.api'
import { usersApi } from '@/features/users/users.api'

import type {
  CreateResourceInput,
  Resource,
  UpdateResourceInput,
} from '@/features/resources/resources.types'

import type { Department } from '@/features/departments/departments.types'
import type { User } from '@/features/users/users.types'

const rows = ref<Resource[]>([])
const departments = ref<Department[]>([])
const managers = ref<User[]>([])

const search = ref('')
const open = ref(false)
const editing = ref<Resource | null>(null)
const toast = ref('')
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const form = ref({
  name: '',
  type: 1,
  specifications: '',
  imageUrl: '',
  usageRules: '',
  departmentId: '',
  labManagerId: '',
  status: 0,
})

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [resourceResult, departmentList, userResult] = await Promise.all([
      resourcesApi.list({
        page: 1,
        pageSize: 100,
      }),
      departmentsApi.list(),
      usersApi.list({
        page: 1,
        pageSize: 100,
      }),
    ])

    rows.value = resourceResult.items
    departments.value = departmentList

    managers.value = userResult.items.filter(
      (user) => user.role === 'LabManager',
    )
  } catch (err) {
    console.error('ADMIN RESOURCES LOAD ERROR:', err)
    error.value = 'Không thể tải dữ liệu tài nguyên.'
  } finally {
    loading.value = false
  }
}

const shown = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) {
    return rows.value
  }

  return rows.value.filter(
    (resource) =>
      resource.name.toLowerCase().includes(keyword) ||
      resource.departmentName?.toLowerCase().includes(keyword),
  )
})

function resourceTypeToNumber(type: string) {
  switch (type) {
    case 'Room':
      return 0

    case 'Equipment':
      return 1

    default:
      return 1
  }
}

function resourceStatusToNumber(status: string) {
  switch (status) {
    case 'Available':
      return 0

    case 'Maintenance':
      return 1

    case 'Inactive':
      return 2

    default:
      return 0
  }
}

function resourceTypeText(type: string) {
  switch (type) {
    case 'Room':
      return 'Phòng lab'

    case 'Equipment':
      return 'Thiết bị'

    default:
      return type
  }
}

function resourceStatusText(status: string) {
  switch (status) {
    case 'Available':
      return 'Hoạt động'

    case 'Maintenance':
      return 'Bảo trì'

    case 'Inactive':
      return 'Ngừng sử dụng'

    default:
      return status
  }
}

function statusClass(status: string) {
  if (status === 'Available') {
    return 'badge-green'
  }

  if (status === 'Maintenance') {
    return 'badge-red'
  }

  return 'badge-gray'
}

function openCreate() {
  editing.value = null

  form.value = {
    name: '',
    type: 1,
    specifications: '',
    imageUrl: '',
    usageRules: '',
    departmentId: '',
    labManagerId: '',
    status: 0,
  }

  open.value = true
}

function openEdit(resource: Resource) {
  editing.value = resource

  form.value = {
    name: resource.name,
    type: resourceTypeToNumber(resource.type),
    specifications: resource.specifications ?? '',
    imageUrl: resource.imageUrl ?? '',
    usageRules: resource.usageRules ?? '',
    departmentId: resource.departmentId ?? '',
    labManagerId: resource.labManagerId ?? '',
    status: resourceStatusToNumber(resource.status),
  }

  open.value = true
}

async function save() {
  saving.value = true
  error.value = ''

  try {
    if (editing.value) {
      const input: UpdateResourceInput = {
        name: form.value.name,
        type: form.value.type,
        specifications: form.value.specifications || null,
        imageUrl: form.value.imageUrl || null,
        usageRules: form.value.usageRules || null,
        departmentId: form.value.departmentId || null,
        labManagerId: form.value.labManagerId || null,
        status: form.value.status,
      }

      const updated = await resourcesApi.update(
        editing.value.id,
        input,
      )

      const index = rows.value.findIndex(
        (resource) => resource.id === editing.value?.id,
      )

      if (index !== -1) {
        rows.value[index] = updated
      }

      toast.value = 'Đã cập nhật tài nguyên'
    } else {
      const input: CreateResourceInput = {
        name: form.value.name,
        type: form.value.type,
        specifications: form.value.specifications || null,
        imageUrl: form.value.imageUrl || null,
        usageRules: form.value.usageRules || null,
        departmentId: form.value.departmentId || null,
        labManagerId: form.value.labManagerId || null,
      }

      const created = await resourcesApi.create(input)

      rows.value.unshift(created)

      toast.value = 'Đã thêm tài nguyên'
    }

    open.value = false

    setTimeout(() => {
      toast.value = ''
    }, 1800)
  } catch (err) {
    console.error('SAVE RESOURCE ERROR:', err)
    error.value = 'Không thể lưu tài nguyên.'
  } finally {
    saving.value = false
  }
}

async function removeResource(resource: Resource) {
  try {
    await resourcesApi.remove(resource.id)

    rows.value = rows.value.filter(
      (item) => item.id !== resource.id,
    )

    toast.value = 'Đã xóa tài nguyên'

    setTimeout(() => {
      toast.value = ''
    }, 1800)
  } catch (err) {
    console.error('DELETE RESOURCE ERROR:', err)
    error.value = 'Không thể xóa tài nguyên.'
  }
}
</script>

<template>
  <div>
    <div class="toolbar">
      <input
        v-model="search"
        class="input search"
        placeholder="Tìm tên tài nguyên..."
      />

      <button
        class="btn btn-primary"
        @click="openCreate"
      >
        + Thêm tài nguyên
      </button>
    </div>

    <div
      v-if="error"
      class="notice notice-danger"
    >
      {{ error }}
    </div>

    <div
      v-if="loading"
      class="panel empty"
    >
      Đang tải danh sách tài nguyên...
    </div>

    <div
      v-else
      class="panel table-wrap"
    >
      <table class="data-table">
        <thead>
          <tr>
            <th>Tài nguyên</th>
            <th>Loại</th>
            <th>Khoa quản lý</th>
            <th>Lab Manager</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="shown.length === 0">
            <td
              colspan="6"
              class="empty-cell"
            >
              Không có tài nguyên.
            </td>
          </tr>

          <tr
            v-for="resource in shown"
            :key="resource.id"
          >
            <td>
              <div class="resource-cell">
                <img
                  v-if="resource.imageUrl"
                  :src="resource.imageUrl"
                  alt=""
                />

                <strong>
                  {{ resource.name }}
                </strong>
              </div>
            </td>

            <td>
              {{ resourceTypeText(resource.type) }}
            </td>

            <td>
              {{ resource.departmentName ?? '-' }}
            </td>

            <td>
              {{ resource.labManagerName ?? '-' }}
            </td>

            <td>
              <span
                class="badge"
                :class="statusClass(resource.status)"
              >
                {{ resourceStatusText(resource.status) }}
              </span>
            </td>

            <td>
              <div class="row-actions">
                <button
                  class="btn btn-sm"
                  @click="openEdit(resource)"
                >
                  Chỉnh sửa
                </button>

                <button
                  class="btn btn-danger btn-sm"
                  @click="removeResource(resource)"
                >
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="open"
      class="modal-backdrop"
      @click.self="open = false"
    >
      <form
        class="modal"
        @submit.prevent="save"
      >
        <div class="panel-header">
          <h2>
            {{ editing ? 'Chỉnh sửa' : 'Thêm' }} tài nguyên
          </h2>

          <button
            type="button"
            class="icon-button"
            @click="open = false"
          >
            ×
          </button>
        </div>

        <div class="panel-body form-grid">
          <div class="field span-2">
            <label>Tên tài nguyên</label>

            <input
              v-model="form.name"
              class="input"
              required
            />
          </div>

          <div class="field">
            <label>Loại</label>

            <select
              v-model.number="form.type"
              class="select"
            >
              <option :value="0">
                Phòng lab
              </option>

              <option :value="1">
                Thiết bị
              </option>
            </select>
          </div>

          <div class="field">
            <label>Khoa quản lý</label>

            <select
              v-model="form.departmentId"
              class="select"
            >
              <option value="">
                Không chọn
              </option>

              <option
                v-for="department in departments"
                :key="department.id"
                :value="department.id"
              >
                {{ department.name }}
              </option>
            </select>
          </div>

          <div class="field span-2">
            <label>Lab Manager</label>

            <select
              v-model="form.labManagerId"
              class="select"
            >
              <option value="">
                Không chọn
              </option>

              <option
                v-for="manager in managers"
                :key="manager.id"
                :value="manager.id"
              >
                {{ manager.fullName }}
              </option>
            </select>
          </div>

          <div class="field span-2">
            <label>Thông số</label>

            <textarea
              v-model="form.specifications"
              class="textarea"
            ></textarea>
          </div>

          <div class="field span-2">
            <label>Quy định sử dụng</label>

            <textarea
              v-model="form.usageRules"
              class="textarea"
            ></textarea>
          </div>

          <div class="field span-2">
            <label>Ảnh URL</label>

            <input
              v-model="form.imageUrl"
              class="input"
            />
          </div>

          <div
            v-if="editing"
            class="field span-2"
          >
            <label>Trạng thái</label>

            <select
              v-model.number="form.status"
              class="select"
            >
              <option :value="0">
                Hoạt động
              </option>

              <option :value="1">
                Bảo trì
              </option>

              <option :value="2">
                Ngừng sử dụng
              </option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn"
            @click="open = false"
          >
            Hủy
          </button>

          <button
            class="btn btn-primary"
            :disabled="saving"
          >
            {{ saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
        </div>
      </form>
    </div>

    <div
      v-if="toast"
      class="toast"
    >
      {{ toast }}
    </div>
  </div>
</template>

<style scoped>
.resource-cell {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 210px;
}

.resource-cell img {
  width: 40px;
  height: 34px;
  border-radius: 4px;
  object-fit: cover;
}

.row-actions {
  display: flex;
  gap: 7px;
}

.empty {
  padding: 25px;
  text-align: center;
  color: #788397;
}

.empty-cell {
  text-align: center;
  color: #788397;
}
</style>
