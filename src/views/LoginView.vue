<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { roleHome } from '@/router'
import type { Role } from '@/data/mock'

const auth = useAuthStore(),
  router = useRouter(),
  route = useRoute()
const email = ref('sinhvien@fpt.edu.vn'),
  password = ref('password'),
  remember = ref(true),
  role = ref<Role>('Requester')
async function submit() {
  try {
    await auth.login({ email: email.value, password: password.value, role: role.value })
    router.replace((route.query.redirect as string) || roleHome(role.value))
  } catch {}
}
</script>
<template>
  <main class="auth-page">
    <section class="auth-intro">
      <div class="auth-brand"><span class="brand-mark">LS</span><strong>LabSpace</strong></div>
      <div>
        <p class="eyebrow">NỀN TẢNG PHÒNG THÍ NGHIỆM DÙNG CHUNG</p>
        <h1>Đặt lịch chính xác.<br />Vận hành hiệu quả.</h1>
        <p>Truy cập phòng lab và thiết bị nghiên cứu của trường trong một hệ thống thống nhất.</p>
      </div>
      <small>© 2026 LabSpace · Trường Đại học FPT</small>
    </section>
    <section class="auth-form-wrap">
      <form class="auth-form" @submit.prevent="submit">
        <div>
          <h2>Đăng nhập hệ thống</h2>
          <p>Sử dụng tài khoản trường để tiếp tục</p>
        </div>
        <div class="field">
          <label>Email</label><input v-model="email" class="input" type="email" required />
        </div>
        <div class="field">
          <label>Mật khẩu</label><input v-model="password" class="input" type="password" required />
        </div>
        <div class="field">
          <label>Trải nghiệm vai trò</label
          ><select v-model="role" class="select">
            <option value="Requester">Người đặt lịch</option>
            <option value="LabManager">Quản lý phòng lab</option>
            <option value="Admin">Quản trị viên</option>
          </select>
        </div>
        <div class="auth-options">
          <label><input v-model="remember" type="checkbox" /> Ghi nhớ đăng nhập</label
          ><a href="#">Quên mật khẩu?</a>
        </div>
        <p v-if="auth.error" class="notice notice-danger">Email hoặc mật khẩu không chính xác.</p>
        <button class="btn btn-primary auth-submit" :disabled="auth.status === 'loading'">
          {{ auth.status === 'loading' ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
        <div class="auth-divider"><span>hoặc</span></div>
        <p class="auth-register">
          Chưa có tài khoản? <RouterLink to="/register">Đăng ký ngay</RouterLink>
        </p>
      </form>
    </section>
  </main>
</template>
<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(360px, 43%) 1fr;
  background: #fff;
}
.auth-intro {
  padding: 48px clamp(35px, 6vw, 90px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
  background: linear-gradient(145deg, #19368f, #3157d5 62%, #2d69c4);
}
.auth-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 20px;
}
.auth-brand .brand-mark {
  background: #fff;
  color: #3157d5;
}
.eyebrow {
  font-size: 11px;
  font-weight: 800;
  opacity: 0.75;
}
.auth-intro h1 {
  font-size: clamp(34px, 4vw, 54px);
  line-height: 1.13;
  letter-spacing: 0;
  margin: 17px 0;
}
.auth-intro div > p:last-child {
  max-width: 470px;
  line-height: 1.7;
  opacity: 0.8;
  font-size: 14px;
}
.auth-intro small {
  opacity: 0.6;
}
.auth-form-wrap {
  display: grid;
  place-items: center;
  padding: 30px;
}
.auth-form {
  width: min(420px, 100%);
  display: grid;
  gap: 18px;
}
.auth-form h2 {
  font-size: 26px;
  margin: 0 0 7px;
}
.auth-form > div > p {
  margin: 0;
  color: #7c8799;
  font-size: 13px;
}
.auth-options {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #626e81;
}
.auth-options a,
.auth-register a {
  color: #3157d5;
  font-weight: 700;
}
.auth-submit {
  width: 100%;
  min-height: 46px;
}
.auth-divider {
  text-align: center;
  border-top: 1px solid #e1e5ec;
  height: 1px;
  margin: 5px 0 0;
}
.auth-divider span {
  position: relative;
  top: -9px;
  background: #fff;
  padding: 0 12px;
  color: #9aa3b2;
  font-size: 11px;
}
.auth-register {
  text-align: center !important;
}
.auth-form input[type='checkbox'] {
  accent-color: #3157d5;
}
@media (max-width: 760px) {
  .auth-page {
    display: block;
  }
  .auth-intro {
    display: none;
  }
  .auth-form-wrap {
    min-height: 100vh;
    padding: 24px;
  }
  .auth-form:before {
    content: 'LabSpace';
    color: #3157d5;
    font-size: 21px;
    font-weight: 800;
    margin-bottom: 18px;
  }
}
</style>
