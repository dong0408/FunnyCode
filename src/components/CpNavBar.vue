<template>
  <van-nav-bar
    left-arrow
    fixed
    @click-left="onClickLeft"
    :title="title"
    :right-text="rightText"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{ title?: string; rightText?: string; back?: () => void }>()
const router = useRouter()
const onClickLeft = () => {
  console.log(props.back, '18')
  if(props.back) return props.back()

  //实现返回
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
const onClickRight = () => {
  //右侧按钮实现的逻辑
  emit('click-right')
}
</script>

<style lang="scss" scoped>
::v-deep() {
  // &是连接符，连接上一级与下一级的选择器
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
