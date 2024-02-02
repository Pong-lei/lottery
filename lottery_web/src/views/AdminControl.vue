<template>
  <div class="wrapper">
    <el-form :inline="true">
      <el-form-item label="工号">
        <el-input v-model="userid" placeholder="输入工号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSearch" type="primary">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleAdd" type="success">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleBack" type="success">返回</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="numberId" label="工号" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" @click="handleDelet(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showFromData" width="30%" >
      <el-form >
        <el-form-item label="工号">
          <el-input v-model="formData.numberId" placeholder="输入工号"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formData.name" placeholder="输入姓名"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showFromData = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useStore } from "vuex"
import { computed, watch, ref } from "vue"
import { useRouter } from "vue-router"

const userid = ref("")
const formData = ref({
  name: "",
  numberId: ""
})
const showFromData = ref(false)
const store = useStore()
const router = useRouter()
console.log(store)
const basicData = computed(() => store.state.basicData)
const tableData = ref("")
tableData.value = basicData.value.users.map(item => ({ name: item[1], numberId: item[0] }))
watch(
  basicData,
  () => {
    tableData.value = basicData.value.users.map(item => ({ name: item[1], numberId: item[0] }))
  },
  { deep: true }
)

const handleDelet = user => {
  console.log(user)
  store.commit("deletUser", user)
}

const handleSearch = () => {
  if (!userid.value) {
    tableData.value = basicData.value.users.map(item => ({ name: item[1], numberId: item[0] }))
    return
  }
  tableData.value = tableData.value.filter(item => item.numberId === userid.value)
}

const handleAdd = () => {
  showFromData.value = true
}

const confirmAdd = ()=>{
  showFromData.value = false
  store.commit('addUser',{userInfo: formData.value})
  formData.value = {
    name: "",
    numberId: ""
  }
}

const handleBack = ()=>{
  router.push('/')
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 40px;
  background-color: #fff;
  height: 100%;
}
</style>