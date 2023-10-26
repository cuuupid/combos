<script lang="ts" setup>
import Icon from "@Muse/components/common/Icon.vue";
import devtools from "@vue/devtools"
if (process.env.NODE_ENV === 'development') devtools.connect()
import "@Muse/lib/api"
</script>

<template>
  <div class="mobile-warning">
    <span>
      <Icon name="drag" color="normal" /><br>Please use a larger screen size.
    </span>
  </div>

  <div class="main">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.main {
  height: 100%;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.mobile-warning {
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
  background-color: #000;
  color: var(--primary-font-color);
}

.mobile-warning span {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
}

.mobile-warning span img {
  width: 35px;
  margin-bottom: 10px;
}

@media (min-width: 768px) {
  .mobile-warning {
    display: none;
  }
}
</style>@Muse/lib/api