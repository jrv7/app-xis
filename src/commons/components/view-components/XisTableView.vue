<template>
  <a-col :span="12">
    <div class="data-block main-data-block">
      <xis-view-flex-line :span="24">
        <h4 class="">
          <xis-translator :text="'table_name_singular.' + blueprints.db.name" />
        </h4>
        <a-button
          v-if="checkPermission(blueprints.db.userPermissions, 'create')"
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

    <xis-modal
      ref="listSingleAddModal"
      :title="'modal_edit_' + blueprints.db.name"
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
  </a-col>
</template>

<script>
import XisViewLine from './XisViewLine';
import XisViewFlexLine from './XisViewFlexLine';
import XisModal from '@/commons/components/XisModal';
import XisForm from '@/commons/components/html-components/XisForm';

export default {
  name: 'XisTableView',
  components: {
    XisViewLine,
    XisViewFlexLine,
    XisModal,
    XisForm
  },
  props: {
    blueprints: {},
    data: {}
  },
  data () {
    return {
      showEditModal: false,
    }
  },
  computed: {
    getMainStringFields () {
      return this.blueprints.db.fields.filter(i => { return ((!!i.not_null) && (i.fillable) && ( (!!!i.primary_key) || (!!i.editable) ) && (['string', 'md5'].includes(i.type.name))) });
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
            if (this.data[field.joins[0].model_foreign_function]) {
              if (field.joins[0].visible_field) {
                if (field.joins[0].visible_field.name) {
                  if (this.data[field.joins[0].model_foreign_function][field.joins[0].visible_field.name]) {
                    return this.data[field.joins[0].model_foreign_function][field.joins[0].visible_field.name];
                  }
                }
              }
            }
          }
        }
      } else if (['boolean'].includes(field.type.name)) {
        if (this.data[field.name]) {
          return 'true';
        } else {
          return 'false';
        }
      }

      return this.data[field.name];
    }
  },
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
  background-color: #fff;
  // box-shadow: 0 0 14px #ddd;
  box-shadow: 0px 9.07207px 27.2162px rgba(129, 147, 171, 0.2);

  &.second-data-block {
    border-right: 4px solid #3c8dbc;
    border-left: none;
    // margin-top: 12px;
  }

  &.no-padding {
    padding: 0;
  }
}
</style>