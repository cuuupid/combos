<script lang="ts" setup>
defineProps<{
  active?: boolean
  color?: string
}>()
</script>

<template>
  <a :class="{
    'button': true,
    'active': active,
    'red': color == 'red',
  }">
    <slot></slot>
  </a>
</template>

<style lang="scss" scoped>
a {
  background: var(--primary-background-color);
  border: 1px solid var(--primary-background-color);
  color: var(--primary-color);
  padding: 2px 5px;
  border-radius: var(--primary-border-radius);
  font-size: var(--btn-font-size);
  font-weight: var(--btn-font-weight);
  white-space: nowrap;
  transition: .1s;
  display: inline-block;
  text-align: center;
}

a:not([href]):not([tabindex]) {
  color: var(--primary-color);
}

.red {
  border: 1px solid #d0021c !important;
  transition: .1s;
}

.red:hover {
  background-color: #d0021c !important;
  color: #fff !important;
  transition: .1s;
}

a:not([href]):not([tabindex]):hover {
  color: var(--primary-color);
}

a:hover {

  filter: brightness(1.3);
  transition: .1s;
}

.active {
  background-color: transparent !important;
  border: 1px solid var(--primary-color) !important;
  transition: .1s;
}
</style>