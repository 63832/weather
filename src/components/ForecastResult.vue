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
  margin: 0;
  display: grid;
  grid-template-columns: 12% 14% 22% 18% auto;
  align-items: center;
  font-size: 0.95rem;
  color: #222;
  transition: background 0.2s ease;
}

ul:first-of-type {
  background: #264653;
  color: #ffffff;
  font-weight: 600;
  border-radius: 8px 8px 0 0;
}

ul:not(:first-of-type):nth-child(even) {
  background-color: #f7f4ef;
}

ul:not(:first-of-type):nth-child(odd) {
  background-color: #d8f0f0;
}

li {
  padding: 0.6rem 0.4rem;
  list-style-type: none;
  display: block;
  line-height: 1.3;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

ul:last-of-type {
  border-radius: 0 0 8px 8px;
  border-bottom: none;
}

@media (max-width: 768px) {
  ul {
    grid-template-columns: 0.7fr 1.4fr 0.9fr 0.9fr 1.1fr;
    font-size: 0.85rem;
  }

  li {
    padding: 0.4rem 0.2rem;
    white-space: normal;
    text-align: center;
    min-height: 2.5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  li:nth-child(2) {
    padding: 0.4rem 0.15rem;
    font-size: 0.82rem;
    line-height: 1.2;
    word-break: normal;
    hyphens: none;
  }

  li:nth-child(5) {
    font-size: 0.8rem;
    line-height: 1.15;
    padding: 0.3rem 0.15rem;
    min-height: 2.8em;
  }

  br {
    display: block;
    content: '';
    margin: 3px 0;
  }

  li:first-child {
    font-weight: 500;
  }
}
</style>
