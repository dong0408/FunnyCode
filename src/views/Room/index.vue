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
import dayjs from 'dayjs'
import { showToast } from 'vant'

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
    list.value = []
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
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
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
      // arr.push(...item.items)
      item.items.forEach((item, index) => {
        arr.push({ ...item, notScroll: initialMsg.value === false })
      })
    })
    list.value.unshift(...arr)
    loading.value = false
    if (!data.length) {
      showToast('没有聊天记录')
    }
    //第一次需要滚动到最底部
    nextTick(() => {
      if (initialMsg.value) {
        // 把默认加载的消息改成已读
        socket.emit('updateMsgStatus', arr[arr.length - 1].id)

        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      }
    })
  })
  socket.on('statusChange', async () => {
    const res = await getConsultOrderDetail(route.query.orderId as string)
    consult.value = res.data
  })
  socket.on('receiveChatMsg', async (msg: Message) => {
    list.value.push(msg) //滚动到最低部,
    // nextTick在dom渲染之后执行
    // nextTick(()=>{ 放进括号中执行就是等回调执行完之后执行，就是等dom完成后执行})
    await nextTick()
    socket.emit('updateMsgStatus', msg.id)
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

//发送图片信息
const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: {
      picture: img
    }
  })
}

//查询加载更多聊天记录
//0.默认的聊天记录滚动到底部
//1.实现下拉刷新效果
//2.下拉刷新后，发送一个获取聊天记录的消息给后台
//3。触发聊天记录事件
const initialMsg = ref(true)
const loading = ref(false)
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const onRefresh = () => {
  socket.emit('getChatMsgList', 20, time.value, consult.value?.id)
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message :list="list"></room-message>
    </van-pull-refresh>

    <!-- <room-action :disabled="consult?.status !== OrderType.ConsultChat"></room-action> -->
    <room-action
      :disabled="consult?.status !== OrderType.ConsultChat"
      @send-text="sendText"
      @send-image="sendImage"
    ></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
