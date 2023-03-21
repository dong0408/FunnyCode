<script setup lang="ts">
import KnowledgeCard from './KnowledgeCard.vue'
import { ref } from 'vue'
import type { KnowledgeList, KnowledgeParams, KnowledgeType } from '@/types/consult'
import { getKnowledgePage } from '@/services/consult'
const loading = ref(false)
const finished = ref(false)
const list = ref<KnowledgeList>([])

//父组件传入类型请求不同类型文章
const props = defineProps<{
  type: KnowledgeType
}>()
//准备查询参数
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 15
})
const onLoad = async () => {
  // setTimeout(() => {
  //   const data = [1, 2, 3, 4, 5]
  //   list.value.push(...data)
  //   loading.value = false
  //   if (list.value.length >= 20) {
  //     finished.value = true
  //   }
  // }, 1000)
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows)
  loading.value = false
  //是否加载完成
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="item in list" :key="item.id" :item="item"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
