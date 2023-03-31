<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'

import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { nextTick, onMounted, onUnmounted } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType, OrderType } from '@/enum'
import { ref } from 'vue'
import { getConsultOrderDetail } from '@/services/consult'
import type { ConsultOrderItem, Image } from '@/types/consult'

const store = useUserStore()
const route = useRoute()
let socket: Socket
const list = ref<Message[]>([])
onUnmounted(() => {
  socket.close()
})
onMounted(() => {
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })
  //连接成功
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
  // 消息聊天记录
  socket.on('chatMsgList', ({ data }: { data: TimeMessages }) => {
    //  处理消息
    const arr: Message[] = []
    data.forEach((item) => {
      arr.push({
        id: item.createTime,
        msgType: MsgType.Notify,
        createTime: item.createTime,
        msg: {
          content: item.createTime
        }
      })
      arr.push(...item.items)
    })
    list.value.unshift(...arr)
  })
  socket.on('statusChange', async () => {
    const res = await getConsultOrderDetail(route.query.orderId as string)
    consult.value = res.data
    //滚动到最低部,
    // nextTick在dom渲染之后执行
    // nextTick(()=>{ 放进括号中执行就是等回调执行完之后执行，就是等dom完成后执行})
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
  })
})
const consult = ref<ConsultOrderItem>()
onMounted(async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
})
const sendText = (text: string) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <room-message :list="list"></room-message>
    <!-- <room-action :disabled="consult?.status !== OrderType.ConsultChat"></room-action> -->
    <room-action
      :disabled="consult?.status == OrderType.ConsultChat"
      @send-text="sendText"
    ></room-action>
  </div>
</template>

<style lang="scss" scoped></style>
