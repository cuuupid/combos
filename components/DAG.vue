<script lang="ts" setup>
import { VueFlow, useVueFlow, type Node, type Edge, Position } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { ref } from 'vue'
import type { ModelGetS } from '@Muse/lib/api';
import API from '@Muse/lib/api';
import ButtonPrimary from '@Muse/components/common/ButtonPrimary.vue';
import Icon from "@Muse/components/common/Icon.vue"
import topologicalSort, { type TopologicalNode } from "@Muse/utils/topological-sort"
import type { Maybe } from '@Muse/state/common';

const {
  fitView,
  onPaneReady, onConnect,
  addEdges, addNodes,
  findNode, getConnectedEdges, getSelectedNodes,
  getNodes, getEdges,
  toObject
} = useVueFlow({
  fitViewOnInit: true,
  elevateNodesOnSelect: true,
  elevateEdgesOnSelect: false,
})
const lastX = ref<number>(0)
const lastY = ref<number>(0)

const inferType = (key: string, type: string): string => {
  if (['image', 'image_path', "uri"].includes(key)) return 'image'
  if (['audio'].includes(key)) return 'audio'
  return type
}

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
const PADDING = 30
const NODE_WIDTH = 200
const NODE_HEIGHT = 40

type ModelOutputObject = {[key: string]: string}
type ModelOutputArray = string[]
type ModelOutput = ModelOutputObject | ModelOutputArray
const isModelOutputArray = (v: ModelOutput): v is ModelOutputArray => (v as string[]).length > 0

