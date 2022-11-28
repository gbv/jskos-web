import { createApp } from "vue"

import App from "@/App.vue"
const app = createApp(App)

import router from "@/router.js"
app.use(router)

import state from "@/state.js"
app.use(state)

import { createI18n } from "vue-i18n"
import messages from "@/../locale.json"
const i18n = createI18n({
  locale: "de",
  fallbackLocale: "en",
  messages,
})
app.use(i18n)

import { UserStatus, Login } from "gbv-login-client-vue"
app.use(Login)
app.use(UserStatus)

import "jskos-vue/dist/style.css"
import { ItemName, ItemDetails, ItemDetailsTabs, ItemList, AutoLink, LoadingIndicator } from "jskos-vue"
app.use(ItemName)
app.use(ItemList)
app.use(ItemDetails)
app.use(ItemDetailsTabs)
app.use(AutoLink)
app.use(LoadingIndicator)

import jskos from "jskos-tools"
app.config.globalProperties.jskos = jskos

import "@/style.css"

app.mount("#app")
