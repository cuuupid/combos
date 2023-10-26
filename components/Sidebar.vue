<script lang="ts" setup>
import Icon from "@Muse/components/common/Icon.vue"
</script>

<template>
  <div class="sidebar">
    <div class="title"><Icon name="integrations" color="normal" /> Combos</div>

  </div>
</template>

<style scoped lang="scss">
.sidebar {
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  width: 500px;
  background-color: var(--primary-background-color);
  padding: 20px;
}

.title {
  color: var(--strong-font-color);
  font-size: 22pt;
  img {
    margin-top: -4px;
    margin-right: 14px;
    height: 22px;
  }
}
</style>