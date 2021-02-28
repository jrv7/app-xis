<template>
  <div id="XisView">
    <a-row :gutter="16">
      <a-col :span="12">
        <div class="data-block main-data-block">
          <xis-view-flex-line :span="24">
            <h4 class="">
              <xis-translator :text="'table_name_singular.' + blueprints.db.name" />
            </h4>
            <a-button
              type="default"
              @click="openEditModal"
            >Editar</a-button>
          </xis-view-flex-line>

          <xis-view-line :span="24"><hr></xis-view-line>

          <xis-view-line
            v-for="field in getMainStringFields" :key="'line-text-' + field.id"
            :span="24"
            :type="field.type.name"
            :label="_XisT(field.table.name + '.' + field.name)"
            :text="getDataValue(field)"
            :highlight="1"
          />

          <xis-view-line
            v-for="field in getMainForeignFields" :key="'line-text-' + field.id"
            :span="12"
            :type="field.type.name"
            :label="_XisT(field.table.name + '.' + field.name)"
            :text="getDataValue(field)"
            :highlight="2"
          />

          <xis-view-line :span="24" /><xis-view-line :span="24" />

          <xis-view-line
            v-for="field in getPrimaryBooleanFields" :key="'line-text-' + field.id"
            :span="4"
            :type="field.type.name"
            :label="_XisT(field.table.name + '.' + field.name)"
            :text="getDataValue(field)"
          />

          <xis-view-line
            v-for="field in getSecondaryBooleanFields" :key="'line-text-' + field.id"
            :span="4"
            :type="field.type.name"
            :label="_XisT(field.table.name + '.' + field.name)"
            :text="getDataValue(field)"
          />

          <xis-view-line :span="24" /><xis-view-line :span="24" />

          <xis-view-line
            v-for="field in getSecondaryStringFields" :key="'line-text-' + field.id"
            :span="8"
            :type="field.type.name"
            :label="_XisT(field.table.name + '.' + field.name)"
            :text="getDataValue(field)"
          />

          <xis-view-line
            v-for="field in getSecondaryNumericFields" :key="'line-text-' + field.id"
            :span="8"
            :type="field.type.name"
            :label="_XisT(field.table.name + '.' + field.name)"
            :text="getDataValue(field)"
          />
        </div>

        <div
          v-for="mmTable in blueprints.db.many_to_many_tables" :key="'m-m-table-block-' + mmTable.n_table.id"
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
            no-borders
            no-headers
          ></xis-list>
        </div>
      </a-col>

      <a-col :span="12">
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

    <xis-modal
      ref="listSingleAddModal"
      :title="'modal_add_new_' + blueprints.db.name"
      @modal-confirmed="confirmModalInsert"
      v-model="showEditModal"
    >
      <xis-form
        ref="XisFormInlineInsert"
        :blueprints="blueprints"
        :show-actions="false"
        :data="data"
        @submiting="$refs.listSingleAddModal.endLoading()"
        @submited="$refs.listSingleAddModal.endLoading(); showEditModal = false"
        @success="onModalEditSuccess"
      ></xis-form>
    </xis-modal>
  </div>
</template>

<script>
import XisViewLine from './view-components/XisViewLine';
import XisViewFlexLine from './view-components/XisViewFlexLine';
import XisList from '@/commons/components/XisList.vue';
import XisModal from '@/commons/components/XisModal';
import XisForm from '@/commons/components/html-components/XisForm';

export default {
  name: 'XisView',
  components: {
    XisViewLine,
    XisViewFlexLine,
    XisList,
    XisModal,
    XisForm,
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
      showEditModal: false,
      showMtoMtables: true
    }
  },
  computed: {
    getMainStringFields () {
      return this.blueprints.db.fields.filter(i => { return ((!!i.not_null) && ( (!!!i.primary_key) || (!!i.editable) ) && (['string', 'md5'].includes(i.type.name))) });
    },
    getMainForeignFields () {
      return this.blueprints.db.fields.filter(i => { return ((!!i.not_null) && ( (!!!i.primary_key) || (!!i.editable) ) && (i.type.name == 'foreign')) });
    },
    getPrimaryBooleanFields () {
      return this.blueprints.db.fields.filter(i => { return ((!!i.not_null) && ( (!!!i.primary_key) || (!!i.editable) ) && (i.type.name == 'boolean')) });
    },
    getSecondaryBooleanFields () {
      return this.blueprints.db.fields.filter(i => { return ((!!!((!!i.not_null) && ( (!!!i.primary_key) || (!!i.editable) ))) && i.type.name == 'boolean') });
    },
    getSecondaryStringFields () {
      return this.blueprints.db.fields.filter(i => { return ((!!!((!!i.not_null) && ( (!!!i.primary_key) || (!!i.editable) ))) && ['string', 'str_fa_icon'].includes(i.type.name)) });
    },
    getSecondaryNumericFields () {
      return this.blueprints.db.fields.filter(i => { return ((!!!i.primary_key) && (!!!((!!i.not_null) && ( (!!!i.primary_key) || (!!i.editable) ))) && ['bigInteger', 'decimal', 'double', 'integer'].includes(i.type.schema_table_type)) });
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
    onModalEditSuccess (data) {
      if (data) {
        this.formData = this.deepClone(data);
      }
    },
    openEditModal () {
      this.showEditModal = true;
    },
    confirmModalInsert () {
      this.$refs.XisFormInlineInsert.submitForm();
    },
    getDataValue (field) {
      if (['foreign'].includes(field.type.name)) {
        if (field.joins.length) {
          if (field.joins[0].model_foreign_function) {
            if (this.formData[field.joins[0].model_foreign_function]) {
              if (field.joins[0].visible_field) {
                if (field.joins[0].visible_field.name) {
                  if (this.formData[field.joins[0].model_foreign_function][field.joins[0].visible_field.name]) {
                    return this.formData[field.joins[0].model_foreign_function][field.joins[0].visible_field.name];
                  }
                }
              }
            }
          }
        }
      } else if (['boolean'].includes(field.type.name)) {
        if (this.formData[field.name]) {
          return 'true';
        } else {
          return 'false';
        }
      }

      return this.formData[field.name];
    }
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
  .data-block {
    position: relative;
    display: flex;
    flex-flow: wrap;
    padding: 12px;
    border: 1px solid #ddd;
    border-left: 4px solid #3c8dbc;
    box-shadow: 0 0 14px #ddd;
    background-color: #fff;

    &.second-data-block {
      border-top: 4px solid #3c8dbc;
      border-left: none;
      margin-top: 12px;
    }

    &.no-padding {
      padding: 0;
    }
  }

  h4.view-title {
    width: 100%;
    // border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
}
</style>