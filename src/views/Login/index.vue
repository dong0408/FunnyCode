<template>
  <div class="login-page">
    <cp-nav-bar right-text="注册" @click-right="$router.push('/register')"></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="login" ref="form">
      <van-field
        name="mobile"
        v-model="mobile"
        type="text"
        :rules="mobileRules"
        placeholder="请输入手机号"
      ></van-field>
      <van-field
        v-if="isPass"
        :type="show ? 'text' : 'password'"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
      >
        <template #button>
          <cp-icon @click="show = !show" :name="`login-eye-${show ? 'on' : 'off'}`"></cp-icon>
        </template>
      </van-field>
      <van-field v-else :rules="codeRules" v-model="code" placeholder="请输入验证码">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{
            time > 0 ? `${time}s后发送验证码` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button native-type="submit" block round type="primary">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <a
          @click="store.updateReturnUrl($route.query.returnUrl as string)"
          :href="`https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=${url}`"
        >
          <!-- <div id="qq"></div> -->
          <img src="@/assets/qq.svg" alt="" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showToast, showSuccessToast, type FormInstance } from 'vant'
import { loginByCode, loginByPassword, sendMobileCode } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { useMobileCode } from '@/composable'
import axios from 'axios'
// import QC from ''
const agree = ref(false)
const mobile = ref('')
const password = ref('')
const store = useUserStore()
const router = useRouter()
const route = useRoute()
const fn = () => {
  console.log('组件')
}
const show = ref(false)
const login = async () => {
  if (!agree.value) return showToast('请勾选我已同意')
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByCode(mobile.value, code.value)
  store.setUser(res.data)
  router.replace((route.query.returnUrl as string) || '/user')
  showSuccessToast('登录成功')
  console.log(res)
}

//短信登录页面切换
const isPass = ref(true)
const code = ref('')
// const time = ref(0)
// const form = ref<FormInstance | null>(null)
// let timeId: number
// const send = async () => {
//   if (time.value > 0) return
//   await form.value?.validate('mobile')
//   await sendMobileCode(mobile.value, 'login')
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
const url = encodeURIComponent(import.meta.env.VITE_APP_CALLBACK)
// onMounted(() => {
//   QC.Login({
//     btnId: 'qq'
//   })
// })\

axios.get('/patient/message/sys/list').then((res) => {
  console.log(res, 'mock')
})
</script>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>
