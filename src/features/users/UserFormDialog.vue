<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import type { CreateUserInput, UpdateUserInput, User, UserRole, UserStatus } from './users.types'

const props = defineProps<{
  open: boolean
  initial?: User | null
  submitting?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [value: CreateUserInput | UpdateUserInput]
}>()

const { t } = useI18n()
const form = reactive<{
  fullName: string
  email: string
  password: string
  role: UserRole
  status: UserStatus
}>({ fullName: '', email: '', password: '', role: 'Requester', status: 'Active' })

watch(
  () => [props.open, props.initial],
  () => {
    form.fullName = props.initial?.fullName ?? ''
    form.email = props.initial?.email ?? ''
    form.password = ''
    form.role = props.initial?.role ?? 'Requester'
    form.status = props.initial?.status ?? 'Active'
  },
  { immediate: true },
)

function onSubmit() {
  if (props.initial) {
    emit('submit', { fullName: form.fullName, role: form.role, status: form.status })
  } else {
    emit('submit', { fullName: form.fullName, email: form.email, password: form.password, role: form.role })
  }
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <BaseCard>
      <form class="flex w-96 max-w-full flex-col gap-4 p-6" @submit.prevent="onSubmit">
        <h2 class="text-lg font-semibold">
          {{ initial ? t('users.edit') : t('users.create') }}
        </h2>
        <BaseInput v-model="form.fullName" :label="t('users.name')" required />
        <BaseInput v-if="!initial" v-model="form.email" :label="t('users.email')" type="email" required />
        <BaseInput v-if="!initial" v-model="form.password" :label="t('users.password')" type="password" required />
        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium">{{ t('users.role') }}</span>
          <select v-model="form.role" class="rounded border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
            <option value="Requester">Requester</option>
            <option value="LabManager">Lab Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
        <label v-if="initial" class="flex flex-col gap-1">
          <span class="text-sm font-medium">{{ t('users.status') }}</span>
          <select v-model="form.status" class="rounded border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
            <option value="Active">Active</option>
            <option value="Restricted">Restricted</option>
            <option value="Disabled">Disabled</option>
          </select>
        </label>
        <div class="flex justify-end gap-2">
          <BaseButton type="button" variant="secondary" @click="emit('close')">
            {{ t('users.cancel') }}
          </BaseButton>
          <BaseButton type="submit" :loading="submitting">
            {{ t('users.save') }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
