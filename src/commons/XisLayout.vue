<template>
  <div id="XisAppLayout">
    <xis-navbar
      @changed="mainMenuChanged"
    ></xis-navbar>

    <div id="XisMainBlock">
      <xis-side-nav
        :activeMainMenu="accessedMainMenu"
        @changed="menuChanged"
      ></xis-side-nav>

      <xis-main-nav>
        <slot />
      </xis-main-nav>
    </div>
  </div>
</template>

<script>
import XisNavbar from '@/commons/xis-layout/XisNavbar.vue';
import XisSideNav from '@/commons/xis-layout/XisSideNav.vue'
import XisMainNav from '@/commons/xis-layout/XisMainNav.vue'

export default {
  name: "XisLayout",
  components: { XisNavbar, XisSideNav, XisMainNav },
  data () {
    return {
      accessedMainMenu: null,
      accessedMenu: null
    }
  },
  methods: {
    mainMenuChanged (mainMenuId) {
      this.accessedMainMenu = mainMenuId;
    },
    menuChanged (menu) {
      this.accessedMenu = menu.menu_url_hash;
      this.$emit('menuChanged', this.accessedMenu);
    }
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
  }
}
</script>

<style lang="scss">
  body {
    background-color: #fafafa;
  }

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