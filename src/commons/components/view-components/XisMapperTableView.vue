<template>
  <a-col :span="24">
    <div class="data-block main-data-block">
      <xis-view-flex-line :span="24">
        <h4 class="">
          <xis-translator :text="'table_name_singular.' + pivotTable.pivot_table_name" />
        </h4>
        <a-button
          type="default"
          v-if="checkPermission(pivotTable.pivot_table.userPermissions, 'update')"
          @click="enterEditionMode"
        >Editar</a-button>
      </xis-view-flex-line>

      <xis-view-line :span="24"><hr></xis-view-line>

      <div
        v-for="mapped in mapperData" :key="'mapped-data-row-' + mapped[getMapperTable.right_table_field_name]"
        class="data-block main-data-block span-12"
      >
        <xis-view-flex-line
          :span="24"
          :style="{'flex-flow': 'wrap', 'margin-top': '24px'}"
        >
          <h5
            :style="{'width': '100%', 'margin-bottom': '12px !important'}"
          >
            <xis-translator :text="'db_table_name.' + mapped[getMapperTable.right_table_visible_field_name]" />
          </h5>
          <hr>
          <xis-view-line
            v-for="nData in nTableData" :key="'line-text-' + nData[pivotTable.n_field_name]"
            :span="(24 / nTableData.length)"
            :type="'boolean'"
            :text="'WORD.true'"
            :style="{'margin-bottom': '24px !important'}"
          >
            <template slot="text">
              <span
                :style="{'display': 'flex'}"
              >
                <a-switch
                  :checked="hasMappActive(mapped[getMapperTable.right_table_field_name], nData[pivotTable.n_field_name])"
                  :disabled="(!editing) || submiting"
                  @change="setMapStatus(0, mapped[getMapperTable.right_table_field_name], nData[pivotTable.n_field_name])"
                />
                <span><xis-translator :text="nData[pivotTable.n_visible_field_name]" /></span>
              </span>
            </template>
          </xis-view-line>
          <xis-view-line
            v-for="i in (24 - (nTableData.length*(24 / nTableData.length)))" :key="'line-spacer-' + mapped.id + '-' + i"
            :span="1"
          ><span></span></xis-view-line>
        </xis-view-flex-line>
      </div>
    </div>
  </a-col>
</template>

<script>
import XisViewLine from './XisViewLine';
import XisViewFlexLine from './XisViewFlexLine';

export default {
  name: 'XisMapperTableView',
  components: {
    XisViewLine,
    XisViewFlexLine
  },
  props: {
    pivotTable: {},
    data: {}
  },
  data () {
    return {
      pivotTableData: [],
      nTableData: [],
      mapperData: [],
      editing: false,
      submiting: false
    }
  },
  computed: {
    getMapperTable () {
      let mapperTables = this.pivotTable.pivot_table.joined_tables.filter(i => {
        return (![this.pivotTable.m_table_id, this.pivotTable.n_table_id].includes(i.right_table_id));
      });

      if (mapperTables.length) {
        return mapperTables[0];
      }
      
      return null;
    }
  },
  methods: {
    enterEditionMode () {
      this.editing = (!this.editing);
    },
    hasMappActive (mappedDataId, nTableDataId) {
      return !!this.pivotTableData.filter(i => {
        return ((i[this.getMapperTable.right_table_object][this.getMapperTable.right_table_field_name] == mappedDataId) && (i[this.pivotTable.n_object][this.pivotTable.n_field_name] == nTableDataId));
      }).length;
    },
    getPivotData () {
      if (this.pivotTable.pivot_table) {
        this.getDataByTable(this.pivotTable.pivot_table.id, this._XIS_Current_Menu.ids, 0)
          .then( ({data}) => {
            this.pivotTableData = data;
          })
      }
    },
    getNData () {
      if (this.pivotTable.n_table) {
        this.getDataByTable(this.pivotTable.n_table.id, null, 0)
          .then( ({data}) => {
            this.nTableData = data;
          })
      }
    },
    getMapperData () {
      if (this.getMapperTable.right_table_id) {
        this.getDataByTable(this.getMapperTable.right_table_id, null, 0)
          .then( ({data}) => {
            this.mapperData = data;
          })
      }
    },
    setMapStatus (mTableId, mapId, nTableId) {
      this.submiting = true;

      if (this.hasMappActive(mapId, nTableId)) {
        console.log('Desativando');

        this.deleteDataByTable(this.pivotTable.pivot_table.id, this.pivotTableData.filter(i => {
          return ((i[this.getMapperTable.right_table_object][this.getMapperTable.right_table_field_name] == mapId) && (i[this.pivotTable.n_object][this.pivotTable.n_field_name] == nTableId));
        }).map(i => {
          let newObj = {};
          newObj[this.pivotTable.m_object] = {};
          newObj[this.pivotTable.m_object][this.pivotTable.m_field_name] = i[this.pivotTable.m_object][this.pivotTable.m_field_name];

          newObj[this.getMapperTable.right_table_object] = {};
          newObj[this.getMapperTable.right_table_object][this.getMapperTable.right_table_field_name] = i[this.getMapperTable.right_table_object][this.getMapperTable.right_table_field_name];

          newObj[this.pivotTable.n_object] = {};
          newObj[this.pivotTable.n_object][this.pivotTable.n_field_name] = i[this.pivotTable.n_object][this.pivotTable.n_field_name];

          return newObj;
        })[0])
          .then(({data}) => {
            this.pivotTableData = this.pivotTableData.filter(i => {
              return (!((i[this.getMapperTable.right_table_object][this.getMapperTable.right_table_field_name] == mapId) && (i[this.pivotTable.n_object][this.pivotTable.n_field_name] == nTableId)));
            });

            this.feedback(1, this._XisT('table_name_singular.' + this.pivotTable.pivot_table_name) + ' ' + this._XisT('word.succesfuly_deleted'));
            this.submiting = false;
          })
          .catch(() => {
            this.feedback(0, this._XisT('word.could_not_deleted') + ' ' + this._XisT('table_name_singular.' + this.pivotTable.pivot_table_name));
            this.submiting = false;
          });
      } else {
        let newObj = {};

        newObj[this.pivotTable.m_object] = {};
        newObj[this.pivotTable.m_object][this.pivotTable.m_field_name] = this.data[this.pivotTable.m_field_name];

        newObj[this.getMapperTable.right_table_object] = {};
        newObj[this.getMapperTable.right_table_object][this.getMapperTable.right_table_field_name] = mapId;

        newObj[this.pivotTable.n_object] = {};
        newObj[this.pivotTable.n_object][this.pivotTable.n_field_name] = nTableId;

        this.insertByTable(this.pivotTable.pivot_table.id, newObj)
          .then( ({data}) => {
            this.pivotTableData.push(newObj);
            this.feedback(1, this._XisT('table_name_singular.' + this.pivotTable.pivot_table_name) + ' ' + this._XisT('word.succesfuly_inserted'));
            this.submiting = false;
          })
          .catch( () => {
            this.feedback(0, this._XisT('word.could_not_insert') + ' ' + this._XisT('table_name_singular.' + this.pivotTable.pivot_table_name));
            this.submiting = false;
          });
      }

    }
  },
  created () {
    this.getPivotData();
    this.getNData();
    this.getMapperData();
  }
}
</script>

