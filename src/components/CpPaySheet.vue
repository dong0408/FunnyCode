<template>
  <van-action-sheet
    :show="show"
    @update:show="emit('update:show', $event)"
    title="选择支付方式"
    :closeable="false"
    :before-close="onClose"
    :close-on-popstate="false"
  >
    <div class="pay-type">
      <p class="amount">￥{{ actualPayment.toFixed(2) }}</p>
      <van-cell-group>
        <van-cell title="微信支付" @click="paymentMethod = 0">
          <template #icon><cp-icon name="consult-wechat" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
        </van-cell>
        <van-cell title="支付宝支付" @click="paymentMethod = 1">
          <template #icon><cp-icon name="consult-alipay" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <van-button type="primary" round block @click="pay">立即支付</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>

<script setup lang="ts">
import { getConsultOrderPayUrl } from '@/services/consult'
import { showLoadingToast, showToast } from 'vant'
import { ref } from 'vue'
const props = defineProps<{
  actualPayment: number
  show: boolean
  onClose?: () => void
  orderId?: string
  payCallback: string
}>()
const emit = defineEmits<{ (e: 'update:show', show: boolean): void }>()
const paymentMethod = ref<0 | 1>()

const pay = async () => {
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  showLoadingToast({ message: '跳转支付', duration: 0 })
  if (props.orderId) {
    // const res = await getConsultOrderPayUrl({
    const res = await getConsultOrderPayUrl({
      paymentMethod: paymentMethod.value,
      orderId: props.orderId,
      payCallback: import.meta.env.VITE_APP_CALLBACK + props.payCallback
    })
    location.href = res.data.payUrl
  }
}
</script>

<style lang="scss" scoped>
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
