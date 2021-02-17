<template>
  <div
    id="XisList"
    v-if="dbBlueprints != null"
  >
    <xis-list-advanced-filters
      v-model="showAdvancedFilters"
      :blueprints="dbBlueprints"
      @set="fetchData"
    ></xis-list-advanced-filters>
    <div
      class="xis-list"
      v-if="data"
    >
      <div class="list-header">
        <div
          class="list-row detail-row"
          v-if="showDetailedHeader"
        >
          <div class="list-col" :style="{'width': '100%', 'display': 'flex', 'display': 'block'}">
            {{_XisT('table_name.' + dbBlueprints.db.name)}}
          </div>
        </div>
        <div
          class="list-row detail-row"
          v-if="showDetailedHeader"
        >
          <div class="list-col" :style="{'width': '80%', 'display': 'flex', 'display': 'block'}">
            <span>Total {{_XisT('table_name_by_lines.' + dbBlueprints.db.name)}}</span>
          </div>
          <div class="list-col" :style="{'width': '20%', 'text-align': 'right', 'display': 'flex', 'display': 'block'}">
            {{totalResults}}
          </div>
        </div>
        <div class="list-row">
          <div class="list-col left-border" :style="{'width': '80px', 'display': 'flex'}">
            #
          </div>
          <div
            v-for="col in getCols" :key="'xis-list-header-col-' + col.title"
            :style="{
              'width': col.width
            }"
            class="list-col"
          >
            <xis-list-orderer
              :field-id="col.id"
              @ordered="fetchData()"
            >
              <span>{{_XisT(col.table.name + '.' + col.title)}}</span>
            </xis-list-orderer>
            
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
          v-for="(row, rowIndex) in data" :key="'xis-list-row-' + row.id"
        >
          <div class="list-col left-border" :style="{'width': '80px', 'display': 'flex', 'color': '#999'}">
            {{rowIndex + 1}}
          </div>
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
              :blueprints="dbBlueprints"
              :row="row"
              @action-done="goToAction"
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
      
      <div
        class="list-foot"
        v-show="totalPages > 1"
      >
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
import XisListOrderer from './list-components/XisListOrderer.vue';

export default {
  name: 'XisList',
  components: { XisListActions, XisListPaginator, XisListAdvancedFilters, XisListOrderer },
  props: {
    byTable: {
      type: Boolean,
      default: false
    },
    table: {
      type: Number
    },
    blueprints: {
      type: Object
    },
    height: {
      type: Number,
      default: 600
    },
    actionColWidth: {
      type: Number,
      default: 140
    },
    defaultPerPage: {
      type: Number,
      default: 50
    },
    simpleColumns: {
      type: Boolean,
      default: false
    },
    'route-limiters': {},
    'show-detailed-header': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dbBlueprints: null,
      perPage: 50,
      currentPage: 1,
      totalResults: 0,
      totalPages: 0,
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
      if (!this.dbBlueprints) return [];

      let totalSetWidth = 0;
      let countColsWithWidth = 0;
      const actionsColWidth = this.actionColWidth;
      const countCols = this.dbBlueprints.db.fields.filter(col => {
        if (this.simpleColumns) {
          return ((!!!col.primary_key) && col.display_in_lists && (!!col.not_null))
        }

        return col.display_in_lists
      }).length;

      this.dbBlueprints.db.fields.filter(col => {
        if (this.simpleColumns) {
          return ((!!!col.primary_key) && col.display_in_lists && (!!col.not_null))
        }

        return col.display_in_lists
      }).forEach(col => {
        if (col.width) {
          totalSetWidth += parseInt(col.width);
          countColsWithWidth++;
        }
      });

      let returnedColumns = this.dbBlueprints.db.fields.filter(col => {
        if (this.simpleColumns) {
          return ((!!!col.primary_key) && col.display_in_lists && (!!col.not_null))
        }

        return col.display_in_lists
      }).map(col => {
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

      console.log('Returned columns: ');
      console.log(returnedColumns);

      return returnedColumns;
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
      if (!this.dbBlueprints) return null;

      this.loading = true;
      this.loadData(this.dbBlueprints, this.currentPage, this.perPage)
        .then(({data}) => {
          console.log('List data loaded:');
          console.log(data);
          this.data = data.data;

          this.currentPage = data.current_page;
          this.totalResults = data.total;
          this.totalPages = data.last_page;

          this.loading = false;
        })
    },
    changePage (toPage) {
      this.currentPage = toPage;
    },
    onShowSizeChange(current, pageSize) {
      console.log('Mudando o tamanho');
      this.perPage = pageSize;
    },
    changeOrder (event, order) {
      console.log('Changin order');
      console.log(order);
    },
    goToAction (ids) {
      console.log('Going to action');
      console.log(ids);
    }
  },
  mounted () {
    if (this.defaultPerPage) {
      this.perPage = this.defaultPerPage;
    }

    if (this.routeLimiters) {
      console.log('Carregar dados com limitadores:');
      console.log(this.routeLimiters);
    }

    if (this.blueprints) {
      this.dbBlueprints = this.blueprints;
      this.fetchData();
    } else if (this.table) {
      this.fetchBlueprintsByTable(this.table)
        .then( ({data}) => {
          console.log('Blueprints carregados');
          console.log(data);
          this.dbBlueprints = data;

          this.fetchData();
        });
    }
    // this.openAdvancedFilters();
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
        flex-flow: wrap;
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;

        &>.list-row {
          background-color: #fff;
          border: none;

          &:last-of-type {
            border-bottom: 1px solid #ccc;
          }

          &>.list-col {
            display: flex;
            flex-flow: nowrap;
            line-height: 52px;
            border-bottom: 1px solid #eee;
            font-size: 1rem;
            // text-transform: capitalize;
            white-space: nowrap;

            &>* {
              margin: auto 0;
            }
            &>.order-select {
              padding: 0;
            }
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

    &.bordered {
      border: 1px solid #9996;
    }
  }
</style>