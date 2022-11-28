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
      <router-link to="/">
        JSKOS Viewer
      </router-link>
    </h1>
    <ul class="menu">
      <li>
        <a
          href="https://coli-conc.gbv.de/"
          title="Go to coli-conc website">
          ⬅ {{ $t("general.backToMainPage") }}
        </a>
      </li>
      <li>
        <user-status>
          <template #before>
            <p>
              {{ $t("general.loginSelect") }}:
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
      <!-- TODO: Improve -->
      <li class="menu-item-language">
        <a
          v-if="$i18n.locale === 'de'"
          href=""
          :title="$t('general.changeLanguage')"
          @click.prevent.stop="$i18n.locale = 'en'">
          <span class="font-weight-light">EN</span><br>DE
          <div class="line" />
        </a>
        <a
          v-else
          href=""
          :title="$t('general.changeLanguage')"
          @click.prevent.stop="$i18n.locale = 'de'">
          EN<br><span class="font-weight-light">DE</span>
          <div class="line" />
        </a>
      </li>
    </ul>
    <div style="clear:both" />
  </header>
  <main id="main">
    <!-- Empty div here to start the alternating section colors -->
    <div />
    <Home v-if="!$route.query.uri" />
    <Mapping
      v-else-if="itemType === 'mapping'"
      :mapping="item" />
    <div
      v-else
      class="section">
      <h2>{{ item === undefined ? "Loading..." : "Error" }}</h2>
      <p v-if="item === undefined">
        <loading-indicator /> {{ $t("general.loading") }} {{ $route.query.uri }}...
      </p>
      <p v-else-if="item === null">
        {{ $t("general.loadingFailed", { uri: $route.query.uri }) }}
      </p>
      <p v-else>
        {{ $t("general.unsupportedType", { type: itemType || "Unknown" }) }}
      </p>
    </div>
  </main>
  <!-- The footer is mostly copied from https://coli-conc.gbv.de -->
  <footer class="footer">
    <p>
      <b>JSKOS Viewer</b> {{ $t("footer.1_1") }}
      <a
        href=""
        target="_blank">{{ $t("footer.1_2") }}</a>.
      {{ $t("footer.1_3") }} <a href="https://github.com/gbv/jskos-web">GitHub</a>{{ $t("footer.1_4") }}
    </p>
    <p>
      <strong>coli-conc</strong> {{ $t("footer.2_1") }}
      <a
        href="https://www.gbv.de/"
        target="_blank">{{ $t("footer.2_2") }}</a>.
      {{ $t("footer.2_3") }}
      <a
        href="https://gepris.dfg.de/gepris/projekt/276843344"
        target="_blank">2015-2019</a> {{ $t("footer.2_4") }}
      <a
        href="https://gepris.dfg.de/gepris/projekt/455051200"
        target="_blank">2021-2023</a>.
    </p>
    <p>
      <a
        href="https://www.gbv.de/impressum"
        target="_blank">Impressum</a> |
      <a href="https://coli-conc.gbv.de/erklaerung-zur-barrierefreiheit/">Barrierefreiheit</a> |
      <a
        href="https://www.gbv.de/datenschutz"
        target="_blank">Datenschutz</a>
    </p>
  </footer>
</template>

<script setup>
import { inject, watch, ref } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"
import jskos from "jskos-tools"

import Home from "@/views/Home.vue"
import Mapping from "@/views/Mapping.vue"

const route = useRoute()

const item = ref(undefined)
const itemType = ref(null)

watch(() => route.query.uri, (uri, oldUri) => {
  if (uri === oldUri) {
    return
  }
  if (!uri) {
    item.value = undefined
    itemType.value = null
    return
  }
  // Load data in an async function
  (async () => {
    // Wait for state initialization
    await state.init()
    let data
    try {
      data = (await axios.get(uri)).data
    } catch (error) {
      console.error(error)
    }
    if (route.query.uri === uri) {
      if (data) {
        item.value = data
        itemType.value = jskos.guessObjectType(data, true)
      } else {
        item.value = null
        itemType.value = null
      }
    }
  })()
}, {
  immediate: true,
})

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
