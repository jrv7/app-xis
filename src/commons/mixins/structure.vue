<script>
import { mapState } from 'vuex';
// import Translator from '@/commons/components/XisTranslator.vue'

export default {
  name: 'StructureMixins',
  data () {
    return {
      dictionary: null,
      missingTranslation: [],
      loadingDictionary: false
    }
  },
  computed: {
    ...mapState([
      'xisStateUser',
      'xisStateMenuTree',
      'xisStateCurrentMenu',
      'xisStateLanguage',
      'xisStateDictionary'
    ]),
    _XIS_UserData () { return this.xisStateUser; },
    _XIS_CompanyLogo () { return 'Xis'; },
    _XIS_Language () { return this.xisStateLanguage; },
    _XIS_Dictionary () { return this.xisStateDictionary; },
    _XIS_Menu_Tree () { return this.xisStateMenuTree; },
    _XIS_Current_Menu () { return this.xisStateCurrentMenu; },
    _XIS_Current_Menu_Hash () { return this.xisStateCurrentMenu.submenuId; },
    _XIS_Active_Menu () {
      let activeMenu = null;

      this._XIS_Menu_Tree.forEach(mMenu => {
        mMenu.children.forEach(fMenu => {
          fMenu.children.forEach(aMenu => {
            if (String(aMenu.menu_url_hash) == String(this._XIS_Current_Menu_Hash)) {
              activeMenu = this.deepClone(aMenu);
            }
          });
        });
      });

      return activeMenu;
    }
  },
  methods: {
    async _XisGetUser () {
      return await this.$axios.get('/system/user');
    },
    async _XisGetDictionary () {
      return await this.$axios.get('/system/dictionary', {
        params: {
          language: this._XIS_Language
        }
      });
    },
    refreshDictionary () {
      this._XisGetDictionary()
        .then( ({data}) => {
          this.$store.commit('setDictionary', data);
        })
        .catch((error) => {
          this.explainAxiosError(error);
        });
    },
    feedback (status, message, duration = 6) {
      switch (status) {
        case 1: {
          this.$message.success(
            this._XisT(message),
            duration,
          );
        } break;

        case 0: {
          this.$message.error(
            this._XisT(message),
            duration,
          );
        } break;
      }
    },
    deepClone (object) {
      return JSON.parse(JSON.stringify(object));
    },
    async fetchBlueprintsByTable (tableId) {
      return await this.$axios.get('/system/blueprints/by-table/' + tableId);
    },
    async getBlueprints (menuHash) {
      return await this.$axios.get('/system/blueprints/by-menu/' + menuHash);
    },
    async getData (menuHash, ids) {
      return await this.$axios.get('/data/view/by-menu/' + menuHash + '/' + ids);
    },
    async getDataByTable (tableId, limiters = null, perPage = 20) {
      return await this.$axios.get('/data/list/' + tableId + '?limiters=' + limiters + '&per-page=' + perPage);
    },
    async deleteDataByTable (tableId, data) {
      return await this.$axios.post('/data/delete/' + tableId, {
        _method: 'delete',
        data
      });
    },
    async insertByTable (tableId, data) {
      return await this.$axios.post('/data/insert/' + tableId, data);
    },
    
    _XisT (text) {
      let translated = this._XIS_Dictionary.findIndex(
        item => String(item.word) == String(text)
      );

      if (translated >= 0) {
        return this._XIS_Dictionary[translated].translation;
      }

      this.$store.commit('storeUntranslatedWord', text);

      return text;
    },
    _XisForceReload () {
      setTimeout(() => {
        location.reload();
      }, 400);
    },
    loadData (blueprints, currentPage = 1, perPage = 20) {
      let currentFilters = this.$store.getters.getAdvancedFilters;
      let currentOrder = this.$store.getters.getListOrders;
      let limiters = this.$route.params.ids || null;
      
      return this.$axios.get('/data/list/' + blueprints.db.id + '?page=' + currentPage + '&per-page=' + perPage + '&limiters=' + limiters + '&filters=' + currentFilters + '&order-by=' + JSON.stringify(currentOrder));
    },

    /**
     * Checking dor Vuex State Variables
     */
    checkForUserData () {
      // Section focused on populating Vuex
      let hasStateVar = this.$store.getters.hasUserData;

      if (!hasStateVar) {
        this._XisGetUser()
          .then( ({data}) => {
            this.$store.commit('setUserSession', data);
          })
          .catch((error) => {
            this.explainAxiosError(error);
          });
      } else {
        this.$store.commit('setUserSession');
      }
    },
    checkForMenus () {
      let hasStateVar = this.$store.getters.hasMenuTree

      if (!hasStateVar) {
        this.$axios.get('/system/menus/root')
          .then( ({data}) => {
            this.$store.commit('setMenuTree', data);
          })
          .catch((error) => {
            this.explainAxiosError(error);
          });
      } else {
        this.$store.commit('setMenuTree');
      }
    },
    checkForCurrentMenus () {
      this.$store.commit('setCurrentMenus');
    },
    checkForDictionary () {
      let hasStateVar = this.$store.getters.hasDictionary

      if (!hasStateVar) {
        this._XisGetDictionary()
          .then( ({data}) => {
            this.$store.commit('setDictionary', data);
          })
          .catch((error) => {
            this.explainAxiosError(error);
          });
      } else {
        this.$store.commit('setDictionary');
      }
    },
    makePreparations () {
      this.checkForUserData();
      this.checkForMenus();
      this.checkForCurrentMenus();
      this.checkForDictionary();
    },
    explainAxiosError (error) {
      // Error 😨
      if (error.response) {
          /*
          * The request was made and the server responded with a
          * status code that falls out of the range of 2xx
          */
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
      } else if (error.request) {
          /*
          * The request was made but no response was received, `error.request`
          * is an instance of XMLHttpRequest in the browser and an instance
          * of http.ClientRequest in Node.js
          */
          console.log(error.request);
      } else {
          // Something happened in setting up the request and triggered an Error
          console.log('Error', error.message);
      }
      console.log(error.config);
    },
    checkPermission (permissions, permission = 'view') {
      return !!permissions.filter(i => { return (i.permission.name == permission) }).length;
    }
  }
}
</script>