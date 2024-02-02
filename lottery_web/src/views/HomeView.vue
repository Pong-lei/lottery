<template>
  <!-- <div class="bg-box" id="bgVideo"></div> -->

  <div class="music" @click="handleMusicBox">
    <audio id="music" ref="Music" class="music-item" loop :src="SRC"></audio>
    <div id="musicBox" class="music-box" title="播放/暂停背景音乐"></div>
  </div>

  <PrizeBar :currentPrizeIndex="currentPrizeIndex" />

  <WordCard ref="wordCard" />
  <DanmuComp />
  <MenuBtn ref="MenuBtnRef" @enter="handleEnter" @lottery="handleLottery" />
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useStore } from "vuex"
import PrizeBar from "@/components/PrizeBar"
import MenuBtn from "@/components/MenuBtn"
import DanmuComp from "@/components/DanmuComp.vue"
import WordCard from "@/components/WordCard.vue"

const currentPrizeIndex = ref(4)
const MenuBtnRef = ref(null)
const wordCard = ref(null)
const Music = ref(null)
const SRC = ref("")

const store = useStore()
const currentMusic = computed(() => store.state.currentMusic)

const handleEnter = () => {
  wordCard?.value.handleEnter()
}
const handleLottery = () => {
  store.commit('upDateMusic')
  if(currentMusic.value=='other-lottery.m4a'){
    Music.value.src = new URL('../assets/music/other-lottery.m4a', import.meta.url).href
  }else if(currentMusic.value=='1st-lottery.m4a'){
    Music.value.src = new URL('../assets/music/1st-lottery.m4a', import.meta.url).href
  }else if(currentMusic.value=='other-BJ-BGM.m4a'){
    Music.value.src = new URL('../assets/music/other-BJ-BGM.m4a', import.meta.url).href
  }
  wordCard?.value.handleLottery()
}

let stopAnimate = true
let rotated = 0
function animate() {
  let musicBox = document.querySelector("#musicBox")
 
  if(!stopAnimate){
    musicBox.classList.add('playMusic')
  }else{
    musicBox.classList.remove('playMusic')
  }
}
const handleMusicBox = e => {
  let music = Music.value
  if (music.paused) {
    music.play().then(
      () => {
        stopAnimate = false
        animate()
      },
      () => {
        console.log("背景音乐自动播放失败，请手动播放！")
      }
    )
  } else {
    music.pause()
    stopAnimate = true
    animate()
  }
}

onMounted(() => {
  console.log(Music.value, currentMusic.value)
  Music.value.src = new URL('../assets/music/enter-BGM.m4a', import.meta.url).href
})

let nowScenes, musicBox
/**
 * @description: 替换音乐
 * @param {*} scenes 场景值对应音乐名
 * @return {*}
 * @Date: 2022-01-19 14:46:05
 */
function replaceMusic(scenes) {
  if (nowScenes == scenes) return
  let musicBox = document.querySelector("#musicBox")
  // music.src = `../assets/music/enter-BGM.m4a`
  // music.src = require('../assets/music/enter-BGM.m4a')
  musicBox.click()
  nowScenes = scenes
}

</script>
<style scoped>
a {
  color: #ffffff;
}

.none {
  display: none;
}

#container {
  z-index: 3;
  /* position: relative;
  /* width: 70vw; */
  /* margin: 0 6vh; */
  position: fixed;
  left: 52%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.canvas-box {
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
}

#info {
  position: absolute;
  width: 100%;
  color: #ffffff;
  padding: 5px;
  font-family: Monospace;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  z-index: 1;
}

.element {
  width: 125px;
  height: 166px;
  box-shadow: 0 0 12px rgba(249, 192, 94);
  /* border: 1px solid rgba(249, 192, 94); */
  text-align: center;
  cursor: default;
  transition: background-color 0.3s ease-in;
}

.element:hover {
  /* box-shadow: 0 0 12px rgba(249, 192, 94, 0.75);
  border: 1px solid rgba(249, 192, 94, 0.75); */
}

