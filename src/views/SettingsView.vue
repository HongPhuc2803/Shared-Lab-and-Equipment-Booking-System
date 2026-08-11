<script setup lang="ts">
import { ref } from 'vue'
const saved = ref(false),
  noShow = ref(15),
  cancel = ref(2),
  weights = ref([
    { name: 'Nghiên cứu khoa học', value: 100 },
    { name: 'Đồ án tốt nghiệp', value: 80 },
    { name: 'Bài tập môn học', value: 50 },
    { name: 'Tự học', value: 20 },
  ])
function save() {
  saved.value = true
  setTimeout(() => (saved.value = false), 1800)
}
</script>
<template>
  <form class="settings-grid" @submit.prevent="save">
    <section class="panel">
      <div class="panel-header">
        <h2>Trọng số ưu tiên</h2>
        <span class="badge badge-blue">Điểm cao được duyệt trước</span>
      </div>
      <div class="panel-body rule-list">
        <div v-for="(w, i) in weights" :key="w.name" class="rule-row">
          <span class="rank">{{ i + 1 }}</span>
          <div>
            <strong>{{ w.name }}</strong
            ><small>Mức ưu tiên {{ i + 1 }}</small>
          </div>
          <label
            ><input v-model.number="w.value" type="number" min="0" max="100" /><span
              >điểm</span
            ></label
          >
        </div>
      </div>
    </section>
    <section class="panel">
      <div class="panel-header"><h2>Quy tắc no-show & hủy lịch</h2></div>
      <div class="panel-body setting-fields">
        <div class="field">
          <label>Thời gian chờ check-in</label>
          <div class="unit-input">
            <input v-model="noShow" class="input" type="number" /><span>phút</span>
          </div>
          <small>Tự động ghi nhận no-show sau thời gian này.</small>
        </div>
        <div class="field">
          <label>Hạn hủy lịch trước giờ bắt đầu</label>
          <div class="unit-input">
            <input v-model="cancel" class="input" type="number" /><span>giờ</span>
          </div>
        </div>
        <div class="toggle-row">
          <div>
            <strong>Tự động khóa tài khoản</strong
            ><small>Khi người dùng no-show 3 lần trong 30 ngày</small>
          </div>
          <input type="checkbox" checked />
        </div>
        <div class="toggle-row">
          <div>
            <strong>Gửi email nhắc lịch</strong><small>Gửi trước giờ bắt đầu 24 tiếng</small>
          </div>
          <input type="checkbox" checked />
        </div>
      </div>
    </section>
    <section class="panel penalty span-all">
      <div class="panel-header"><h2>Chế tài vi phạm mặc định</h2></div>
      <div class="panel-body form-grid">
        <div class="field">
          <label>No-show lần thứ 2</label
          ><select class="select">
            <option>Khóa đặt lịch 7 ngày</option>
            <option>Cảnh cáo</option>
          </select>
        </div>
        <div class="field">
          <label>Làm hỏng thiết bị</label
          ><select class="select">
            <option>Khóa đặt lịch 30 ngày</option>
            <option>Khóa vô thời hạn</option>
          </select>
        </div>
      </div>
    </section>
    <div class="save-bar span-all">
      <span v-if="saved" class="notice notice-success">Đã lưu cấu hình hệ thống.</span
      ><button class="btn btn-primary">Lưu cấu hình</button>
    </div>
  </form>
</template>
<style scoped>
.settings-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 16px;
}
.span-all {
  grid-column: 1/-1;
}
.rule-list {
  display: grid;
  gap: 8px;
}
.rule-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px;
  border: 1px solid #e6eaf0;
  border-radius: 6px;
}
.rank {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #edf1ff;
  color: #3157d5;
  font-weight: 800;
  font-size: 11px;
}
.rule-row > div {
  flex: 1;
}
.rule-row strong,
.rule-row small,
.toggle-row strong,
.toggle-row small {
  display: block;
}
.rule-row strong {
  font-size: 12px;
}
.rule-row small,
.toggle-row small,
.field > small {
  color: #8c96a6;
  font-size: 9px;
  margin-top: 3px;
}
.rule-row label {
  display: flex;
  align-items: center;
  border: 1px solid #dce1e9;
  border-radius: 5px;
  overflow: hidden;
}
.rule-row input {
  width: 55px;
  border: 0;
  padding: 8px;
}
.rule-row label span {
  padding: 8px;
  background: #f5f7fa;
  font-size: 9px;
}
.setting-fields {
  display: grid;
  gap: 19px;
}
.unit-input {
  position: relative;
}
.unit-input span {
  position: absolute;
  right: 11px;
  top: 11px;
  font-size: 10px;
  color: #8791a2;
}
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.toggle-row strong {
  font-size: 11px;
}
.toggle-row input {
  width: 35px;
  height: 19px;
  accent-color: #3157d5;
}
.save-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
.save-bar .notice {
  padding: 9px 13px;
}
@media (max-width: 900px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  .span-all {
    grid-column: auto;
  }
}
</style>
