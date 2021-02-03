<template>
  <div id="XisAppLayout">
    <xis-navbar></xis-navbar>
    <xis-main-block>
      <slot />
    </xis-main-block>
  </div>
</template>

<script>
import XisNavbar from '@/commons/xis-layout/XisNavbar.vue';
import XisMainBlock from '@/commons/xis-layout/XisMainBlock.vue';

export default {
  name: "XisLayout",
  components: { XisNavbar, XisMainBlock },
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss">
  body {
    background-color: #fafafa;
  }
</style>