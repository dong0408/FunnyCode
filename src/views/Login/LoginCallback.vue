<script setup lang="ts">
import { bindMobile, loginByQQ, sendMobileCode } from '@/services/user'
import { onMounted, onUnmounted, ref } from 'vue'
import { mobileRules, codeRules } from '@/utils/rules'
import { showSuccessToast, type FormInstance } from 'vant'
import type { User } from '@/types/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { useMobileCode } from '@/composable'
onMounted(() => {
  // if (window.QC.login.check()) {
  //   // console.log('ok')
  //   window.QC.login.getMe((id: string) => {
  //     openId.value = id
  //     loginByQQ(id)
  //       .then((res) => {
  //         loginSuccess(res.data)
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //         isNeedBind.value = true
  //       })
  //   })
  // }
})

const openId = ref('')
const isNeedBind = ref(false)
const mobile = ref('')
const code = ref('')

// const time = ref(0)
// const form = ref<FormInstance | null>(null)
// let timeId: number
// const send = async () => {
//   if (time.value > 0) return
//   await form.value?.validate('mobile')
//   await sendMobileCode(mobile.value, 'bindMobile')
//   showSuccessToast('发送成功')
//   time.value = 60
//   if (timeId) clearInterval(timeId)
//   timeId = setInterval(() => {
//     time.value--
//     if (time.value <= 0) clearInterval(timeId)
//   }, 1000)
// }
// onUnmounted(() => {
//   clearInterval(timeId)
// })
const { time, form, send } = useMobileCode(mobile, 'bindMobile')
//绑定手机号
const store = useUserStore()
const router = useRouter()
const loginSuccess = (u: User) => {
  store.setUser(u)
  router.replace(store.returnUrl || '/user')
  store.updateReturnUrl('')
  showSuccessToast('登录成功')
}
const bind = async () => {
  const res = await bindMobile({
    mobile: mobile.value,
    code: code.value,
    openId: openId.value
  })
  loginSuccess(res.data)
}
</script>

<template>
  <div class="login-page" v-if="isNeedBind">
    <cp-nav-bar></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form" @submit="bind">
      <van-field
        name="mobile"
        v-model="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
      ></van-field>
      <van-field name="code" v-model="code" :rules="codeRules" placeholder="请输入验证码">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button style="margin-top: 50px" block round type="primary" native-type="submit">
          立即绑定
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>
