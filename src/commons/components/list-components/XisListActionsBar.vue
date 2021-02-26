<template>
  <div id="XisListActionsBar">
    <a-input
      class="inp-search"
      :placeholder="_XisT('WORD.SEARCH') + '...'"
    >
      <a-button 
        slot="addonAfter"
        type="link"
        size="small"
        @click.prevent="openAdvancedFilters"
      >
         <font-awesome-icon :icon="['fas', 'filter']" style="margin: auto; margin-top: 4px !important" />
      </a-button>
    </a-input>

    <a-button-group>
      <router-link
        tag="a-button"
        type="default"
        v-if="_XIS_Active_Menu.actions.length"
        :to="{ name: routeName(_XIS_Active_Menu.actions[0]), params: routeParams(_XIS_Active_Menu.actions[0])}"
      >
        <xis-translator :text="_XIS_Active_Menu.actions[0].target_menu.menu_title" />
      </router-link>
      
      <a-button
        type="secondary"
        icon="setting"
        title="Teste"
      />
      
      <a-popconfirm
        :title="_XisT('MESSAGE.CAN_TAKE_TOO_LONG_CONFIRM')"
        :ok-text="_XisT('WORD.CONFIRM')"
        placement="left"
        :cancel-text="_XisT('WORD.CANCEL')"
        @confirm="downloadList"
      >
        <a-button
          type="secondary"
          icon="cloud-download"
          :loading="downloading"
        />
      </a-popconfirm>
    </a-button-group>

    <xis-list-advanced-filters
      v-model="showAdvancedFilters"
      :blueprints="blueprints"
      @set="onFiltersSet"
    ></xis-list-advanced-filters>
  </div>
</template>

<script>
import XisListAdvancedFilters from './XisListAdvancedFilters.vue';
export default {
  name: 'XisListActionsBar',
  components: { XisListAdvancedFilters },
  props: {
    blueprints: {},
    'route-limiters': {}
  },
  data () {
    return {
      showAdvancedFilters: false,
      downloading: false,
    }
  },
  computed: {
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
    mainAction (action) {
      console.log('action');
      console.log(action);
    },
    chooseAction (option) {
      console.log('Escolhendo acao');
      console.log(option);
    },
    downloadList () {
      this.downloading = true;

      this.$axios.get(`/data/list/${this.blueprints.db.id}/download`, {
        params: {
          limiters: this.routeLimiters
        }
      })
        .then( ({data}) => {
          if (data.status) {
            var link = document.createElement("a");
            link.download = data.filename;
            link.href = data.download;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            link = null;
          }
          this.feedback(1, (this._XisT('WORD.FILE_DOWNLOAD_SUCCESS') + '!'), 3);
          this.downloading = false;
        })
        .catch(() => {
          this.feedback(0, (this._XisT('WORD.FILE_DOWNLOAD_ERROR') + '!'), 3);
          this.downloading = false;
        })
    },
    openAdvancedFilters () {
      console.log('Mostrando');
      this.showAdvancedFilters = true;
    },
    onFiltersSet () {
      this.$emit("filters-set");
    }
  }
}
</script>

<style lang="scss">
#XisListActionsBar {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #d6d6d6;
  border-radius: 0;
  box-shadow: 0 0 22px #0006;
  background-color: #fafafa;

  &:hover {
    box-shadow: 0 0 32px #0008;
    transition: all .3s ease-in-out;
    transition-delay: 2000ms;
  }

  .inp-search {
    width: 400px;
  }

  .ant-btn {
    .anticon {
      vertical-align: 0 !important;
      // margin-top: -2px !important;
    }

    .anticon-down {
      vertical-align: 0 !important;
    }
  }
}
</style>