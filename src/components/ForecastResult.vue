<script setup>
const props = defineProps(['forecast'])
import wc from '@/assets/data/weatherCodes.json'
import { ref } from 'vue'
const weatherCodes = ref(wc)

function getText(code) {
  let wcText =
    weatherCodes.value.find((itm) => {
      return itm.code == code
    }).description ?? 'Unknown'
  return wcText
}
</script>

<template>
  <ul>
    <li>Date</li>
    <li>Code</li>
    <li>Temp</li>
    <li>Precip</li>
    <li>Wind</li>
  </ul>
  <ul v-for="day in props.forecast.weather" :key="day">
    <li>{{ new Date(day.date).getDate() }}.{{ new Date(day.date).getMonth() + 1 }}</li>
    <li>{{ getText(day.code) }}</li>
    <li>{{ day.temp.min }} - {{ day.temp.max }}{{ day.temp.unit }}</li>
    <li>
      {{ day.precipitation.sum }}{{ day.precipitation.unit }}<br />({{
        day.precipitation.probability
      }}%)
    </li>
    <li>
      {{ day.wind.speed }}({{ day.wind.gusts }}){{ day.wind.unit }}<br />{{ day.wind.direction
      }}{{ day.wind.direction_unit }}
    </li>
  </ul>
</template>

<style scoped>
ul {
  padding: 0;
  display: grid;
  grid-template-columns: 12% 12% 22% 15% auto;
}
li {
  padding: 0 0.5em;
  list-style-type: none;
  display: inline-block;
  padding: 0 0.5em;
  list-style-type: none;
  vertical-align: top;
}

ul:nth-child(even) {
  background-color: aqua;
}

ul:nth-child(odd) {
  background-color: antiquewhite;
}
</style>
