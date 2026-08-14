<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute(),
  router = useRouter()
const files = ref<string[]>([]),
  done = ref(false)
function upload(e: Event) {
  files.value = Array.from((e.target as HTMLInputElement).files ?? []).map((f) => f.name)
}
function submit() {
  done.value = true
  setTimeout(() => router.push('/my-bookings'), 1100)
}
</script>
<template>
  <form class="panel issue-form" @submit.prevent="submit">
    <div class="panel-header">
      <h2>Phiếu báo cáo · {{ route.params.id }}</h2>
      <span class="badge badge-red">Cần xử lý</span>
    </div>
    <div class="panel-body form-grid">
      <div class="field">
        <label>Loại sự cố</label
        ><select class="select">
          <option>Hỏng thiết bị</option>
          <option>Thiếu linh kiện</option>
          <option>Lỗi phần mềm</option>
          <option>Vấn đề an toàn</option>
        </select>
      </div>
      <div class="field">
        <label>Mức độ</label
        ><select class="select">
          <option>Thấp</option>
          <option>Trung bình</option>
          <option>Nghiêm trọng</option>
        </select>
      </div>
      <div class="field span-2">
        <label>Mô tả chi tiết</label
        ><textarea
          class="textarea"
          required
          placeholder="Mô tả hiện tượng, thời điểm phát hiện và thao tác đã thực hiện..."
        ></textarea>
      </div>
      <div class="field span-2">
        <label>Ảnh bằng chứng</label
        ><label class="upload"
          ><input type="file" accept="image/*" multiple @change="upload" /><strong
            >Chọn ảnh từ thiết bị</strong
          ><span>PNG, JPG · tối đa 5 ảnh</span></label
        >
        <div v-if="files.length" class="file-list">
          <span v-for="f in files" :key="f">{{ f }}</span>
        </div>
      </div>
      <div v-if="done" class="notice notice-success span-2">
        Báo cáo đã được gửi đến quản lý phòng lab.
      </div>
    </div>
    <div class="form-actions">
      <button type="button" class="btn" @click="router.back()">Hủy</button
      ><button class="btn btn-primary">Gửi báo cáo</button>
    </div>
  </form>
</template>
<style scoped>
.issue-form {
  max-width: 800px;
  margin: auto;
}
.upload {
  border: 1px dashed #aeb8c8;
  border-radius: 6px;
  padding: 27px;
  text-align: center;
  cursor: pointer;
  background: #fafbfc;
}
.upload input {
  display: none;
}
.upload strong,
.upload span {
  display: block;
  font-size: 11px;
}
.upload strong {
  color: #3157d5;
}
.upload span {
  margin-top: 6px;
  color: #929aa8;
}
.file-list {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}
.file-list span {
  background: #edf1f7;
  padding: 6px 9px;
  font-size: 10px;
  border-radius: 4px;
}
.form-actions {
  padding: 16px 19px;
  border-top: 1px solid #e7eaf0;
  display: flex;
  justify-content: flex-end;
  gap: 9px;
}
</style>
