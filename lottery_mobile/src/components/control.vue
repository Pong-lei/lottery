<template>
  <div style="padding: 20px 20px;">
    <h2>破晓 · "易"路同行</h2>
    <el-input v-model="name" placeholder="请输入姓名" clearable />
    <div style="margin-top: 20px;"><el-button @click="confirm">发送</el-button></div>
  </div>
</template>

<script setup>
import { ref,defineProps } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps(['wb'])

const name = ref()
const confirm = () => {
  if (props.wb.readyState === 1) {
    let data = {type:'control',content:name.value}
    props.wb.send(JSON.stringify(data))
    ElMessage({
      message: '发送成功'
    })
  }else{
    ElMessage({
      icon:'',
      message: 'websocket连接失败',
      type:'error'
    })
  }
}
</script>

<style lang="scss" scoped>
</style>