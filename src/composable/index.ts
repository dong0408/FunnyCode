import type { Doctor, FollowType } from '@/types/consult'
import { followTarget } from '@/services/consult'
import { ref } from 'vue'
export const useFollow = (type: FollowType = 'doc') => {
  //关注逻辑
  const loading = ref(false)
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followTarget(item.id)
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      //不管成功失败,都会执行finally
      loading.value = false
    }
  }
  return { loading, follow }
}
