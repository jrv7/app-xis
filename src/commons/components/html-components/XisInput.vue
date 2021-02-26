<template>
  <a-form-item
    :class="{'is-hidden': (!!isHidden)}"
  >
    <xis-translator
      v-show="(label != null) && (!!!isHidden)"
      :text="label"
    />
    <a-input
      v-if="form"
      v-decorator="getDecorations"
      :placeholder="_XisT(placeholder)"
      :type="getTypeByOption"
      :size="'large'"
      :disabled="disabled && (!!!isHidden)"
    />
    <a-input
      v-else
      :placeholder="_XisT(placeholder)"
      :type="getTypeByOption"
      :size="'large'"
      :disabled="(disabled || readonly) && (!!!isHidden)"
      :class="{'is-readonly': readonly}"
      v-model="inputValue"
    >
      <a-select
        v-if="selectOption.length"
        slot="addonBefore"
        v-decorator="['prefix', { initialValue: '86' }]"
        style="min-width: 120px"
        :default-value="selectTarget.id"
        @change="onSelectChange"
      >
        <a-select-option :value="0">{{_XisT('Choose...')}}</a-select-option>
        <a-select-option
          v-for="option in selectOption" :key="'input-' + name + '-inner-select-option-' + option"
          :value="option.id"
        >
          {{_XisT(option.value)}}
        </a-select-option>
      </a-select>

      <a-button 
        slot="addonAfter"
        type="link"
        size="small"
        v-if="actionButton"
        @click="actionButton(actionButtonUniqueId)"
      >
        {{actionButtonIcon}}
      </a-button>
    </a-input>
  </a-form-item>
</template>

<script>
export default {
  name: 'XisInput',
  props: {
    form: {},
    value: {},
    name: { type: String, required: true },
    label: {},
    selectOption: { type: Array, default: () => { return [] } },
    type: { type: String, default: 'text' },
    placeholder: {},
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    'is-email': { type: Boolean, default: false },
    'is-hidden': { type: Boolean, default: false },
    'is-password': { type: Boolean, default: false },
    'compareTo': { type: String, default: null },
    'select-target': {},
    'action-button': {},
    'action-button-icon': { type: String, default: '+' },
    'action-button-unique-id': {}
  },
  data () {
    return {
      inputValue: null,
      selectedOption: null,
      afterMount: false
    }
  },
  watch: {
    inputValue (newValue) {
      if (this.afterMount) {
        if (this.selectOption.length) {
          if (this.selectedOption && newValue) {
            this.$emit('select-changed', this.actionButtonUniqueId, {id: this.selectedOption, value: newValue});
          }
        } else {
          this.$emit('input', newValue);
        }
      }
    },
    selectedOption (newValue) {
      if (newValue) {
        this.$emit('select-changed', this.actionButtonUniqueId, {id: newValue, value: this.inputValue});
      }
    }
  },
  computed: {
    getDecorations () {
      if (this.form) {
        return [
          this.name,
          {
            rules: this.validationRules,
            initialValue: this.value
          }
        ];
      } else {
        return null;
      }
    },
    validationRules () {
      let rules = [];

      if (this.required) {
        rules.push({ required: true, message: this._XisT('Required.field') });
      }

      if (this.isEmail) {
        rules.push({ type: 'email', message: this._XisT('error_message_invalid_email') });
      }

      if (this.isPassword) {
        rules.push({
          validator: this.validateToNextPassword,
        })
      }

      if (this.compareTo) {
        rules.push({
          validator: this.compareToFirstPassword,
        })
      }

      return rules;
    },
    getTypeByOption () {
      let vm = this;
      if (this.isHidden) {
        return 'hidden';
      }
      if (vm.selectOption.length) {
        let seletedTypeIndex = vm.selectOption.findIndex(i => { return (parseInt(i.id) == parseInt(vm.selectedOption)) });
        if (seletedTypeIndex >= 0) {
          if (vm.selectOption[seletedTypeIndex].type) {
            if (vm.selectOption[seletedTypeIndex].type.is_numeric) {
              return 'number';
            } else {
              return 'text';
            }
          }
        }
      }

      return vm.type;
    }
  },
  methods: {
    validateToNextPassword(rule, value, callback) {
      const form = this.form;

      form.validateFields(['confirm_' + this.name], { force: true });

      if (value) {
        form.validateFields(['confirm_' + this.name], { force: true });
      }
      callback();
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;

      if (value !== form.getFieldValue(this.compareTo)) {
        callback(this._XisT('error_message_password_confirrmation_missmatch'));
      } else {
        callback();
      }
    },
    onSelectChange (value) {
      this.selectedOption = value;
    }
  },
  mounted () {
    if (this.selectOption.length) {
      this.inputValue = this.selectTarget.value;
    } else {
      this.inputValue = this.value;
    }

    setTimeout(() => {
      this.afterMount = true;
    }, 200)
  }
}
</script>

<style lang="scss">
.ant-form-item-label {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 24px;
}

.no-bottom-margin {
  margin-bottom: 0 !important;
}

.ant-form-item {
  input {
    // background-color: #0004;
    // border-color: #000a;
  }
}

.is-hidden {
  margin-bottom: 0;
}

.is-readonly {
  background-color: #fff !important;
  color: #999 !important;
}
</style>