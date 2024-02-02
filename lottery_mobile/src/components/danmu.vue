<template>
  <div class="wrapper">
    <h2>破晓 · "易"路同行</h2>
    <el-form>
      <el-form-item label="姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="工号">
        <el-input v-model="form.numberId"></el-input>
      </el-form-item>
      <el-form-item class="button">
        <el-button type="primary" @click="submitForm"> 提交 </el-button>
      </el-form-item>
      <el-form-item label="弹幕">
        <el-input
          v-model="form.content"
          :rows="4"
          type="textarea"
          placeholder="发送我~~"
        />
      </el-form-item>
      <el-form-item class="button">
        <el-button type="primary" @click="addDanmu"> 发送弹幕 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
const props = defineProps(['wb'])

const form = reactive({
  name: '',
  numberId: '',
  content: ''
})
//从本地获取信息
let hasInfo = ref(false)
let user = localStorage.getItem('user')

if (user) {
  hasInfo.value = true
  user = JSON.parse(user)
  form.name = user.name
  form.numberId = user.numberId
}

//
const submitForm = () => {
  // if (hasInfo.value) {
  //   ElMessage({
  //     message: '已经提交过啦~~'
  //   })
  //   return
  // }
  let user = {
    name: form.name,
    numberId: form.numberId,
    isRegister: hasInfo.value,
    type:'register'
  }

  props.wb.send(JSON.stringify(user))
  localStorage.setItem('user', JSON.stringify(user))
}
const addDanmu = () => {
  let user = JSON.parse(localStorage.getItem('user')) || ''
  let data = {
    type: 'danmu',
    name: user?.name,
    content: form.content
  }
  if (props.wb.readyState === 1) {
    props.wb.send(JSON.stringify(data))
    ElMessage({
      message: '发送完毕',
      type: 'success'
    })
    form.content = ''
  }else{
    ElMessage({
      message: '发送失败',
      type: 'error'
    })
  }
}
</script>

<style  scoped>
::v-deep .button .el-form-item__content {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper {
  padding: 20px 20px;
}
</style>