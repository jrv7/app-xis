<template>
  <a-menu mode="inline" :open-keys="openKeys" @openChange="onOpenChange">
    <a-sub-menu
      v-for="menu in multiMenu"
      :key="'vertical-menu-' + menu.menu_url_hash"
    >
      <span slot="title"><a-icon :type="menu.class_fa_icon ? menu.class_fa_icon : null" /><span>{{_XisT(menu.menu_title)}}</span></span>
      <a-menu-item
        v-for="submenu in menu.submenus.filter(item => { return (!!item.opt_show_menu) })"
        :key="'vertical-submenu-' + submenu.menu_url_hash"
        @click="goToSubmenu(submenu)"
      >
        {{_XisT(submenu.menu_title)}}
      </a-menu-item>
    </a-sub-menu>

    <a-menu-item
      v-for="menu in singleMenu"
      :key="'vertical-menu-' + menu.menu_url_hash"
    >
      {{_XisT(menu.menu_title)}}
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  name: 'XisVerticalMenu',
  props: {
    keys: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      rootSubmenuKeys: [],
      openKeys: [],
    }
  },
  watch: {
    keys (newValue) {
      this.rootSubmenuKeys = newValue
        .filter(item => { return (item.submenus && item.submenus.length) })
        .map(item => {
          return 'vertical-menu-' + item.id;
        });
    }
  },
  computed: {
    multiMenu () {
      return this.keys.filter(item => { return (item.submenus && item.submenus.length) });
    },
    singleMenu () {
      return this.keys.filter(item => {
        if (!item.opt_show_menu) {
          return false;
        }
        if (!item) {
          return false;
        }

        if (!item.submenus) {
          return true;
        }

        if (!item.submenus.length) {
          return true;
        }

        return false;
      });
    },
  },
  methods: {
    grandFatherMenuHash (menuItem) {
      if (menuItem.father_menu) {
        if (menuItem.father_menu.father_menu) {
          return menuItem.father_menu.father_menu.menu_url_hash;
        } else {
          return menuItem.father_menu.menu_url_hash;
        }
      } else {
        return menuItem.menu_url_hash;
      }
    },
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
    goToSubmenu (submenuItem) {
      this.$store.commit('storeAccessedMenu', submenuItem);
      this.$emit('changed', submenuItem);
      this.$router.push('/' + this.grandFatherMenuHash(submenuItem) + '/' + submenuItem.menu_url_hash);
    }
  }
}
</script>

<style>

</style>