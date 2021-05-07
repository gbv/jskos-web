<template>
  <header>
    <h1>
      JSKOS Server Web
    </h1>
    <div style="flex: 1" />
    <user-status>
      <template #before>
        <p>
          Select JSKOS Server:
        </p>
        <ul>
          <li
            v-for="server in state.config.jskos"
            :key="server.url"
            :class="{
              'selected-server': server === state.selectedServer,
            }">
            <a
              href=""
              @click.prevent="state.setSelectedServer(server)">
              {{ (server.about && server.about.config.title) || server.url }}
            </a>
          </li>
        </ul>
        <hr>
      </template>
    </user-status>
  </header>
  <h1>
    Test
  </h1>
</template>

<script>
import { defineComponent, inject, watch } from "vue"

export default defineComponent({
  components: {
  },
  setup() {
    const state = inject("state")
    const login = inject("login")
    state.init()
    watch(() => state.selectedServer, (server) => {
      if (server && server.login) {
        login.connect(server.login.url, server.login)
      } else {
        login.disconnect()
      }
    })
    return {
      state,
    }
  },
})
</script>

<style>
header {
  display: flex;
  align-items: center;
}
header > h1 {
  font-size: 20px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 60px auto 0 auto;
  padding: 0 20px;
  max-width: 800px;
}
li.selected-server {
  background-color: #feffcc;
}
</style>
