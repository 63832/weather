<script setup>
const props = defineProps(['active'])
const emits = defineEmits(['toggle-menu'])

function toggleActive() {
  // emit the *next* state (toggle)
  emits('toggle-menu', !props.active)
}

function closeMenu() {
  // explicitly close the menu
  emits('toggle-menu', false)
}
</script>

<template>
  <div id="burger" :class="{ active: props.active }" @click="toggleActive">
    <button type="button" class="burger-button" title="Menu">
      <span class="burger-bar bar--1"></span>
      <span class="burger-bar bar--2"></span>
      <span class="burger-bar bar--3"></span>
    </button>
    <nav class="navbar" v-if="props.active" @click.stop>
      <RouterLink to="/" @click="closeMenu">Home</RouterLink>
      <RouterLink to="/locations" @click="closeMenu">Locations</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
#burger {
  display: block;
  position: relative;
}

.burger-button {
  position: fixed;
  height: 30px;
  width: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s ease-in-out;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
}

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

.bar--1 {
  transform: translateY(-7px);
}
.bar--2 {
  transform: translateY(0);
}
.bar--3 {
  transform: translateY(7px);
}

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

#burger .burger-button:hover .burger-bar {
  background-color: #000;
}

.navbar {
  position: fixed;
  top: 3.6rem;
  left: 1rem;
  background: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 1000;
}

.navbar a {
  padding: 0.5rem 0.75rem;
  color: #222;
  text-decoration: none;
  white-space: nowrap;
}

.navbar a:hover {
  background: rgba(0, 0, 0, 0.04);
}
</style>
