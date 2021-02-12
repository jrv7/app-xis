<template>
  <xis-layout
    id="XisDefaultView"
    @menuChanged="Reload"
  >
    <xis-loader v-if="loading || (blueprints === null)"></xis-loader>
    <div v-else>
      <xis-list
        :blueprints="blueprints"
        :height="100"
      ></xis-list>
    </div>
  </xis-layout>
</template>

<script>
import XisLayout from '@/commons/XisLayout';
import XisLoader from '@/commons/assets/XisLoader.vue'
import XisList from '@/commons/components/XisList';

export default {
  name: 'XisDefaultView',
  components: { XisLayout, XisLoader, XisList },
  data () {
    return {
      accessedMenu: null,
      loading: true,
      blueprints: null
    }
  },
  methods: {
    Reload () {
      this.blueprints = null;
      this.loading = true;
      this.accessedMenu = this.$store.state.accessedMenu;
      this.getBlueprints(this.accessedMenu)
        .then( ({data}) => {
          this.blueprints = data;
          this.loading = false;
        });
    }
  },
  mounted () {
    this.loading = true;
    this.accessedMenu = this.$store.getters.getSelectedMenu;
    this.getBlueprints(this.accessedMenu)
      .then( ({data}) => {
        this.blueprints = data;
        this.loading = false;
      })
  }
}
</script>

<style lang="scss">

</style>