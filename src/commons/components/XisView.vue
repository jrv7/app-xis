<template>
  <div
    id="XisView"
  >
    <div class="horizontal-block">
      <div class="left-pane">
        <h3>{{_XisT('table_name_singular.' + blueprints.db.name)}}</h3>
        <hr>
        <div
          v-for="field in blueprints.db.fields" :key="'field-block-' + field.id"
        >
          <xis-form-field
            :field="field"
            :data="data"
            :readonly="true"
          ></xis-form-field>
        </div>
      </div>

      <div class="right-pane">
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
    </div>

    <div
      v-for="mnTable in blueprints.db.many_to_many_tables" :key="'m-to-n-table-block-' + mnTable.n_table_id"
      class="horizontal-block"
    >
      <xis-list
        :byTable="true"
        :table="mnTable.pivot_table.id"
        :height="40"
        :default-per-page="20"
        :simple-columns="true"
        :route-limiters="$route.params.ids"
        :class="['bordered']"
        :show-detailed-header="true"
      ></xis-list>
    </div>
  </div>
</template>

<script>
import XisFormField from '@/commons/components/html-components/XisFormField.vue';
import XisList from '@/commons/components/XisList.vue';

export default {
  name: 'XisView',
  components: { XisFormField, XisList },
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
      loading: false
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
    display: flex;
    flex-flow: wrap;

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
        max-height: 600px;
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