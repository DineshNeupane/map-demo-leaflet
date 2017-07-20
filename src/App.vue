<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

require('date-input-polyfill');

export default {
  name: 'app',
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

date-input-polyfill {
  z-index: 1002 !important;
}

</style>
