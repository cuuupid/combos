<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import Icon from '@Muse/components/common/Icon.vue'
import type iconDefinitions from '@Muse/utils/icon-definitions';

const props = defineProps<{
  color?: string
  icon?: keyof typeof iconDefinitions
}>()

const color = ref(props.color || '#486fff')
</script>

<template>
  <span>
    <Icon v-if="icon" :name="icon" color="white"></Icon>
    <slot></slot>
  </span>
</template>

<style lang="scss" scoped>
img {
  max-height: 15px;
  margin-left: 2px;
  margin-right: 5px;
  vertical-align: text-top;
}

span {
  opacity: 1.0;
  background: v-bind('color');
  color: white;
  font-weight: 600;
  padding: 5px;
  padding-right: 8px;
  border-radius: 8px;
  line-height: 220%;
}
</style>