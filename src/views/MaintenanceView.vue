<script setup lang="ts">
import { ref } from 'vue'
import { maintenance, resources } from '@/data/mock'
const rows = ref([...maintenance])
const open = ref(false),
  toast = ref('')
const form = ref({
  resource: resources[0].name,
  date: '2026-08-10',
  type: 'Bảo trì định kỳ',
  cost: '0',
})
function add() {
  rows.value.unshift({
    id: `MT-0${rows.value.length + 92}`,
    resource: form.value.resource,
    date: form.value.date.split('-').reverse().join('/'),
    type: form.value.type,
    cost: `${Number(form.value.cost).toLocaleString('vi-VN')} đ`,
    status: 'Đã lên lịch',
  })
  open.value = false
  toast.value = 'Đã tạo lịch bảo trì và khóa khung giờ'
  setTimeout(() => (toast.value = ''), 1800)
}
</script>
<template>
  <div>
    <div class="toolbar">
      <div class="maintenance-note">
        <strong>Tự động khóa lịch</strong><span>Các khung giờ bảo trì sẽ không thể được đặt.</span>
      </div>
      <button class="btn btn-primary" @click="open = true">+ Tạo lịch bảo trì</button>
    </div>
    <div class="panel table-wrap">
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
          <tr v-for="r in rows" :key="r.id">
            <td>
              <strong>{{ r.id }}</strong>
            </td>
            <td>{{ r.resource }}</td>
            <td>{{ r.date }}</td>
            <td>{{ r.type }}</td>
            <td>{{ r.cost }}</td>
            <td>
              <span class="badge" :class="r.status === 'Hoàn tất' ? 'badge-green' : 'badge-blue'">{{
                r.status
              }}</span>
            </td>
            <td><button class="btn btn-sm">Chi tiết</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="open" class="modal-backdrop" @click.self="open = false">
      <form class="modal" @submit.prevent="add">
        <div class="panel-header">
          <h2>Tạo lịch bảo trì</h2>
          <button type="button" class="icon-button" @click="open = false">×</button>
        </div>
        <div class="panel-body form-grid">
          <div class="field span-2">
            <label>Phòng / Thiết bị</label
            ><select v-model="form.resource" class="select">
              <option v-for="r in resources" :key="r.id">{{ r.name }}</option>
            </select>
          </div>
          <div class="field">
            <label>Ngày thực hiện</label
            ><input v-model="form.date" class="input" type="date" required />
          </div>
          <div class="field">
            <label>Hạng mục</label
            ><select v-model="form.type" class="select">
              <option>Bảo trì định kỳ</option>
              <option>Hiệu chuẩn</option>
              <option>Sửa chữa</option>
            </select>
          </div>
          <div class="field span-2">
            <label>Chi phí dự kiến</label><input v-model="form.cost" class="input" type="number" />
          </div>
          <div class="notice notice-success span-2">
            Calendar của tài nguyên sẽ tự động khóa trong ngày đã chọn.
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" @click="open = false">Hủy</button
          ><button class="btn btn-primary">Tạo lịch</button>
        </div>
      </form>
    </div>
    <div v-if="toast" class="toast">{{ toast }}</div>
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
</style>
