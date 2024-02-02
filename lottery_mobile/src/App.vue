<template>
<router-view :wb="wb"></router-view>
</template>

<script setup>
let wb = new WebSocket('ws://10.11.16.180:19999')

wb.onopen = () => {
  console.log('连接开启')
}
wb.onclose = () => {
  console.log('连接开启')
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
