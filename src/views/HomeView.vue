<script setup>
import { onMounted, ref } from 'vue'
import { getForecast } from '@/services/forecastService'

const location = ref({ lat: 60.0, long: 20.0, name: 'Nuvarande position' })
const info = ref({})

onMounted(() => {
  getForecast(location.value)
    .then((response) => {
      info.value = response
    })
    .catch((err) => {
      console.log(err)
    })
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
  <div>
    {{ info }}
  </div>
</template>

<style scoped>
.location {
  display: inline-block;
  margin: 0 1em;
}
</style>
