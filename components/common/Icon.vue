<script lang="ts" setup>
import defs from '@Muse/utils/icon-definitions'
defineProps<{
  name?: string & keyof typeof defs
  color?: string
}>();
</script>

<template>
  <img :src="defs[name!]" :class="color" draggable="false" />
</template>

<style lang="scss" scoped>
img {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.blue {
  filter: invert(22%) sepia(63%) saturate(3131%) hue-rotate(242deg) brightness(89%) contrast(86%);
}

.red {
  filter: invert(16%) sepia(82%) saturate(7141%) hue-rotate(347deg) brightness(80%) contrast(106%);
}

.error {
  filter: invert(16%) sepia(82%) saturate(7141%) hue-rotate(347deg) brightness(80%) contrast(106%);
}

.grey {
  filter: var(--icon-filter);
  opacity: .5;
}

.gray {
  opacity: .5;
  filter: var(--icon-filter);
}

.normal {
  filter: var(--icon-filter);
  opacity: .5;
}

.white {
  filter: invert(1);
}
</style>
