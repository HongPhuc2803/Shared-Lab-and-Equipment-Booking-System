import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: '/resources' },
      {
        path: 'resources',
        component: () => import('@/views/ResourcesView.vue'),
        meta: {
          title: 'Danh mục phòng & thiết bị',
          subtitle: 'Tìm và đặt lịch tài nguyên dùng chung',
        },
      },
      {
        path: 'resources/:id',
        component: () => import('@/views/ResourceDetailView.vue'),
        meta: { title: 'Chi tiết tài nguyên', subtitle: 'Thông số, nội quy và tài liệu hướng dẫn' },
      },
      {
        path: 'resources/:id/calendar',
        component: () => import('@/views/CalendarView.vue'),
        meta: { title: 'Lịch khả dụng', subtitle: 'Chọn khung giờ phù hợp để gửi yêu cầu' },
      },
      {
        path: 'bookings/new',
        component: () => import('@/views/BookingFormView.vue'),
        meta: { title: 'Tạo yêu cầu đặt lịch', subtitle: 'Điền thông tin và kiểm tra lịch trống' },
      },
      {
        path: 'my-bookings',
        component: () => import('@/views/MyBookingsView.vue'),
        meta: { title: 'Đặt lịch của tôi', subtitle: 'Theo dõi, check-in và quản lý hàng đợi' },
      },
      {
        path: 'bookings/:id/report-issue',
        component: () => import('@/views/IssueReportView.vue'),
        meta: { title: 'Báo cáo sự cố', subtitle: 'Gửi thông tin để bộ phận kỹ thuật xử lý' },
      },
      {
        path: 'manager/approvals',
        component: () => import('@/views/ApprovalsView.vue'),
        meta: {
          title: 'Duyệt yêu cầu đặt lịch',
          subtitle: 'Xử lý yêu cầu theo mức độ ưu tiên',
          roles: ['LabManager', 'Admin'],
        },
      },
      {
        path: 'manager/maintenance',
        component: () => import('@/views/MaintenanceView.vue'),
        meta: {
          title: 'Quản lý bảo trì',
          subtitle: 'Lên lịch và theo dõi phiếu sửa chữa',
          roles: ['LabManager', 'Admin'],
        },
      },
      {
        path: 'manager/violations',
        component: () => import('@/views/ViolationsView.vue'),
        meta: {
          title: 'Vi phạm & khóa quyền',
          subtitle: 'Theo dõi và áp dụng chế tài người dùng',
          roles: ['LabManager', 'Admin'],
        },
      },
      {
        path: 'admin/dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Dashboard thống kê',
          subtitle: 'Hiệu suất sử dụng toàn hệ thống',
          roles: ['Admin'],
        },
      },
      {
        path: 'admin/resources',
        component: () => import('@/views/AdminResourcesView.vue'),
        meta: {
          title: 'Quản lý danh mục',
          subtitle: 'Cập nhật phòng lab và thiết bị',
          roles: ['Admin'],
        },
      },
      {
        path: 'admin/settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: {
          title: 'Quy tắc & cấu hình',
          subtitle: 'Điểm ưu tiên và chế tài vi phạm',
          roles: ['Admin'],
        },
      },
      {
        path: 'notifications',
        component: () => import('@/views/NotificationsView.vue'),
        meta: { title: 'Thông báo', subtitle: 'Cập nhật mới nhất về lịch đặt của bạn' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true },
  },
]

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes })
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated)
    return { name: 'login', query: { redirect: to.fullPath } }
  if ((to.name === 'login' || to.name === 'register') && auth.isAuthenticated)
    return roleHome(auth.user?.role)
  const roles = to.meta.roles as string[] | undefined
  if (roles && auth.user && !roles.includes(auth.user.role)) return roleHome(auth.user.role)
})
export function roleHome(role?: string) {
  return role === 'Admin'
    ? '/admin/dashboard'
    : role === 'LabManager'
      ? '/manager/approvals'
      : '/resources'
}
export default router
