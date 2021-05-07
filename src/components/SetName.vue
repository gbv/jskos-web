<template>
  <input v-model="name">
  <button @click="setName">
    Set Name
  </button>
  {{ user && user.name }}
  {{ login.user && login.user.name }}
  <button @click="login.connect('coli-conc.gbv.de/login/')">
    Connect to other login server
  </button>
  <user-status />
</template>

<script>
import { defineComponent, inject, ref, watch } from "vue"

export default defineComponent({
  setup() {
    const login = inject("login")
    const name = ref("")
    const _setName = () => {
      login.setName(name.value)
    }
    watch(() => login.user, (user) => {
      name.value = (user && user.name) || ""
    })
    return {
      login,
      setName: _setName,
      name,
      user: login.user,
    }
  },
})
</script>
