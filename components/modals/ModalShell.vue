<script lang="ts" setup>
import { selectedModal, Modal } from '@Muse/state/common'

defineProps<{
  size?: string
}>()
</script>

<template>
  <div class="backdrop" @click="selectedModal = Modal.None" />
  <div :class="{
    'modal': true,
    'small': size == 'small' || size == 's' || size == 'thin',
    'medium': size == 'medium' || size == 'm' || size == 'normal',
    'large': size == 'large' || size == 'l' || size == 'big',
    'fullscreen': size == 'fullscreen' || size == 'xl' || size == 'full',
  }">
    <div class="esc">
      Click anywhere outside of this window or <b>press ESC</b> to exit
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  background-color: var(--primary-background-color);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: unset;
  max-height: calc(100% - 260px);
  width: 90%;
  height: fit-content;
  border-radius: var(--primary-border-radius);
  box-shadow: var(--modal-shadow);
  overflow: visible;
}

.small {
  max-width: 300px;
}

.medium {
  max-width: 500px;
}

.large {
  max-width: 1000px;
  max-height: 900px;
  height: calc(100% - 260px);
}

.fullscreen {
  border-radius: 0 !important;
  padding: 5%;
}

.content {
  border-radius: var(--primary-border-radius);
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

h1 {
  font-size: 20px;
}

.esc {
  position: absolute;
  top: 0;
  margin-right: 0;
  margin-top: -40px;
  font-size: 14px;
  left: 50%;
  transform: translate(-50%, 0%);
  text-align: center;
  white-space: nowrap;
  color: var(--primary-font-color);
}

.backdrop {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: var(--modal-backdrop);
  z-index: 100;
  backdrop-filter: blur(5px) !important;
}
</style>