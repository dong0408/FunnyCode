<script setup lang="ts">
import type { ConsultType } from '@/enum'
import { getConsultOrderPage } from '@/services/consult'
import type { ConsultOrderItem, ConsultOrderParams } from '@/types/consult'
import { ref } from 'vue'
import ConsultItem from './ConsultItem.vue'

const props = defineProps<{ type: ConsultType }>()
const params = ref<ConsultOrderParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})
const loading = ref(false)
const finished = ref(false)
const list = ref<ConsultOrderItem[]>([])
const onLoad = async () => {
  const res = await getConsultOrderPage(params.value)
  list.value.push(...res.data.rows)
  if (params.value.current < res.data.pageTotal) {
    params.value.current++
  } else {
    finished.value = true
  }
  loading.value = false
}

const onDelete = (id: string) => {
  //从数组中找出元素，删除元素
  // const index = list.value.find((item) => (item.id = id))
  // list.value.splice(index, 1)
  list.value = list.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item :item="item" v-for="item in list" :key="item.id" @on-delete="onDelete" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
