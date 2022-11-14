<template>
  <header class="header">
    <a
      href="https://coli-conc.gbv.de/"
      class="coli-conc-logo-small">
      <img
        src="https://coli-conc.gbv.de/images/coli-conc.svg"
        alt="coli-conc Logo">
    </a>
    <h1>
      JSKOS Server Web
    </h1>
    <ul class="menu">
      <li>
        <a
          href="https://coli-conc.gbv.de/coli-ana/"
          title="Go to coli-conc website">
          ⬅ back to coli-conc website
        </a>
      </li>
      <li>
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
      </li>
    </ul>
    <div style="clear:both" />
  </header>
  <main id="main">
    <div class="section">
      <h2>...</h2>
    </div>
  </main>
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
.user-status {
  z-index: 9999;
}
.user-status > a {
  font-size: initial;
}
header .user-status li {
  float: none;
}
header .user-status li a {
  text-align: left;
}
header > h1 {
  float: left;
  padding: 18px 0 0 20px;
  font-size: 24px;
}
li.selected-server {
  background-color: #feffcc;
}
</style>
