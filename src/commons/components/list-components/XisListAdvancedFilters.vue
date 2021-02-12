<template>
  <xis-modal
    ref="advFilterModal"
    v-model="visible"
    @go-for-ok="applyAdvancedSearch"
    title="Advanced search"
  >
    <xis-input
      name="basic_search"
      :label="_XisT('Basic search')"
      :placeholder="_XisT('Search...')"
      v-model="filters.simpleSearch"
    ></xis-input>
    <hr>
    <xis-input
      v-for="(searches, index) in filters.fieldSearches" :key="searches.id + '-' + index"
      type="text"
      :name="'field-search-' + searches.id + '-' + index"
      :placeholder="_XisT('Search by field...')"
      :label="(!index) ? _XisT('Search by field') : null"
      :selectOption="blueprints.db.fields.filter(i => { return [1, 2, 3, 4, 5, 6, 7, 15, 16, 20].includes(i.type.id) }).map(i => { return {id: i.id, value: i.name, type: i.type} })"
      :select-target="searches"
      @select-changed="setSearchedField"
      :action-button="addNewFieldSearch"
      :action-button-icon="(index == (filters.fieldSearches.length - 1)) ? '+' : '-'"
      :action-button-unique-id="index"
      :class="{'no-bottom-margin': (filters.fieldSearches.length)}"
    ></xis-input>
    <hr>
    <xis-boolean
      v-for="(boolField, index) in blueprints.db.fields.filter(i => { return [8].includes(i.type.id) })" :key="'fk-field-search-' + boolField.id"
      :fieldId="boolField.id"
      :value="filters.booleanFilters.filter(i => { return (parseInt(i.id) == parseInt(boolField.id)) }).length ? filters.booleanFilters.filter(i => { return (parseInt(i.id) == parseInt(boolField.id)) })[0].value : null"
      :name="'field-filter-bool-' + boolField.id + '-' + index"
      :label="_XisT(boolField.name)"
      @changed="setBooleanFilter"
    />
    <hr>
    <xis-select
      v-for="fkfield in blueprints.db.fields.filter(i => { return ((i.type.id == 10) && i.joins.length) })" :key="'fk-field-search-' + fkfield.id"
      :name="String(fkfield.id)"
      :label="_XisT(fkfield.name)"
      :default-value="filters.fkFieldSearches.filter(i => { return (parseInt(i.id) == parseInt(fkfield.id)) }).length ? filters.fkFieldSearches.filter(i => { return (parseInt(i.id) == parseInt(fkfield.id)) })[0].value : null"
      @change="setFkFieldFilters"
      mode="multiple"
      :api-mode="true"
      :api-url="'data/get-as-option/' + fkfield.joins[0].right_field.table.id + '/' + fkfield.joins[0].visible_field.id"
    />
    
  </xis-modal>
</template>

<script>
import XisModal from '@/commons/components/XisModal.vue';
import XisInput from '@/commons/components/html-components/XisInput.vue';
import XisSelect from '@/commons/components/html-components/XisSelect.vue';
import XisBoolean from '@/commons/components/html-components/XisBoolean.vue';

export default {
  name: 'XisListAdvancedSearch',
  components: { XisModal, XisInput, XisSelect, XisBoolean },
  props: {
    'value': {},
    blueprints: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      visible: false,
      filters: {
        simpleSearch: null,
        fieldSearches: [
          {
            id: 0,
            value: null
          }
        ],
        fkFieldSearches: [],
        booleanFilters: []
      }
    }
  },
  watch: {
    'value' (newValue) {
      this.visible = newValue;
    },
    visible (newValue) {
      this.$emit('input', newValue);
    }
  },
  methods: {
    closeAdvancedFilters () {
      this.visible = false;
    },
    applyAdvancedSearch () {
      this.$store.commit('setAdvancedFilters', {submenuId: this.$route.params.submenuId, filters: this.filters});
      this.$refs.advFilterModal.unsetLoading();
    },
    addNewFieldSearch (value) {
      if (this.filters.fieldSearches.length <= (value + 1)) {
        // Adicona um novo
        this.filters.fieldSearches.push(
          {
            id: 0,
            value: null
          }
        );
      } else {
        this.filters.fieldSearches = this.filters.fieldSearches.filter( (i, index) => { return (index != value) });
      }
    },
    setSearchedField (target, value) {
      this.filters.fieldSearches[target] = value;
    },
    setFkFieldFilters (id, value) {
      let index = this.filters.fkFieldSearches.findIndex(i => (i.id == id));

      if (index >= 0) {
        this.filters.fkFieldSearches[index].value = value;
      } else {
        this.filters.fkFieldSearches.push({
          id: id,
          value: value
        });
      }
    },
    setBooleanFilter (fieldId, value) {
      let fIndex = this.filters.booleanFilters.findIndex(i => { return (i.id == fieldId) });

      if (fIndex >= 0) {
        if (value == null) {
          this.filters.booleanFilters = this.filters.booleanFilters.filter(i => { return (parseInt(i.id) != parseInt(fieldId)) });
        } else {
          this.filters.booleanFilters[fIndex].value = value;
        }
      } else {
        this.filters.booleanFilters.push(
          {
            id: fieldId,
            value: value
          }
        );
      }
    }
  },
  mounted () {
    let currentFilters = this.$store.getters.getAdvancedFilters;
    
    if (currentFilters != null) {
      this.filters = JSON.parse(currentFilters);
      console.log(this.filters);
    }
  }
}
</script>

<style lang="scss">
.ant-modal-full-right {
  .ant-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 0;
    min-width: 580px;
  
    .ant-modal-content {
      border-radius: 0;
  
      .ant-modal-body {
        height: calc(100vh - 109px);
      }
    }
  }

}
</style>