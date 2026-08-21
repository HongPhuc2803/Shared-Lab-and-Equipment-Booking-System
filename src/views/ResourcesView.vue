<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { resourcesApi } from '@/features/resources/resources.api'
import type { Resource } from '@/features/resources/resources.types'

const search = ref('')
const type = ref('Tất cả')
const dept = ref('Tất cả')
const status = ref('Tất cả')

const resources = ref<Resource[]>([])

const departments = computed(() => [
  ...new Set(resources.value.map((r) => r.departmentName)),
])

const filtered = computed(() =>
  resources.value.filter(
    (r) =>
      (!search.value ||
        r.name.toLowerCase().includes(search.value.toLowerCase())) &&
      (type.value === 'Tất cả' || r.type === type.value) &&
      (dept.value === 'Tất cả' || r.departmentName === dept.value) &&
      (status.value === 'Tất cả' || r.status === status.value),
  ),
)

onMounted(async () => {
  try {
    resources.value = await resourcesApi.listAll()
  } catch (error) {
    console.error('RESOURCE API ERROR:', error)
  }
})
</script>

<template>
  <div>
    <div class="toolbar">
      <input
        v-model="search"
        class="input search"
        placeholder="Tìm theo tên tài nguyên..."
      />

      <select v-model="type" class="select">
        <option>Tất cả</option>
        <option value="Room">Phòng lab</option>
        <option value="Equipment">Thiết bị</option>
      </select>

      <select v-model="dept" class="select">
        <option>Tất cả</option>
        <option v-for="d in departments" :key="d">
          {{ d }}
        </option>
      </select>

      <select v-model="status" class="select">
        <option>Tất cả</option>
        <option value="Available">Sẵn sàng</option>
        <option value="UnderMaintenance">Bảo trì</option>
        <option value="Disabled">Ngừng sử dụng</option>
      </select>
    </div>

    <div class="resource-grid">
      <article
        v-for="r in filtered"
        :key="r.id"
        class="resource-card"
      >
        <RouterLink :to="`/resources/${r.id}`">
          <img
            v-if="r.imageUrl"
            class="resource-image"
            :src="r.imageUrl"
            :alt="r.name"
          />

          <div class="resource-card-body">
            <div class="resource-meta">
              <span class="resource-code">
                {{ r.type }}
              </span>

              <span
                class="badge"
                :class="
                  r.status === 'Available'
                    ? 'badge-green'
                    : r.status === 'UnderMaintenance'
                      ? 'badge-red'
                      : 'badge-gray'
                "
              >
                {{
                  r.status === 'Available'
                    ? 'Sẵn sàng'
                    : r.status === 'UnderMaintenance'
                      ? 'Bảo trì'
                      : 'Ngừng sử dụng'
                }}
              </span>
            </div>

            <h3>{{ r.name }}</h3>

            <p class="muted">
              {{ r.departmentName }}
            </p>

            <div class="resource-footer">
              <span class="muted">
                Quản lý: {{ r.labManagerName }}
              </span>

              <RouterLink
                class="btn btn-sm"
                :to="`/resources/${r.id}/calendar`"
              >
                Xem lịch →
              </RouterLink>
            </div>
          </div>
        </RouterLink>
      </article>
    </div>

    <div v-if="!filtered.length" class="panel empty">
      <strong>Không tìm thấy tài nguyên</strong>
      Thử thay đổi từ khóa hoặc bộ lọc.
    </div>
  </div>
</template>
