<script setup lang="ts">
import { computed, ref } from 'vue'
import { approvals } from '@/data/mock'
const tab = ref('Tất cả'),
  rows = ref(approvals.map((x) => ({ ...x }))),
  toast = ref('')
const visible = computed(() =>
  rows.value.filter(
    (r) =>
      tab.value === 'Tất cả' ||
      (tab.value === 'Ưu tiên cao' && r.priority === 'Cao') ||
      (tab.value === 'Hôm nay' && r.time.startsWith('05/08')),
  ),
)
function act(id: string, status: string) {
  const r = rows.value.find((x) => x.id === id)
  if (r) r.status = status
  toast.value = `Đã ${status.toLowerCase()} yêu cầu ${id}`
  setTimeout(() => (toast.value = ''), 1800)
}
</script>
<template>
  <div>
    <div class="tabs">
      <button
        v-for="t in ['Tất cả', 'Ưu tiên cao', 'Hôm nay']"
        :key="t"
        class="tab"
        :class="{ active: tab === t }"
        @click="tab = t"
      >
        {{ t }}
      </button>
    </div>
    <div class="panel table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Người yêu cầu</th>
            <th>Phòng/Thiết bị</th>
            <th>Thời gian</th>
            <th>Mục đích</th>
            <th>Ưu tiên</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in visible" :key="r.id">
            <td>
              <strong>{{ r.person }}</strong
              ><br /><small>{{ r.id }}</small>
            </td>
            <td>{{ r.resource }}</td>
            <td>{{ r.time }}</td>
            <td>{{ r.purpose }}</td>
            <td>
              <span
                class="badge"
                :class="
                  r.priority === 'Cao'
                    ? 'badge-red'
                    : r.priority === 'TB'
                      ? 'badge-yellow'
                      : 'badge-gray'
                "
                >{{ r.priority }}</span
              >
            </td>
            <td>
              <span
                class="badge"
                :class="
                  r.status === 'Đã duyệt'
                    ? 'badge-green'
                    : r.status === 'Từ chối'
                      ? 'badge-red'
                      : 'badge-yellow'
                "
                >{{ r.status }}</span
              >
            </td>
            <td>
              <div v-if="r.status === 'Chờ duyệt'" class="row-actions">
                <button class="btn btn-primary btn-sm" @click="act(r.id, 'Đã duyệt')">Duyệt</button
                ><button class="btn btn-sm" @click="act(r.id, 'Từ chối')">Từ chối</button>
              </div>
              <button v-else class="btn btn-sm" @click="act(r.id, 'Chờ duyệt')">Hoàn tác</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>
