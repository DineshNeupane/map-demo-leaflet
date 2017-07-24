<template>
  <div class="bg">
    <span id="playbackholder" class="hidden">
      <span class="playback" v-on:click="skipback"><i class="fa fa-backward" aria-hidden="true"></i></span>
      <span class="playback" v-on:click="togglePause"><i id="play" class="fa icon-fixed-width fa-play" aria-hidden="true"></i></span>
      <span class="playback" v-on:click="skipfwd"><i class="fa fa-forward" aria-hidden="true"></i></span>
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
          document.getElementById('playbackholder').classList.toggle('hidden');
          this.playerStatus = '▮▮';
          this.playing = true;
        }
      },
      togglePause() {
        if (!this.playing) {
          document.getElementById('play').classList.toggle('fa-play');
          document.getElementById('play').classList.toggle('fa-pause');
          this.playerStatus = '▮▮';
          this.playing = true;
          this.$emit('play');
        } else {
          document.getElementById('play').classList.toggle('fa-pause');
          document.getElementById('play').classList.toggle('fa-play');
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
  line-height: 30px;
}

.hidden {
  display: none;
}
</style>
