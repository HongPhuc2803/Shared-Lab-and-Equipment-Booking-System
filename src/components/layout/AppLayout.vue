<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)

const requesterNav = [
  ['Tổng quan', '/resources', 'home'],
  ['Danh mục', '/resources', 'grid'],
  ['Đặt lịch của tôi', '/my-bookings', 'calendar'],
  ['Hàng đợi', '/my-bookings?tab=waitlist', 'clock'],
  ['Thông báo', '/notifications', 'bell'],
]
const managerNav = [
  ['Chờ duyệt', '/manager/approvals', 'check'],
  ['Lịch bảo trì', '/manager/maintenance', 'tool'],
  ['Vi phạm', '/manager/violations', 'shield'],
  ['Danh mục', '/resources', 'grid'],
]
const adminNav = [
  ['Dashboard', '/admin/dashboard', 'chart'],
  ['Danh mục', '/admin/resources', 'grid'],
  ['Quy tắc ưu tiên', '/admin/settings', 'settings'],
  ['Vi phạm', '/manager/violations', 'shield'],
  ['Báo cáo', '/admin/dashboard#reports', 'file'],
]
const nav = computed(() =>
  auth.user?.role === 'Admin'
    ? adminNav
    : auth.user?.role === 'LabManager'
      ? managerNav
      : requesterNav,
)
const roleName = computed(() =>
  auth.user?.role === 'Admin'
    ? 'Quản trị viên'
    : auth.user?.role === 'LabManager'
      ? 'Lab Manager'
      : 'Requester',
)
const title = computed(() => String(route.meta.title ?? 'LabSpace'))

async function logout() {
  await auth.logout()
  await router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ open: mobileOpen }">
      <div class="brand">
        <span class="brand-mark">LS</span>
        <div><strong>LabSpace</strong><small>Quản lý phòng thí nghiệm</small></div>
      </div>
      <nav class="side-nav">
        <RouterLink v-for="item in nav" :key="item[1]" :to="item[1]" @click="mobileOpen = false">
          <span class="nav-icon" :data-icon="item[2]"></span><span>{{ item[0] }}</span>
          <span v-if="item[1] === '/manager/approvals'" class="count">5</span>
        </RouterLink>
      </nav>
      <div class="sidebar-help">
        <strong>Cần hỗ trợ?</strong><span>Liên hệ quản trị hệ thống</span
        ><a href="mailto:lab@fpt.edu.vn">lab@fpt.edu.vn</a>
      </div>
    </aside>
    <div v-if="mobileOpen" class="backdrop" @click="mobileOpen = false"></div>
    <section class="workspace">
      <header class="topbar">
        <button class="icon-button mobile-menu" aria-label="Mở menu" @click="mobileOpen = true">
          ☰
        </button>
        <div class="page-heading">
          <h1>{{ title }}</h1>
          <p>{{ route.meta.subtitle }}</p>
        </div>
        <div class="top-actions">
          <button class="icon-button" title="Thông báo" aria-label="Thông báo">
            <span class="nav-icon" data-icon="bell"></span><i></i>
          </button>
          <div class="user-block">
            <span class="avatar">{{ auth.user?.fullName?.split(' ').slice(-1)[0]?.[0] }}</span>
            <div>
              <strong>{{ auth.user?.fullName }}</strong
              ><small>{{ roleName }}</small>
            </div>
          </div>
          <button class="icon-button" title="Đăng xuất" aria-label="Đăng xuất" @click="logout">
            ↪
          </button>
        </div>
      </header>
      <main class="content"><RouterView /></main>
    </section>
  </div>
</template>
