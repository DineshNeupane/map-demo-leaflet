<template>
  
  <div id="bg">{{datestring}}</div>
</template>

<script>
  const moment = require('moment');

  module.exports = {
    name: 'timestamp',
    computed: {
      datestring() {
        return moment(`${this.date} ${this.time}`, 'YYYY-MM-DD HH-mm')
          .format('MMMM Do YYYY, HH:mm');
      },
    },
    props: ['date', 'time'],
  };
</script>

<style scoped>
#bg {
  height: 100px;
  width: 100%;
  background-color: #333333;
  font-size: 70px;
  color: #00AA01;
}
</style>
