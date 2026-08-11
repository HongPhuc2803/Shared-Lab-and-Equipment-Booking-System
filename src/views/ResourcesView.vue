<script setup lang="ts">
import { computed, ref } from 'vue'
import { resources, statusLabel } from '@/data/mock'
const search = ref(''),
  type = ref('Tất cả'),
  dept = ref('Tất cả'),
  status = ref('Tất cả')
const departments = [...new Set(resources.map((r) => r.department))]
const filtered = computed(() =>
  resources.filter(
    (r) =>
      (!search.value || `${r.name} ${r.code}`.toLowerCase().includes(search.value.toLowerCase())) &&
      (type.value === 'Tất cả' || r.type === type.value) &&
      (dept.value === 'Tất cả' || r.department === dept.value) &&
      (status.value === 'Tất cả' || r.status === status.value),
  ),
)
</script>
<template>
  <div>
    <div class="toolbar">
      <input
        v-model="search"
        class="input search"
        placeholder="Tìm theo tên hoặc mã tài nguyên..."
      /><select v-model="type" class="select">
        <option>Tất cả</option>
        <option>Phòng lab</option>
        <option>Thiết bị</option></select
      ><select v-model="dept" class="select">
        <option>Tất cả</option>
        <option v-for="d in departments" :key="d">{{ d }}</option></select
      ><select v-model="status" class="select">
        <option>Tất cả</option>
        <option value="available">Sẵn sàng</option>
        <option value="maintenance">Bảo trì</option>
        <option value="inactive">Ngừng sử dụng</option>
      </select>
    </div>
    <div class="resource-grid">
      <article v-for="r in filtered" :key="r.id" class="resource-card">
        <RouterLink :to="`/resources/${r.id}`"
          ><img class="resource-image" :src="r.image" :alt="r.name" />
          <div class="resource-card-body">
            <div class="resource-meta">
              <span class="resource-code">{{ r.type }} · {{ r.code }}</span
              ><span
                class="badge"
                :class="
                  r.status === 'available'
                    ? 'badge-green'
                    : r.status === 'maintenance'
                      ? 'badge-red'
                      : 'badge-gray'
                "
                >{{ statusLabel[r.status] }}</span
              >
            </div>
            <h3>{{ r.name }}</h3>
            <p class="muted">{{ r.department }}</p>
            <div class="resource-footer">
              <span class="muted">⌖ {{ r.location }}</span
              ><RouterLink class="btn btn-sm" :to="`/resources/${r.id}/calendar`"
                >Xem lịch →</RouterLink
              >
            </div>
          </div></RouterLink
        >
      </article>
    </div>
    <div v-if="!filtered.length" class="panel empty">
      <strong>Không tìm thấy tài nguyên</strong>Thử thay đổi từ khóa hoặc bộ lọc.
    </div>
  </div>
</template>
