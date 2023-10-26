//////? Types
import type { Model } from "replicate"

export interface ModelGetQ {
  model: string
}
export type ModelGetS = Model


//////? API
const BASE = 'http://localhost:5656'
enum ENDPOINT {
  ModelGet = '/model/get',
}

const POST = async <Q, S>(endpoint: ENDPOINT, body: Q) => {
  // @ts-ignore
  const res = await fetch(BASE + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const s = await res.json() as S
  return s
}

//////? HELPER
export default class API {
  static model = {
    get: async (model: string) => POST<ModelGetQ, ModelGetS>(ENDPOINT.ModelGet, { model, })
  }
}
// @ts-ignore
window.API = API