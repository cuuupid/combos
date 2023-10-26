<script lang="ts" setup>
</script>

<template>
  <div :class="{
    'card': true,
    'active': false,
    'fadeInOut': true,
  }">
    <div class="row">
      <div class="col-9 p0 title">
        Loading this title...
      </div>
      <div class="col-3 p0 date">
        ...
      </div>
    </div>
    <div class="subtitle">
      Loading subtitle...
    </div>
    Please wait while we load this from our servers.
    This will only take a moment.
  </div>
</template>

<style lang="scss" scoped>

@import url('https://fonts.googleapis.com/css2?family=Flow+Circular&display=swap');

.card {
  position: relative;
  background: rgb(23 22 32) !important;
  border-radius: 5px;
  color: #888;
  user-select: none;
  margin-bottom: 15px;
  width: 100%;
  background: var(--secondary-background-color);
  padding: 6px;
  overflow: hidden;
  font-family: 'Flow Circular';
  font-size: var(--body-font-size);
  contain: layout;
  transition: .2s;
  cursor: pointer;
}

.card:hover {
  background: rgb(28, 27, 40) !important;
  transition: .2s;
}


.selected {
  border: 2px solid var(--primary-color);
  padding: 4px 4px 0 6px !important;
  transition: .1s;
}

.active {
  border-left: 3px solid var(--primary-color);
  padding: 6px;
  transition: .1s;
}

.starred {
  border-left: 3px solid #ffbf07;
  padding: 8px 10px 0 7px;
  transition: .1s;
}

.card:hover {
  background: var(--secondary-background-color-hover);
  box-shadow: none;
  transition: .2s;
}

.card .top {
  display: inline-flex;
}

.card .title {
  color: var(--primary-font-color);
  font-size: 14px;
  white-space: nowrap;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
  margin-bottom: 0;
  letter-spacing: .4px;
  font-weight: 500;
  user-select: none;
  display: inline-flex;
}

.medium .label {
  display: none;
}

.card .date {
  color: var(--primary-font-color);
  font-size: 13px;
  text-align: right;
  font-weight: 500;
  white-space: nowrap;
}

.card .preview {
  color: var(--primary-font-color);
  font-size: var(--small-font-size);
  filter: brightness(0.8);
  height: 33px;
  overflow: hidden;
  line-height: 16px;
  margin-bottom: 3px;
  text-overflow: ellipsis;
  letter-spacing: .1px;
  width: 100%;
  transition: .1s;
}

.card .subtitle {
  font-size: 14px;
  margin-bottom: 2px;
  font-weight: 600;
  height: 20px;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  margin-top: -1px;
  white-space: nowrap;
  letter-spacing: .4px;
  color: var(--strong-font-color);
}

.card .bottom {
  box-shadow: var(--email-bottom-shadow);
  user-select: none;
  display: flex;
  width: calc(100% + 20px);
  height: 27px;
  margin-left: -10px;
  border-radius: 0 0 5px 5px;
  padding: 0 10px;
  margin-top: 2px;
}

.card .bottom .action span {
  color: var(--primary-font-color);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .1px;
  line-height: 28px;
  white-space: nowrap;
  text-transform: uppercase;
  width: 140px;
  display: inline-block;
  height: 30px;
  padding: 0;
  overflow: hidden;
  opacity: .9;
  text-overflow: ellipsis;
}

.card .bottom .action span img {
  height: 15px;
  margin-top: 6px !important;
  margin-right: 3px !important;
}

.card .footer {
  box-shadow: var(--email-bottom-shadow);
  user-select: none;
  width: 100%;
  display: none;
  min-height: 27px;
  margin-left: -10px;
  border-radius: 0 0 5px 5px;
  padding: 0 10px;
  margin-top: 2px;
  background: var(--primary-background-color);
  border: 2px solid var(--secondary-background-color);
  position: relative;
  bottom: 0;
  z-index: 1;
}

.card.active .footer {
  width: calc(100% + 3px);
}

.card.starred .footer {
  width: calc(100% + 3px);
}

.card.selected .footer {
  width: calc(100% + 4px);
}

