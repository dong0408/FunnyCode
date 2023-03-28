<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'

import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { onMounted, onUnmounted } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
const store = useUserStore()
const route = useRoute()
let socket: Socket
onUnmounted(() => {
  socket.close()
})
onMounted(() => {
  io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })
  socket.on('connect', () => {
    console.log('打印成功')
  })
  socket.on('error', (event) => {
    // 错误异常消息
    console.log('error')
  })

  socket.on('disconnect', () => {
    // 已经断开连接
    console.log('disconnect')
  })
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status />
    <room-message></room-message>
    <room-action></room-action>
  </div>
</template>

<style lang="scss" scoped></style>
