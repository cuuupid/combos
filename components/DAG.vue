<script lang="ts" setup>
import { VueFlow, isNode, useVueFlow, type Element } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { ref } from 'vue'

const { onPaneReady, onConnect, addEdges, fitView } = useVueFlow()

const elements = ref<Element[]>([
  { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 0 }, class: 'model' },
  { id: '2', type: 'output', label: 'Node 2', position: { x: 100, y: 100 }, class: 'dark' },
])
onPaneReady(({ fitView }) => fitView())
setTimeout(fitView, 300)


onConnect((params) => {
  // TODO: only allow connections for matched types
  addEdges(params)
})
</script>

<template>
  <VueFlow v-model="elements" class="dark basicflow" :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4">
    <Background pattern-color="#484848" :gap="8" />
    <Controls />
  </VueFlow>
</template>

<style lang="scss">
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.23.0/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.23.0/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';

.basicflow {
  text-transform: uppercase;
  font-family: 'Fira Code', 'Open Sans Mono', 'JetBrains Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--primary-font-color);
}

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.basicflow.dark {
  background: var(--primary-background-color);
  color: var(--primary-font-color);
}

.basicflow.dark .vue-flow__node {
  background: var(--primary-background-color);
  color: var(--primary-font-color);
}
.vue-flow__node.selected {
  background: var(--secondary-background-color) !important;
  color: var(--strong-font-color) !important;
}

.vue-flow__controls {
  background-color: white;
}

.basicflow.dark .vue-flow__controls .vue-flow__controls-button {
  background: var(--primary-background-color);
  fill: color(--primary-font-color);
  border-color: color(--primary-font-color);
}

.basicflow.dark .vue-flow__edge-textbg {
  fill: var(--primary-background-color)
}

.basicflow.dark .vue-flow__edge-text {
  fill: var(--primary-font-color)
}

.basicflow .controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px
}

.basicflow .controls button {
  padding: 4px;
  border-radius: 5px;
  font-weight: 600;
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, .3);
  box-shadow: 0 5px 10px #0000004d;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center
}

.basicflow .controls button:hover {
  transform: scale(102%);
  transition: .25s all ease
}
</style>