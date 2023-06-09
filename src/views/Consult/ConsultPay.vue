<script setup lang="ts">
import router from '@/router'
import { createConsultOrder, getConsultOrderPayUrl, getConsultOrderPre } from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores/consult'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { showConfirmDialog, showDialog, showLoadingToast, showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const store = useConsultStore()
const payInfo = ref<ConsultOrderPreData>()
//1.获取订单信息
const loadPayInfo = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  payInfo.value = res.data
  store.setCoupon(res.data.couponId)
}
//获取患者信息
const patient = ref<Patient>()
const loadPatient = async () => {
  if (store.consult.patientId) {
    const res = await getPatientDetail(store.consult.patientId)
    patient.value = res.data
  }
}
onMounted(() => {
  if (
    !store.consult.type ||
    !store.consult.illnessType ||
    !store.consult.depId ||
    !store.consult.patientId
  ) {
    return showDialog({
      title: '温馨提示',
      message: '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付！',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }
  loadPayInfo()
  loadPatient()
})
const show = ref(false)
const paymentMethod = ref<0 | 1>()
const agree = ref(false)
const orderId = ref('')
const loading = ref(false)
const openSheet = async () => {
  if (!agree.value) return showToast('请勾选用户协议')
  loading.value = true
  const res = await createConsultOrder(store.consult)
  orderId.value = res.data.id
  store.clear()
  show.value = true
}
const onClose = () => {
  return showConfirmDialog({
    title: '关闭支付',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付',
    confirmButtonColor: 'var(--cp-primary)'
  })
    .then(() => {
      //不想关闭
      return false
    })
    .catch(() => {
      orderId.value = ''
      router.push('/user/consult')
      return true
    })
}
onBeforeRouteLeave(() => {
  //离开路由前的事情
  if (orderId.value) return false
})
// const pay = async () => {
//   if (paymentMethod.value === undefined) return showToast('请选择支付方式')
//   showLoadingToast({ message: '跳转支付', duration: 0 })
//   if (orderId.value) {
//     const res = await getConsultOrderPayUrl({
//       paymentMethod: paymentMethod.value,
//       orderId: orderId.value,
//       payCallback: 'http://127.0.0.1:5173/room'
//     })
//     location.href = res.data.payUrl
//   }
// }
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-￥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${payInfo.actualPayment.toFixed(2)}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}`"
      ></van-cell>
      <!-- <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell> -->
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      :loading="loading"
      @click="openSheet"
    />
    <cp-pay-sheet
      :actual-payment="payInfo.actualPayment"
      :orderId="orderId"
      v-model:show="show"
      :onClose="onClose"
      pay-callback="/room"
    ></cp-pay-sheet>
    <!-- <van-action-sheet
      v-model:show="show"
      title="选择支付方式"
      :closeable="false"
      :before-close="onClose"
      :close-on-popstate="false"
    >
      <div class="pay-type">
        <p class="amount">￥{{ payInfo.actualPayment.toFixed(2) }}</p>
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
    </van-action-sheet> -->
  </div>
  <div class="consult-pay-page" v-else>
    <van-skeleton title :row="4"></van-skeleton>
    <van-skeleton title :row="5"></van-skeleton>
    <van-skeleton title :row="3"></van-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
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
