import type { Edge, Node } from "@vue-flow/core";

export interface TopologicalNode extends Node {
  source: string
}
export default (nodes: Node[], edges: Edge[]): TopologicalNode[] => {
  const inDegree: Map<string, number> = new Map()
  const outDegree: Map<string, number> = new Map()

  for (const node of nodes) {
    inDegree.set(node.id, 0)
    outDegree.set(node.id, 0)
  }
  for (const edge of edges) {
    inDegree.set(edge.target, inDegree.get(edge.target)! + 1)
    outDegree.set(edge.source, outDegree.get(edge.source)! + 1)
  }
  nodes = nodes.filter(({ id, type }) => {
    switch(type) {
      case "model": return true;
      case "model-input": return inDegree.get(id)! > 0;
      case "model-output": return true;
      case "combos-output": return outDegree.get(id)! > 0;
    }
  })
  console.log("Filtered nodes down to:", nodes)

  const q: string[] = []
  for (const [nodeId, degree] of inDegree.entries())
    if (degree == 0) q.push(nodeId)

  const ordered = []
  while (q.length) {
    const node = q.shift()
    ordered.push(node)
    for (const {target} of edges.filter(({ source }) => source == node)) {
      inDegree.set(target, inDegree.get(target)! - 1)
      if (inDegree.get(target) === 0) q.push(target)
    }
  }

  const steps = ordered.map(id => nodes.find(node => node.id == id)).filter(_ => _) as Node[]
  return steps.map((step): TopologicalNode => {
    const source = step.type == 'combos-output' ?
      'INPUT'
      : edges.filter(({ target }) => target == step.id)[0]?.source
    if (!source) throw new Error('No source found for node ' + step.id)
    return {
      ...step,
      source,
    }
  })
}

