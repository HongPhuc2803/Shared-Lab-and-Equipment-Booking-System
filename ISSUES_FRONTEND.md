# 🛠️ DANH SÁCH LỖI & YÊU CẦU CẦN XỬ LÝ (FRONTEND - VUE 3)
## Dự án: Nền tảng Đặt lịch & Quản lý Phòng thí nghiệm (LabSpace)

Tài liệu này tổng hợp các vấn đề và yêu cầu chỉnh sửa phía Frontend phát hiện qua đợt kiểm thử Smoke Test.

---

### 📌 1. Lỗi truyền Resource ID từ Calendar sang Form Đặt lịch (Issue #FE-01)
- **Mức độ:** 🔴 Cao (Ảnh hưởng trực tiếp luồng đặt lịch từ Calendar)
- **File liên quan:** `src/views/CalendarView.vue` (hoặc component Calendar slot)
- **Mô tả hiện tượng:**
  - Khi người dùng bấm vào ô `+ Đặt lịch` trên Calendar của một phòng (ví dụ `CS Lab A`), URL chuyển hướng đang bị hardcode hoặc dùng sai biến index:
    ```
    /bookings/new?resource=1&start=2026-08-05T09:00&end=2026-08-05T11:00
    ```
  - Do `resource=1` là số nguyên thay vì UUID (`44e4ff50-a568-4715-9ec5-399f1bd0a63d`), Form `BookingFormView.vue` không tìm thấy tài nguyên tương ứng và tự động fallback về chọn phòng đầu tiên trong danh mục (`Mech Workshop`).
- **Giải pháp đề xuất:**
  - Lấy đúng `route.params.id` hoặc `resource.id` (dạng UUID) để truyền vào query parameter:
    ```typescript
    // Thay vì:
    router.push({ path: '/bookings/new', query: { resource: 1, start: ..., end: ... } })
    
    // Sửa thành:
    router.push({ 
      path: '/bookings/new', 
      query: { 
        resource: route.params.id || currentResource.value.id, 
        start: slot.startTime, 
        end: slot.endTime 
      } 
    })
    ```

---

### 📌 2. Bổ sung nút Check-in / Check-out trên thẻ Đặt lịch (Issue #FE-02)
- **Mức độ:** 🟡 Trung bình (Thiếu hành động tương tác trực tiếp của Requester)
- **File liên quan:** `src/views/MyBookingsView.vue`, `src/features/bookings/bookings.api.ts`
- **Mô tả hiện tượng:**
  - Tại trang `Đặt lịch của tôi` (`/my-bookings`), các thẻ booking ở trạng thái `Đã duyệt` (`Approved`) hiện chỉ có duy nhất nút `Báo sự cố`. Người dùng chưa có nút bấm để thực hiện `Check-in` và `Check-out`.
- **Giải pháp đề xuất:**
  1. Thêm API call vào `src/features/bookings/bookings.api.ts`:
     ```typescript
     checkIn: async (bookingId: string) => {
       const { data } = await http.post(`/Bookings/${bookingId}/check-in`)
       return unwrapApiResponse(data)
     },
     checkOut: async (bookingId: string) => {
       const { data } = await http.post(`/Bookings/${bookingId}/check-out`)
       return unwrapApiResponse(data)
     }
     ```
  2. Tại `MyBookingsView.vue`, kiểm tra điều kiện thời gian hiện tại so với `startTime` & `endTime`:
     - Nếu `status === 'Approved'` và chưa check-in: Hiển thị nút **`Check-in`** (kích hoạt trong khung `[startTime - 2h, endTime]`).
     - Nếu đã check-in và chưa check-out: Hiển thị nút **`Check-out`**.
     - Khi bấm, gọi API tương ứng và load lại danh sách booking.

---

### 📌 3. Hiển thị gợi ý 3 khung giờ thay thế khi có Xung đột (Issue #FE-03)
- **Mức độ:** 🟢 Thấp / Cải thiện UX
- **File liên quan:** `src/views/BookingFormView.vue`
- **Mô tả hiện tượng:**
  - Khi form phát hiện xung đột lịch, hệ thống chỉ hiển thị dòng cảnh báo màu đỏ *"Xung đột lịch xảy ra. Khung giờ này đã có người đặt hoặc đang bảo trì."* nhưng chưa render khu vực gợi ý chọn nhanh các slot thay thế từ mảng `suggestedSlots` do API trả về.
- **Giải pháp đề xuất:**
  - Thêm block UI bên dưới thông báo conflict:
    ```vue
    <div v-if="conflictResult?.suggestedSlots?.length" class="suggested-slots">
      <p class="text-sm font-medium">Gợi ý khung giờ khả dụng gần nhất:</p>
      <div class="flex gap-2 mt-2">
        <button 
          v-for="slot in conflictResult.suggestedSlots" 
          :key="slot.startTime"
          type="button"
          class="btn-outline-slot"
          @click="applySlot(slot)"
        >
          {{ formatTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}
        </button>
      </div>
    </div>
    ```

---
*Tài liệu bàn giao cho Frontend Team - Ngày 18/08/2026*
