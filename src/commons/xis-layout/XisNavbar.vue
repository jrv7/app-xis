<template>
  <nav
    id="XisTopNavBar"
    class="navbar navbar-expand-lg"
    :class="{'collapsed': (!!collapsed)}"
  >
    <a-button type="primary" class="collapse-menu" @click="toggleCollapsed">
      <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
    </a-button>

    <div class="collapse navbar-collapse" id="navbarColor02">
      <a-button-group :style="{'margin-left': '12px'}" class="mr-auto">
        <a-button
          v-for="menu in _XIS_Menu_Tree" :key="'main-nav-button-' + menu.menu_url_hash"
          :type="(menu.menu_url_hash == _XIS_Current_Menu.mainMenuId) ? 'primary' : 'default'"
           @click.prevent="goToMainMenu(menu.menu_url_hash)"
        >
          {{_XisT(menu.menu_title)}}
        </a-button>
      </a-button-group>

      <!-- <ul class="navbar-nav mr-auto">

        <li
          v-for="menu in _XIS_Menu_Tree" :key="menu.menu_url_hash"
          class="nav-item"
          :class="{
            'active': (activeMainMenu == menu.menu_url_hash)
          }"
        >
          <a class="nav-link" @click.prevent="goToMainMenu(menu.menu_url_hash)">
            {{_XisT(menu.menu_title)}}
            <span v-if="activeMainMenu == menu.menu_url_hash" class="sr-only">(current)</span>
          </a>
        </li>

      </ul> -->
      <form
        class="form-inline"
        :style="{'display': 'flex'}"
      >
        <a-button type="primary" :style="{'margin-right': '12px'}" @click="openAdvancedTranslator">
          T
        </a-button>
        
        <a-select
          :default-value="xisStateLanguage"
          v-model="selectedLanguage"
          :style="{'width': '100px'}"
        >
          <a-select-option :value="1">
            <font-awesome-icon :icon="['fas', 'globe-americas']" /> PT-Br
          </a-select-option>
          <a-select-option :value="2">
            <font-awesome-icon :icon="['fas', 'globe-americas']" /> US-En
          </a-select-option>
        </a-select>

        <a-button
          icon="logout"
          :style="{'margin-left': '12px'}"
          @click="signOut"
        >
          {{_XisT('Log out')}}
        </a-button>
      </form>
    </div>

    <xis-modal
      ref="XisAdvancedTranslatorModal"
      :title="'modal_add_new_'"
      v-model="showXisAdvancedTranslator"
      @modal-confirmed="$refs.XisAdvancedTranslator.submitTranslations()"
      @modal-canceled="showXisAdvancedTranslator = false"
    >
      <xis-advanced-translator
        ref="XisAdvancedTranslator"
      />
    </xis-modal>
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';
import XisModal from '@/commons/components/XisModal';
import XisAdvancedTranslator from './XisAdvancedTranslator';

export default {
  name: 'XisNavbar',
  components: { XisModal, XisAdvancedTranslator },
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedLanguage: 0,
      mounted: false,
      showXisAdvancedTranslator: false
    }
  },
  watch: {
    selectedLanguage (newValue) {
      if (this.mounted) {
        this.$store.commit('setLanguage', newValue);

        setTimeout(() => {
          this.refreshDictionary();
        }, 400);
      }
    }
  },
  computed: {
    ...mapState(['xisStateCurrentMenu', 'xisStateLanguage']),
    activeMainMenu () {
      return this.xisStateCurrentMenu.mainMenuId;
    }
  },
  methods: {
    toggleCollapsed () {
      this.$emit('collapse-toggled');
    },
    openAdvancedTranslator () {
      this.showXisAdvancedTranslator = true;
    },
    goToMainMenu (menuId) {
      if (this.activeMainMenu !== menuId) {
        this.$nextTick(() => {
          this.$router.push('/' + menuId);
        })
      }
    },
		signOut() {
			this.$store.commit("login/signout");
			this.$router.replace('/');
		}
  },
  mounted () {
    this.selectedLanguage = parseInt(this.xisStateLanguage);

    setTimeout(() => {
      this.mounted = true;
    }, 400);
  }
}
</script>

<style lang="scss">
#XisTopNavBar {
  position: fixed;
  top: 0;
  left: 220px;
  right: 0;
  min-height: 56px;
  max-height: 56px;
  background-color: #3c8dbc;
  z-index: 99;
  box-shadow: 0 0 12px #0002;
  transition: all .3s ease;

  &.collapsed {
    left: 70px;
  }

  .collapse-menu {
    .anticon {
      vertical-align: 0rem !important;
    }
  }
}
.navbar-light {
  border-bottom: 1px solid #eee;
}

.mr-auto {
  margin-right: auto !important;
}
</style>