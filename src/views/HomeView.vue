<script setup>
import { ref, watch, watchEffect } from 'vue'
import { getForecast } from '@/services/forecastService'
import ForecastResult from '@/components/ForecastResult.vue'

const location = ref({ lat: 60.0, long: 20.0, name: 'Nuvarande position' })
const info = ref({})
const props = defineProps(['name', 'lat', 'long'])

function fetchForeCast(loc) {
  getForecast(loc)
    .then((response) => {
      info.value = response
    })
    .catch((err) => {
      console.log(err)
    })
}

watchEffect(() => {
  if (typeof props.name !== 'undefined') {
    location.value.name = props.name
    location.value.lat = parseFloat(props.lat)
    location.value.long = parseFloat(props.long)
  }
  fetchForeCast(location.value)
})

watch(props, () => {
  if (typeof props.name == 'undefined') {
    location.value = { lat: 60.0, long: 20.0, name: 'Nuvarande position' }
    fetchForeCast(location.value)
  }
})
</script>

<template>
  <h2>{{ location.name }}</h2>
  <p class="location">
    Lat: <span>{{ location.lat.toFixed(3) }}</span>
  </p>
  <p class="location">
    Long: <span>{{ location.long.toFixed(3) }}</span>
  </p>
  <ForecastResult :forecast="info" />
</template>

<style scoped>
.location {
  display: inline-block;
  margin: 0 1em;
}
</style>
