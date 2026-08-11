<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { resources, statusLabel } from '@/data/mock'
const route = useRoute()
const resource = computed(
  () => resources.find((r) => r.id === Number(route.params.id)) ?? resources[0],
)
</script>
<template>
  <div class="detail">
    <div class="detail-hero">
      <img :src="resource.image" :alt="resource.name" />
      <div class="detail-overlay">
        <span
          class="badge"
          :class="resource.status === 'available' ? 'badge-green' : 'badge-red'"
          >{{ statusLabel[resource.status] }}</span
        >
        <h2>{{ resource.name }}</h2>
        <p>{{ resource.code }} · {{ resource.location }}</p>
      </div>
    </div>
    <div class="detail-grid">
      <section class="panel">
        <div class="panel-header"><h2>Thông tin tài nguyên</h2></div>
        <div class="panel-body">
          <p class="description">{{ resource.description }}</p>
          <div class="spec-grid">
            <div v-for="(value, key) in resource.specs" :key="key">
              <small>{{ key }}</small
              ><strong>{{ value }}</strong>
            </div>
          </div>
        </div>
      </section>
      <aside class="panel booking-aside">
        <div>
          <small>ĐƠN VỊ QUẢN LÝ</small><strong>{{ resource.department }}</strong>
        </div>
        <div>
          <small>TRẠNG THÁI HIỆN TẠI</small><strong>{{ statusLabel[resource.status] }}</strong>
        </div>
        <RouterLink
          v-if="resource.status === 'available'"
          class="btn btn-primary"
          :to="`/resources/${resource.id}/calendar`"
          >Xem lịch khả dụng</RouterLink
        ><button v-else class="btn" disabled>Tạm ngừng nhận lịch</button>
      </aside>
      <section class="panel rules">
        <div class="panel-header"><h2>Nội quy & an toàn</h2></div>
        <div class="panel-body">
          <ol>
            <li>Check-in đúng giờ và xuất trình thẻ sinh viên/cán bộ.</li>
            <li>Tuân thủ hướng dẫn an toàn và sử dụng đúng thiết bị đã đăng ký.</li>
            <li>Báo cáo ngay mọi hư hỏng hoặc sự cố sau khi sử dụng.</li>
            <li>Không mang thức ăn, đồ uống vào khu vực phòng thí nghiệm.</li>
          </ol>
        </div>
      </section>
      <section class="panel docs">
        <div class="panel-header"><h2>Tài liệu hướng dẫn</h2></div>
        <div class="panel-body">
          <a href="#" class="document"
            ><span>PDF</span>
            <div>
              <strong>Hướng dẫn vận hành & an toàn</strong><small>2.4 MB · cập nhật 01/2026</small>
            </div>
            <b>↓</b></a
          >
          <h3>Thiết bị đi kèm</h3>
          <div class="child-list">
            <span>Nguồn DC Keysight</span><span>Máy tính trạm</span><span>Bộ kit thực hành</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<style scoped>
.detail-hero {
  height: 310px;
  position: relative;
  border-radius: 7px;
  overflow: hidden;
  margin-bottom: 18px;
}
.detail-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.detail-hero:after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 35%, #101a2dd9);
}
.detail-overlay {
  position: absolute;
  z-index: 2;
  left: 25px;
  bottom: 23px;
  color: #fff;
}
.detail-overlay h2 {
  font-size: 25px;
  margin: 10px 0 5px;
}
.detail-overlay p {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1.5fr 0.75fr;
  gap: 16px;
}
.description {
  font-size: 13px;
  line-height: 1.7;
  color: #586479;
}
.spec-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 18px;
}
.spec-grid div {
  padding: 13px;
  background: #f6f8fb;
  border-radius: 6px;
}
.spec-grid small,
.spec-grid strong,
.booking-aside small,
.booking-aside strong,
.document small,
.document strong {
  display: block;
}
.spec-grid small,
.booking-aside small {
  color: #8993a4;
  font-size: 9px;
  font-weight: 700;
}
.spec-grid strong {
  margin-top: 5px;
  font-size: 12px;
}
.booking-aside {
  padding: 19px;
  display: flex;
  flex-direction: column;
  gap: 19px;
}
.booking-aside strong {
  font-size: 13px;
  margin-top: 5px;
}
.booking-aside .btn {
  margin-top: auto;
}
.rules ol {
  padding-left: 20px;
  margin: 0;
  display: grid;
  gap: 12px;
  color: #596578;
  font-size: 12px;
  line-height: 1.5;
}
.document {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e2e6ed;
  padding: 12px;
  border-radius: 6px;
}
.document > span {
  background: #fde8e8;
  color: #bd3742;
  font-size: 10px;
  font-weight: 800;
  padding: 8px;
}
.document b {
  margin-left: auto;
  color: #3157d5;
}
.document small {
  color: #8993a5;
  margin-top: 3px;
}
.docs h3 {
  font-size: 12px;
  margin: 20px 0 10px;
}
.child-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.child-list span {
  padding: 7px 9px;
  background: #f0f3f8;
  border-radius: 4px;
  font-size: 10px;
}
@media (max-width: 850px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  .detail-hero {
    height: 240px;
  }
  .spec-grid {
    grid-template-columns: 1fr;
  }
  .booking-aside .btn {
    margin-top: 0;
  }
}
</style>
