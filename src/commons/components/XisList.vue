<template>
  <div
    v-if="dbBlueprints != null"
    id="XisList"
    :class="{'no-borders': noBorders}"
  >

    <xis-list-actions-bar
      :blueprints="dbBlueprints"
      :route-limiters="routeLimiters"
      :no-borders="noBorders"
      v-model="simpleSearch"
      @filters-set="fetchData"
      @refresh-requested="onRefreshRequested"
    />

    <div
      class="xis-list"
      v-if="data"
    >
      <div
        v-if="!!!noHeaders"
        class="list-header"
      >
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

          <div class="list-col left-border" :style="{'width': (actionColWidth + 'px'), 'margin-left': 'auto', 'display': 'flex', 'justify-content': 'space-between'}">
            <span :style="{'color': '#666', 'font-size': '.94rem'}"><xis-translator :text="'WORD.ACTIONS'" /></span>
          </div>
        </div>
      </div>

      <div
        v-if="loading"
        class="list-body"
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
        v-else-if="(totalResults > 0) && (filteredData.length)"
        class="list-body"
      >
        <div
          class="list-row"
          v-for="(row, rowIndex) in filteredData" :key="'xis-list-row-' + (row.id || rowIndex)"
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
                <span :style="{'display': 'flex'}">
                  <span :style="{'margin': 'auto 0'}">
                    <xis-translator :text="getDataValueByColumn(row, col)" />
                  </span>
                </span>
              </template>
              <span v-if="!col.translate_in_lists">{{getDataValueByColumn(row, col)}}</span>
              <span v-else :style="{'display': 'flex'}">
                <span :style="{'margin': 'auto 4px auto 0', 'font-size': '14pt', 'color': '#ddd'}">
                  <font-awesome-icon :icon="['fas', 'language']" />
                </span>
                <span>{{getDataValueByColumn(row, col)}}</span>
              </span>
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
      >
        <div
          class="list-row"
        >
          <div class="list-col" style="width: 100%;">
            <span>
              <xis-translator
                v-if="!!!totalResults"
                :text="'WORD.NOTHING_TO_SHOW'"
              />
              <xis-translator
                v-if="(totalResults > 0) && (!!!filteredData.length)"
                :text="'WORD.NOTHING_TO_SHOW_BY_SEARCH'"
              />
            </span>
          </div>
        </div>
      </div>
      
      <div
        class="list-foot"
        v-show="!!!noHeaders"
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

import XisListActionsBar from './list-components/XisListActionsBar.vue';
import XisListActions from './list-components/XisListActions.vue';
import XisListPaginator from './list-components/XisListPaginator.vue';
import XisListOrderer from './list-components/XisListOrderer.vue';
import XisModal from '@/commons/components/XisModal';
import XisForm from '@/commons/components/html-components/XisForm';

export default {
  name: 'XisList',
  components: {
    XisListActionsBar,
    XisListActions,
    XisListPaginator,
    XisListOrderer,
    XisModal,
    XisForm
  },
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
    'no-borders': { type: Boolean, default: false },
    'no-headers': { type: Boolean, default: false },
    'route-limiters': {},
    'show-detailed-header': {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      dbBlueprints: null,
      perPage: 50,
      currentPage: 1,
      totalResults: 0,
      totalPages: 0,
      loading: false,
      downloading: false,
      data: [],
      cols: [],
      showAdvancedFilters: false,
      showListAddModal: true,
      simpleSearch: null
    }
  },
  watch: {
    simpleSearch (newValue) {
      console.log('Busca simples feita por');
      console.log(newValue);
    },
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
    filteredData () {
      return this.data.filter(row => {
        let found = true;

        if (this.simpleSearch) {
          found = false;
        }

        return found;
      })
    },
    getCols () {
      if (!this.dbBlueprints) return [];

      let totalSetWidth = 0;
      let countColsWithWidth = 0;
      const actionsColWidth = this.actionColWidth;
      const countCols = this.dbBlueprints.db.fields.filter(col => {
        if (this.simpleColumns) {
          return (((!!!col.primary_key) || col.editable) && ((!!col.display_in_lists && (!!col.not_null)) && (['int', 'string', 'foreign'].includes(col.type.name))));
        }

        return (!!col.display_in_lists);
      }).length;

      this.dbBlueprints.db.fields.filter(col => {
        if (this.simpleColumns) {
          return (((!!!col.primary_key) || col.editable) && ((!!col.display_in_lists && (!!col.not_null)) && (['int', 'string', 'foreign'].includes(col.type.name))))
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
          return (((!!!col.primary_key) || col.editable) && ((!!col.display_in_lists && (!!col.not_null)) && (['int', 'string', 'foreign'].includes(col.type.name))))
        }

        return col.display_in_lists
      }).map(col => {
        if (col.width) {
          col.width = col.width + 'px';
        } else if (col.primary_key && (!!!col.editable)) {
          col.width = '40px';
        } else {
          col.width = 'calc(((100% - ' + totalSetWidth + 'px) - ' + (actionsColWidth / (countCols - countColsWithWidth)) + 'px) / ' + (countCols - countColsWithWidth) + ')'
        }

        col.title = col.name;
        col.field = col.name;
        
        return col;
      });

      return returnedColumns;
    }
  },
  methods: {
    onRefreshRequested () {
      this.fetchData();
    },
    showAddModal () {
      this.$refs.listSingleAddModal.openModal();
    },
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
    border: none;
    background: none;
    box-shadow: 0 0 13px #aaa6;

    &.no-borders {
      box-shadow: none;
    }

    .xis-list {
      position: relative;
      display: flex;
      flex-flow: wrap;
      border: 1px solid #ddd;
      // box-shadow: 0 4px 14px #0002;
      // border-radius: 12px;

      &>.list-header {
        position: inherit;
        display: flex;
        flex-flow: wrap;
        width: 100%;
        overflow-y: scroll;
        background-color: #fff;
        overflow-x: hidden;
        // border-radius: 12px 12px 0 0;

        &::-webkit-scrollbar {
          background: none;
          border: none;
          width: 8px;
        }

        &>.list-row {
          border: none;
          // border-radius: 12px;

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
        // overflow-y: scroll;
        overflow-x: hidden;
        flex-direction: column;
        // background-color: #efefef;
        // border-radius: 0 0 12px 12px;

        &::-webkit-scrollbar {
          background-color: #efefef;
          // border-radius: 0 0 12px 0;
          width: 8px;
        }
        &::-webkit-scrollbar-track {
          // border-radius: 0 0 12px 0;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }
        &::-webkit-scrollbar-thumb {
          background-color: darkgrey;
          // outline: 1px solid slategrey;
          // border-radius: 12px;
        }

        &>.list-row {
          border-bottom: 1px solid #f0f0f0;
          background-color: #fafafa;

          &:first-of-type {
            // border-radius: 0 0 12px 12px;
          }

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
          // min-width: 100px;

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