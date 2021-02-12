<template>
  <div id="XisList">
    <xis-list-advanced-filters
      v-model="showAdvancedFilters"
      :blueprints="blueprints"
    ></xis-list-advanced-filters>
    <div
      class="xis-list"
      v-if="data"
    >
      <div class="list-header">
        <div class="list-row">
          <div
            v-for="col in getCols" :key="'xis-list-header-col-' + col.title"
            :style="{
              'width': col.width
            }"
            class="list-col"
          >
            <span>{{_XisT(col.title)}}</span>
          </div>

          <div class="list-col left-border" :style="{'width': (actionColWidth + 'px'), 'margin-left': 'auto', 'display': 'flex'}">
            <button
              @click.prevent="openAdvancedFilters"
              class="btn btn-sm btn-link no-outline"
            >
              <font-awesome-icon :icon="['fas', 'filter']" /> {{_XisT('Filters')}}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="loading"
        class="list-body"
        :style="{
          'max-height': 'calc(' + height + 'vh - 238px)',
          'min-height': 'calc(' + height + 'vh - 238px)'
        }"
      >
        <div
          class="list-row"
          v-for="i in 10" :key="'skeleton-' + i"
        >
          <div class="list-col" style="width: 100%;">
            <a-skeleton active />
          </div>
        </div>
      </div>

      <div
        v-else-if="totalResults > 0"
        class="list-body"
        :style="{
          'max-height': 'calc(' + height + 'vh - 238px)',
          'min-height': 'calc(' + height + 'vh - 238px)'
        }"
      >
        <div
          class="list-row"
          v-for="row in data" :key="'xis-list-row-' + row.id"
        >
          <div
            v-for="col in getCols" :key="'xis-list-header-col-' + col.title"
            :style="{
              'width': col.width,
              'height': (col.height ? (col.height + 'px') : 'auto')
            }"
            class="list-col"
          >
            <a-tooltip
              placement="bottom"
              trigger="click"
            >
              <template slot="title">
                <span>{{getDataValueByColumn(row, col)}}</span>
              </template>
              <span>{{getDataValueByColumn(row, col)}}</span>
            </a-tooltip>
          </div>

          <div class="list-col left-border" :style="{'width': (actionColWidth + 'px'), 'margin-left': 'auto'}">
            <xis-list-actions
              :actions="blueprints.db.list_actions"
              :row="row"
            ></xis-list-actions>
          </div>
        </div>
      </div>

      <div
        v-else
        class="list-body"
        :style="{
          'max-height': 'calc(' + height + 'vh - 238px)',
          'min-height': 'calc(' + height + 'vh - 238px)'
        }"
      >
        <div
          class="list-row"
        >
          <div class="list-col" style="width: 100%;">
            <span>{{_XisT('Nothing to show')}}</span>
          </div>
        </div>
      </div>
      
      <div class="list-foot">
        <div class="list-row">
          <div class="list-col" style="width: 100%; padding: 8px 12px;">
            <xis-list-paginator
              :show-size-changer="true"
              :current="currentPage"
              :totalResults="totalResults"
              :pageSize.sync="perPage"
              @page-changed="changePage"
              @page-size-changed="onShowSizeChange"
            ></xis-list-paginator>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import XisListActions from './list-components/XisListActions.vue';
import XisListPaginator from './list-components/XisListPaginator.vue';
import XisListAdvancedFilters from './list-components/XisListAdvancedFilters.vue';

