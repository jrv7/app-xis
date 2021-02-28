<template>
  <a-form
    :form="form"
    :layout="layout"
    class="xis-form"
    :style="{'width': '100%'}"
  >
    <slot name="header">
      <h4 class="form-title">
        <xis-translator :text="title" />
      </h4>
    </slot>
    <hr>
    <a-alert
      v-for="(message, index) in formErrorMessages" :key="'form-error-message-' + index"
      :message="_XisT('form_field_error_' + message.field)"
      :description="_XisT(message.error)"
      type="error"
      closable
      :style="{'margin-bottom': '12px'}"
    />


    <xis-form-field
      v-for="(keyField, index) in keyFields" :key="'form-key-field-' + (index)"
      :form="form"
      :formLayout="layout"
      :field="keyField"
      :data="formData"
      v-model="formData[keyField.name]"
    ></xis-form-field>
    
    <div
      v-for="(field, index) in editableFields" :key="'field-block-' + (index)"
    >
      <xis-form-field
        :form="form"
        :field="field"
        :data="formData"
        v-model="formData[field.name]"
        :disbaled="submiting || isSubmiting"
        :required="(!!field.primary_key) || (!!field.not_null)"
        :showConditionalFields="!!!hasPrimaryKeyValues"
      ></xis-form-field>
    </div>

    <slot />

    <hr>

    <div class="buttons-container" v-if="showActions">
      <a-button
        type="default"
        :disabled="submiting || isSubmiting"
        v-if="showCancel"
      >
        <xis-translator :text="'Cancel'"/>
      </a-button>
      <span v-else />

      <a-button
        v-if="showOk"
        type="primary"
        :loading="submiting || isSubmiting"
        @click="submitForm"
      >
        <span><xis-translator :text="'Save'"/></span>
      </a-button>
    </div>
  </a-form>
</template>

<script>
import XisFormField from '@/commons/components/html-components/XisFormField.vue';

export default {
  name: 'XisForm',
  components: { XisFormField },
  props: {
    blueprints: {
      type: Object,
      default: null
    },
    data: {
      type: Object
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    showOk: {
      type: Boolean,
      default: true
    },
    showActions: {
      type: Boolean,
      default: true
    },
    canSubmit: {
      type: Boolean,
      default: true
    },
    layout: { type: String, default: 'horizontal' },
    title: { type: String, default: 'word.default_form_title' },
    'is-submiting': { type: Boolean, default: false }
  },
  data () {
    return {
      submiting: false,
      formData: {
        name: null
      },
      form: this.$form.createForm(this, { name: 'default_form' }),
      formErrorMessages: []
    }
  },
  watch: {
    data (newValue) {
      this.formData = this.deepClone(newValue);
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
          } else {
            // hasValues = false;
          }
        } else {
          // hasValues = false;
        }
      } else {
        // hasValues = false;
      }

      return hasValues;
    },
    keyFields () {
      if (this.blueprints) {
        if (this.blueprints.db) {
          if (this.blueprints.db.fields.length) {
            return this.blueprints.db.fields.filter(i => { return ((!!i.primary_key) && (!!!i.editable)) });
          }
        }
      }

      return [];
    },
    editableFields () {
      if (this.blueprints) {
        if (this.blueprints.db) {
          if (this.blueprints.db.fields.length) {
            return this.blueprints.db.fields.filter(i => { return (!!i.editable) });
          }
        }
      }

      return [];
    },
    hasPrimaryKeyData () {
      let hasKeyData = true;
      if (this.formData) {
        this.keyFields.forEach(i => {
          if (!!!this.formData[i.name]) {
            hasKeyData = false;
          }
        })
      } else {
        hasKeyData = false;
      }

      return hasKeyData;
    }
  },
  methods: {
    submitForm () {
      this.form.validateFields(err => {
        if (!err) {
          if (this.canSubmit) {
            this.submiting = true;
            this.$emit('submiting', null);

            if (!this.blueprints) return false;

            const hide = this.$message.loading('Action in progress..', 0);

            let _method = (this.hasPrimaryKeyData ? 'put' : 'post');

            this.$axios({
              method: _method,
              url: `/data/form/${this.blueprints.db.id}`,
              data: this.form.getFieldsValue()
            })
              .then(({data}) => {
                this.formData = this.deepClone(data);
                this.submiting = false;
                setTimeout(hide, 200);
                this.feedback(1, 'Dados ' + (_method == 'post' ? 'inseridos' : 'atualizados') + ' com sucesso!');
                this.$emit('submited');
                this.$emit('success', data);
              })
              .catch(({response}) => {
                Object.entries(response.data.errors).forEach(i => {
                  if (i[0]) {
                    if (response.data.errors[i[0]]) {
                      response.data.errors[i[0]].forEach(j => {
                        this.formErrorMessages.push(
                          {
                            field: i[0],
                            error: j
                          }
                        );
                      });
                    }
                  }
                });
                setTimeout(hide, 200);
                this.feedback(0, 'Falha ao executar ' + (_method == 'post' ? 'inserção' : 'atualização'));
                this.submiting = false;
                this.$emit('submited');
                this.$emit('error');
              });
          } else {
            this.$emit('submiting', this.form.getFieldsValue());
          }
        }
      });
    }
  },
  created () {
    if (this.data) {
      this.formData = this.deepClone(this.data);
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">
.xis-form {
  position: relative;
  padding: 12px;
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  box-shadow: 0 0 13px #aaa6;

  .form-title {
    font-size: 1.2rem;
  }
}

.buttons-container {
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>