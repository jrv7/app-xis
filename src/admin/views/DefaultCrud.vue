<template>
  <xis-layout
    id="XisDefaultView"
    @menuChanged="Reload"
  >
    <xis-loader v-if="loading || (blueprints === null)"></xis-loader>
    <div v-else>
      <xis-view
        :blueprints="blueprints"
        :height="100"
        :data="data"
      ></xis-view>
    </div>
  </xis-layout>
</template>

<script>
import XisLayout from '@/commons/XisLayout';
import XisLoader from '@/commons/assets/XisLoader.vue'
import XisView from '@/commons/components/XisView';

export default {
  name: 'XisDefaultCrud',
  components: { XisLayout, XisLoader, XisView },
  data () {
    return {
      accessedMenu: null,
      loading: true,
      blueprints: null,
      data: {}
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
    },
    loadData () {
      this.getData(this.$route.params.submenuId, this.$route.params.ids)
        .then( ({data}) => {
          this.data = data;
        });
    }
  },
  mounted () {
    this.loading = true;
    this.accessedMenu = this.$store.getters.getSelectedMenu;
    this.getBlueprints(this.$route.params.submenuId)
      .then( ({data}) => {
        console.log('Blueprints carregados para o DefaultView');
        console.log(data);
        this.blueprints = data;
        this.loading = false;
      });
    this.loadData();
  }
}
</script>

<style>

</style>