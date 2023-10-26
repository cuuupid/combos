import ColorFilter from '@Muse/utils/color-filter'
import { ref, reactive } from '@vue/reactivity'
import { computedAsync } from '@vueuse/core'
import hotkeys from 'hotkeys-js'
import type { SortableOptions } from "sortablejs";

export type Maybe<T> = T | null | undefined

export const setAccentColor = (color?: string) => {
  const accentColor = parseInt(color?.slice(1) ?? "f94377", 16)
  const root = document.documentElement
  root.style.setProperty('--primary-color', `#${accentColor.toString(16)}`)
  const hoverOffset = 0x050917
  root.style.setProperty('--primary-color-hover', `#${(accentColor - hoverOffset).toString(16)}`)
  const filter = ColorFilter(color ?? "#f94377")
  root.style.setProperty('--primary-color-filter', filter)
}
// @ts-ignore
window.setAccentColor = setAccentColor

export const sidebarCollapsed = ref(false)
export const infoContent = ref('')

export enum ListTab {
  MAIN,
}
export const listTab = ref<ListTab>(ListTab.MAIN)

export enum Modal {
  Loading,
  None,
}
export const selectedModal = ref(Modal.None)