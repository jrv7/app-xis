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
    async getBlueprints (menuHash) {
      return await this.$axios.get('/system/blueprints/' + menuHash);
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
    loadData (blueprints, currentPage = 1, perPage = 20) {
      return this.$axios.get('/data/list/' + blueprints.db.id + '?page=' + currentPage + '&per-page=' + perPage);
    }
  }
}
</script>