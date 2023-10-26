<script lang="ts" setup>
const props = defineProps<{
  color?: string,
}>()
</script>

<template>
  <div class="pill" :style="{ background: color }">
    <slot>

    </slot>
  </div>
</template>

<style lang="scss" scoped>
.pill {
  border-radius: var(--primary-border-radius);
  padding: 0px 6px;
  color: #fff !important;
  border: 1px solid var(--primary-background-color);
  opacity: 1;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
}
</style>
