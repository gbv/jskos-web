import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"

// eslint-disable-next-line no-undef
const base = BASE

export default createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: "/",
      component: Home,
    },
  ],
})
