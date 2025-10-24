<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import { getCurrentWeather, getForecast } from '@/services/forecastService'
import ForecastResult from '@/components/ForecastResult.vue'
import CurrentWeather from '@/components/currentWeather.vue'
import { getPosition } from '@/services/positioningService'

const location = ref({})
const info = ref({})
const currentWeather = ref({})
const currentLocation = ref({ lat: 0.0, long: 0.0, name: 'Current location' })
const props = defineProps(['name', 'lat', 'long'])

onMounted(() => {
  getPosition()
    .then((pos) => {
      currentLocation.value = { name: 'Current location', ...pos.position }
    })
    .catch(() => {})
})

function fetchForeCast(loc) {
  getForecast(loc)
    .then((response) => {
      info.value = response
    })
    .catch((err) => {
      console.log(err)
    })
  // Hämta aktuellt väder
  getCurrentWeather(loc)
    .then((response) => {
      currentWeather.value = response
    })
    .catch((err) => {
      console.log(err)
    })
}

watchEffect(() => {
  // Läs in alla sparade locations
  let locationsList = JSON.parse(localStorage.getItem('locations')) ?? []
  let tmpLocation = {}
  if (typeof props.name !== 'undefined') {
    // sök location
    tmpLocation = locationsList.find((loc) => {
      return loc.name.toLowerCase() === props.name.toLowerCase()
    })
    if (tmpLocation) {
      // Tilldela hittad location
      location.value.name = tmpLocation.name
      location.value.lat = tmpLocation.position.lat
      location.value.long = tmpLocation.position.long
    }
  } else {
    // Tilldela default-position
    location.value = currentLocation.value
  }

  if (!tmpLocation && typeof props.lat !== 'undefined' && typeof props.long !== 'undefined') {
    location.value.name = props.name
    location.value.lat = parseFloat(props.lat)
    location.value.long = parseFloat(props.long)
  }
  if (typeof location.value.name !== 'undefined') {
    fetchForeCast(location.value)
  }
})

watch(currentLocation, () => {
  if (location.value.name == currentLocation.value.name) {
    fetchForeCast(currentLocation.value)
  }
})
</script>

<template>
  <main v-if="!location.name">
    <h2>Angiven plats kan inte hittas</h2>
    <p>
      <i>{{ props.name }}</i> finns inte i listan över platser
    </p>
  </main>
  <main v-else>
    <h2>{{ location.name }}</h2>
    <p class="location">
      Lat: <span>{{ location.lat.toFixed(3) }}</span>
    </p>
    <p class="location">
      Long: <span>{{ location.long.toFixed(3) }}</span>
    </p>
    <CurrentWeather v-if="currentWeather?.code" :weather="currentWeather" /><br />
    <ForecastResult :forecast="info" />
  </main>
</template>

<style scoped>
.location {
  display: inline-block;
  margin: 0 1em;
}
</style>
