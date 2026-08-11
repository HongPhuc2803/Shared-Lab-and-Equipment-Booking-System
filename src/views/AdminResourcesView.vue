<script setup lang="ts">
import { computed, ref } from 'vue'
import { resources, statusLabel, type Resource } from '@/data/mock'
const rows = ref(resources.map((r) => ({ ...r }))),
  search = ref(''),
  open = ref(false),
  editing = ref<Resource | null>(null),
  toast = ref('')
const shown = computed(() =>
  rows.value.filter(
    (r) =>
      r.name.toLowerCase().includes(search.value.toLowerCase()) ||
      r.code.toLowerCase().includes(search.value.toLowerCase()),
  ),
)
function edit(r?: Resource) {
  editing.value = r
    ? { ...r }
    : {
        id: Date.now(),
        name: '',
        code: '',
        type: 'Thiết bị',
        department: 'Khoa CNTT',
        status: 'available',
        location: '',
        image:
          'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80',
        description: '',
        specs: {},
      }
  open.value = true
}
function save() {
  if (!editing.value) return
  const i = rows.value.findIndex((r) => r.id === editing.value!.id)
  if (i >= 0) rows.value[i] = { ...editing.value }
  else rows.value.unshift({ ...editing.value })
  open.value = false
  toast.value = 'Đã lưu thông tin tài nguyên'
  setTimeout(() => (toast.value = ''), 1800)
}
</script>
<template>
  <div>
    <div class="toolbar">
      <input
        v-model="search"
        class="input search"
        placeholder="Tìm tên hoặc mã tài nguyên..."
      /><select class="select">
        <option>Tất cả trạng thái</option>
        <option>Hoạt động</option>
        <option>Bảo trì</option></select
      ><button class="btn btn-primary" @click="edit()">+ Thêm tài nguyên</button>
    </div>
    <div class="panel table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tài nguyên</th>
            <th>Mã</th>
            <th>Loại</th>
            <th>Khoa quản lý</th>
            <th>Vị trí</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in shown" :key="r.id">
            <td>
              <div class="resource-cell">
                <img :src="r.image" /><strong>{{ r.name }}</strong>
              </div>
            </td>
            <td>{{ r.code }}</td>
            <td>{{ r.type }}</td>
            <td>{{ r.department }}</td>
            <td>{{ r.location }}</td>
            <td>
              <span
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
            </td>
            <td><button class="btn btn-sm" @click="edit(r)">Chỉnh sửa</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button class="btn btn-sm">‹</button><span>Trang 1 / 1</span
      ><button class="btn btn-sm">›</button>
    </div>
    <div v-if="open && editing" class="modal-backdrop" @click.self="open = false">
      <form class="modal" @submit.prevent="save">
        <div class="panel-header">
          <h2>{{ rows.some((r) => r.id === editing!.id) ? 'Chỉnh sửa' : 'Thêm' }} tài nguyên</h2>
          <button type="button" class="icon-button" @click="open = false">×</button>
        </div>
        <div class="panel-body form-grid">
          <div class="field span-2">
            <label>Tên tài nguyên</label><input v-model="editing.name" class="input" required />
          </div>
          <div class="field">
            <label>Mã</label><input v-model="editing.code" class="input" required />
          </div>
          <div class="field">
            <label>Loại</label
            ><select v-model="editing.type" class="select">
              <option>Phòng lab</option>
              <option>Thiết bị</option>
            </select>
          </div>
          <div class="field">
            <label>Khoa quản lý</label><input v-model="editing.department" class="input" />
          </div>
          <div class="field">
            <label>Vị trí</label><input v-model="editing.location" class="input" />
          </div>
          <div class="field span-2">
            <label>Trạng thái</label
            ><select v-model="editing.status" class="select">
              <option value="available">Hoạt động</option>
              <option value="maintenance">Bảo trì</option>
              <option value="inactive">Ngừng sử dụng</option>
            </select>
          </div>
          <div class="field span-2">
            <label>Mô tả</label><textarea v-model="editing.description" class="textarea"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" @click="open = false">Hủy</button
          ><button class="btn btn-primary">Lưu thay đổi</button>
        </div>
      </form>
    </div>
    <div v-if="toast" class="toast">{{ toast }}</div>
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
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 13px;
  font-size: 10px;
  color: #788397;
}
</style>
