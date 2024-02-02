<template>
  <div id="container"></div>
</template>

<script setup>
import { useStore } from "vuex"
import { computed, onMounted, ref, defineExpose } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js"
import * as TWEEN from "three/examples/jsm/libs/tween.module"
import NUMBER_MATRIX from "@/config/matrix.js"
import { createCard, atmosphereGroupCard, changeCard, removeHighlight } from "@/config/wordCard/index.js"
import { ElNotification } from "element-plus"

const store = useStore()
const basicData = computed(() => store.state.basicData).value
const COMPANY = computed(() => store.state.COMPANY).value
// const selectedCardIndex = computed(() => store.state.selectedCardIndex).value
const isLotting = computed(() => store.state.isLotting)
const currentPrize = computed(() => store.state.currentPrize)
const currentPrizeIndex = computed(() => store.state.currentPrizeIndex)
const EACH_COUNT = computed(() => store.state.EACH_COUNT).value

let selectedCardIndex = []
const member = basicData.users
const length = member.length
let ROW_COUNT = 7,
  COLUMN_COUNT = 17
let TOTAL_CARDS = ROW_COUNT * COLUMN_COUNT
const width = window.innerWidth * 0.75
const height = window.innerWidth * 0.75 * 0.75
const threeDCards = []
const targets = {
  table: [],
  sphere: []
}
let btns
let Resolution = 1

let controls
let camera
let scene
let renderer
let rotate = false

let currentLuckys = []
let timer

