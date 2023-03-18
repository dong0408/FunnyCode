<template>
  <div class="test-page">
    test{{ modelValue }}
    <button @click="emit('update:modelValue', modelValue + 1)">改count</button>
    <hr />
    {{ car }} <button @click="emit('update:car', '奔驰')">买车</button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: number
  car: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', count: number): void
  (e: 'update:car', car: string): void
}>()
</script>

<style lang="scss" scoped></style>
