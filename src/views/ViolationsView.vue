<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { violationsApi } from '@/features/violations/violations.api'
import type { Violation } from '@/features/violations/violations.types'

const rows = ref<Violation[]>([])
const loading = ref(false)
const error = ref('')

const keyword = ref('')
const typeFilter = ref('')

async function loadViolations() {
  loading.value = true
  error.value = ''

  try {
    rows.value = await violationsApi.list()
  } catch (err) {
    console.error('VIOLATIONS API ERROR:', err)
    error.value = 'Không thể tải danh sách vi phạm.'
  } finally {
    loading.value = false
  }
}

const visibleRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()

  return rows.value.filter((item) => {
    const matchesKeyword =
      !q ||
      item.userName?.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)

    const matchesType =
      !typeFilter.value ||
      item.type === typeFilter.value

    return matchesKeyword && matchesType
  })
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN')
}

function typeText(type: string) {
  switch (type) {
    case 'NoShow':
      return 'Không đến'

    case 'LateReturn':
      return 'Trả trễ'

    case 'Damage':
      return 'Hư hỏng'

    default:
      return type
  }
}

onMounted(loadViolations)
</script>

<template>
  <div>
    <div class="toolbar">
      <input
        v-model="keyword"
        class="input search"
        placeholder="Tìm người dùng hoặc mã vi phạm..."
      />

      <select
        v-model="typeFilter"
        class="select"
      >
        <option value="">
          Tất cả vi phạm
        </option>

        <option value="NoShow">
          Không đến
        </option>

        <option value="LateReturn">
          Trả trễ
        </option>

        <option value="Damage">
          Hư hỏng
        </option>
      </select>
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
      Đang tải danh sách vi phạm...
    </div>

    <div
      v-else
      class="panel table-wrap"
    >
      <table class="data-table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Mã booking</th>
            <th>Vi phạm</th>
            <th>Ngày</th>
            <th>Ghi chú</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="visibleRows.length === 0">
            <td
              colspan="5"
              class="empty-cell"
            >
              Không có dữ liệu vi phạm.
            </td>
          </tr>

          <tr
            v-for="r in visibleRows"
            :key="r.id"
          >
            <td>
              <strong>
                {{ r.userName ?? 'Người dùng' }}
              </strong>

              <br />

              <small>
                {{ r.userId }}
              </small>
            </td>

            <td>
              {{ r.bookingId ?? '-' }}
            </td>

            <td>
              <span class="badge badge-red">
                {{ typeText(r.type) }}
              </span>
            </td>

            <td>
              {{ formatDate(r.recordedAt) }}
            </td>

            <td>
              {{ r.note ?? '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
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