export default {
  name: 'XisList',
  components: { XisListActions, XisListPaginator, XisListAdvancedFilters },
  props: {
    blueprints: {
      type: Object,
      required: true
    },
    height: {
      type: Number,
      default: 600
    },
    actionColWidth: {
      type: Number,
      default: 140
    }
  },
  data () {
    return {
      perPage: 50,
      currentPage: 1,
      totalResults: 1,
      loading: false,
      data: [],
      cols: [],
      showAdvancedFilters: false
    }
  },
  watch: {
    currentPage (newValue, oldValue) {
      if (newValue != oldValue) {
        this.fetchData();
      }
    },
    perPage (newValue, oldValue) {
      if (newValue != oldValue) {
        this.fetchData();
      }
    }
  },
  computed: {
    getCols () {
      let totalSetWidth = 0;
      let countColsWithWidth = 0;
      const actionsColWidth = this.actionColWidth;
      const countCols = this.blueprints.db.fields.filter(col => { return col.display_in_lists }).length;

      this.blueprints.db.fields.filter(col => { return col.display_in_lists }).forEach(col => {
        if (col.width) {
          totalSetWidth += parseInt(col.width);
          countColsWithWidth++;
        }
      });

      return this.blueprints.db.fields.filter(col => { return col.display_in_lists }).map(col => {
        if (col.width) {
          col.width = col.width + 'px';
        } else if (col.primary_key) {
          col.width = '40px';
        } else {
          col.width = 'calc(((100% - ' + totalSetWidth + 'px) - ' + (actionsColWidth / (countCols - countColsWithWidth)) + 'px) / ' + (countCols - countColsWithWidth) + ')'
        }

        col.title = col.name;
        col.field = col.name;
        
        return col;
      });
    }
  },
  methods: {
    openAdvancedFilters () {
      this.showAdvancedFilters = true;
    },
    getDataValueByColumn (row, col) {
      if (col.type.id == 10) {
        if (col.joins) {
          if (col.joins.length) {
            if (row[col.joins[0].model_foreign_function]) {
              if (row[col.joins[0].model_foreign_function][col.joins[0].visible_field.name]) {
                return (row[col.joins[0].model_foreign_function][col.joins[0].visible_field.name]);
              }
            }
          }
        }
      }
      return row[col.field] ?? '-';
    },
    fetchData () {
      this.loading = true;
      this.loadData(this.blueprints, this.currentPage, this.perPage)
        .then(({data}) => {
          this.data = data.data;

          this.currentPage = data.current_page;
          this.totalResults = data.total;

          this.loading = false;
        })
    },
    changePage (toPage) {
      this.currentPage = toPage;
    },
    onShowSizeChange(current, pageSize) {
      console.log('Mudando o tamanho');
      this.perPage = pageSize;
    }
  },
  mounted () {
    this.fetchData();
    this.openAdvancedFilters();
  }
}
</script>

<style lang="scss">
  #XisList {
    position: relative;
    width: 100%;
    overflow: auto;
    padding: 0;
    margin: 0;
    font-size: .8rem;
    border: 1px solid #ddd;
    box-shadow: 0 4px 14px #0002;

    .xis-list {
      position: relative;
      display: flex;
      flex-flow: wrap;

      &>.list-header {
        position: inherit;
        display: flex;
        flex-flow: nowrap;
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;

        &>.list-row {
          border-bottom: 1px solid #ccc;

          &>.list-col {
            line-height: 52px;
            border-bottom: 1px solid #eee;
            font-size: 1rem;
            text-transform: capitalize;
            white-space: nowrap;
          }
        }
      }

      &>.list-body {
        position: inherit;
        display: flex;
        flex-flow: nowrap;
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        flex-direction: column;
        background-color: #fafafa;

        &>.list-row {
          background-color: #ffffff;
          border-bottom: 1px solid #f0f0f0;

          >.list-col {
            line-height: 48px;
            white-space: nowrap;
          }

          &:hover {
            background-color: #f8f8f8;

            >.list-col {
              border-bottom: 1px solid #f8f8f8;
            }
          }
        }
      }

      &>.list-foot {
        position: inherit;
        display: flex;
        flex-flow: nowrap;
        width: 100%;

        &>.list-row {
          border-top: 1px solid #ccc;
        }
      }

      .list-row {
        display: flex;
        flex-flow: nowrap;
        justify-content: flex-start;
        width: 100%;

        &>.list-col {
          display: flex;
          border-left: 1px solid #fff;
          line-height: 32px;
          padding: 0 12px;
          margin: 0;
          overflow: hidden;

          &.left-border {
          border-left: 1px solid #ddd;
          }
          
          &>span {
            position: relative;
            display: flex;
            margin: auto 0;
            margin-left: 0;
          }
        }
      }
    }
  }
</style>