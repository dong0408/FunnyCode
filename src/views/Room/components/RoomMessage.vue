<script setup lang="ts">
import { ConsultTime, MsgType } from '@/enum'
import type { Message } from '@/types/room'
import { timeOptions, flagOptions } from '@/services/constants'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { showImagePreview } from 'vant'
import { onMounted, ref } from 'vue'
import { getConsultOrderDetail } from '@/services/consult'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
import dayjs from 'dayjs'
defineProps<{ list: Message[] }>()

const getIllnessTimeText = (time?: ConsultTime) => {
  return timeOptions.find((item) => item.value === time)?.label
}

const getConsultFlagText = (flag?: 0 | 1) => {
  return flagOptions.find((item) => item.value === flag)?.label
}
const onPreviewImage = (pictures?: Image[]) => {
  if (pictures && pictures.length) {
    showImagePreview(pictures.map((item) => item.url))
  }
}
const consult = ref<ConsultOrderItem>()
const route = useRoute()
onMounted(async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
})
const store = useUserStore()
const formatTime = (time: string) => dayjs(time).format('HH:mm')
</script>

<template>
  <template v-for="{ msgType, id, msg, from, createTime,fromAvatar } in list" :key="id">
    <!-- 患者卡片 -->
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ msg.consultRecord?.patientInfo.name }}
          {{ msg.consultRecord?.patientInfo.genderValue }}
          {{ msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ getIllnessTimeText(msg.consultRecord?.illnessTime) }} |
          {{ getConsultFlagText(msg.consultRecord?.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="onPreviewImage(msg.consultRecord?.pictures)">点击查看</van-col>
      </van-row>
    </div>
    <!-- 通知-通用 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.Notify">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 通知-温馨提示 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 通知-结束 -->
    <div class="msg msg-tip msg-tip-cancel">
      <div class="content">
        <span>订单取消</span>
      </div>
    </div>
    <!-- 发送文字 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgText && from === store.user?.id">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <van-image :src="store.user?.avatar" />
    </div>
    <!-- 发送图片 -->
    <!-- <div class="msg msg-to">
      <div class="content">
        <div class="time">20:12</div>
        <van-image
          fit="contain"
          src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
        />
      </div>
      <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
    </div> -->
    <!-- 接收文字 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgText && from !== store.user?.id">
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{msg.content}}</div>
      </div>
    </div>
    <!-- 接收图片 -->
    <!-- <div class="msg msg-from">
      <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
      <div class="content">
        <div class="time">20:12</div>
        <van-image
          fit="contain"
          src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
        />
      </div>
    </div> -->
    <!-- 处方卡片 -->
    <!-- <div class="msg msg-recipe">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p>原始处方 <van-icon name="arrow"></van-icon></p>
          </div>
          <p>李富贵 男 31岁 血管性头痛</p>
          <p>开方时间：2022-01-15 14:21:42</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="i in 2" :key="i">
            <div class="durg">
              <p>优赛明 维生素E乳</p>
              <p>口服，每次1袋，每天3次，用药3天</p>
            </div>
            <div class="num">x1</div>
          </div>
        </div>
        <div class="foot"><span>购买药品</span></div>
      </div>
    </div> -->
  </template>
  <!-- 评价卡片，后期实现 -->
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
