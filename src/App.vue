<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <h1>大家好 欢迎使用 vite-mini...</h1>
  <h2>
    <span>count is {{count}}</span>
    <button @click="count++">戳我</button>
  </h2>
</template>

<script>
import { ref, computed } from 'vue';
export default {
  setup() {
    const count = ref(0);
    function add() {
      count.value++;
    }
    const double = computed(() => count.value * 2);
    return { count, add, double };
  },
};
</script>