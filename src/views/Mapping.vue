<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="section">
    <h2>Mapping</h2>
    <p v-if="mapping === undefined">
      Loading mapping from URI {{ uri }}...
    </p>
    <p v-else-if="mapping === null">
      Mapping data from URI {{ uri }} could not be loaded.
    </p>
    <p v-else>
      TODO
    </p>
  </div>
  <div class="section">
    <h2>JSKOS Data</h2>
    <pre v-if="mapping"><code>{{ JSON.stringify(mapping, null, 2) }}</code></pre>
    <p v-else>
      No JSKOS data available
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import axios from "axios"

const props = defineProps({
  uri: {
    type: String,
    default: "",
  },
})

const mapping = ref(undefined)
watch(props, (newProps, oldProps) => {
  const uri = newProps.uri, oldUri = oldProps && oldProps.uri
  if (uri === oldUri) {
    return
  }
  if (!uri) {
    mapping.value = undefined
    return
  }
  // Load mapping data in an async function
  (async () => {
    let data
    try {
      data = (await axios.get(uri)).data
    } catch (error) {
      console.error(error)
    }
    if (props.uri === uri) {
      if (data) {
        mapping.value = data
      } else {
        mapping.value = null
      }
    }
  })()
}, {
  immediate: true,
})
</script>
