<script lang="ts" setup>
import { VueFlow, useVueFlow, type Node } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { ref } from 'vue'
import type { ModelGetS } from '@Muse/lib/api';
import API from '@Muse/lib/api';

const { onPaneReady, onConnect, addEdges, fitView, addNodes } = useVueFlow({
  fitViewOnInit: true,
  elevateNodesOnSelect: true,
  elevateEdgesOnSelect: false,
})
const lastX = ref<number>(0)
const lastY = ref<number>(0)

interface Schema {
  type: string
  title?: string
  key?: string
  default?: any
  format?: string
  description?: string
}
interface Model {
  raw: ModelGetS
  inputs: Schema[]
  outputs: Schema[]
}
const addModel = async (name: string) => {
  const model = await API.model.get(name)
  const Model: Model = {
    raw: model,
    inputs: [],
    outputs: []
  }
  // @ts-ignore
  const schemas = model.latest_version.openapi_schema.components.schemas

  const inputSchema = schemas.Input
  const input_nodes: Schema[] = []
  if (inputSchema.type == 'object') {
    const requiredInputs = (inputSchema.required ?? []).map((key: string) => ({
      ...(schemas.Input.properties[key]),
      key,
    }))
    Model.inputs = Object.keys(inputSchema.properties).map(key => ({
      ...(inputSchema.properties[key]),
      key,
    }))
    if (requiredInputs.length == 0) {
      requiredInputs.push(...(Model.inputs.filter(({ key, }) => [
        "audio",
        "image",
        "image_path",
        "text",
        "prompt"
      ].includes(key ?? 'noop'))))
    }
    input_nodes.push(...requiredInputs)
  } else {
    console.error("Input schema type is unexpected:", inputSchema)
  }

  const outputSchema = schemas.ModelOutput ?? schemas.Output
  const output_nodes: Schema[] = []
  if (outputSchema.type == 'object') {
    const requiredOutputs = (schemas.ModelOutput ?? schemas.Output).required.map((key: string) => ({
      ...(schemas.ModelOutput.properties[key]),
      key,
    }))
    Model.outputs = Object.keys(outputSchema.properties).map(key => ({
      ...(outputSchema.properties[key]),
      key,
    }))
    if (requiredOutputs.length == 0) {
      requiredOutputs.push(...(Model.outputs.filter(({ key, }) => [
        "audio",
        "image",
        "image_path",
        "text",
        "prompt"
      ].includes(key ?? 'noop'))))
    }
    output_nodes.push(...requiredOutputs)
  } else if (outputSchema.type == 'array') {
    Model.outputs = [{
      type: outputSchema.items.type,
      format: outputSchema.items.format
    }]
    output_nodes.push(...Model.outputs)
  }

  const ID = (model.latest_version?.id ?? model.name)
  const PADDING = 30
  const NODE_WIDTH = 200
  const NODE_HEIGHT = 40
  lastY.value += PADDING
  lastX.value = 0
  const WIDTH = Math.max(input_nodes.length, output_nodes.length) * (NODE_WIDTH + PADDING) + PADDING
  const HEIGHT = 3 * (NODE_HEIGHT + PADDING) + PADDING
  addNodes([{
    id: ID,
    label: model.name,
    position: {x: lastX.value, y: lastY.value },
    style: { backgroundColor: '#f9d4', height: HEIGHT + 'px', width: WIDTH + 'px' },
    draggable: false,
    connectable: false
  }])
  lastY.value += PADDING
  lastX.value = input_nodes.length >= output_nodes.length ? 0
    : WIDTH/2 - (input_nodes.length * (NODE_WIDTH + PADDING) + PADDING)/2
  const IN_NODES = input_nodes.map(schema => {
    lastX.value += PADDING
    const node: Node = {
      id: `${ID}:input<${schema.key}>`,
      label: schema.title ?? schema.key ?? schema.format ?? schema.type,
      position: { x: lastX.value, y: lastY.value },
      style: { height: NODE_HEIGHT + 'px', width: NODE_WIDTH + 'px', backgroundColor: '#03F4' },
      extent: 'parent'
    }
    lastX.value += NODE_WIDTH
    return node
  })
  addNodes(IN_NODES)
  lastX.value = WIDTH / 2 - (NODE_WIDTH / 2)
  lastY.value += NODE_HEIGHT + PADDING
  addNodes([{
    id: `${ID}:model`,
    label: "🧠",
    position: { x: lastX.value, y: lastY.value },
    style: { height: NODE_HEIGHT + 'px', width: NODE_WIDTH + 'px', backgroundColor: '#9fd4' },
    extent: 'parent',
    connectable: false
  }])
  lastX.value = output_nodes.length >= input_nodes.length ? 0
    : WIDTH/2 - (output_nodes.length * (NODE_WIDTH + PADDING) + PADDING)/2;
  lastY.value += NODE_HEIGHT + PADDING
  const OUT_NODES = output_nodes.map(schema => {
    lastX.value += PADDING
    const node: Node = {
      id: `${ID}:output<${schema.key}>`,
      label: schema.title ?? schema.key ?? schema.format ?? schema.type,
      position: { x: lastX.value, y: lastY.value },
      style: { height: NODE_HEIGHT + 'px', width: NODE_WIDTH + 'px', backgroundColor: '#618484' },
      extent: 'parent'
    }
    lastX.value += NODE_WIDTH
    return node
  })
  addNodes(OUT_NODES)
  lastY.value += NODE_HEIGHT + PADDING
  lastX.value = 0

  // { id: 'e1-2', source: '1', target: '2' }
  // inputs -> model
  addEdges(IN_NODES.map(({ id }) => ({
    id: 'edge[' + id + ' -> ' + ID + ':model]',
    source: id,
    target: ID + ':model'
  })))
  // model -> outputs
  addEdges(OUT_NODES.map(({ id }) => ({
    id: 'edge[' + ID + ':model -> ' + id + ']',
    source: ID + ':model',
    target: id
  })))

  fitView()

  return Model
}
// @ts-ignore
window.addModel = addModel

onPaneReady(({ fitView }) => fitView())
setTimeout(fitView, 300)

onConnect((params) => {
  // TODO: only allow connections for matched types
  addEdges(params)
})
</script>

<template>
  
  <VueFlow class="dark basicflow" :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4">
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