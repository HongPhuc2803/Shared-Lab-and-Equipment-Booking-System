<template>
  <div class="panel">
    <div class="panel-header">
      <h2>Thông báo gần đây</h2>
      <button class="btn btn-sm">Đánh dấu đã đọc</button>
    </div>
    <div class="notification">
      <span class="badge badge-green">Đã duyệt</span>
      <div>
        <strong>Yêu cầu BK-24081 đã được phê duyệt</strong>
        <p>Phòng Lab Vi mạch A1 · 06/08/2026, 09:00 - 11:00</p>
      </div>
      <small>12 phút trước</small>
    </div>
    <div class="notification">
      <span class="badge badge-blue">Nhắc lịch</span>
      <div>
        <strong>Lịch đặt của bạn bắt đầu trong 24 giờ</strong>
        <p>Vui lòng check-in trong vòng 15 phút trước giờ sử dụng.</p>
      </div>
      <small>2 giờ trước</small>
    </div>
    <div class="notification">
      <span class="badge badge-yellow">Hàng đợi</span>
      <div>
        <strong>Vị trí hàng đợi của bạn đã thay đổi</strong>
        <p>Bạn hiện ở vị trí #2 cho Phòng Lab AI & Robotics.</p>
      </div>
      <small>Hôm qua</small>
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
.notification div {
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
</style>
