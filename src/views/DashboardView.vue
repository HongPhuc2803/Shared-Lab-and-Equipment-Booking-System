<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { dashboardApi } from '@/features/dashboard/dashboard.api'
import { maintenancesApi } from '@/features/maintenances/maintenances.api'

import type {
  MaintenanceReport,
  UsageDashboard,
} from '@/features/dashboard/dashboard.types'

import type {
  Maintenance,
} from '@/features/maintenances/maintenances.types'


const usageData = ref<UsageDashboard | null>(null)

const maintenanceReport = ref<MaintenanceReport | null>(null)

const maintenances = ref<Maintenance[]>([])

const loading = ref(true)


onMounted(async () => {
  loading.value = true

  try {
    const [usage, report, maintenanceList] = await Promise.all([
      dashboardApi.usage(),
      dashboardApi.maintenanceReport(),
      maintenancesApi.list(),
    ])

    usageData.value = usage
    maintenanceReport.value = report
    maintenances.value = maintenanceList
  } catch (error) {
    console.error('DASHBOARD API ERROR:', error)
  } finally {
    loading.value = false
  }
})


const averageUsage = computed(() => {
  return Math.round(usageData.value?.overallUsagePercent ?? 0)
})


const totalBookedMinutes = computed(() => {
  return usageData.value?.totalBookedMinutes ?? 0
})


const totalActualMinutes = computed(() => {
  return usageData.value?.totalActualMinutes ?? 0
})


const usageItems = computed(() => {
  return usageData.value?.byResource ?? []
})


const departmentItems = computed(() => {
  return usageData.value?.byDepartment ?? []
})


const recentMaintenances = computed(() => {
  return maintenances.value.slice(0, 3)
})


function formatDate(date?: string) {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('vi-VN')
}


function formatMoney(cost?: number | null) {
  if (cost == null) return '-'

  return new Intl.NumberFormat('vi-VN').format(cost) + ' đ'
}


function maintenanceStatus(status?: string) {
  switch (status) {
    case 'Completed':
      return 'Hoàn tất'

    case 'Scheduled':
      return 'Đã lên lịch'

    case 'InProgress':
      return 'Đang thực hiện'

    default:
      return status ?? '-'
  }
}


function maintenanceBadge(status?: string) {
  return status === 'Completed'
    ? 'badge-green'
    : 'badge-blue'
}
</script>


<template>
  <div>

    <div
      v-if="loading"
      class="panel loading-box"
    >
      Đang tải dữ liệu Dashboard...
    </div>


    <template v-else>

      <section class="kpi-grid">

        <article class="panel kpi">

          <span class="kpi-label">
            Tỷ lệ sử dụng trung bình
          </span>

          <div class="kpi-value">
            {{ averageUsage }}%
          </div>

          <span class="muted">
            Dữ liệu sử dụng thực tế
          </span>

        </article>


        <article class="panel kpi">

          <span class="kpi-label">
            Tổng phút đã đặt
          </span>

          <div class="kpi-value">
            {{ totalBookedMinutes }}
          </div>

          <span class="muted">
            Tổng thời gian booking
          </span>

        </article>


        <article class="panel kpi">

          <span class="kpi-label">
            Tổng phút sử dụng thực tế
          </span>

          <div class="kpi-value">
            {{ totalActualMinutes }}
          </div>

          <span class="muted">
            Dựa trên check-in / check-out
          </span>

        </article>


        <article class="panel kpi">

          <span class="kpi-label">
            Số đợt bảo trì
          </span>

          <div class="kpi-value">
            {{ maintenanceReport?.totalCount ?? 0 }}
          </div>

          <span class="muted">
            Trong kỳ báo cáo
          </span>

        </article>

      </section>


      <section class="dashboard-grid">

        <article class="panel">

          <div class="panel-header">
            <h2>
              Tỷ lệ sử dụng theo phòng / thiết bị
            </h2>
          </div>


          <div class="panel-body">

            <div
              v-if="usageItems.length === 0"
              class="empty-data"
            >
              Chưa có dữ liệu sử dụng.
            </div>


            <div
              v-else
              class="bars"
            >

              <div
                v-for="item in usageItems"
                :key="item.resourceId"
                class="bar-wrap"
              >

                <span>
                  {{ Math.round(item.usagePercent) }}%
                </span>


                <div
                  class="bar"
                  :style="{
                    height: `${Math.max(
                      Math.round(item.usagePercent) * 2,
                      2
                    )}px`
                  }"
                ></div>


                <b>
                  {{ item.resourceName ?? 'Không tên' }}
                </b>

              </div>

            </div>

          </div>

        </article>


        <article class="panel">

          <div class="panel-header">
            <h2>
              Phân bổ theo khoa / bộ môn
            </h2>
          </div>


          <div class="department-list">

            <div
              v-if="departmentItems.length === 0"
              class="empty-data"
            >
              Chưa có dữ liệu khoa / bộ môn.
            </div>


            <div
              v-for="department in departmentItems"
              :key="department.departmentId"
              class="department-row"
            >

              <div>

                <strong>
                  {{ department.departmentName ?? 'Chưa phân khoa' }}
                </strong>

                <small>
                  {{ department.actualMinutes }} phút sử dụng
                </small>

              </div>


              <span class="badge badge-blue">
                {{ Math.round(department.usagePercent) }}%
              </span>

            </div>

          </div>

        </article>

      </section>


      <section
        id="reports"
        class="panel recent"
      >

        <div class="panel-header">

          <h2>
            Báo cáo bảo trì gần đây
          </h2>


          <RouterLink
            class="btn btn-sm"
            to="/manager/maintenance"
          >
            Xem tất cả
          </RouterLink>

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

              <tr v-if="recentMaintenances.length === 0">

                <td
                  colspan="5"
                  class="empty-cell"
                >
                  Chưa có dữ liệu bảo trì.
                </td>

              </tr>


              <tr
                v-for="r in recentMaintenances"
                :key="r.id"
              >

                <td>
                  <strong>
                    {{ r.resourceName ?? '-' }}
                  </strong>
                </td>


                <td>
                  {{ formatDate(r.startTime) }}
                </td>


                <td>
                  {{ r.description ?? '-' }}
                </td>


                <td>
                  {{ formatMoney(r.cost) }}
                </td>


                <td>

                  <span
                    class="badge"
                    :class="maintenanceBadge(r.status)"
                  >
                    {{ maintenanceStatus(r.status) }}
                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </section>

    </template>

  </div>
</template>


<style scoped>
.recent {
  margin-top: 16px;
}


.loading-box {
  padding: 30px;
  text-align: center;
  color: #788397;
}


.empty-data {
  padding: 30px 10px;
  text-align: center;
  color: #788397;
}


.empty-cell {
  text-align: center;
  color: #788397;
}


.department-list {
  padding: 16px 19px;
}


.department-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 14px 0;
  border-bottom: 1px solid #edf0f4;
}


.department-row:last-child {
  border-bottom: 0;
}


.department-row div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}


.department-row strong {
  font-size: 12px;
}


.department-row small {
  color: #788397;
  font-size: 10px;
}


.bar-wrap b {
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
