<template>
  <xis-layout
    id="XisDefaultView"
    :blueprints="blueprints"
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
import { mapState } from 'vuex';
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
  computed: {
    ...mapState(['xisStateCurrentMenu'])
  },
  methods: {
    Reload () {
      console.log('Reloading Lista');
      console.log(this._XIS_Current_Menu);

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
    this.getBlueprints(this._XIS_Current_Menu_Hash)
      .then( ({data}) => {
        this.blueprints = data;
        this.loading = false;
      })
  }
}
</script>

<style lang="scss">

</style>