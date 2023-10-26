<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import LoadingDots from '@Muse/components/loaders/LoadingDots.vue';


const loading = ref<boolean>(true)
</script>

<template>
  <div class="loading" v-if="loading">
    <p>Beep boop -- we're doing some stuff in the background.</p>
    <a target="_blank" href="https://www.youtube.com/watch?v=rOhCY1yY2Sc">Need something to watch while you wait?</a>
    <br><br>
    <LoadingDots />
  </div>
</template>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 20px;
}

a {
  color: var(--primary-color);
  height: 42px;
  padding-top: 10px;
}

h1 {
  font-size: 16px;
  margin-top: 0px;
}
</style>