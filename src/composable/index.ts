import type { ConsultOrderItem, Doctor, FollowType } from '@/types/consult'
import { cancelOrder, deleteOrder, followTarget, getPrescriptionPic } from '@/services/consult'
import { ref } from 'vue'
import { showFailToast, showImagePreview, showSuccessToast } from 'vant'
import { OrderType } from '@/enum'
import type { OrderDetail } from '@/types/order'
import { getMedicalOrderDetail } from '@/services/order'
import { onMounted } from 'vue'
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

//查看处方
// const showPrescription = async (id?: string) => {
//   if (id) {
//     const res = await getPrescriptionPic(id)
//     showImagePreview([res.data.url])
//   }
// }

export const useShowPrescription = () => {
  //查看处方
  const showPrescription = async (id?: string) => {
    if (id) {
      // const res = await getPrescriptionPic(id)
      const res = await getPrescriptionPic(id)
      // showImagePreview([res.data.url])
      showImagePreview([res.data.url])
    }
  }
  return { showPrescription }
}

//取消订单
export const useCancelOrder = () => {
  const loading = ref(false)
  const onCancelOrder = (item: ConsultOrderItem) => {
    loading.value = true
    cancelOrder(item.id)
      .then((res) => {
        item.status = OrderType.ConsultCancel
        // item.status = OrderType
        item.statusValue = '已取消'
        showSuccessToast('取消成功')
      })
      .catch((err) => {
        showFailToast('取消失败')
      })
      .finally(() => {
        loading.value = false
      })
  }
  return { loading, onCancelOrder }
}

//删除订单
export const useDeleteOrder = (cb: (id: string) => void) => {
  const loading = ref(false)
  const deleteConsultOrder = async (item: ConsultOrderItem) => {
    loading.value = true
    try {
      await deleteOrder(item.id)
      // emit('on-delete', item.id)
      cb && cb(item.id)
      showSuccessToast('删除成功')
    } catch (error) {
      showFailToast('删除失败')
    } finally {
      loading.value = false
    }
  }
  return { loading, deleteConsultOrder }
}

export const useOrderDetail = (id: string) => {
  const order = ref<OrderDetail>()
  const loading = ref(false)
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetail(id)
      order.value = res.data
    } finally {
      loading.value = false
    }
  })
  return { loading, order }
}
