import { http, unwrapApiResponse, type ApiResponse } from '@/lib/api/http'
import type {
  Booking,
  BookingQuery,
  PaginationResponse,
  CreateBookingRequest,
  CheckBookingConflictRequest,
  BookingConflictResponse,
} from './bookings.types'

export const bookingsApi = {
  list: async (params?: BookingQuery): Promise<PaginationResponse<Booking>> => {
    const { data } = await http.get<ApiResponse<PaginationResponse<Booking>>>(
      '/Bookings',
      { params },
    )

    return unwrapApiResponse(data)
  },

  getById: async (bookingId: string): Promise<Booking> => {
    const { data } = await http.get<ApiResponse<Booking>>(
      `/Bookings/${bookingId}`,
    )

    return unwrapApiResponse(data)
  },

  create: async (payload: CreateBookingRequest): Promise<Booking> => {
    const { data } = await http.post<ApiResponse<Booking>>(
      '/Bookings',
      payload,
    )

    return unwrapApiResponse(data)
  },

  checkConflict: async (
    payload: CheckBookingConflictRequest,
  ): Promise<BookingConflictResponse> => {
    const { data } = await http.post<ApiResponse<BookingConflictResponse>>(
      '/Bookings/check-conflict',
      payload,
    )

    return unwrapApiResponse(data)
  },

  checkIn: async (bookingId: string): Promise<Booking> => {
    const { data } = await http.post<ApiResponse<Booking>>(
      `/Bookings/${bookingId}/checkin`,
    )

    return unwrapApiResponse(data)
  },

  checkOut: async (bookingId: string): Promise<Booking> => {
    const { data } = await http.post<ApiResponse<Booking>>(
      `/Bookings/${bookingId}/checkout`,
    )

    return unwrapApiResponse(data)
  },

  approve: async (bookingId: string): Promise<Booking> => {
    const { data } = await http.post<ApiResponse<Booking>>(
      `/Bookings/${bookingId}/approve`,
    )

    return unwrapApiResponse(data)
  },

  reject: async (
    bookingId: string,
    reason?: string,
  ): Promise<Booking> => {
    const { data } = await http.post<ApiResponse<Booking>>(
      `/Bookings/${bookingId}/reject`,
      {
        reason: reason ?? null,
      },
    )

    return unwrapApiResponse(data)
  },
}
