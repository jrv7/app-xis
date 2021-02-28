<template>
  <div id="XisAppLayout">
    <xis-navbar
      @collapse-toggled="toggleCollapse"
      :collapsed="collapsed"
      @changed="mainMenuChanged"
    ></xis-navbar>
    
    <xis-side-nav
      :activeMainMenu="accessedMainMenu"
      :collapsed="collapsed"
      @changed="menuChanged"
    ></xis-side-nav>

    <div
      id="XisMainBlock"
      :class="{'collapsed': (!!collapsed)}"
    >
      <div
        class="theater-mode"
        :class="{
          'xis-visible': loading,
          'xis-invisible': !loading,
        }"
      />
      <xis-main-nav
        :blueprints="blueprints"
      >
        <slot />
      </xis-main-nav>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';
import XisNavbar from '@/commons/xis-layout/XisNavbar.vue';
import XisSideNav from '@/commons/xis-layout/XisSideNav.vue'
import XisMainNav from '@/commons/xis-layout/XisMainNav.vue'

export default {
  name: "XisLayout",
  components: { XisNavbar, XisSideNav, XisMainNav },
  props: {
    blueprints: {}
  },
  data () {
    return {
      accessedMainMenu: null,
      accessedMenu: null,
      collapsed: false,
      loading: true,
    }
  },
  watch: {
    $route(to, from) { // react to route changes... 
      if (to !== from) {
        this.loading = true;
        this.$store.commit('setCurrentMenus', to.params);
        this._XisForceReload();
      }
    }
  },
  computed: {
    ...mapState(['xisStateUser']),
    getUserData () {
      return this.xisStateUser;
    }
  },
  methods: {
    toggleCollapse () {
      this.collapsed = (!!!this.collapsed);
    },
    mainMenuChanged (mainMenuId) {
      this.accessedMainMenu = mainMenuId;
    },
    menuChanged (menu) {
      this.accessedMenu = menu.menu_url_hash;
      this.$emit('menuChanged', this.accessedMenu);
    },
  },
  created () {
    this.makePreparations();
  },
  mounted () {
    if (this.accessedMainMenu === null) {
      if (this.$store.getters.getSelectedMainMenu) {
        this.accessedMainMenu = this.$store.getters.getSelectedMainMenu;
      }
    }
    if (this.accessedMenu === null) {
      if (this.$store.getters.getSelectedMenu) {
        this.accessedMenu = this.$store.getters.getSelectedMenu;
      }
    }

    setTimeout(() => {
      this.loading = false;
    }, 400)
  }
}
</script>

<style lang="scss">
  body {
    background-color: #fff;
  }

  #XisMainBlock {
    position: fixed;
    top: 56px;
    bottom: 0;
    left: 220px;
    right: 0;
    display: flex;
    flex-flow: nowrap;
    justify-content: flex-start;
    overflow: hidden;
    z-index: 80;

    &>.theater-mode {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      opacity: 1;
      background-color: #eee;
      z-index: inherit;
      transition: all .3s ease-in-out;

      &.xis-visible {
        opacity: 1;
        right: 0;
        // transition: opacity .3s ease-in-out;
      }

      &.xis-invisible {
        opacity: 0;
        right: 100%;
        // transition: all .3s ease-in-out;
      }
    }

    &.collapsed {
      left: 70px;
    }
  }
</style>