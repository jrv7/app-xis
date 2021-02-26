<template>
  <div id="XisSideNav" :class="{'uncollapsed': (!collapsed), 'collapsed': (!!collapsed)}">
    <div class="compny-logo">
      <p>{{_XIS_CompanyLogo}} {{_XIS_Language}}</p>
    </div>

    <xis-user-dock
      :collapsed="collapsed"
    />

    <xis-vertical-menu
      :collapsed="collapsed"
      @changed="menuChanged"
    ></xis-vertical-menu>
  </div>
</template>

<script>
import XisVerticalMenu from '@/commons/xis-layout/XisVerticalMenu.vue';
import XisUserDock from '@/commons/xis-layout/XisUserDock.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'XisSideNav',
  components: { XisVerticalMenu, XisUserDock },
  props: {
    activeMainMenu: {
      type: String,
      default: null
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      submenus: []
    }
  },
  watch: {
    getSelectedMainMenu (newValue) {
      this.fetchSubMenus(newValue);
    },
    // activeMainMenu (newValue) {
    //   this.fetchSubMenus(newValue);
    // }
  },
  computed: {
    ...mapGetters(['getSelectedMainMenu'])
  },
  methods: {
    // fetchSubMenus () {
    //   this.$axios.get('system/menus/root/' + this.activeMainMenu + '/submenus')
    //     .then( ({data}) => {
    //       this.submenus = data;
    //     });
    // },
    menuChanged (menu) {
      this.$emit('changed', menu);
    }
  },
  mounted () {
    // if (this.$store.getters.getSelectedMainMenu) {
    //   this.activeMainMenu = this.$store.getters.getSelectedMainMenu;
    // }
  }
}
</script>

<style lang="scss">
  #XisSideNav {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    box-shadow: 0 0 12px #0006;
    background-color: #222d32;
    flex-direction: column;
    overflow: hidden;
    z-index: 96;
    transition: all .3s ease;
    width: 220px;
    max-width: 220px;
    color: #ccc;

    &.collapsed {
      max-width: 70px;
    }

    .compny-logo {
      position: relative;
      width: 100%;
      display: flex;
      line-height: 40px;
      background-color: #3c8dbc;
    }
  }
</style>