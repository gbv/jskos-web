<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="section">
    <h2>Mapping</h2>
    <p v-if="mapping === undefined">
      <loading-indicator /> Loading mapping from URI {{ uri }}...
    </p>
    <p v-else-if="mapping === null">
      Mapping data from URI {{ uri }} could not be loaded.
    </p>
    <div v-else>
      <div class="row">
        <div class="col col-25">
          Source Scheme:
        </div>
        <div class="col">
          <item-name :item="mapping.fromScheme" />
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Source Concept:
        </div>
        <div class="col">
          <item-name :item="mapping.from.memberSet[0]" />
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Target Scheme:
        </div>
        <div class="col">
          <item-name :item="mapping.toScheme" />
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Target Concept:
        </div>
        <div class="col">
          <item-name :item="mapping.to.memberSet[0]" />
          <!-- TODO: 1-to-n mappings -->
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Mapping Type:
        </div>
        <div class="col">
          <auto-link
            v-if="jskos.mappingTypeByType(mapping.type)"
            :href="jskos.mappingTypeByType(mapping.type).uri">
            {{ jskos.prefLabel(jskos.mappingTypeByType(mapping.type)) }} ({{ jskos.notation(jskos.mappingTypeByType(mapping.type)) }})
          </auto-link>
          <span v-else>
            No mapping type
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Creator:
        </div>
        <div class="col">
          <auto-link
            v-if="mapping.creator && mapping.creator[0]"
            :href="mapping.creator[0].uri">
            {{ jskos.prefLabel(mapping.creator[0]) }}
          </auto-link>
          <span v-else>
            No mapping type
          </span>
        </div>
      </div>
      <div
        v-if="mapping.created"
        class="row">
        <div class="col col-25">
          Created:
        </div>
        <div class="col">
          {{ mapping.created.slice(0,10) }}
        </div>
      </div>
      <div
        v-if="mapping.modified"
        class="row">
        <div class="col col-25">
          Modified:
        </div>
        <div class="col">
          {{ mapping.modified.slice(0,10) }}
        </div>
      </div>
      <div
        v-if="mapping.partOf && mapping.partOf.length"
        class="row">
        <div class="col col-25">
          Part of Concordance:
        </div>
        <div class="col">
          <auto-link
            :href="mapping.partOf[0].uri"
            :text="jskos.prefLabel(mapping.partOf[0])" />
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Identifier:
        </div>
        <div class="col">
          <div
            v-for="identifier in [].concat(mapping.uri, mapping.identifier).filter(Boolean)"
            :key="identifier">
            <auto-link
              :href="identifier"
              :class="{
                'font-weight-bold': identifier === mapping.uri,
                'font-weight-regular': identifier !== mapping.uri,
              }" /> <span v-if="identifier === mapping.uri">(URI)</span>
          </div>
        </div>
      </div>
    </div>
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
