<template>
  <div id="XisView">
    <a-row :gutter="16">
      <xis-table-view
        :blueprints="blueprints"
        :data="formData"
      />

      <a-col :span="12">
        <div
          v-for="mmTable in getNtoMTables" :key="'m-m-table-block-' + mmTable.n_table.id"
          class="data-block second-data-block no-padding"
        >
          <xis-view-flex-line :span="24" :style="{'padding': '12px'}">
            <h4 class="">
              <xis-translator :text="'table_name.' + mmTable.n_table.name" />
            </h4>

            <a-button
              :icon="showMtoMtables ? 'up' : 'down'"
              type="link"
              @click="showMtoMtables = !showMtoMtables"
            />
          </xis-view-flex-line>

          <xis-list
            v-show="showMtoMtables"
            :byTable="true"
            :table="mmTable.pivot_table.id"
            :simple-columns="true"
            :route-limiters="$route.params.ids"
            :default-per-page="10"
            no-borders
            no-headers
          ></xis-list>
        </div>
        <div
          v-if="hasPrimaryKeyValues"
          class="right-pane"
        >
          <div
            v-for="relatedTable in blueprints.db.related_tables.filter(i => { return (i.right_table.id != blueprints.db.id) })" :key="'related-table-block-' + relatedTable.right_table.id"
            class="vertical-block"
          >
            <xis-list
              :byTable="true"
              :table="relatedTable.right_table.id"
              :height="93"
              :default-per-page="10"
              :simple-columns="true"
              :route-limiters="$route.params.ids"
              :class="['bordered']"
              :show-detailed-header="true"
            ></xis-list>
          </div>
        </div>
      </a-col>
    </a-row>

    <a-row
      v-for="mmTable in getNtoMTableMappers" :key="'m-m-mapper-table-block-' + mmTable.n_table.id"
    >
      <xis-mapper-table-view
        :pivot-table="mmTable"
        :data="formData"
      />
    </a-row>
  </div>
</template>

<script>
import XisTableView from './view-components/XisTableView';
import XisMapperTableView from './view-components/XisMapperTableView';
import XisList from '@/commons/components/XisList.vue';
import XisViewFlexLine from './view-components/XisViewFlexLine';

export default {
  name: 'XisView',
  components: {
    XisTableView,
    XisMapperTableView,
    XisList,
    XisViewFlexLine
  },
  props: {
    blueprints: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      formData: null,
      showMtoMtables: true
    }
  },
  computed: {
    getNtoMTables () {
      return this.blueprints.db.many_to_many_tables.filter(i => { return (['join_n_m'].includes(i.pivot_table.type.name)) });
    },
    getNtoMTableMappers () {
      console.log('Mapper tables:');
      console.log(this.blueprints.db.many_to_many_tables.filter(i => { return (['join_n_m_map'].includes(i.pivot_table.type.name)) }));
      return this.blueprints.db.many_to_many_tables.filter(i => { return (['join_n_m_map'].includes(i.pivot_table.type.name)) });
    },
    hasPrimaryKeyValues () {
      let hasValues = true;

      if (this.blueprints) {
        if (this.blueprints.db) {
          if (this.blueprints.db.fields.length) {
            this.blueprints.db.fields.filter(i => { return (!!i.primary_key) }).forEach(i => {
              if (!!!this.formData[i.name]) {
                hasValues = false;
              }
            });
          }
        }
      }

      return hasValues;
    },
  },
  methods: {
  },
  created () {
    if (!this.formData) {
      if (this.data) {
        this.formData = this.deepClone(this.data)
      }
    }

    console.log('Blueprints');
    console.log(this.blueprints);
  }
}
</script>

<style lang="scss">
#XisView {
  

  h4.view-title {
    width: 100%;
    // border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
}
</style>