.medium .card.qr .footer {
  width: calc(100% + 20px);
  min-height: 129px;
}

.qr.card {
  padding: 6px 6px 20px 6px !important;
}

.card .footer .textarea {
  background: transparent;
  width: 100%;
  resize: none;
  min-height: 62px;
  cursor: text !important;
  padding-bottom: 2px;
  border: none;
  padding: 6px 0 12px 0;
  outline: none;
  display: inline-block;
  color: var(--strong-font-color);
  border-radius: none;
  border-bottom-left-radius: var(--primary-border-radius);
}

.card .send {
  display: inline;
  background: var(--primary-color);
  width: calc(50% + 3px);
  padding: 4px 6px !important;
  height: 30px;
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: -1px;
  margin-bottom: -1px;
  border-bottom-right-radius: var(--primary-border-radius);
  transition: .1s;
  font-weight: 500;
  text-align: center;
  position: absolute;
  margin-bottom: -23px;
  color: #fff;
  margin-right: -2px;
  padding: 0 6px;
  transition: .1s;
}

.democard {
  margin-bottom: 22px;
}

.card .voice {
  width: 30px;
  display: inline;
  padding: 6px;
  height: 30px;
  position: absolute;
  right: 0;
  bottom: 0;
  margin-bottom: -23px;
  color: #fff;
  background: var(--secondary-background-color);
  margin-right: -2px;
  padding: 0 6px;
  transition: .1s;
}

.card .scribe {
  display: inline;
  padding: 4px 6px;
  text-align: center;
  height: 30px;
  font-weight: 500;
  color: var(--primary-font-color);
  background: var(--secondary-background-color);
  width: calc(50% + 3px);
  bottom: 0;
  left: 0;
  border-bottom-left-radius: var(--primary-border-radius);
  position: absolute;
  margin-bottom: -23px;
  margin-left: -2px;
  transition: .1s;
}

.card .send img {
  width: 17px;
  margin-right: 2px;
  position: relative;
  margin-top: -2px;
}

.card .scribe img {
  width: 17px;
  margin-right: 2px;
  position: relative;
  margin-top: -2px;
}

.card.qr .footer {
  display: inline-block;
  width: calc(100% + 20px);
}

.card .preview.long {
  overflow: scroll;
  height: fit-content;
  margin-bottom: 5px;
  max-height: 100px;
}

.card .send:hover {
  background: var(--primary-color-hover);
  transition: .1s;
}

.qr .bottom {
  display: none;
}

.card .actions {
  text-align: right;
  white-space: nowrap;
}

.card .actions span {
  padding: 3px;
  margin-left: 3px;
  margin-top: 4px;
  cursor: default;
}

.card:hover .actions span img {
  opacity: .5;
  transition: .1s;
}

.card .actions span img {
  margin-top: 1px;
  transition: .1s;
  opacity: 0;
  margin-top: 2px;
  height: 15px;
  transition: .1s;
}

.card .actions span img:hover {
  transition: .1s;
  opacity: .7;
}

.card .bottom .action span {
  position: relative;
  cursor: pointer;
  display: inline-flex;
  height: 27px;
  transition: .1s;
}

.text::before {
  content: attr(htext);
  position: absolute;
  filter: brightness(0.7);
  width: 0;
  overflow: hidden;
  transition: 0.6s;
}

.card .bottom .action span::before {
  content: "";
  width: 0%;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  transition: 0.6s;
}

.card .bottom .action span:hover img {
  opacity: .7;
  transition: .1s;
}

.card .bottom .action span img {
  opacity: .5;
  transition: .1s;
}

.card .bottom .action span:hover .text::before,
.card .bottom .action span:hover::before {
  width: 100%;
}

.card .row {
  width: 100%;
  margin-left: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
}

[contentEditable=true]:empty:before {
  content: attr(placeholder);
  opacity: 0.4;
}

.fadeInOut {
  opacity: 1;
  -webkit-animation: fade 2s linear forwards;
  animation: fade 2s linear forwards;
  animation-iteration-count: infinite;
}


@-webkit-keyframes fade {

  0%,
  100% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }
}

@keyframes fade {

  0%,
  100% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }
}
</style>