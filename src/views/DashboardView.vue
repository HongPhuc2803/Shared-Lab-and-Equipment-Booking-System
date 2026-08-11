<script setup lang="ts">
import { maintenance } from '@/data/mock'
const bars = [68, 51, 76, 43, 60, 34]
const colors = ['#3157d5', '#89a3ef', '#d9e1f8']
</script>
<template>
  <div>
    <section class="kpi-grid">
      <article class="panel kpi">
        <span class="kpi-label">Tỷ lệ sử dụng trung bình</span>
        <div class="kpi-value">68%</div>
        <span class="kpi-trend">↑ 4,2% so với tháng trước</span>
      </article>
      <article class="panel kpi">
        <span class="kpi-label">Tổng lượt đặt / tháng</span>
        <div class="kpi-value">342</div>
        <span class="kpi-trend">↑ 18 lượt đặt</span>
      </article>
      <article class="panel kpi">
        <span class="kpi-label">Sự cố chưa xử lý</span>
        <div class="kpi-value">5</div>
        <span class="muted">2 sự cố nghiêm trọng</span>
      </article>
      <article class="panel kpi">
        <span class="kpi-label">Vi phạm tháng này</span>
        <div class="kpi-value">12</div>
        <span class="muted">3 tài khoản đang khóa</span>
      </article>
    </section>
    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-header">
          <h2>Tỷ lệ sử dụng theo phòng / thiết bị</h2>
          <select class="select">
            <option>Tháng 08/2026</option>
          </select>
        </div>
        <div class="panel-body">
          <div class="bars">
            <div v-for="(h, i) in bars" :key="i" class="bar-wrap">
              <span>{{ h }}%</span>
              <div class="bar" :style="{ height: `${h * 2}px` }"></div>
              <b>P{{ i + 1 }}</b>
            </div>
          </div>
        </div>
      </article>
      <article class="panel">
        <div class="panel-header"><h2>Phân bổ theo khoa / bộ môn</h2></div>
        <div class="donut-wrap">
          <div class="donut"></div>
          <div class="legend">
            <span
              v-for="(l, i) in ['Khoa CNTT · 41%', 'Khoa Điện tử · 32%', 'Khoa Cơ khí · 27%']"
              :key="l"
              ><i :style="{ background: colors[i] }"></i>{{ l }}</span
            >
          </div>
        </div>
      </article>
    </section>
    <section id="reports" class="panel recent">
      <div class="panel-header">
        <h2>Báo cáo bảo trì gần đây</h2>
        <RouterLink class="btn btn-sm" to="/manager/maintenance">Xem tất cả</RouterLink>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Thiết bị</th>
              <th>Ngày bảo trì</th>
              <th>Hạng mục</th>
              <th>Chi phí</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in maintenance" :key="r.id">
              <td>
                <strong>{{ r.resource }}</strong>
              </td>
              <td>{{ r.date }}</td>
              <td>{{ r.type }}</td>
              <td>{{ r.cost }}</td>
              <td>
                <span
                  class="badge"
                  :class="r.status === 'Hoàn tất' ? 'badge-green' : 'badge-blue'"
                  >{{ r.status }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
<style scoped>
.recent {
  margin-top: 16px;
}
.panel-header .select {
  width: auto;
  min-height: 32px;
  padding: 5px 9px;
  font-size: 10px;
}
</style>
