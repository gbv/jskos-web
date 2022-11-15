import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/mapping",
      component: () => import("@/views/Mapping.vue"),
      props: route => ({ uri: route.query.uri }),
    },
  ],
})