.element .company {
  position: absolute;
  top: 27%;
  right: 0;
  width: 100%;
  font-size: 25px;
  color: #d6eea1;
}

.element .name {
  margin: 0 10px;
  position: absolute;
  top: 52%;
  left: 0;
  right: 0;
  font-size: 26px;
  font-weight: bold;
  color: #f9c05e;
  text-shadow: 0 0 1px rgba(249, 192, 94, 0.95);
}

.element .details {
  position: absolute;
  bottom: 1.2vh;
  left: 0;
  right: 0;
  font-size: 1.6vh;
  color: rgba(127, 255, 255, 0.75);
}

button {
  color: #f9c05e;
  background: transparent;
  outline: 1px solid #f9c05e;
  border: 0;
  padding: 1.6vh 4vh;
  margin: 0 4.6vh;
  font-size: 2vh;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: rgba(255, 255, 0, 0.5);
}

button:active {
  color: #fff;
  background-color: rgba(255, 255, 0, 0.7);
}

.highlight {
  background-color: #e6b175 !important;
  box-shadow: 0 0 12px #e6b175;
  /* border: 1px solid  rgba(0, 0, 0, 0.5); */
  /* color: #000000!important; */
}
.bg-box {
  /* width: 100%;
  height: 100%; */
}
.bg-video {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
}
video {
  object-fit: contain;
}

.highlight.element .name {
  /* text-shadow: 0 0 5px rgba(8, 169, 223, 0.95); */
}

.prize.element .name {
  text-shadow: none;
}

.prize.element {
  transition: background-color 1.5s ease-in 0.3s;
  /* background-color: #f9c05e !important; */

  /* background:url(https://corp-wecom-cdn.elcapp.cn/outlet_test/material/image/20220112/23143769899272448.png) no-repeat; */
  background: url(https://corp-wecom-cdn.elcapp.cn/outlet_test/material/image/20220113/23202548765399331.png) no-repeat;

  background-size: 100% 100%;
  border-radius: 10%;
  border: 0.1px solid #f9d598;
  box-shadow: 0 0 12px #f9d598;
}

.prize .company,
.prize .details,
.prize .name,
.highlight .company,
.highlight .name,
.highlight .details {
  /* color: rgba(255, 255, 255, 0.85); */
  color: #c82121;
}

.dan-mu {
  visibility: hidden;
  position: fixed;
  z-index: -1;
  font-size: 12px;
  top: 1vh;
  left: 0;
  padding: 0 1.2vh;
  height: 2.2vh;
  line-height: 2.2vh;
  border-radius: 1vh;
  box-sizing: border-box;
  background-color: rgba(0, 127, 127, 0.37);
  box-shadow: 0 0 4px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(127, 255, 255, 0.25);
  color: rgba(127, 255, 255, 0.75);
}

.dan-mu.active {
  visibility: visible;
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

.qipao-container {
  position: fixed;
  right: 0;
  top: 10vh;
  bottom: 1vh;
  width: 26vh;
  z-index: 2;
}

.qipao {
  width: 100%;
  padding: 1.8vh 1.4vh;
  line-height: 1.414;
  margin: 4px 0;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 800;
  background-color: rgba(255, 195, 127, 0.253);
  color: rgba(23, 19, 231, 0.75);
}

.music {
  position: fixed;
  top: 3vh;
  right: 4vh;
  z-index: 5;
}

.music-item {
  display: block !important;
  opacity: 0;
}

.music-box {
  width: 5vh;
  height: 5vh;
  border-radius: 50%;
  text-align: center;
  line-height: 5vh;
  font-size: 1.4vh;
  color: #fff;
  cursor: pointer;
  /* background-color: rgba(253, 105, 0, 0.9); */
  background: url(https://corp-wecom-cdn.elcapp.cn/outlet_test/material/image/20220113/23229171906123500.svg) no-repeat;
  background-size: 100% 100%;
  /* border: 1px solid rgba(255, 255, 255, 0.5); */
  
}
.playMusic{
  animation: 3.6s linear infinite rotate;
}

@keyframes rotate {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.margin-l-40 {
  margin-left: 40px;
}
</style>
