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
      <div>{{ day.wind.speed }} ({{ day.wind.gusts }}){{ day.wind.unit }}</div>
      <div
        class="wind-arrow"
        :style="{ transform: `rotate(${day.wind.direction}deg)` }"
        title="Wind direction"
      >
        ↑
      </div>
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

ul.header {
  background: #264653;
  color: #fff;
  font-weight: 600;
  border-radius: 8px 8px 0 0;
}

ul:not(.header):nth-child(even) {
  background-color: #f7f4ef;
}

ul:not(.header):nth-child(odd) {
  background-color: #d8f0f0;
}

li {
  padding: 0.6rem 0.4rem;
  list-style: none;
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

.wind-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wind-arrow {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #222;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transform-origin: center center;
  transition: transform 0.3s ease;
  margin-bottom: 4px;
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
    flex-direction: column; /* stack content vertically */
  }

  li:nth-child(2) {
    font-size: 0.82rem;
    line-height: 1.2;
  }

  li:nth-child(5) {
    font-size: 0.8rem;
    line-height: 1.15;
  }

  br {
    display: block;
    margin: 3px 0;
  }
}
</style>
