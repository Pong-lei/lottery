<template>
  <div id="menu" @click="handleMenu">
    <button id="enter">进入抽奖</button>
    <button @click="handleAdmin">奖池人员</button>
    <div id="lotteryBar" class="none">
      <button id="lottery">抽奖</button>
      <button id="reLottery">重新抽奖</button>
      <button id="awards">颁奖模式</button>
      <button id="reset" class="margin-l-40">重置</button>
      <div class="luckyDiv">
        <div class="number">
          <span class="value">{{munber}}</span>
          <span class="label">幸运数</span>
        </div>
        <el-input v-model="munber" placeholder="输入幸运数"></el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex"
import { computed,defineEmits,ref } from "vue"
import {useRouter} from 'vue-router' 

const munber = ref('')

const router = useRouter()
const store = useStore()
const currentPrize = computed(() => store.state.currentPrize)

const emit = defineEmits(['enter','lottery'])

const handleAdmin = () =>{
  router.push('admin')
}

const handleMenu = e => {
  // 如果正在抽奖，则禁止一切操作'
  let target = e.target.id

  if (!["reset", "back"].includes(target)) {
    // //骇客
    console.log(currentPrize.value)

    switch (target) {
      case "enter":
        emit('enter')
        break;
      // 重置
      case "reset":
        break;
      // 抽奖
      case "lottery":
        emit('lottery')
        break;
    }
  }
}
</script>

<style lang="scss" scoped>
#menu {
  position: absolute;
  bottom: 2vh;
  width: 100%;
  text-align: center;
  z-index: 4;
}
.margin-l-40 {
  margin-left: 40px;
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
.none {
  display: none;
}
.luckyDiv{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  right: 20px;
  height: 20vh;
  width: 20vw;
  bottom:0;
  .number{
    height: 80%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    
    .value{
      font-size:100px;
      font-weight: 600;
      color: #e61eec;
    }
    .label{
      color: #fff;
    }
  }
  
}
</style>