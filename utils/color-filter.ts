import type { Maybe } from "@Muse/state/common";
import autoBind from "auto-bind";

export class Color {

  private readonly clamp = (v: number) => v > 255 ? 255 : v < 0 ? 0 : v;

  private _r: number = 0
  private _g: number = 0
  private _b: number = 0

  get r() { return this._r }
  get g() { return this._g }
  get b() { return this._b }
  set r(v: number) { this._r = this.clamp(v) }
  set g(v: number) { this._g = this.clamp(v) }
  set b(v: number) { this._b = this.clamp(v) }

  set rgb(v: [number, number, number]) {
    this.r = v[0]
    this.g = v[1]
    this.b = v[2]
  }

  constructor(rgb: [number, number, number]) {
    this.rgb = rgb
    autoBind(this)
  }

  toString = () => `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`

  hueRotate(angle = 0) {
    angle = angle / 180 * Math.PI
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)

    this.multiply([
      0.213 + cos * 0.787 - sin * 0.213,
      0.715 - cos * 0.715 - sin * 0.715,
      0.072 - cos * 0.072 + sin * 0.928,
      0.213 - cos * 0.213 + sin * 0.143,
      0.715 + cos * 0.285 + sin * 0.140,
      0.072 - cos * 0.072 - sin * 0.283,
      0.213 - cos * 0.213 - sin * 0.787,
      0.715 - cos * 0.715 + sin * 0.715,
      0.072 + cos * 0.928 + sin * 0.072,
    ])
  }

  grayscale(value = 1) {
    this.multiply([
      0.2126 + 0.7874 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 + 0.2848 * (1 - value),
      0.0722 - 0.0722 * (1 - value),
      0.2126 - 0.2126 * (1 - value),
      0.7152 - 0.7152 * (1 - value),
      0.0722 + 0.9278 * (1 - value),
    ])
  }

  sepia(value = 1) {
    this.multiply([
      0.393 + 0.607 * (1 - value),
      0.769 - 0.769 * (1 - value),
      0.189 - 0.189 * (1 - value),
      0.349 - 0.349 * (1 - value),
      0.686 + 0.314 * (1 - value),
      0.168 - 0.168 * (1 - value),
      0.272 - 0.272 * (1 - value),
      0.534 - 0.534 * (1 - value),
      0.131 + 0.869 * (1 - value),
    ])
  }

  saturate(value = 1) {
    this.multiply([
      0.213 + 0.787 * value,
      0.715 - 0.715 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 + 0.285 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 - 0.715 * value,
      0.072 + 0.928 * value,
    ])
  }

  multiply([
    r1, g1, b1,
    r2, g2, b2,
    r3, g3, b3
  ]: [
    number, number, number,
    number, number, number,
    number, number, number
  ]) {
    this.rgb = [
      this.clamp(this.r * r1 + this.g * g1 + this.b * b1),
      this.clamp(this.r * r2 + this.g * g2 + this.b * b2),
      this.clamp(this.r * r3 + this.g * g3 + this.b * b3),
    ]
  }

  brightness = this.linear
  contrast = (v=1) => this.linear(v, 0.5 - v / 2)

  linear(slope = 1, intercept = 0) {
    this.rgb = [
      this.clamp(this.r * slope + intercept * 255),
      this.clamp(this.g * slope + intercept * 255),
      this.clamp(this.b * slope + intercept * 255),
    ]
  }

  invert(value = 1) {
    this.rgb = [
      this.clamp((value + this.r / 255 * (1 - 2 * value)) * 255),
      this.clamp((value + this.g / 255 * (1 - 2 * value)) * 255),
      this.clamp((value + this.b / 255 * (1 - 2 * value)) * 255),
    ]
  }

  hsl() {
    const r = this.r / 255
    const g = this.g / 255
    const b = this.b / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h: number, s: number, l: number
    h = s = l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break;

        case g:
          h = (b - r) / d + 2
          break;

        case b:
          h = (r - g) / d + 4
          break;
      }
      h /= 6
    }

    return {
      h: h * 100,
      s: s * 100,
      l: l * 100,
    }
  }

}

type num3 = [number, number, number]
type num6 = [number, number, number, number, number, number]
type Solve = {
  values: num6,
  loss: number,
}
class Solver {
  private readonly targetHSL: { h: number, s: number, l: number }
  private readonly prediction: Color
  constructor(
    private readonly target: Color,
  ) {
    this.targetHSL = target.hsl()
    this.prediction = new Color([0, 0, 0])
  }

