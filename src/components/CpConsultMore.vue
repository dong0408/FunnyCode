<template>
  <div class="cp-consult-more">
    <van-popover
      placement="top-start"
      v-model:show="showPopover"
      :actions="actions"
      @select="onSelect"
    >
      <template #reference> 更多 </template>
    </van-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const showPopover = ref(false)
const emit = defineEmits<{ (e: 'on-delete'): void; (e: 'on-preview'): void }>()
const props = defineProps<{
  disabled?: boolean
}>()
const actions = computed(() => [
  {
    text: '查看处方',
    disabled: props.disabled
  },
  {
    text: '删除订单'
  }
])

const onSelect = (action: { text: string }, i: number) => {
  if (i === 1) {
    emit('on-delete')
  }
  if (i === 0) {
    emit('on-preview')
  }
}
</script>

<style lang="scss" scoped>
.cp-consult-more {
  flex: 1;
  color: var(--cp-tag);
  font-size: 13px;
}
</style>
