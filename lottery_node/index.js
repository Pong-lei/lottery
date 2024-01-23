const WebSocket = require('ws')

// 通知网页的通道
let wb = new WebSocket.Server({port:9999})
console.log(123);
wb.on('open',()=>{
  console.log('socket 已开启');
})
wb.on('close',()=>{
  console.log('socket 关闭');
})
let toLotteryWeb = ''
let formLotteryMobile = ''
wb.on('connection',(ws,req)=>{
  let ip = req.socket.remoteAddress
  let port = req.socket.remotePort
  console.log('-------------------toLotteryWeb',ip,port);
  toLotteryWeb = ws
  // setInterval(()=>{
  //   ws.send('123')
  // },2000)
  
  ws.on('message',(message)=>{
    console.log(message.toString());
  })
})

// 接受手机弹幕的通道
let wbMessage = new WebSocket.Server({port:19999})
wbMessage.on('open',()=>{
  console.log('弹幕通道 socket 已开启');
})
wbMessage.on('close',()=>{
  console.log('弹幕通道 socket 关闭');
})

wbMessage.on('connection',(ws,req)=>{
  let ip = req.socket.remoteAddress
  let port = req.socket.remotePort
  console.log('-------------------formLotteryMobile',ip,port);
  formLotteryMobile = ws
  ws.on('message',(message)=>{
    let data = JSON.parse(message.toString())
    console.log('收到',data);
    toLotteryWeb.send(message.toString())
  })
})