  solve() {
    const result = this.solveNarrow(this.solveWide())
    return {
      values: result.values,
      loss: result.loss,
      filter: this.css(result.values),
    }
  }

  solveWide() {
    const A = 5
    const c = 15
    const a: num6 = [60, 180, 18000, 600, 1.2, 1.2]

    let best: Solve = { loss: Infinity, values: [0,0,0,0,0,0] }
    for (let i = 0; best.loss > 25 && i < 3; i++) {
      const initial: num6 = [50, 20, 3750, 50, 100, 100]
      const result = this.spsa(A, a, c, initial, 1000)
      if (result.loss < best.loss) {
        best = result
      }
    }
    return best;
  }

  solveNarrow(wide: Solve): Solve {
    const A = wide.loss
    const c = 2
    const A1 = A + 1
    const a: num6 = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1]
    return this.spsa(A, a, c, wide.values, 500)
  }

  spsa(A: number, a: num6, c: number, values: num6, iters: number): Solve {
    const alpha = 1
    const gamma = 0.16666666666666666

    let bestLoss = Infinity
    let best: num6 = [0,0,0,0,0,0]
    const deltas: num6 = [0,0,0,0,0,0]
    const highArgs: num6 = [0,0,0,0,0,0]
    const lowArgs: num6 = [0,0,0,0,0,0]

    for (let k = 0; k < iters; k++) {
      const ck = c / Math.pow(k + 1, gamma)
      for (let i = 0; i < 6; i++) {
        deltas[i] = Math.random() > 0.5 ? 1 : -1
        highArgs[i] = values[i] + ck * deltas[i]
        lowArgs[i] = values[i] - ck * deltas[i]
      }

      const lossDiff = this.loss(highArgs) - this.loss(lowArgs)
      for (let i = 0; i < 6; i++) {
        const g = lossDiff / (2 * ck) * deltas[i]
        const ak = a[i] / Math.pow(A + k + 1, alpha)
        values[i] = fix(values[i] - ak * g, i)
      }

      const loss = this.loss(values)
      if (loss < bestLoss) {
        best = values.slice(0) as num6
        bestLoss = loss
      }
    }
    return { values: best ?? values, loss: bestLoss }

    function fix(value: number, idx: number) {
      let max = 100;
      if (idx === 2 /* saturate */) {
        max = 7500;
      } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
        max = 200;
      }

      if (idx === 3 /* hue-rotate */) {
        if (value > max) {
          value %= max;
        } else if (value < 0) {
          value = max + value % max;
        }
      } else if (value < 0) {
        value = 0;
      } else if (value > max) {
        value = max;
      }
      return value;
    }
  }

  loss(filters: num6) {
    // Argument is array of percentages.
    const color = this.prediction;
    color.rgb = [0, 0, 0]

    color.invert(filters[0] / 100)
    color.sepia(filters[1] / 100)
    color.saturate(filters[2] / 100)
    color.hueRotate(filters[3] * 3.6)
    color.brightness(filters[4] / 100)
    color.contrast(filters[5] / 100)

    const colorHSL = color.hsl()
    return (
      Math.abs(color.r - this.target.r) +
      Math.abs(color.g - this.target.g) +
      Math.abs(color.b - this.target.b) +
      Math.abs(colorHSL.h - this.targetHSL.h) +
      Math.abs(colorHSL.s - this.targetHSL.s) +
      Math.abs(colorHSL.l - this.targetHSL.l)
    )
  }

  css(filters: num6) {
    const fmt = (idx: number, multiplier = 1) => Math.round(filters[idx] * multiplier)
    return `invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%)`;
  }
}

export const hexToRgb = (hex: string): Maybe<num3> => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ]
    : null
}

const ColorFilter = (hex: string): string => {
  hex = hex.replace('#', '').slice(0, 6)
  const rgb = hexToRgb(hex)
  if (!rgb) throw new Error('Invalid hex color')
  const color = new Color(rgb)
  const solver = new Solver(color)
  const { filter, loss } = solver.solve()
  return loss < 5 ? filter : ColorFilter(hex)
}

// @ts-ignore
window.ColorFilter = ColorFilter

export default ColorFilter
