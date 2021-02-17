<script>
export default {
  name: 'StructureMixins',
  data () {
    return {
        dictionary: null,
        missingTranslation: [],
        loadingDictionary: false
    }
  },
  methods: {
    async fetchBlueprintsByTable (tableId) {
      console.log('Getting blueprints by table');
      console.log(tableId);
      return await this.$axios.get('/system/blueprints/by-table/' + tableId);
    },
    async getBlueprints (menuHash) {
      return await this.$axios.get('/system/blueprints/by-menu/' + menuHash);
    },
    async getData (menuHash, ids) {
      return await this.$axios.get('/data/view/by-menu/' + menuHash + '/' + ids);
    },
    _XisT (text) {
      if (this.dictionary == null) {
        this.dictionary = JSON.parse(this.$store.getters.getDictionary);
      }

      let translated = this.dictionary.findIndex(
        item => String(item.word) == String(text)
      );

      if (translated >= 0) {
        return this.dictionary[translated].translation;
      }

      return text;
    },
    _XisForceReload (to, from) {
      location.reload();
    },
    loadData (blueprints, currentPage = 1, perPage = 20) {
      let currentFilters = this.$store.getters.getAdvancedFilters;
      let currentOrder = this.$store.getters.getListOrders;
      let limiters = this.$route.params.ids || null;
      
      return this.$axios.get('/data/list/' + blueprints.db.id + '?page=' + currentPage + '&per-page=' + perPage + '&limiters=' + limiters + '&filters=' + currentFilters + '&order-by=' + JSON.stringify(currentOrder));
    }
  }
}
</script>