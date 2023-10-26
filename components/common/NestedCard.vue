<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import type { SortableOptions } from 'sortablejs';
import { Sortable } from "sortablejs-vue3"

enum CollapseState {
  None = 0,
  Semi = 1,
  Full = 2
}
const collapsed = ref<CollapseState>(CollapseState.Semi)
const collapse = () => collapsed.value = (collapsed.value + 1) % 3

const sortOptions: SortableOptions = {
  draggable: '.card',
  handle: '.header',
  ghostClass: 'ghost',
  group: "foobar"
}

interface CardContents {
  id: string
  numerical?: string
  title: string
  body?: string
  children: CardContents[]
}

const props = defineProps<{
  content: CardContents
}>()

</script>

<template>
  <div class="card">
    <div :class="{
      'header': true,
      'collapsed': collapsed != CollapseState.None,
    }" @click="collapse">
      <span v-if="content.numerical" class="numerical">
        {{ content.numerical }}
      </span>
      <span class="title">
        {{ content.title }}
      </span>
    </div>
    <div class="more" v-if="collapsed == CollapseState.None">
      {{ content.body }}
    </div>
    <Sortable v-if="collapsed < CollapseState.Full" tag="div" class="children" :list="content.children" item-key="id"
      :options="sortOptions">
      <template #item="{ element, index }">
        <NestedCard :content="element" />
      </template>
    </Sortable>
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding: 10px 5px 5px 10px;
  background-color: var(--primary-background-color);
  width: fit-content;
  margin-right: 10px;
  margin-bottom: 10px;
  display: inline-flex;
  width: 100%;
}

.header {
  display: inline-block;
  padding: 5px 5px 10px 5px;
  cursor: grab;
}

.numerical {
  color: var(--primary-color) !important;
}

.collapsed .title {
  color: var(--strong-font-color) !important;
}

.children {
  display: block;
}

.more {
  margin-left: 10px;

  small {
    color: var(--primary-font-color);
  }
}
</style>
