import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'cp-user',
  () => {
    //1用户信息
    const user = ref<User>()
    //2修改信息
    const setUser = (u: User) => {
      user.value = u
    }
    //3删除信息
    const delUser = () => {
      user.value = undefined
    }
    // 记录回调地址，修改回跳地址
    const returnUrl = ref('')
    const updateReturnUrl = (url: string) => (returnUrl.value = url)
    return { user, setUser, delUser, returnUrl, updateReturnUrl }
  },
  {
    //开启持久化，使用本地存储
    persist: true
  }
)
