<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const done = ref(false)
const fullName = ref('')
const email = ref('')
const password = ref('')
const departmentId = ref('')

async function submit() {
  try {
    await auth.register({
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      password: password.value,
      ...(departmentId.value.trim() && { departmentId: departmentId.value.trim() }),
    })
    done.value = true
    setTimeout(() => router.push('/login'), 900)
  } catch {}
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
          <label>Họ và tên</label
          ><input v-model="fullName" class="input" required placeholder="Nguyễn Văn An" />
        </div>
        <div class="field span-2">
          <label>Email trường</label
          ><input v-model="email" class="input" required type="email" placeholder="ten@fpt.edu.vn" autocomplete="off" />
        </div>
        <div class="field">
          <label>ID Khoa / Bộ môn (không bắt buộc)</label
          ><input v-model="departmentId" class="input" placeholder="UUID do hệ thống cung cấp" />
        </div>
        <div class="field span-2">
          <label>Mật khẩu</label
          ><input v-model="password" class="input" required type="password" minlength="6" autocomplete="new-password" />
        </div>
      </div>
      <label class="terms"
        ><input type="checkbox" required /> Tôi đồng ý với nội quy sử dụng phòng thí nghiệm</label
      >
      <div v-if="done" class="notice notice-success">
        Đăng ký thành công. Đang chuyển đến trang đăng nhập...
      </div>
      <div v-else-if="auth.error" class="notice notice-danger" role="alert">{{ auth.error }}</div>
      <button class="btn btn-primary" :disabled="auth.status === 'loading'">
        {{ auth.status === 'loading' ? 'Đang đăng ký...' : 'Đăng ký tài khoản' }}
      </button>
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
