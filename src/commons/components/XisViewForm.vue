<template>
  <div
    id="XisView"
  >
    <a-row type="flex" justify="center" align="top" :gutter="22">
      <a-col :span="12">
        <div class="left-pane">
          <xis-form
            :blueprints="blueprints"
            :title="'table_name_singular.' + blueprints.db.name"
            :data="data"
            @success="storeNewData"
          />
        </div>
      </a-col>

      <a-col :span="12">
        <div
          v-if="hasPrimaryKeyValues"
          :key="'right-pane-key-' + (hasPrimaryKeyValues ? '1' : '0')"
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
              :default-per-page="20"
              :simple-columns="true"
              :route-limiters="$route.params.ids"
              :class="['bordered']"
              :show-detailed-header="true"
            ></xis-list>
          </div>
        </div>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="24">
        <p></p>
      </a-col>
    </a-row>

    <a-row type="flex" justify="start" align="top" :gutter="22">
      <a-col
        :span="12"
        v-for="mnTable in getManyToManyTables" :key="'m-to-n-table-block-' + mnTable.n_table_id + (hasPrimaryKeyValues ? '1' : '0')"
      >
        <xis-list
          :byTable="true"
          :table="mnTable.pivot_table.id"
          :height="40"
          :default-per-page="20"
          :simple-columns="true"
          :route-limiters="$route.params.ids"
          :show-detailed-header="true"
        ></xis-list>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import XisForm from '@/commons/components/html-components/XisForm.vue';
import XisList from '@/commons/components/XisList.vue';

export default {
  name: 'XisView',
  components: { XisForm, XisList },
  props: {
    blueprints: {
      type: Object,
      required: true
    },
    height: {
      type: Number,
      default: 600
    },
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      formData: null
    }
  },
  computed: {
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
    getManyToManyTables () {
      if (!!!this.hasPrimaryKeyValues) {
        return [];
      }
      
      return this.blueprints.db.many_to_many_tables;
    }
  },
  methods: {
    storeNewData (data) {
      console.log('Inserido');
      console.log(data);
      this.formData = data;
    }
  },
  created () {
    if (this.data) {
      this.formData = this.deepClone(this.data);
    }
  },
  mounted () {
    console.log(this.blueprints);
  }
}
</script>

<style lang="scss">
  #XisView {
    position: relative;

    &>.horizontal-block {
      position: relative;
      display: flex;
      flex-flow: nowrap;
      width: 100%;
      margin-bottom: 12px;

      &:last-of-type {
        margin-bottom: 0;
      }

      .left-pane {
        padding: 12px;
        width: calc(60% - 12px);
        // max-height: 600px;
        overflow: auto;
        box-shadow: 0 0 8px #ddd;
        border: 1px solid #ccc;
        background-color: #f6f6f6;
        // background-color: #343a40;
      }

      .right-pane {
        position: relative;
        display: flex;
        flex-flow: wrap;
        flex-direction: column;
        width: calc(40%);
        margin-left: auto;

        .vertical-block {
          position: relative;
          width: 100%;
          // padding: 12px;
          margin-bottom: 12px;
          // box-shadow: 0 0 8px #ddd;
          // border: 1px solid #ccc;
          // background-color: #eaeaea;

          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>