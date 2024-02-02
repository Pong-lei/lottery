import {createRouter,createWebHistory} from 'vue-router'

import Danmu from '@/components/danmu.vue'
import Control from '@/components/control.vue'
const routes = [
  {path:'/', component:Danmu},
  {path:'/control',component:Control},
]
const router = createRouter({
  history:createWebHistory(),
  routes,
})
export default router