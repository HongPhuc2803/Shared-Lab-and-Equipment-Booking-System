import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type { Notification, NotificationQuery } from './notifications.types'

export const notificationsApi = {
  list: async (params?: NotificationQuery): Promise<Notification[]> => {
    const { data } = await http.get<ApiResponse<Notification[]>>(
      '/Notifications',
      { params },
    )

    return unwrapApiResponse(data)
  },

  markRead: async (notificationId: string): Promise<Notification> => {
    const { data } = await http.put<ApiResponse<Notification>>(
      `/Notifications/${notificationId}/read`,
    )

    return unwrapApiResponse(data)
  },
}
