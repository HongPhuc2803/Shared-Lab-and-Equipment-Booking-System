<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { notificationsApi } from '@/features/notifications/notifications.api'
import type { Notification } from '@/features/notifications/notifications.types'

const notifications = ref<Notification[]>([])
const loading = ref(false)
const errorMessage = ref('')

async function loadNotifications() {
  loading.value = true
  errorMessage.value = ''

  try {
    notifications.value = await notificationsApi.list()
  } catch (error) {
    console.error('NOTIFICATIONS API ERROR:', error)
    errorMessage.value = 'Không thể tải thông báo.'
  } finally {
    loading.value = false
  }
}

async function markRead(notification: Notification) {
  if (notification.isRead) return

  try {
    const updated = await notificationsApi.markRead(notification.id)

    const index = notifications.value.findIndex(
      (item) => item.id === notification.id,
    )

    if (index !== -1) {
      notifications.value[index] = updated
    }
  } catch (error) {
    console.error('MARK NOTIFICATION READ ERROR:', error)
  }
}

async function markAllRead() {
  const unreadNotifications = notifications.value.filter(
    (notification) => !notification.isRead,
  )

  try {
    await Promise.all(
      unreadNotifications.map((notification) =>
        notificationsApi.markRead(notification.id),
      ),
    )

    await loadNotifications()
  } catch (error) {
    console.error('MARK ALL NOTIFICATIONS READ ERROR:', error)
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('vi-VN')
}

function getBadgeClass(type: string) {
  const value = type.toLowerCase()

  if (value.includes('approval') || value.includes('approved')) {
    return 'badge-green'
  }

  if (value.includes('reminder')) {
    return 'badge-blue'
  }

  if (value.includes('waitlist')) {
    return 'badge-yellow'
  }

  return 'badge-gray'
}

function getTypeLabel(type: string) {
  const labels: Record<string, string> = {
    BookingApproved: 'Đã duyệt',
    BookingRejected: 'Từ chối',
    BookingReminder: 'Nhắc lịch',
    WaitlistUpdated: 'Hàng đợi',
  }

  return labels[type] ?? type
}

onMounted(() => {
  loadNotifications()
})
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h2>Thông báo gần đây</h2>

      <button
        class="btn btn-sm"
        :disabled="loading || !notifications.some((item) => !item.isRead)"
        @click="markAllRead"
      >
        Đánh dấu tất cả đã đọc
      </button>
    </div>

    <div v-if="loading" class="notification-state">
      Đang tải thông báo...
    </div>

    <div v-else-if="errorMessage" class="notification-state error">
      {{ errorMessage }}
    </div>

    <div v-else-if="notifications.length === 0" class="notification-state">
      Chưa có thông báo.
    </div>

    <div
      v-for="notification in notifications"
      v-else
      :key="notification.id"
      class="notification"
      :class="{ unread: !notification.isRead }"
    >
      <span
        class="badge"
        :class="getBadgeClass(notification.type)"
      >
        {{ getTypeLabel(notification.type) }}
      </span>

      <div>
        <strong>{{ notification.content }}</strong>

        <p>
          {{
            notification.isRead
              ? 'Đã đọc'
              : 'Chưa đọc'
          }}
        </p>
      </div>

      <div class="notification-actions">
        <small>{{ formatDate(notification.createdAt) }}</small>

        <button
          v-if="!notification.isRead"
          class="btn btn-sm"
          @click="markRead(notification)"
        >
          Đánh dấu đã đọc
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification {
  padding: 17px 19px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  border-bottom: 1px solid #edf0f4;
}

.notification.unread {
  background: #f8faff;
}

.notification > div {
  flex: 1;
}

.notification strong {
  font-size: 12px;
}

.notification p {
  margin: 5px 0 0;
  color: #788397;
  font-size: 11px;
}

.notification small {
  color: #98a1af;
  font-size: 9px;
}

.notification-actions {
  flex: none !important;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.notification-state {
  padding: 24px 19px;
  text-align: center;
  color: #788397;
  font-size: 12px;
}

.notification-state.error {
  color: #c0392b;
}
</style>
