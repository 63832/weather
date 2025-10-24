<script setup>
const props = defineProps(['active'])
const emits = defineEmits(['toggle-menu'])

function toggleActive() {
  emits('toggle-menu', props.active)
}
</script>

<template>
  <div id="burger" :class="{ active: props.active }" @click="toggleActive">
    <button type="button" class="burger-button" title="Menu">
      <span class="burger-bar bar--1"></span>
      <span class="burger-bar bar--2"></span>
      <span class="burger-bar bar--3"></span>
    </button>
    <nav class="navbar" v-show="props.active">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/locations">Locations</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
#burger {
  display: block;
}

.burger-button {
  position: relative;
  height: 30px;
  width: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s ease-in-out;
}

/* Streck */
.burger-bar {
  position: absolute;
  left: 8px;
  right: 8px;
  height: 2px;
  background-color: #222;
  border-radius: 2px;
  transition:
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.4s ease,
    background-color 0.3s ease;
}

/* Startläge */
.bar--1 {
  transform: translateY(-7px);
}
.bar--2 {
  transform: translateY(0);
}
.bar--3 {
  transform: translateY(7px);
}

/* === ACTIVE (X) === */
#burger.active .bar--1 {
  transform: translateY(0) rotate(45deg);
}

#burger.active .bar--2 {
  transform: scaleX(0.2);
  opacity: 0;
}

#burger.active .bar--3 {
  transform: translateY(0) rotate(-45deg);
}

/* Liten modern hover-effekt (fungerar i båda lägen) */
#burger .burger-button:hover .burger-bar {
  background-color: #000;
}
</style>
