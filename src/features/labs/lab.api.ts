import { http } from '@/lib/api/http'

export interface ListParams {
  search?: string
  type?: string
  dept?: string
  status?: string
}
export interface BookingPayload {
  resourceId: number
  startTime: string
  endTime: string
  purpose: string
  notes?: string
}
export interface MaintenancePayload {
  resourceId: number
  startTime: string
  endTime: string
  type: string
  cost?: number
}
export interface IncidentPayload {
  bookingId: string
  type: string
  severity: string
  description: string
  images?: File[]
}

// REST contract used when VITE_API_BASE_URL points to the real backend.
export const resourceApi = {
  list: (params?: ListParams) => http.get('/resources', { params }).then((r) => r.data),
  detail: (id: number | string) => http.get(`/resources/${id}`).then((r) => r.data),
  availability: (id: number | string, params?: { from?: string; to?: string }) =>
    http.get(`/resources/${id}/availability`, { params }).then((r) => r.data),
  create: (payload: unknown) => http.post('/resources', payload).then((r) => r.data),
  update: (id: number | string, payload: unknown) =>
    http.put(`/resources/${id}`, payload).then((r) => r.data),
}

export const bookingApi = {
  checkConflict: (payload: BookingPayload) =>
    http.post('/bookings/check-conflict', payload).then((r) => r.data),
  create: (payload: BookingPayload) => http.post('/bookings', payload).then((r) => r.data),
  mine: () => http.get('/bookings/my').then((r) => r.data),
  pending: () => http.get('/bookings/pending').then((r) => r.data),
  checkIn: (id: string) => http.post(`/bookings/${id}/check-in`).then((r) => r.data),
  cancel: (id: string) => http.post(`/bookings/${id}/cancel`).then((r) => r.data),
  approve: (id: string) => http.post(`/bookings/${id}/approve`).then((r) => r.data),
  reject: (id: string, reason?: string) =>
    http.post(`/bookings/${id}/reject`, { reason }).then((r) => r.data),
}

export const operationsApi = {
  maintenance: () => http.get('/maintenance').then((r) => r.data),
  createMaintenance: (payload: MaintenancePayload) =>
    http.post('/maintenance', payload).then((r) => r.data),
  reportIncident: (payload: IncidentPayload) =>
    http
      .post('/incidents', payload, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  violations: () => http.get('/violations').then((r) => r.data),
  createViolation: (payload: unknown) => http.post('/violations', payload).then((r) => r.data),
  utilizationReport: () => http.get('/reports/utilization').then((r) => r.data),
  maintenanceReport: () => http.get('/reports/maintenance').then((r) => r.data),
}
