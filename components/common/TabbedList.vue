<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import {
  listTab, ListTab,
} from '@Muse/state/common'

const props = defineProps<{
  initialSize?: 'large' | 'medium' | 'small'
}>()

const size = ref(props.initialSize ?? 'large')
</script>

<template>
  <div :class="{
    'list': true,
    [size]: true
  }">
    <div class="header">
      <div class="acont">
        <slot name="button"></slot>
      </div>

      <div class="switch">
        <div :class="{
          'tab': true,
          'active': listTab == ListTab.MAIN
        }" @click="listTab = ListTab.MAIN">
          Main
        </div>
        <!-- more tabs here -->
      </div>
    </div>

    <div class="list-items" v-if="listTab == ListTab.MAIN">
      <slot name="items"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list {
  width: 512px;
  background: var(--secondary-background-color);
  height: 100%;
  position: relative;
  box-shadow: var(--board-shadow);
  border: none !important;
  transition: .1s;
}

.acount a {
  margin-top: -10px !important;
}

.empty img {
  width: 20px;
  margin-top: 5px;
}

.dot {
  position: absolute;
  left: 0;
  margin-left: 0px;
}

.header {
  height: 50px;
  width: 100%;
  cursor: default;
  display: inline-block;
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Safari */
  -khtml-user-select: none;
  /* Konqueror HTML */
  -moz-user-select: none;
  /* Old versions of Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
}

.medium {
  width: 150px;
}

.demoswitch {
  left: 0 !important;
  right: unset !important;
  margin-left: 10px;
}

.medium .opportunity-card {
  padding: 6px 6px 0 6px;
}

.small {
  width: 30px;
  height: 185px;
  box-shadow: none !important;
  background: transparent !important;
}

.small .dot {
  display: none;
}

.small .opportunity-card {
  pointer-events: none;
  display: none;
}

.small .header {
  border-radius: var(--primary-border-radius);
  background: var(--primary-background-color);
  box-shadow: var(--board-shadow);
  height: 185px !important;
  position: relative;
  z-index: 5;
  cursor: default !important;
  filter: brightness(1);
  transition: .1s;
}

.small .header:hover {
  filter: brightness(1.2);
  transition: .1s;
}

.small-board-click-area:hover+.header {
  filter: brightness(1.2);
  transition: .1s;
}

.small h1 {
  writing-mode: vertical-rl;
  padding: 15px 10px 0 10px !important;
  margin-top: -15px !important;
  transition: .1s;
  z-index: 11;
  position: relative;
  overflow: visible;
  text-align: left;
  max-width: 100% !important;
  margin-top: 0;
  margin-left: 5px;
}

.small .list-items {

  width: 40px;
  margin-left: -5px;
  height: 180px;
  margin-top: -150px;
  pointer-events: none;


}

.header h1 {
  font-size: 17px;
  display: inline;
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  padding: 20px 15px 10px 15px;
  text-overflow: ellipsis;
  max-width: calc(100% - 45px);

}

.small .header h1 {
  position: unset;
}

.header img {
  padding: 7px 0px;
  width: 23px;
  transition: .1s;
}

.header img:hover {
  opacity: .6;
  transition: .1s;
}

.list-items {
  overflow-y: scroll;
  height: calc(100% - 51px);
  scroll-behavior: smooth;
  padding: 4px 10px;
  overflow-x: hidden;
  position: relative;
}

.list .switch {
  display: inline-flex;
  position: absolute;
  margin-top: 9px;
  right: 0;
  margin-right: 10px;
  height: 35px;
  color: var(--primary-font-color);
  border-radius: var(--primary-border-radius);
  overflow: hidden;
  border: 2px solid var(--primary-background-color);
  background: var(--primary-background-color);
  cursor: pointer;
}

.list .tab {
  display: inline-flex;
  background-color: var(--primary-background-color);
  padding: 3px 10px 3px 10px;
  opacity: .8;
  letter-spacing: .2px;
  transition: .1s;
}

.list .tab:hover {
  opacity: 1;
  transition: .1s;
}

.list .switch .active {
  background-color: var(--secondary-background-color);
  opacity: 1;
  font-weight: 500;
  transition: .1s;
}

.count {
  padding: 0px 4px;
  min-width: 20px;
  margin-left: 5px;
  font-size: 13px;
  height: 20px;
  margin-top: 3px;
  text-align: center;
  background: var(--secondary-background-color);
  border-radius: var(--primary-border-radius);
}

.active .count {
  background: var(--primary-background-color);
}

.header .btn {
  font-size: 12px;
  margin-top: -4px;
}

.top .t8 {
  widows: 28px;
  margin-left: -15px;
}

.acont {
  color: var(--primary-font-color);
  font-size: 15px;
  display: inline-flex;
  margin-left: 10px;
  margin-top: 9px;
}

.acont img {
  width: 17px;
  margin-top: -4px;
  margin-right: 2px;
}

.refresh {
  width: 20px !important;
  margin-left: 5px;
}


.invert-color {
  filter: invert(1);
}















@property --rotate {
  syntax: "<angle>";
  initial-value: 132deg;
  inherits: false;
}

.loading::before {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  height: 100%;
  border-radius: var(--primary-border-radius);
  width: 100%;
  margin: 0 auto;
  background-image: linear-gradient(var(--primary-background-color) 10%, var(--secondary-background-color));
  opacity: 1;
  transition: opacity .5s;
  animation: spin 2.5s linear infinite;
}

@keyframes spin {
  0% {
    height: 0%;
    opacity: .5;
  }

  100% {
    height: 150%;
    opacity: 0;
  }
}


.header .options {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  overflow: visible;
  outline: none !important;
  display: inline-block;
  width: 100%;
  border-radius: var(--primary-border-radius);
  border: 3px solid var(--primary-background-color);
  box-shadow: 11px 14px 10px #00000040;
  background: var(--p-opaque);
}

.header .options div {
  padding: 0 5px 10px 5px;
}

.options .button {
  margin-top: 5px;
  margin-right: 5px;
}

.size {
  text-align: left;
  white-space: nowrap;
  margin-right: 10px;
}

.medium .options {
  display: inline-table;
  padding: 0;
  margin: 0;
  margin-left: -12px;
}

.medium .option {
  width: 100%;
  padding: 0;
  margin: 0;
}

.size p,
.option p {
  font-size: 13px;
  margin-bottom: 2px;
  margin-top: 10px;
  margin-left: 5px;
}

.option {
  width: 100%;
  text-align: left;
  overflow: visible;
}

.option a img {
  width: 20px;
}







.width-picker {
  background: var(--secondary-background-color);
  border-radius: 5px;
  padding: 0 3px 2px 0;
  margin-top: -25px;
  border: 1px solid var(--primary-background-color);
  display: inline-flex;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0%);
}

.width-trigger .width-picker {
  visibility: hidden;
}

.width-trigger {
  z-index: 6;
}

.width-trigger:hover .width-picker {
  visibility: visible;
}

.small .width-trigger:hover .width-picker {
  visibility: visible;
}

.small .width-picker {
  display: none;
}

.small .width-trigger:hover {
  overflow: visible;
}

.clicktoexpand:hover .width-picker {
  visibility: visible;
}

.width-picker div {
  background: var(--primary-background-color);
  box-shadow: inset 0 0 3px 1px rgb(0 0 0 / 11%);
  height: 18px;
  margin-top: 2px;
  border-radius: 3px;
  font-size: 15px;
  text-align: center;
}

.width-picker div:hover {
  background-color: var(--primary-font-color);
  color: var(--modal-backdrop);
  transition: .1s;
}

.width-picker div:nth-child(3) {
  width: 33px;
  margin-left: 3px;
}

.width-picker div:nth-child(2) {
  width: 23px;
  margin-left: 3px;
}

.width-picker div:nth-child(1) {
  width: 17px;
  margin-left: 3px;
}

.hoverzone:hover+.header {
  background: #f8f9fade !important;
  transition: .1s;
}

.empty {
  width: 100%;
  height: 112px;
  text-align: center;
  background: var(--secondary-background-color);
  border-radius: var(--primary-border-radius);
  position: relative;
  user-select: none;
  margin-bottom: 15px;
}

.hoverzone {
  width: 40px;
  margin-left: -5px;
  height: 180px;
  position: absolute;
  margin-top: 35px;
  z-index: 4;
  top: 0;
}

.opportunity-card.ghost,
.opportunity-card.cloned {
  opacity: 0;
  height: fit-content;
  transition: unset !important;
  visibility: hidden;
}

.small-board-click-area {
  display: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  cursor: default;
}

.count2 {
  max-width: 30px;
  display: inline-block;
  height: 20px;
  padding: 2px 6px;
}

.small .count2 {
  transform: rotate(270deg);
  position: absolute;
  bottom: 0;
  width: 100%;
  right: 0;
  margin-bottom: 5px;
  height: 25px;

}

.small .small-board-click-area {
  display: unset;
}
</style>@Muse/state/common