const addModel = async () => {
  const name = prompt("Which model would you like to add?")
  if (!name) throw new Error("user did not provide model name")
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
      type: inferType(key, inputSchema.properties[key].type)
    }))
    Model.inputs = Object.keys(inputSchema.properties).map(key => ({
      ...(inputSchema.properties[key]),
      key,
      type: inferType(key, inputSchema.properties[key].type)
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
      type: inferType(key, outputSchema.properties[key].type)
    }))
    Model.outputs = Object.keys(outputSchema.properties).map(key => ({
      ...(outputSchema.properties[key]),
      key,
      type: inferType(key, outputSchema.properties[key].type)
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
      type: inferType(outputSchema.items.format, outputSchema.items.type),
      format: outputSchema.items.format
    }]
    output_nodes.push(...Model.outputs)
  }

  const ID = (model.latest_version?.id ?? model.name)
  lastY.value += PADDING
  lastX.value = 0
  const WIDTH = Math.max(input_nodes.length, output_nodes.length) * (NODE_WIDTH + PADDING) + PADDING
  const HEIGHT = 3 * (NODE_HEIGHT + PADDING) + PADDING
  addNodes([{
    id: ID,
    label: model.name,
    position: { x: lastX.value, y: lastY.value },
    style: { backgroundColor: '#f9d4', height: HEIGHT + 'px', width: WIDTH + 'px' },
    draggable: false,
    connectable: false,
    selectable: false,
    expandParent: true,
    type: 'model-container'
  }])
  lastY.value += PADDING
  lastX.value = input_nodes.length >= output_nodes.length ? 0
    : WIDTH / 2 - (input_nodes.length * (NODE_WIDTH + PADDING) + PADDING) / 2
  const IN_NODES = input_nodes.map(schema => {
    lastX.value += PADDING
    const node: Node = {
      id: `${ID}:input<${schema.key}>`,
      label: schema.title ?? schema.key ?? schema.format ?? schema.type,
      position: { x: lastX.value, y: lastY.value },
      style: { height: NODE_HEIGHT + 'px', width: NODE_WIDTH + 'px', backgroundColor: '#03F4' },
      extent: 'parent',
      selectable: true,
      type: 'model-input',
      data: schema
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
    connectable: false,
    selectable: true,
    type: 'model',
    data: model,
  }])
  lastX.value = output_nodes.length >= input_nodes.length ? 0
    : WIDTH / 2 - (output_nodes.length * (NODE_WIDTH + PADDING) + PADDING) / 2;
  lastY.value += NODE_HEIGHT + PADDING
  const OUT_NODES = output_nodes.map(schema => {
    lastX.value += PADDING
    const node: Node = {
      id: `${ID}:output<${schema.key}>`,
      label: schema.title ?? schema.key ?? schema.format ?? schema.type,
      position: { x: lastX.value, y: lastY.value },
      style: { height: NODE_HEIGHT + 'px', width: NODE_WIDTH + 'px', backgroundColor: '#618484' },
      extent: 'parent',
      selectable: true,
      type: 'model-output',
      data: schema
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

  console.log(Model)
}

const num_inputs = ref<number>(0)
const addAudio = () => {
  addNodes([{
    id: `combos-input:${num_inputs.value}`,
    label: 'Audio Input',
    position: { x: num_inputs.value * (NODE_WIDTH + PADDING), y: -NODE_HEIGHT },
    style: { height: NODE_HEIGHT + 'px', width: NODE_WIDTH + 'px' },
    type: 'combos-output',
    data: { type: 'audio' }
  }])
  num_inputs.value += 1
}
const addImage = () => {
  addNodes([{
    id: `combos-input:${num_inputs.value}`,
    label: 'Image Input',
    position: { x: num_inputs.value * (NODE_WIDTH + PADDING), y: -NODE_HEIGHT },
    style: { height: NODE_HEIGHT + 'px', width: NODE_WIDTH + 'px' },
    type: 'combos-output',
    data: { type: 'image' }
  }])
  num_inputs.value += 1
}
const addText = () => {
  addNodes([{
    id: `combos-input:${num_inputs.value}`,
    label: 'Text Input',
    position: { x: num_inputs.value * (NODE_WIDTH + PADDING), y: -NODE_HEIGHT },
    style: { height: NODE_HEIGHT + 'px', width: NODE_WIDTH + 'px' },
    type: 'combos-output',
    data: { type: 'string' }
  }])
  num_inputs.value += 1
}

onPaneReady(({ fitView }) => fitView())
setTimeout(fitView, 300)

onConnect((params) => {
  const source = findNode(params.source)
  if (!source) throw new Error("No source node")
  const target = findNode(params.target)
  if (!target) throw new Error("No target node")
  console.log(source.type, '->', target.type)
  if (!(source.type.includes('output') && target.type.includes('input'))) return false
  console.log(source.data.type, '->', target.data.type)
  if (source.data.type != target.data.type) return false
  if (getConnectedEdges(target.id).filter(edge => edge.target == target.id).length > 0) return false
  addEdges(params)
})

interface Step extends TopologicalNode {
  source: string
  value: Maybe<string>
}

const vals = ref<{[id: string]: Step}>({})
const run = async () => {
  const steps: Step[] = topologicalSort(getNodes.value, getEdges.value)
    .map((step): Step => ({...step, value: null}))

  for (const step of steps) {
    if (step.source == 'INPUT') {
      step.value = prompt(`Provide a value for ${step.label}`)
    } else if (step.type == 'model') {
      const model = step.data as ModelGetS
      console.log('Executing model:', model)
      const modelId = model.owner + '/' + model.name + ':' + model.latest_version?.id
      const input: {[key: string]: string} = {}
      const inputNodes = getConnectedEdges(step.id)
        .filter(edge => edge.target == step.id)
        .map(edge => findNode(edge.source))
        .filter(node => node?.type.includes('input'))
        .map(node => vals.value[node!.id])
        .filter(_ => _)
        .map(inputStep => {
          console.log("Using input:", inputStep)
          if (!inputStep) throw new Error("Missing computation in DAG")
          if (!inputStep.value) throw new Error("Incomplete computation in DAG")
          input[inputStep.data.key as string] = inputStep.value
        })
      const result = await API.model.run(modelId, input)
      step.value = JSON.stringify(result)
    } else if (step.type == 'model-output') {
      const output: ModelOutput = JSON.parse(vals.value[step.source].value!)
      if (isModelOutputArray(output)) step.value = output.reduceRight(_ => _)
      else step.value = output[step.data.key]
    } else {
      const source = vals.value[step.source]
      if (!source) throw new Error("No source node")
      step.value = source.value
    }
    vals.value[step.id] = step
    console.log(step.id, '->', step.value, '| from', step.source)
  }
}
</script>

<template>
  <VueFlow class="dark basicflow" :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4">
    <Background pattern-color="#484848" :gap="8" />
    <Controls />
  </VueFlow>
  <Icon @click="run" name="integrations" color="white" class="logo" />
  <div class="control-panel">
    <ButtonPrimary @click="addModel">
      <Icon name="plus" color="white" /> Add Model
    </ButtonPrimary>
    <ButtonPrimary @click="addAudio">
      <Icon name="plus" color="white" /> Add Audio
    </ButtonPrimary>
    <ButtonPrimary @click="addText">
      <Icon name="plus" color="white" /> Add Text
    </ButtonPrimary>
    <ButtonPrimary @click="addImage">
      <Icon name="plus" color="white" /> Add Image
    </ButtonPrimary>
    <div class="val" v-if="vals[getSelectedNodes[0]?.id]?.value">
      <span v-if="vals[getSelectedNodes[0].id].data.type == 'string'">{{ vals[getSelectedNodes[0].id].value }}</span>
      <img v-if="vals[getSelectedNodes[0].id].data.type == 'image'" crossorigin="anonymous" :src="vals[getSelectedNodes[0].id].value!">
      <audio crossorigin="anonymous" v-if="vals[getSelectedNodes[0].id].data.type == 'audio'" controls>
        <source :src="vals[getSelectedNodes[0].id].value!" type="audio/wav">
      </audio>
      <span v-if="vals[getSelectedNodes[0].id].type == 'model'">
        <pre>{{ JSON.stringify(JSON.parse(vals[getSelectedNodes[0].id].value!), undefined, 4) }}</pre>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.control-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: fit-content;
  height: fit-content;
  padding: 10px;
  background-color: var(--primary-background-color);
}

.logo {
  position: absolute;
  right: 15px;
  top: 15px;
}

.val {
  max-width: 450px;
  margin-top: 20px;
  max-height: 800px;
  overflow-y: scroll;
  img {
    max-width: 100%;
  }
  audio {
    width: 100%;
  }
  span {
    color: white;
  }
  pre {
    background-color: black;
    color: white;
  }
}

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