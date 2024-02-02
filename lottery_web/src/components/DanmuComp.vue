<template>
  <div id="danmu">
    <!-- <button @click="add" style="z-index: 5; ">添加弹幕</button> -->
    <span
      v-for="item in danmuContent"
      :id="item.id"
      :key="item.id"
      :class="['danmuItem', 'danmu' + item.status, 'track' + item.track]"
      :style="{ color: item.color }"
      @animationend="() => animationEnd(item)"
    >
      {{ item.content }}
    </span>
  </div>
</template>

<script setup>
import DanMu from "@/config/Danmu";
import Track from "@/config/Track";
import { useStore } from 'vuex'
import {  reactive, onMounted, onUnmounted,computed } from "vue"
import {  useRoute } from "vue-router"
const store = useStore()
const route = useRoute()
const basicData = computed(() => store.state.basicData).value

const trackLists = [new Track(), new Track(), new Track(), new Track()]
const timer = ""
const danmuContent = reactive([])

// websocket
let wb = new WebSocket("ws://10.11.16.180:9999/damnu")
wb.onmessage = event => {
  let data = JSON.parse(event.data)
  console.log(data)
  if (data.type === "danmu") {
    store.commit('addProbab',data)
    add(data.content)
  } else if (data.type === "control") {
    console.log(data.content)
  } else if(data.type === 'register'){
    store.commit('addUser',{userInfo:data,cb:()=>{
      add(data.name + '加入奖池')
    }})
  }
}
wb.onopen = () => {
  console.log("连接开启")
}
wb.onclose = () => {
  console.log("连接开启")
}

const run = () => {
  setInterval(() => {
    // let 
    if (!danmuContent.length || route.value.name === 'admin') return
    let waitingDanmu = danmuContent.filter(item => item.status === "Waiting")
    waitingDanmu.map(item => {
      trackLists[item.track].disable = true
      item.status = "Running"
      // console.log(document.getElementById(item.id));
      let w1 = document.getElementById(item.id).getBoundingClientRect().width
      let w2 = document.getElementById("danmu").getBoundingClientRect().width

      let delay = (w1 / (w1 + w2)) * 5 * 1000
      setTimeout(() => {
        trackLists[item.track].disable = false
      }, delay)
    })
  }, 300)
}
const animationEnd = endItem => {
  let destoryItem = danmuContent.findIndex(item => item.id === endItem.id)
  if (destoryItem > -1) {
    endItem.status = "End"
    danmuContent.splice(destoryItem, 1)
  }
}
const add = (content) => {
  let danmu = new DanMu({ name: "peglei" })
  danmu.content = content
  let trackIndex = trackLists.findIndex(item => item.disable === false)
  if (trackIndex > -1) {
    danmu.track = trackIndex
  }
  danmuContent.push(danmu)
}

onMounted(() => {
  run()
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style lang="scss" scoped>
#danmu {
  position: relative;
  z-index: 4;
  width: 100%;
  margin: 0 auto;
}

.danmuItem {
  font-size: 28px;
  font-weight: 600;
  display: flex;
  flex-wrap: nowrap;
  /* display: inlin-block; */
  text-wrap: nowrap;
  padding: 4px;
  position: absolute;
}

.danmuWaiting {
  left: 100%;
  transform: translate3d(0, 0, 0);
}

.danmuRunning {
  left: 100%;
  animation: run 5s linear;
}

.track0 {
  top: 10px;
}

.track1 {
  top: 50px;
}

.track2 {
  top: 90px;
}

.track3 {
  top: 130px;
}

@keyframes run {
  from {
    left: 100%;
    transform: translate3d(0, 0, 0);
  }

  to {
    left: 0;
    transform: translate3d(-100%, 0, 0);
  }
}
</style>