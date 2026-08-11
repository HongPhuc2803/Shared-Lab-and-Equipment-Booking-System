<script setup lang="ts">
import { ref } from 'vue'
import { violations } from '@/data/mock'
const rows = ref(violations.map((v) => ({ ...v }))),
  open = ref(false),
  toast = ref('')
function unlock(id: string) {
  const r = rows.value.find((x) => x.id === id)
  if (r) r.status = 'Đã mở khóa'
  toast.value = 'Đã mở khóa quyền đặt lịch'
  setTimeout(() => (toast.value = ''), 1800)
}
</script>
<template>
  <div>
    <div class="toolbar">
      <input class="input search" placeholder="Tìm người dùng hoặc mã vi phạm..." /><select
        class="select"
      >
        <option>Tất cả vi phạm</option>
        <option>Không đến</option>
        <option>Trả trễ</option>
        <option>Hư hỏng</option></select
      ><button class="btn btn-primary" @click="open = true">+ Ghi nhận vi phạm</button>
    </div>
    <div class="panel table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Khoa</th>
            <th>Vi phạm</th>
            <th>Ngày</th>
            <th>Chế tài</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td>
              <strong>{{ r.person }}</strong
              ><br /><small>{{ r.id }}</small>
            </td>
            <td>{{ r.department }}</td>
            <td>{{ r.type }}</td>
            <td>{{ r.date }}</td>
            <td>
              <span class="badge badge-red">{{ r.penalty }}</span>
            </td>
            <td>{{ r.status }}</td>
            <td>
              <button v-if="r.status === 'Đang khóa'" class="btn btn-sm" @click="unlock(r.id)">
                Mở khóa</button
              ><span v-else class="muted">Đã xử lý</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="open" class="modal-backdrop" @click.self="open = false">
      <form
        class="modal"
        @submit.prevent="
          open = false
          toast = 'Đã ghi nhận vi phạm'
        "
      >
        <div class="panel-header">
          <h2>Ghi nhận vi phạm</h2>
          <button type="button" class="icon-button" @click="open = false">×</button>
        </div>
        <div class="panel-body form-grid">
          <div class="field span-2">
            <label>Người dùng</label
            ><input class="input" required placeholder="Tìm theo tên hoặc mã số" />
          </div>
          <div class="field">
            <label>Loại vi phạm</label
            ><select class="select">
              <option>Không đến (no-show)</option>
              <option>Trả trễ > 30 phút</option>
              <option>Làm hỏng thiết bị</option>
            </select>
          </div>
          <div class="field">
            <label>Chế tài</label
            ><select class="select">
              <option>Cảnh cáo</option>
              <option>Khóa 7 ngày</option>
              <option>Khóa 30 ngày</option>
            </select>
          </div>
          <div class="field span-2">
            <label>Ghi chú</label><textarea class="textarea"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" @click="open = false">Hủy</button
          ><button class="btn btn-primary">Ghi nhận</button>
        </div>
      </form>
    </div>
    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>
