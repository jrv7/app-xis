<template>
  <a-form-item :label="_XisT(label)">
    <a-input
      v-decorator=""
      v-model="inputValue"
      :placeholder="placeholder"
      :type="getTypeByOption"
      :size="'large'"
      :disabled="disabled"
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
    value: {},
    name: { type: String, required: true },
    label: {},
    selectOption: { type: Array, default: () => { return [] } },
    type: { type: String, default: 'text' },
    placeholder: {},
    disabled: { type: Boolean, default: false },
    'select-target': {},
    'action-button': {},
    'action-button-icon': { type: String, default: '+' },
    'action-button-unique-id': {}
  },
  data () {
    return {
      inputValue: null,
      selectedOption: null
    }
  },
  watch: {
    inputValue (newValue) {
      if (this.selectOption.length) {
        if (this.selectedOption && newValue) {
          this.$emit('select-changed', this.actionButtonUniqueId, {id: this.selectedOption, value: newValue});
        }
      } else {
        this.$emit('input', newValue);
      }
    },
    selectedOption (newValue) {
      if (newValue) {
        this.$emit('select-changed', this.actionButtonUniqueId, {id: newValue, value: this.inputValue});
      }
    }
  },
  computed: {
    getTypeByOption () {
      let vm = this;
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
</style>