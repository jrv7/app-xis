<template>
  <div
    id="XisPostLoginScreen"
  >
    <div class="loader-bar" :style="{'width': (loading + 'vw'), 'max-width': '100vw'}"></div>
    <div class="splash-gb-image"></div>
    <div class="splash-gb-ball-inner">
      <span>Loading...</span>
    </div>
    <div class="splash-gb-ball-outter"></div>
  </div>
</template>

<script>
export default {
  name: 'XisPostLoginScreen',
  data () {
    return {
      canRedirect: false,
      loading: 0,
      timer: null
    }
  },
  methods: {
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    mountDictionary () {
      this.$axios.get('system/dictionary')
        .then( ({data}) => {
          this.$store.commit('setDictionary', data);
          this.canRedirect = true;

          if (this.loading >= 100) {
            this.goHome();
          } else {
            this.loading = this.loading + 40;
          }
        });
    },
    goHome () {
      this.$router.push('Dashboard');
    },
    startLoader () {
      let vm = this;
      this.timer = setInterval( function () {
        if (vm.loading <= 100) {
          vm.loading = vm.loading + (Math.random() / (vm.getRandomInt(vm.getRandomInt(vm.getRandomInt(vm.getRandomInt(1024) + 1) + 1) + 1) + 1));

          if ((vm.loading >= 60) && (vm.loading <= 62)) {
            vm.loading = (vm.loading + 20);
          }
          if ((vm.loading >= 78) && (vm.loading <= 80)) {
            vm.loading = (vm.loading + 16);
          }
        } else {
          clearInterval(vm.timer);
          vm.timer = null;

          if (vm.canRedirect) {
            vm.goHome();
          }
        }
      }, 8);
    }
  },
  created () {
    this.makePreparations();
  },
  mounted () {
    this.startLoader();
    this.mountDictionary();
  }
}
</script>
<style lang="scss">
#XisPostLoginScreen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f4f4f4;

  .loader-bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
    background-color: #aaf;
  }

  .splash-gb-image {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;

    background: url(~@/assets/images/splash-bg-2.png) center center;
    background-size: 200%;
  }
  .splash-gb-ball-inner {
    position: absolute;
    display: flex;
    top: 50%;
    left: 50%;
    width: 186px;
    height: 182px;

    transform: translate(-50%, -50%);

    border-radius: 50%;
    z-index: 20;
    background-color: #fff;

    &>span {
      margin: auto;
      color: #aaf;
    }
  }

  .splash-gb-ball-outter {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 204px;
    height: 200px;

    transform: translate(calc(-50%), -50%);

    border-radius: 50%;
    z-index: 21;
    background: none;
    border: 4px solid #fff;
  }
}
</style>