const createHighlight = () => {
  let year = new Date().getFullYear() + ""
  let step = 4,
    xoffset = 1,
    yoffset = 1,
    highlight = []

  year.split("").forEach(n => {
    highlight = highlight.concat(
      NUMBER_MATRIX[n].map(item => {
        return `${item[0] + xoffset}-${item[1] + yoffset}`
      })
    )
    xoffset += step
  })

  return highlight
}
const transform = (targets, duration) => {
  // TWEEN.removeAll();
  for (var i = 0; i < threeDCards.length; i++) {
    var object = threeDCards[i]
    var target = targets[i]

    new TWEEN.Tween(object.position)
      .to(
        {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()

    new TWEEN.Tween(object.rotation)
      .to(
        {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()
  }

  new TWEEN.Tween(this).to({}, duration * 2).start()
}

// 场景切换
const switchScreen = type => {
  switch (type) {
    case "enter":
      btns.enter.classList.remove("none")
      btns.lotteryBar.classList.add("none")
      transform(targets.table, 2000)
      break
    default:
      btns.enter.classList.add("none")
      btns.lotteryBar.classList.remove("none")
      transform(targets.sphere, 2000)
      break
  }
}
onMounted(() => {
  btns = {
    enter: document.querySelector("#enter"),
    lotteryBar: document.querySelector("#lotteryBar")
  }
  let HIGHLIGHT_CELL = createHighlight()

  let isBold = false,
    showTable = basicData.leftUsers.length === basicData.users.length,
    index = 0,
    totalMember = member.length,
    position = {
      x: (140 * COLUMN_COUNT - 20) / 2,
      y: (180 * ROW_COUNT - 20) / 2
    }

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
  camera.position.z = 3000

  scene = new THREE.Scene()

  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COLUMN_COUNT; j++) {
      isBold = HIGHLIGHT_CELL.includes(j + "-" + i)
      let element = createCard(member[index % length], isBold, index, showTable, COMPANY)

      let object = new CSS3DObject(element)
      object.position.x = Math.random() * 4000 - 2000
      object.position.y = Math.random() * 4000 - 2000
      object.position.z = Math.random() * 4000 - 2000

      scene.add(object)
      threeDCards.push(object)
      //

      object = new THREE.Object3D()
      object.position.x = j * 140 - position.x
      object.position.y = -(i * 180) + position.y
      targets.table.push(object)
      index++
    }
  }

  // sphere

  var vector = new THREE.Vector3()

  for (var i = 0, l = threeDCards.length; i < l; i++) {
    var phi = Math.acos(-1 + (2 * i) / l)
    var theta = Math.sqrt(l * Math.PI) * phi
    var object = new THREE.Object3D()
    object.position.setFromSphericalCoords(800 * Resolution, phi, theta)
    vector.copy(object.position).multiplyScalar(2)
    object.lookAt(vector)
    targets.sphere.push(object)
  }

  renderer = new CSS3DRenderer()
  renderer.setSize(width, height)
  document.getElementById("container").appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.rotateSpeed = 0.5
  controls.minDistance = 500
  controls.maxDistance = 6000

  if (showTable) {
    switchScreen("enter")
  } else {
    switchScreen("lottery")
  }
  animate()
  shineCard()
  window.addEventListener("resize", onWindowResize, false)
})
const onWindowResize = () => {
  console.log(123)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  // renderer.render(scene, camera)
}

const animate = () => {
  // 让场景通过x轴或者y轴旋转
  rotate && (scene.rotation.y += 0.004)
  TWEEN.update()
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

function random(num) {
  // Math.floor取到0-num-1之间数字的概率是相等的
  return Math.floor(Math.random() * num)
}
function shine(cardIndex, color) {
  let card = threeDCards[cardIndex].element
  card.style.backgroundColor = color || atmosphereGroupCard()
}
const shineCard = () => {
  let maxCard = 10,
    maxUser
  let shineCard = 10 + random(maxCard)

  timer = setInterval(() => {
    // 正在抽奖停止闪烁
    if (isLotting.value) {
      return
    }
    maxUser = basicData.leftUsers.length
    for (let i = 0; i < shineCard; i++) {
      let index = random(maxUser),
        cardIndex = random(TOTAL_CARDS)
      // 当前显示的已抽中名单不进行随机切换
      if (selectedCardIndex.includes(cardIndex)) {
        continue
      }
      shine(cardIndex)
      changeCard(cardIndex, basicData.leftUsers[index], threeDCards, COMPANY)
    }
  }, 500)
}

const handleEnter = () => {
  removeHighlight()
  ElNotification({
    message: `马上抽取[${currentPrize.value.title}],不要走开。`,
    customClass: "qipao"
  })

  switchScreen("lottery")
  setTimeout(() => {
    rotate = true
    // clearInterval(timer)
  }, 4000)
}

function saveMock() {
  
  if (!currentPrize.value) {
    //若奖品抽完，则不再记录数据，但是还是可以进行抽奖
    return
  }
  //当前选中奖品类型
  let type = currentPrize.value.type,
    //幸运用户建立池子
    curLucky = basicData.luckyUsers[type] || []
  //幸运用户入池
  
  curLucky = curLucky.concat(currentLuckys)
  // 上述合并
  store.commit("changeLuckUsers", { type, curLucky })
  // basicData.luckyUsers[type] = curLucky

  let letfUsers = basicData.leftUsers.filter(human => !curLucky.map(item => item[0]).includes(human[0]))
  store.commit("changeLeftUsers", letfUsers)
  // basicData.leftUsers = basicData.leftUsers.filter(human => !curLucky.map(item => item[0]).includes(human[0]))

  //奖品树小于等于幸运用户数,商品抽满了
  if (currentPrize.value.count <= curLucky.length) {
    //下一个奖品
    store.commit("changeCurrentPrizeIndex", currentPrizeIndex.value - 1)
    //到0为止
    if (currentPrizeIndex.value <= -1) {
      store.commit("changeCurrentPrizeIndex", 0)
    }
    //选择奖品更新为下一个
    store.commit("changeCurrentPrize", currentPrizeIndex.value)
  }
  //有幸运人数
  if (currentLuckys.length > 0) {
    console.log(currentLuckys)
    // todo by xc 添加数据保存机制，以免服务器挂掉数据丢失
    store.commit("setLuckStore", currentLuckys)
    // return setLuckyStore(currentLuckys);
  }

  // console.error(basicData);
  return Promise.resolve()
}
/**
 * 重置抽奖牌内容
 */
const resetCard = (duration = 500) => {
  if (currentLuckys.length === 0) {
    return Promise.resolve()
  }

  selectedCardIndex.forEach(index => {
    let object = threeDCards[index],
      target = targets.sphere[index]

    new TWEEN.Tween(object.position)
      .to(
        {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()

    new TWEEN.Tween(object.rotation)
      .to(
        {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()
  })

  return new Promise((resolve, reject) => {
    new TWEEN.Tween(this)
      .to({}, duration * 2)
      // .onUpdate(render)
      .start()
      .onComplete(() => {
        selectedCardIndex.forEach(index => {
          let object = threeDCards[index]
          object.element.classList.remove("prize")
        })
        resolve()
      })
  })
}

function rotateBall() {
  return new Promise((resolve, reject) => {
    let ROTATE_TIME = 1000
    scene.rotation.y = 0
    new TWEEN.Tween(scene.rotation)
      .to(
        {
          y: Math.PI * ((currentPrize.value && currentPrize.value.circle) || 8)
        },
        (currentPrize.value && currentPrize.value.ROTATE_TIME) || ROTATE_TIME
      )
      // .onUpdate(render)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()
      .onComplete(() => {
        resolve()
      })
  })
}
function selectCard(duration = 600) {
  rotate = false
  let width = 140,
    tag = -(currentLuckys.length - 1) / 2,
    locates = []

  // 计算位置信息, 大于5个分两排显示
  if (currentLuckys.length > 5) {
    let yPosition = [-87, 87],
      l = selectedCardIndex.length,
      mid = Math.ceil(l / 2)
    tag = -(mid - 1) / 2
    for (let i = 0; i < mid; i++) {
      locates.push({
        x: tag * width * Resolution,
        y: yPosition[0] * Resolution
      })
      tag++
    }

    tag = -(l - mid - 1) / 2
    for (let i = mid; i < l; i++) {
      locates.push({
        x: tag * width * Resolution,
        y: yPosition[1] * Resolution
      })
      tag++
    }
  } else {
    for (let i = selectedCardIndex.length; i > 0; i--) {
      locates.push({
        x: tag * width * Resolution,
        y: 0 * Resolution
      })
      tag++
    }
  }

  let text = currentLuckys.map(item => item[1])
  ElNotification({ message: `恭喜${text.join("、")}获得${currentPrize.value.title}, 新的一年必定旺旺旺。` })

  selectedCardIndex.forEach((cardIndex, index) => {
    changeCard(cardIndex, currentLuckys[index], threeDCards, COMPANY)
    var object = threeDCards[cardIndex]
    new TWEEN.Tween(object.position)
      .to(
        {
          x: locates[index].x,
          y: locates[index].y * Resolution,
          z: 2200
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()

    new TWEEN.Tween(object.rotation)
      .to(
        {
          x: 0,
          y: 0,
          z: 0
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()

    object.element.classList.add("prize")
    tag++
  })

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    // .onUpdate(render)
    .start()
    .onComplete(() => {
      // 动画结束后可以操作
      store.commit("changeIsLotting", false)
    })
}

function getRandomWinner(peopleWeights) {
  let totalWeight = peopleWeights.reduce(function (sum, weight) {
    return sum + weight
  }, 0)

  var randomValue = Math.random() * totalWeight

  for (var i = 0; i < peopleWeights.length; i++) {
    randomValue -= peopleWeights[i]
    if (randomValue <= 0) {
      return i
    }
  }
}

function lotteryRan(number, time) {
  var arr = []
  let Random
  let peopleWeights = basicData.leftUsers.map(item => item.at(-1))
  // 几个奖项
  while (time) {
    Random = getRandomWinner(peopleWeights)

    if (!arr.includes(Random)) {
      time--
      arr.push(Random)
    }
  }
  return arr
}
/**
 * 抽奖
 */
const lottery = async () => {
  await rotateBall()
  // 将之前的记录置空
  currentLuckys = []
  selectedCardIndex = []
  // 当前同时抽取的数目,当前奖品抽完还可以继续抽，但是不记录数据
  let perCount = EACH_COUNT[currentPrizeIndex.value],
    luckyData = basicData.luckyUsers[currentPrize.value.type],
    leftCount = basicData.leftUsers.length,
    leftPrizeCount = currentPrize.value.count - (luckyData ? luckyData.length : 0)
  const cloneLeftUsers = JSON.parse(JSON.stringify(basicData.leftUsers))
  if (leftCount === 0) {
    ElNotification({ message: "人员已抽完，现在重新设置所有人员可以进行二次抽奖！" })
    // basicData.leftUsers = basicData.users
    store.commit("changeLeftUsers", basicData.users)
    leftCount = basicData.leftUsers.length
  }
  // 抽取人员
  let temp = lotteryRan(leftCount, perCount)
  // console.log(temp,cloneLeftUsers);
  currentLuckys = temp.map(index => {
    return cloneLeftUsers[index]
  })

  // 抽取卡片
  for (let i = 0; i < perCount; i++) {

    leftCount--
    leftPrizeCount--

    let cardIndex = random(TOTAL_CARDS)
    while (selectedCardIndex.includes(cardIndex)) {
      cardIndex = random(TOTAL_CARDS)
    }
    selectedCardIndex.push(cardIndex)

    if (leftPrizeCount === 0) {
      break
    }
  }

  console.log(selectedCardIndex)
  selectCard()
}

const handleLottery = async () => {


  rotate = false

  if (!currentPrizeIndex.value) {
    ElNotification({
      type: "warning",
      message: "没有可以抽取的奖品了"
    })
    store.commit("changeIsLotting", false)
    return
  }
  // let store.commit("changeCurrentPrizeIndex", currentPrizeIndex.value - 1)
  if (isLotting.value) {
    ElNotification({
      message: "抽慢一点点～～抽奖还没结束",
      duration: 3000
    })
    return false
  }
  store.commit("changeIsLotting", true)
  

  console.log(basicData);
  let perCount = EACH_COUNT[currentPrizeIndex.value],
    leftCount = basicData.leftUsers.length - currentLuckys.length
  if(currentLuckys.length + basicData.luckyUsers[currentPrize.value.type]?.length >= currentPrize.value.count){
    perCount = EACH_COUNT[currentPrizeIndex.value - 1]
  }
  console.log(perCount, leftCount)
  const notAllowed = perCount > leftCount
  if (notAllowed) {
    ElNotification({
      message: "池中已经没有人拉,请重置抽奖人员池",
      duration: 3000
    })
    store.commit("changeIsLotting", false)
    return false
  }


  saveMock()
  // replaceMusic(currentPrize.enter)
  store.commit("setSecret", true)
  //更新剩余抽奖数目的数据显示
  store.commit("changePrizeCount")
  // 卡片放回
  await resetCard()
  
  lottery()
}

defineExpose({ createHighlight, handleEnter, handleLottery })
</script>

<style lang="scss">
.el-notification__content {
  color: rgba(27, 90, 226, 0.75) !important;
  font-size: 20px !important;
  font-weight: 600 !important;
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
.highlight {
  background-color: #e6b175 !important;
  box-shadow: 0 0 12px #e6b175;
  /* border: 1px solid  rgba(0, 0, 0, 0.5); */
  /* color: #000000!important; */
}
.prize.element .name {
  text-shadow: none;
}

.prize.element {
  transition: background-color 1.5s ease-in 0.3s;
  background: url("~@/assets/prizeBg.png") no-repeat;
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
</style>