export interface Notification {
  id: string
  type: string
  content: string
  isRead: boolean
  createdAt: string
}

export interface NotificationQuery {
  UnreadOnly?: boolean
}
