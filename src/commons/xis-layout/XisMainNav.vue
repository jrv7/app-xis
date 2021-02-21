<template>
  <div id="XisMainNav">
    <div class="breadcrumbs">
      <div>
        <a-button
          v-if="lastAccessedMenu.ids"
          type="link"
          size="small"
          class="btn-go-back"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" /> <span><xis-translator :text="'breadcrumb.go_back'" /></span>
        </a-button>
        <a-breadcrumb
          :style="{'display': 'flex'}"
        >
          <a-breadcrumb-item
            v-for="menu in getMenuMap" :key="'breadcrum-item-' + menu.id"
            :style="{'display': 'flex'}"
          >
            <xis-translator :text="'breadcrumb.' + menu.menu_title" />
          </a-breadcrumb-item>
          <!-- <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
          <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
          <a-breadcrumb-item>An Application</a-breadcrumb-item> -->
        </a-breadcrumb>
      </div>

      <div
        v-if="blueprints && activeMenu"
      >
        <router-link
          tag="button"
          class="btn btn-danger"
          v-for="action in activeMenu.actions" :key="'menu-action-' + action.target_menu.id"
          :to="{ name: routeName(action), params: routeParams(action)}"
          :style="{'display': 'flex'}"
        >
          <xis-translator :text="'New'" /> <xis-translator :text="'table_name_single.' + action.target_menu.menu_title" />
        </router-link>
      </div>
    </div>
    <div class="xis-default-page-size">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'XisMainNav',
  props: {
    blueprints: {}
  },
  data () {
    return {
      menuMap: [],
      activeMenu: null,
      lastAccessedMenu: {
        ids: null
      }
    }
  },
  computed: {
    getMenuMap () {
      let activeMenuHash = this.$route.params.submenuId || this.$store.getters.getSelectedMenu;
      let mainMenu = null;
      let fatherMenu = null;
      let activeMenu = null;

      this.menuMap.forEach(mMenu => {
        mMenu.children.forEach(fMenu => {
          fMenu.children.forEach(aMenu => {
            if (String(aMenu.menu_url_hash) == String(activeMenuHash)) {
              mainMenu = this.deepClone(mMenu);
              fatherMenu = this.deepClone(fMenu);
              activeMenu = this.deepClone(aMenu);
              this.activeMenu = activeMenu;
            }
          });
        });
      });

      if (mainMenu && fatherMenu && activeMenu) {
        return [mainMenu, fatherMenu, activeMenu];
      } else {
        return [];
      }
    }
  },
  methods: {
    routeParams (action) {
      let params = {};

      params = {
        mainMenuId: this.$route.params.mainMenuId,
        submenuId: action.target_menu.menu_url_hash,
        ids: '-0:0-'
      }

      console.log('Parametros do botao');
      console.log(params);

      return params;
    },
    routeName (action) {
      return 'default-view';
    },
    goToActionMenu (action) {
      console.log('Going to menu');
      console.log(action);
    }
  },
  mounted () {
    setTimeout(() => {
      this.menuMap = this.deepClone(this.$store.getters.getStoredMainMenus);
      console.log(this.menuMap);
      this.lastAccessedMenu = this.deepClone(this.$store.getters.getLastAccessedMenu);
    }, 400)
  }
}
</script>

<style lang="scss">
  #XisMainNav {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 240px;
    display: flex;
    flex-flow: wrap;
    flex-direction: column;
    padding: 0;
    
    .breadcrumbs {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      padding: 12px;
      border-bottom: 1px solid #ddd;
      background-color: #fff;

      .btn-go-back {
        margin: 0;
        line-height: 8px !important;
        height: 12px !important;
        padding-top: 3px;
      }

      &>div {
        position: relative;
        display: flex;
        margin: auto 0;

        &>button {
          margin-left: 12px;
        }
      }
    }

    .xis-default-page-size {
      overflow: auto;
    }
  }
</style>