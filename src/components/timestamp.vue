<template>
  <div class="bg">
    <span id="playbackholder">
      <span class="playback" v-on:click="skipback">⏪</span>
      <span class="playback" v-on:click="togglePause">{{playerStatus}}</span>
      <span class="playback" v-on:click="skipfwd">⏩</span>
    </span>
    <span>{{datestring}}</span>
  </div>
</template>

<script>
  const moment = require('moment');

  module.exports = {
    name: 'timestamp',
    data() {
      return {
        playerStatus: '',
        playing: false,
      };
    },
    computed: {
      datestring() {
        return moment(`${this.date} ${this.time}`, 'YYYY-MM-DD HH-mm')
          .format('MMMM Do YYYY, HH:mm');
      },
    },
    methods: {
      setStart() {
        if (this.playerStatus === '') {
          document.getElementById('playbackholder').style.display = 'block';
          this.playerStatus = '▮▮';
          this.playing = true;
        }
      },
      togglePause() {
        if (!this.playing) {
          this.playerStatus = '▮▮';
          this.playing = true;
          this.$emit('play');
        } else {
          this.playerStatus = '▶';
          this.playing = false;
          this.$emit('pause');
        }
      },
      skipback() {
        this.$emit('skipback');
      },
      skipfwd() {
        this.$emit('skipfwd');
      },
    },
    props: ['date', 'time'],
  };
</script>

<style scoped>
#playbackholder {
  float: left;
  display: none;
}

.bg {
  height: 8vh;
  width: 100%;
  background-color: #333333;
  font-size: 6vh;
  color: #00AA01;
  overflow: hidden;
}

.playback {
  user-select: none;
}

.hidden {
  display: none;
}
</style>
