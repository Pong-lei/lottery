<template>
  <div id="prizeBar">
    <div class="prize-mess">
      <div class="prize-shine">正在抽取</div>
      <label id="prizeType" class="prize-shine">{{ currentPrize.text }}</label>
      <div id="prizeText" class="prize-shine">{{ currentPrize.title }}</div>
      <span class="prize-shine">剩余</span>
      <label id="prizeLeft" class="prize-shine">{{ currentPrize.remainCount }}</label>
      <span class="prize-shine">个</span>
      <ul class="prize-list"></ul>
    </div>
    <ul class="prize-list">
      <li
        :id="'prize-item-' + (index + 1)"
        v-for="(item, index) in prizes.slice(1)"
        :key="item.type"
        :class="['prize-item', currentPrizeIndex === index + 1 ? 'shine' : '']"
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <div class="prize-img">
          <img :src="getMenuImg(item)" alt="" />
        </div>
        <div class="prize-text">
          <div class="prize-title">{{ item.text }}{{ item.title }}</div>
          <div class="prize-count">
            <div class="progress">
              <div
                :id="'prize-bar-' + (index + 1)"
                class="progress-bar progress-bar-danger progress-bar-striped active"
                :style="{width:(item.remainCount/item.count)*100+'%'}"
              ></div>
            </div>
            <div :id="'prize-count-' + (index + 1)" class="prize-count-left">{{ item.remainCount }} / {{ item.count }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {useStore} from 'vuex'
import { computed } from "vue"

const store = useStore()
const basicData = computed(() => store.state.basicData)
const currentPrize = computed(() => store.state.currentPrize)
const currentPrizeIndex = computed(() => store.state.currentPrizeIndex)
const prizes = basicData.value.prizes

if (currentPrize.value.type === prizes[0]["type"]) {
  currentPrize.value.count === "不限制"
}

const getMenuImg = item => {
  return require(`@/assets/img/${item.img}`)
}
</script>

<style lang="scss" scoped>
#prizeBar {
  position: fixed;
  left: 0.2vh;
  padding-left: 1.2vh;
  top: 24.2vh;
  z-index: 2;
}

.prize-list {
  margin: 0;
  padding: 0;
  list-style: none;
  width: calc(20vw - 7vh);
}

.prize-item {
  padding: 9px;
  margin: 6px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-wrap: nowrap;
  background-color: rgba(0, 127, 127, 0.37);
  border: 1px solid rgba(127, 255, 255, 0.25);
  color: rgba(255, 255, 0, 0.9);
  width: 100%;
  height: 10vh;
  box-sizing: border-box;
  transition: transform 1s ease-in;
}

.prize-item .prize-img {
  /* width: 100%; */
  height: 7vh;
  width: 7vh;
  margin-right: 1.2vh;
  border-radius: 50%;
  background-color: #fff;
  text-shadow: 0 0 1vh rgba(0, 255, 255, 0.95);
  overflow: hidden;
}

.prize-img img {
  width: 90%;
  height: 90%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.prize-text {
  flex: 1;
}

.prize-title {
  margin: 4px 0;
  font-size: 0.8vw;
  height: 60%;
}

.prize-count {
  padding: 4px 0;
  position: relative;
}

.prize-count .progress {
  height: 1.8vh;
  background: rgba(0, 0, 0, 0.5);
  padding: 1px;
  overflow: visible;
  border-radius: 1vh;
}

.progress .progress-bar {
  border-radius: 1.8vh;
  position: relative;
  animation: animate-positive 2s;
  background-color: #d9534f;
  height: 1.8vh;
  -webkit-transition: width 0.6s ease;
  -o-transition: width 0.6s ease;
  transition: width 0.6s ease;
}

.progress-bar.active {
  animation: reverse progress-bar-stripes 0.4s linear infinite, animate-positive 2s;
}

.progress-bar-striped {
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-image: -o-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  -webkit-background-size: 8px 8px;
  background-size: 8px 8px;
}

@-webkit-keyframes animate-positive {
  0% {
    width: 0;
  }
}

@keyframes animate-positive {
  0% {
    width: 0;
  }
}

@-webkit-keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}

@-o-keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}

@keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}

.prize-count-left {
  position: absolute;
  color: #fff;
  right: 9px;
  font-size: 1.8vh;
  line-height: 1.6vh;
  top: 50%;
  transform: translateY(-50%);
}

.shine {
  box-shadow: 0 0 15px 0 rgba(0, 255, 255, 0.5);
  transform: scale(1.2);
  transform-origin: left center;
  position: relative;
  overflow: hidden;
}

.done {
  position: relative;
}

.done:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: not-allowed;
}

.shine span {
  position: absolute;
  display: block;
}

.shine span:nth-child(1) {
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #f9c05e);
  animation: animate1 1s linear infinite;
}

@keyframes animate1 {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

.shine span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #f9c05e);
  animation: animate2 1s linear infinite;
  animation-delay: 0.25s;
}

@keyframes animate2 {
  0% {
    top: -100%;
  }

  50%,
  100% {
    top: 100%;
  }
}

.shine span:nth-child(3) {
  bottom: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #f9c05e);
  animation: animate3 1s linear infinite;
  animation-delay: 0.5s;
}

@keyframes animate3 {
  0% {
    right: -100%;
  }

  50%,
  100% {
    right: 100%;
  }
}

.shine span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #f9c05e);
  animation: animate4 1s linear infinite;
  animation-delay: 0.75s;
}

@keyframes animate4 {
  0% {
    bottom: -100%;
  }

  50%,
  100% {
    bottom: 100%;
  }
}

.shine.prize-item {
  /* width: 24vh; */
  margin: 1.8vh 0;
}

.prize-mess {
  width: calc(20vw - 6vh);
  position: fixed;
  top: 20.2vh;
  right: 0.2vh;
  color: #fff;
  line-height: 5vh;
  font-size: 1.6vh;
  margin: 2.4vh 0;
}

.prize-shine {
  font-size: 2.5vh;
  font-weight: bold;
  color: #f9c05e;
  vertical-align: middle;
  padding: 0 6px;
}
</style>
