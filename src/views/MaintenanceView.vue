<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { maintenancesApi } from '@/features/maintenances/maintenances.api'
import { resourcesApi } from '@/features/resources/resources.api'

import type {
  Maintenance,
  CreateMaintenanceInput,
} from '@/features/maintenances/maintenances.types'

import type {
  Resource,
} from '@/features/resources/resources.types'


const rows = ref<Maintenance[]>([])
const resources = ref<Resource[]>([])

const open = ref(false)
const loading = ref(false)
const saving = ref(false)
const toast = ref('')
const error = ref('')


const form = ref({
  resourceId: '',
  date: '',
  startTime: '08:00',
  endTime: '10:00',
  type: 'Bảo trì định kỳ',
  cost: '0',
})


onMounted(async () => {
  await loadData()
})


async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [maintenanceList, resourceResult] = await Promise.all([
      maintenancesApi.list(),
      resourcesApi.listAll(),
    ])

    rows.value = maintenanceList
    resources.value = resourceResult

    if (!form.value.resourceId && resources.value.length > 0) {
      form.value.resourceId = resources.value[0]!.id
    }
  } catch (err) {
    console.error('MAINTENANCE LOAD ERROR:', err)
    error.value = 'Không thể tải dữ liệu bảo trì.'
  } finally {
    loading.value = false
  }
}


async function add() {
  if (!form.value.resourceId || !form.value.date) {
    return
  }

  saving.value = true
  error.value = ''

  try {
    const start = new Date(`${form.value.date}T${form.value.startTime}:00`)
    const end = new Date(`${form.value.date}T${form.value.endTime}:00`)

    if (end <= start) {
      error.value = 'Giờ kết thúc phải sau giờ bắt đầu.'
      return
    }

    const input: CreateMaintenanceInput = {
      resourceId: form.value.resourceId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      description: form.value.type,
      cost: Number(form.value.cost) || 0,
    }

    const created = await maintenancesApi.create(input)

    rows.value.unshift(created)

    open.value = false

    toast.value = 'Đã tạo lịch bảo trì thành công'

    setTimeout(() => {
      toast.value = ''
    }, 1800)
  } catch (err) {
    console.error('CREATE MAINTENANCE ERROR:', err)
    error.value = 'Không thể tạo lịch bảo trì.'
  } finally {
    saving.value = false
  }
}


async function resolveMaintenance(id: string) {
  error.value = ''

  try {
    const updated = await maintenancesApi.resolve(id)

    const index = rows.value.findIndex(
      (item) => item.id === id,
    )

    if (index !== -1) {
      rows.value[index] = updated
    }

    toast.value = 'Đã hoàn tất bảo trì'

    setTimeout(() => {
      toast.value = ''
    }, 1800)
  } catch (err) {
    console.error('RESOLVE MAINTENANCE ERROR:', err)
    error.value = 'Không thể hoàn tất bảo trì.'
  }
}


function formatDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN')
}


function formatTime(date: string) {
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}


function formatMoney(cost: number | null) {
  if (cost == null) {
    return '-'
  }

  return `${new Intl.NumberFormat('vi-VN').format(cost)} đ`
}


function statusText(status: string) {
  switch (status) {
    case 'Scheduled':
      return 'Đã lên lịch'

    case 'InProgress':
      return 'Đang thực hiện'

    case 'Completed':
      return 'Hoàn tất'

    default:
      return status
  }
}


function statusClass(status: string) {
  return status === 'Completed'
    ? 'badge-green'
    : 'badge-blue'
}


const availableResources = computed(() => {
  return resources.value.filter(
    (resource) => resource.status === 'Available',
  )
})
</script>


<template>
  <div>
    <div class="toolbar">
      <div class="maintenance-note">
        <strong>Tự động khóa lịch</strong>

        <span>
          Các khung giờ bảo trì sẽ không thể được đặt.
        </span>
      </div>

      <button
        class="btn btn-primary"
        @click="open = true"
      >
        + Tạo lịch bảo trì
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
      Đang tải danh sách bảo trì...
    </div>


    <div
      v-else
      class="panel table-wrap"
    >
      <table class="data-table">
        <thead>
          <tr>
            <th>Mã phiếu</th>
            <th>Tài nguyên</th>
            <th>Ngày bảo trì</th>
            <th>Hạng mục</th>
            <th>Chi phí</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-if="rows.length === 0"
          >
            <td
              colspan="7"
              class="empty-cell"
            >
              Chưa có lịch bảo trì.
            </td>
          </tr>

          <tr
            v-for="r in rows"
            :key="r.id"
          >
            <td>
              <strong>{{ r.id }}</strong>
            </td>

            <td>
              {{ r.resourceName ?? '-' }}
            </td>

            <td>
              {{ formatDate(r.startTime) }}<br />
              <span class="muted">
                {{ formatTime(r.startTime) }} - {{ formatTime(r.endTime) }}
              </span>
            </td>

            <td>
              {{ r.description ?? '-' }}
            </td>

            <td>
              {{ formatMoney(r.cost) }}
            </td>

            <td>
              <span
                class="badge"
                :class="statusClass(r.status)"
              >
                {{ statusText(r.status) }}
              </span>
            </td>

            <td>
              <button
                v-if="r.status !== 'Completed'"
                class="btn btn-sm"
                @click="resolveMaintenance(r.id)"
              >
                Hoàn tất
              </button>

              <span
                v-else
                class="muted"
              >
                Đã xử lý
              </span>
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
        @submit.prevent="add"
      >
        <div class="panel-header">
          <h2>Tạo lịch bảo trì</h2>

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
            <label>
              Phòng / Thiết bị
            </label>

            <select
              v-model="form.resourceId"
              class="select"
              required
            >
              <option
                v-for="r in availableResources"
                :key="r.id"
                :value="r.id"
              >
                {{ r.name }}
              </option>
            </select>
          </div>


          <div class="field">
            <label>
              Ngày thực hiện
            </label>

            <input
              v-model="form.date"
              class="input"
              type="date"
              required
            />
          </div>


          <div class="field">
            <label>
              Giờ bắt đầu
            </label>

            <input
              v-model="form.startTime"
              class="input"
              type="time"
              required
            />
          </div>


          <div class="field">
            <label>
              Giờ kết thúc
            </label>

            <input
              v-model="form.endTime"
              class="input"
              type="time"
              required
            />
          </div>


          <div class="field">
            <label>
              Hạng mục
            </label>

            <select
              v-model="form.type"
              class="select"
            >
              <option>
                Bảo trì định kỳ
              </option>

              <option>
                Hiệu chuẩn
              </option>

              <option>
                Sửa chữa
              </option>
            </select>
          </div>


          <div class="field span-2">
            <label>
              Chi phí dự kiến
            </label>

            <input
              v-model="form.cost"
              class="input"
              type="number"
              min="0"
            />
          </div>


          <div class="notice notice-success span-2">
            Calendar của tài nguyên sẽ tự động khóa
            trong khung giờ bảo trì.
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
            {{ saving ? 'Đang tạo...' : 'Tạo lịch' }}
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
.toolbar {
  justify-content: space-between;
}

.maintenance-note strong,
.maintenance-note span {
  display: block;
}

.maintenance-note strong {
  font-size: 13px;
}

.maintenance-note span {
  font-size: 10px;
  color: #7f899a;
  margin-top: 3px;
}

.empty {
  padding: 25px;
  text-align: center;
  color: #7f899a;
}

.empty-cell {
  text-align: center;
  color: #7f899a;
}
</style>
