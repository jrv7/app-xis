<template>
  <div id="XisSideNav">
    <xis-vertical-menu
      :keys="submenus"
      @changed="menuChanged"
    ></xis-vertical-menu>
  </div>
</template>

<script>
import XisVerticalMenu from '@/commons/xis-layout/XisVerticalMenu.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'XisSideNav',
  components: { XisVerticalMenu },
  props: {
    activeMainMenu: {
      type: String,
      default: null
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
    activeMainMenu (newValue) {
      this.fetchSubMenus(newValue);
    }
  },
  computed: {
    ...mapGetters(['getSelectedMainMenu'])
  },
  methods: {
    fetchSubMenus () {
      this.$axios.get('system/menus/root/' + this.activeMainMenu + '/submenus')
        .then( ({data}) => {
          this.submenus = data;
        });
    },
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
    position: relative;
    width: 240px;
    border-right: 1px solid #ddd;
    box-shadow: 0 0 12px #0002;
    background-color: #fff;
    flex-direction: column;
  }
</style>