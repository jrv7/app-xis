<template>
  <a-menu
    mode="inline"
    :open-keys="openKeys"
    :theme="theme"
    :inline-collapsed="collapsed"
    :class="{'is-collapsed': collapsed}"
    @openChange="onOpenChange"
  >
    <a-sub-menu
      v-for="menu in multiMenu"
      :key="'vertical-menu-' + menu.menu_url_hash"
    >
      <span slot="title">
        <a-icon :type="menu.class_fa_icon ? menu.class_fa_icon : null" />
        <!-- <font-awesome-icon :icon="['fas', menu.class_fa_icon]" /> -->
        <span>{{_XisT(menu.menu_title)}}</span>
      </span>
      <a-menu-item
        v-for="submenu in menu.children.filter(item => { return (!!item.opt_show_menu) })"
        :key="'vertical-submenu-' + submenu.menu_url_hash"
        @click="goToSubmenu(submenu)"
      >
        {{_XisT(submenu.menu_title)}}
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'XisVerticalMenu',
  props: {
    keys: {
      type: Array,
      default: () => {
        return []
      }
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      rootSubmenuKeys: [],
      openKeys: [],
      theme: 'dark',
      lastOpenMenu: null
    }
  },
  watch: {
    collapsed () {
      this.openKeys = [];
    },
    keys (newValue) {
      this.rootSubmenuKeys = newValue
        .filter(item => { return (item.submenus && item.submenus.length) })
        .map(item => {
          return 'vertical-menu-' + item.id;
        });
    }
  },
  computed: {
    ...mapState(['xisStateMenuTree', 'xisStateCurrentMenu']),
    multiMenu () {
      let mainHash = null;
      let fatherHash = null;
      let accessedMenuHash = null;

      if (this.xisStateCurrentMenu.submenuId) {
        accessedMenuHash = this.xisStateCurrentMenu.submenuId;
      } else if (this._XIS_UserData) {
        if (this._XIS_UserData.default_menu) {
          if (this._XIS_UserData.default_menu.menu_url_hash) {
            accessedMenuHash = this._XIS_UserData.default_menu.menu_url_hash;
          }
        }
      }

      this.xisStateMenuTree.forEach(mainM => {
        mainM.children.forEach(fatherM => {
          fatherM.children.forEach(currentM => {
            if ((currentM.menu_url_hash == accessedMenuHash) && (mainM.menu_url_hash == this._XIS_Current_Menu.mainMenuId)) {
              fatherHash = fatherM;
              mainHash = mainM;
            }
          })
        })
      });
      
      if ((!this.openKeys.length) && (!this.collapsed) && fatherHash) {
        this.openKeys = [];
        this.openKeys.push('vertical-menu-' + fatherHash.menu_url_hash);
      }

      console.log('Aqui');

      if (mainHash) {
        return mainHash.children;
      } else {
        if (this._XIS_Current_Menu.mainMenuId) {
          let has_menu = this.xisStateMenuTree.filter(i => { return (i.menu_url_hash == this._XIS_Current_Menu.mainMenuId) });

          if (has_menu.length) {
            return has_menu[0].children;
          }
        }
      }

      console.log('Retornando menus vazios');
      return [];
    },
  },
  methods: {
    grandFatherMenuHash (menuItem) {
      let mainHash = '-';
      
      this.xisStateMenuTree.forEach(mainM => {
        mainM.children.forEach(fatherM => {
          fatherM.children.forEach(currentM => {
            if (currentM.menu_url_hash == menuItem.menu_url_hash) {
              mainHash = mainM.menu_url_hash;
            }
          })
        })
      });

      return mainHash;
    },
    onOpenChange(openKeys) {
      let latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
      this.openKeys = openKeys.filter(i => { return (i == latestOpenKey) });
    },
    goToSubmenu (submenuItem) {
      // this.$store.commit('storeAccessedMenu', submenuItem);
      // this.$emit('changed', submenuItem);
      this.$router.push('/' + this.grandFatherMenuHash(submenuItem) + '/' + submenuItem.menu_url_hash);
    }
  }
}
</script>

<style lang="scss">
.ant-menu-dark {
  background: #1a2226 !important;
}

.ant-menu {
  &.is-collapsed {
    margin-left: -8px !important;
  }
}
</style>