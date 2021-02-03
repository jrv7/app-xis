<template>
  <div id="XisMainBlock">
    <xis-side-nav></xis-side-nav>
    <xis-main-nav>
      <slot />
    </xis-main-nav>
  </div>
</template>

<script>
import XisSideNav from '@/commons/xis-layout/XisSideNav.vue'
import XisMainNav from '@/commons/xis-layout/XisMainNav.vue'

export default {
  name: 'XisMainBlock',
  components: { XisSideNav, XisMainNav },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
  #XisMainBlock {
    position: absolute;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-flow: nowrap;
    justify-content: flex-start;
    overflow: hidden;
  }
</style>