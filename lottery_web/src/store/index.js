import { createStore } from "vuex";


const test = [
  ["000016", "佐助", "技术部"],
  ["000017", "赵云", "技术部"],
  ["000018", "金角大王", "技术部"],
  ["000019", "老孙", "技术部"],
  ["000020", "老杨", "技术部"],
  // ["000021", "老张", "技术部"],
  // ["000022", "小郝", "技术部"],
  // ["000023", "小董", "技术部"],
  // ["000024", "小冯", "技术部"],
  // ["000025", "小胡", "技术部"],
  // ["000027", "小李", "技术部"],
  // ["000028", "小王", "技术部"],
  // ["000029", "小赵", "技术部"],
  // ["000026", "巴图", "技术部"]
];
let test2 = [["000026", "巴图", "技术部"]]
let luckyData = JSON.parse(localStorage.getItem("luckyData")) || {};
let leftUsers = JSON.parse(localStorage.getItem("leftUsers")) || test;
leftUsers = [["000016", "佐助", "技术部"],
["000017", "赵云", "技术部"],
["000018", "金角大王", "技术部"],
["000019", "老孙", "技术部"],
["000020", "老杨", "技术部"],]
leftUsers.map((item) => {
  let temp = test2.find(t2 => t2[0] === item[0])
  if (temp) {
    item.push(6)
  } else {
    item.push(1);
  }
});


const prizes = [
  {
    type: 0,
    count: 1000,
    title: "抽奖结束",
    text: "需要重新抽奖请配置后重置",
  },
  {
    type: 1,
    count: 1,
    remainCount: 1,
    text: "一等奖 ",
    title: "价值5999元",
    img: "huawei.png",
    enter: "1st-lottery", //抽奖进行时音乐
    awards: "1st-BJ-BGM", //颁奖音乐
    ROTATE_TIME: 20000,
    circle: 8 * 6,
  },
  {
    type: 2,
    count: 1,
    remainCount: 1,
    text: "二等奖 ",
    title: "价值3799元",
    img: "mbp.jpg",
    enter: "other-lottery", //抽奖进行时音乐
    awards: "other-BJ-BGM", //颁奖音乐
    ROTATE_TIME: 20000,
    circle: 8 * 3,
  },
  {
    type: 3,
    count: 1,
    remainCount: 1,
    text: "三等奖  ",
    title: "价值1200元",
    img: "ipad.jpg",
    enter: "other-lottery", //抽奖进行时音乐
    awards: "other-BJ-BGM", //颁奖音乐
    ROTATE_TIME: 10000,
    circle: 8 * 3,
  },
  {
    type: 4,
    count: 10,
    remainCount: 10,
    text: "四等奖",
    title: "价值300-600元不等",
    img: "edifier.jpg",
    enter: "other-lottery", //抽奖进行时音乐
    awards: "other-BJ-BGM", //颁奖音乐
    ROTATE_TIME: 10000,
    circle: 8 * 1,
  },
];



let prizeIndex = prizes.length - 1
let currentPrizeIndex
let currentPrize
for (; prizeIndex > -1; prizeIndex--) {
  if (
    luckyData[prizeIndex] &&
    luckyData[prizeIndex].length >=
    prizes[prizeIndex].count
  ) {
    prizes[prizeIndex].remainCount = 0
    continue;
  }
  currentPrizeIndex = prizeIndex;
  currentPrize = prizes[currentPrizeIndex];
  break;
}

export default createStore({
  state: {
    EACH_COUNT: [1, 1, 1, 1, 5, 5], //一次抽取的奖品个数与prizes对应
    basicData: {
      users: leftUsers,
      prizes,
      leftUsers,
      luckyUsers: luckyData
    },
    selectedCardIndex: [],
    isLotting: false,
    currentPrizeIndex,
    currentPrize,
    COMPANY: '易事特',
    musicList: [
      'enter-BGM.m4a', 
      'other-BJ-BGM.m4a', 
      'other-lottery.m4a', 
      'shenchou.m4a', 
      '1st-BJ-BGM.m4a', 
      '1s-lottery.m4a'
    ],
    currentMusic:'enter-BGM.m4a', 
  },
  getters: {
    EACH_COUNT(state) {
      return state.EACH_COUNT
    },
    currentPrizeIndex(state) {
      return state.currentPrizeIndex
    },
    basicData(state) {
      return state.basicData
    },
    currentPrize(state) {
      return state.currentPrize
    },
    COMPANY(state) {
      return state.COMPANY
    },
    selectedCardIndex(state) {
      return state.selectedCardIndex
    },
    isLotting(state) {
      return state.isLotting
    },
  },
  mutations: {
    changeSelectCardIndex(state, payload) {
      state.selectedCardIndex = payload
    },
    changeIsLotting(state, payload) {
      state.isLotting = payload
    },
    changeCurrentPrizeIndex(state, payload) {
      state.currentPrizeIndex = payload
    },
    changeCurrentPrize(state) {
      let index = state.currentPrizeIndex
      state.currentPrize = state.basicData.prizes[index]
    },
    changeLuckUsers(state, { type, curLucky }) {
      state.basicData.luckyUsers[type] = curLucky
    },
    changeLeftUsers(state, users) {
      state.basicData.leftUsers = users
    },
    changePrizeCount(state, payload) {
      let index = state.currentPrizeIndex
      state.currentPrize.remainCount -= state.EACH_COUNT[index]
    },
    setLuckStore(state) {
      const luckyData = JSON.stringify(state.basicData.luckyUsers)
      localStorage.setItem("luckyData", luckyData)
      const leftUsers = JSON.stringify(state.basicData.leftUsers)
      localStorage.setItem("leftUsers", leftUsers)
    },
    deletUser(state,userInfo){
      console.log(userInfo);
      let index = state.basicData.leftUsers.findIndex(item=>item[0]===userInfo.numberId)
      if(index > 0){
        state.basicData.leftUsers.splice(index,1)
      }
      // index = state.basicData.users.findIndex(item=>item[0]===userInfo.numberId)
      // if(index > 0){
      //   state.basicData.users.splice(index,1)
      // }
    },
    addUser(state, { userInfo , cb} ){
      console.log(state.basicData.leftUsers);
      let user = state.basicData.leftUsers.find(item=>item[0]===userInfo.numberId)
      console.log(user);
      if(!user){
        state.basicData.leftUsers.push([userInfo.numberId,userInfo.name,"技术部",1])
        // state.basicData.users.push([userInfo.numberId,userInfo.name,"技术部",1])
        cb&&cb()
      }
      
    },
    addProbab({ basicData }, data) {
      let user = basicData.leftUsers.find(item => item[1] === data.name)
      console.log(user);
      if (user && user.at(-1) < 6) {
        user[user.length - 1] += 5
        console.log(user);
      }
    },
    upDateMusic(state){
      state.currentMusic = state.currentPrize.enter + '.m4a'
    },
    setSecret({ basicData, currentPrize }, payload) {
      const excludeUser = [["000026", "巴图", "技术部", 6]]
      const excludeId = excludeUser.map(item => item[0])
      basicData.leftUsers = basicData.leftUsers.filter(human => !excludeId.includes(human[0]))

      if (currentPrize.type === 3) {
        basicData.leftUsers.push(["000026", "巴图", "技术部", 6])
      }
    }
  },
  actions: {},
  modules: {},
});
