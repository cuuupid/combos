<script lang="ts" setup>
import { Color, hexToRgb } from "@Muse/utils/color-filter"
import { computed } from "@vue/reactivity";

const props = defineProps({
  bgColor: {
    type: String,
    required: false,
    default: '#5541c8'
  },
  fgColor: {
    type: String,
    required: false,
    default: '#fff'
  },
})

const hover = computed(() => {
  const c = new Color(hexToRgb(props.bgColor)!)
  c.brightness(0.8)
  return c.toString()
})
</script>

<template>
  <a>
    <slot></slot>
  </a>
</template>

<style lang="scss">
a {
  background: v-bind(bgColor);
  color: v-bind(fgColor) !important;
  margin-top: 0;
  transition: .1s;
  width: 100%;
  position: relative;
  padding: 4px 10px 5px 9px;
  border-radius: var(--primary-border-radius);
  font-size: 14px;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  height: 30px;
  margin-bottom: 5px;
  letter-spacing: .3px;
  transition: .1s;
  img {
    width: 12px;
    margin-top: -3px;
  }
}

a:hover {
  background: v-bind(hover);
  transition: .1s;
}
</style>