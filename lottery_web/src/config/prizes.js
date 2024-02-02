const prizes = [
  {
    type: 0,
    count: 1000,
    title: '抽奖结束',
    text: '需要重新抽奖请配置后重置'
  },
  {
    type: 1,
    count: 1,
    text: '一等奖 ',
    title: '价值5999元',
    img: 'huawei.png',
    enter: '1st-lottery', //抽奖进行时音乐
    awards: '1st-BJ-BGM', //颁奖音乐
    ROTATE_TIME: 20000,
    circle: 8 * 6
  },
  {
    type: 2,
    count: 1,
    text: '二等奖 ',
    title: '价值3799元',
    img: 'mbp.jpg',
    enter: 'other-lottery', //抽奖进行时音乐
    awards: 'other-BJ-BGM', //颁奖音乐
    ROTATE_TIME: 20000,
    circle: 8 * 3
  },
  {
    type: 3,
    count: 1,
    text: '三等奖  ',
    title: '价值1200元',
    img: 'ipad.jpg',
    enter: 'other-lottery', //抽奖进行时音乐
    awards: 'other-BJ-BGM', //颁奖音乐
    ROTATE_TIME: 10000,
    circle: 8 * 3
  },
  {
    type: 4,
    count: 10,
    text: '四等奖',
    title: '价值300-600元不等',
    img: 'edifier.jpg',
    enter: 'other-lottery', //抽奖进行时音乐
    awards: 'other-BJ-BGM', //颁奖音乐
    ROTATE_TIME: 10000,
    circle: 8 * 1
  }
]

export default prizes