<style lang="scss" scoped>
.data-block {
  position: relative;
  display: flex;
  flex-flow: wrap;
  padding: 12px;
  border: 1px solid #ddd;
  border-left: 4px solid #3c8dbc;
  box-shadow: 0 0 14px #ddd;
  background-color: #fff;
  margin-top: 12px;

  &.second-data-block {
    border-right: 4px solid #3c8dbc;
    border-left: none;
  }

  &.no-padding {
    padding: 0;
  }


  &.span-1 { width: calc( ((100% / 24) * 1) - 12px); }
  &.span-2 { width: calc( ((100% / 24) * 2) - 12px); }
  &.span-3 { width: calc( ((100% / 24) * 3) - 12px); }
  &.span-4 { width: calc( ((100% / 24) * 4) - 12px); }
  &.span-5 { width: calc( ((100% / 24) * 5) - 12px); }
  &.span-6 { width: calc( ((100% / 24) * 6) - 12px); }
  &.span-7 { width: calc( ((100% / 24) * 7) - 12px); }
  &.span-8 {
    width: calc( ((100% / 24) * 8) - 12px);
    margin-right: 12px;
    border-color: #0f0;

    &:last-of-type {
      margin-right: 0;
    }
  }
  &.span-9 { width: calc( ((100% / 24) * 9) - 12px); }
  &.span-10 { width: calc( ((100% / 24) * 10) - 12px); }
  &.span-11 { width: calc( ((100% / 24) * 11) - 12px); }
  &.span-12 {
    width: calc( ((100% / 24) * 12) - 12px);
    margin-right: 12px;
    border-color: #e2eef5;

    &:last-of-type {
      margin-right: 0;
    }
  }
  &.span-13 { width: calc( ((100% / 24) * 13) - 12px); }
  &.span-14 { width: calc( ((100% / 24) * 14) - 12px); }
  &.span-15 { width: calc( ((100% / 24) * 15) - 12px); }
  &.span-16 { width: calc( ((100% / 24) * 16) - 12px); }
  &.span-17 { width: calc( ((100% / 24) * 17) - 12px); }
  &.span-18 { width: calc( ((100% / 24) * 18) - 12px); }
  &.span-19 { width: calc( ((100% / 24) * 19) - 12px); }
  &.span-20 { width: calc( ((100% / 24) * 20) - 12px); }
  &.span-21 { width: calc( ((100% / 24) * 21) - 12px); }
  &.span-22 { width: calc( ((100% / 24) * 22) - 12px); }
  &.span-23 { width: calc( ((100% / 24) * 23) - 12px); }
  &.span-24 { width: calc( ((100% / 24) * 24) - 12px); }
}
</style>