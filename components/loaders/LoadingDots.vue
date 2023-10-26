<script lang="ts" setup>
</script>

<template>
  <div class="loader">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 15px;
}

.loader div {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary-color);
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.loader.blue div {
  background: var(--primary-color) !important;
}

.loader.red div {
  background: #d0021c !important;
}

.loader.grey div {
  background: var(--primary-font-color) !important;
}

.loader.gray div {
  background: var(--primary-font-color) !important;
}

.loader div:nth-child(1) {
  left: 8px;
  animation: loader1 0.6s infinite;
}

.loader div:nth-child(2) {
  left: 8px;
  animation: loader2 0.6s infinite;
}

.loader div:nth-child(3) {
  left: 32px;
  animation: loader2 0.6s infinite;
}

.loader div:nth-child(4) {
  left: 56px;
  animation: loader3 0.6s infinite;
}

@keyframes loader1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes loader3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes loader2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(24px, 0);
  }
}
</style>