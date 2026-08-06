<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const done = ref(false)
function submit() {
  done.value = true
  setTimeout(() => router.push('/login'), 900)
}
</script>
<template>
  <main class="register-page">
    <form class="register-card" @submit.prevent="submit">
      <RouterLink to="/login" class="back">← Quay lại đăng nhập</RouterLink>
      <div>
        <span class="brand-mark">LS</span>
        <h1>Tạo tài khoản</h1>
        <p>Đăng ký quyền truy cập tài nguyên phòng thí nghiệm</p>
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Họ và tên</label><input class="input" required placeholder="Nguyễn Văn An" />
        </div>
        <div class="field">
          <label>Mã số sinh viên / cán bộ</label
          ><input class="input" required placeholder="SE180001" />
        </div>
        <div class="field span-2">
          <label>Email trường</label
          ><input class="input" required type="email" placeholder="ten@fpt.edu.vn" />
        </div>
        <div class="field">
          <label>Khoa / Bộ môn</label
          ><select class="select">
            <option>Khoa Công nghệ thông tin</option>
            <option>Khoa Điện - Điện tử</option>
            <option>Khoa Cơ khí</option>
          </select>
        </div>
        <div class="field">
          <label>Vai trò</label
          ><select class="select">
            <option>Sinh viên</option>
            <option>Giảng viên</option>
            <option>Nghiên cứu sinh</option>
          </select>
        </div>
        <div class="field span-2">
          <label>Mật khẩu</label><input class="input" required type="password" minlength="6" />
        </div>
      </div>
      <label class="terms"
        ><input type="checkbox" required /> Tôi đồng ý với nội quy sử dụng phòng thí nghiệm</label
      >
      <div v-if="done" class="notice notice-success">
        Đăng ký thành công. Đang chuyển đến trang đăng nhập...
      </div>
      <button class="btn btn-primary">Đăng ký tài khoản</button>
    </form>
  </main>
</template>
<style scoped>
.register-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 30px;
  background: #f3f6fc;
}
.register-card {
  width: min(650px, 100%);
  background: #fff;
  border: 1px solid #e0e5ee;
  border-radius: 8px;
  padding: 30px;
  display: grid;
  gap: 21px;
  box-shadow: 0 16px 50px #182a5612;
}
.register-card > div:nth-child(2) {
  text-align: center;
}
.brand-mark {
  margin: auto;
}
.register-card h1 {
  margin: 15px 0 6px;
  font-size: 25px;
}
.register-card p {
  margin: 0;
  color: #7b8698;
  font-size: 12px;
}
.back {
  font-size: 12px;
  color: #3157d5;
  font-weight: 700;
}
.terms {
  font-size: 11px;
  color: #657084;
}
.terms input {
  accent-color: #3157d5;
}
</style>
