import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const notification = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined
  function notify(message: string) {
    notification.value = message
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      notification.value = ''
    }, 2200)
  }
  return { notification, notify }
})
