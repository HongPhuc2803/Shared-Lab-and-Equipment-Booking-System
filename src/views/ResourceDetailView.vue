<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { resourcesApi } from '@/features/resources/resources.api'
import type { Resource } from '@/features/resources/resources.types'

const route = useRoute()
const resource = ref<Resource | null>(null)
const loading = ref(true)
const error = ref('')

async function loadResource() {
  loading.value = true
  error.value = ''
  try {
    resource.value = await resourcesApi.getById(route.params.id as string)
  } catch (err) {
    console.error('LOAD RESOURCE DETAIL ERROR:', err)
    error.value = 'Không thể tải thông tin chi tiết tài nguyên.'
  } finally {
    loading.value = false
  }
}

function statusText(status?: string) {
  if (!status) return ''
  switch (status) {
    case 'Available':
      return 'Sẵn sàng'
    case 'UnderMaintenance':
      return 'Bảo trì'
    case 'Disabled':
      return 'Ngừng sử dụng'
    default:
      return status
  }
}

onMounted(loadResource)
</script>

<template>
  <div v-if="loading" class="notice text-center" style="margin: 40px;">
    Đang tải thông tin chi tiết...
  </div>
  <div v-else-if="error" class="notice notice-danger" style="margin: 40px;">
    {{ error }}
  </div>
  <div v-else-if="resource" class="detail">
    <div class="detail-hero">
      <img
        :src="resource.imageUrl || 'https://images.unsplash.com/photo-1581093458791-9d42e3c4a896?auto=format&fit=crop&w=900&q=80'"
        :alt="resource.name"
      />
      <div class="detail-overlay">
        <span
          class="badge"
          :class="resource.status === 'Available' ? 'badge-green' : 'badge-red'"
        >
          {{ statusText(resource.status) }}
        </span>
        <h2>{{ resource.name }}</h2>
        <p>{{ resource.type === 'Room' ? 'Phòng lab' : 'Thiết bị' }} · {{ resource.departmentName || 'Chưa phân khoa' }}</p>
      </div>
    </div>
    
    <div class="detail-grid">
      <section class="panel">
        <div class="panel-header"><h2>Thông tin tài nguyên</h2></div>
        <div class="panel-body">
          <p class="description">
            {{ resource.specifications || 'Không có mô tả chi tiết.' }}
          </p>
        </div>
      </section>
      
      <aside class="panel booking-aside">
        <div>
          <small>ĐƠN VỊ QUẢN LÝ</small>
          <strong>{{ resource.departmentName || 'Chưa phân khoa' }}</strong>
        </div>
        <div>
          <small>TRẠNG THÁI HIỆN TẠI</small>
          <strong>{{ statusText(resource.status) }}</strong>
        </div>
        <RouterLink
          v-if="resource.status === 'Available'"
          class="btn btn-primary"
          :to="`/resources/${resource.id}/calendar`"
        >
          Xem lịch khả dụng
        </RouterLink>
        <button v-else class="btn" disabled>Tạm ngừng nhận lịch</button>
      </aside>
      
      <section class="panel rules">
        <div class="panel-header"><h2>Nội quy & an toàn</h2></div>
        <div class="panel-body">
          <div v-if="resource.usageRules" class="description" style="white-space: pre-line;">
            {{ resource.usageRules }}
          </div>
          <ol v-else>
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
          <a href="#" class="document">
            <span>PDF</span>
            <div>
              <strong>Hướng dẫn vận hành & an toàn</strong>
              <small>2.4 MB · cập nhật 01/2026</small>
            </div>
            <b>↓</b>
          </a>
          <h3>Thiết bị đi kèm</h3>
          <div class="child-list">
            <span>Nguồn DC Keysight</span>
            <span>Máy tính trạm</span>
            <span>Bộ kit thực hành</span>
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
