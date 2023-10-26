<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from '@vue/reactivity'
import { selectedModal, Modal } from '@Muse/state/common'
import ModalShell from "@Muse/components/modals/ModalShell.vue"
import ModalLoading from '@Muse/components/modals/ModalLoading.vue'
import LoaderScreen from '@Muse/components/loaders/LoaderScreen.vue';
import DAG from '@Muse/components/DAG.vue'
import Sidebar from '@Muse/components/Sidebar.vue'

const router = useRouter()
const route = ref(router.currentRoute.value.name)

</script>

<template>
  <div :class="{
    'home': true,
  }">
    <KeepAlive>
      <Suspense>

        <div class="main">
          <DAG />
          <Sidebar />
        </div>

        <template #fallback>
          <LoaderScreen />
        </template>
      </Suspense>
    </KeepAlive>

    <ModalShell size="medium" v-if="selectedModal == Modal.Loading">
      <ModalLoading />
    </ModalShell>
    <!-- other modals here-->

  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100%;
  overflow-x: scroll !important;
  height: 100%;
  overflow: hidden;
  display: inline-flex;
}

.home .main {
  overflow: visible;
  display: inline-flex;
  margin-top: -10px;
  padding-top: 10px;
  width: -webkit-fill-available;
}

.vue-flow {
  width: calc(100% - 500px);
}
</style>