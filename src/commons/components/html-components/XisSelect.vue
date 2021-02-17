<template>
  <a-form-item :label="_XisT(label)">
    <a-select
      :mode="mode"
      v-model="selected"
      :placeholder="_XisT('Please select')"
      style="width: 100%"
      :size="'large'"
      @change="handleChange"
    >
      <a-select-option
        :value="null"
      >
        {{_XisT('Select...')}}
      </a-select-option>
      <a-select-option
        v-for="(option, index) in selectOptions" :key="'select-' + name + '-option-' + index"
        :value="option.id || option"
      >
        {{useTranslation ? _XisT(option.value || option) : (option.value || option)}}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
export default {
  name: 'XisSelect',
  props: {
    value: {},
    defaultValue: {},
    name: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: 'single'
    },
    options: {
      type: Array,
      default: () => { return [] }
    },
    label: {},
    apiMode: {
      type: Boolean,
      default: false
    },
    apiUrl: {
      type: String,
      required: () => {
        return !!this.apiMode;
      }
    }
  },
  data () {
    return {
      selectOptions: [],
      selected: [],
      useTranslation: false
    }
  },
  methods: {
    handleChange (value) {
      this.$emit('change', this.name, value);
    },
    loadOptions () {
      this.$axios.get(this.apiUrl).then( ({data}) => {
        this.selectOptions = data;

        if (data.length <= 10) {
          this.useTranslation = true;
        }

        if (this.defaultValue) {
          this.selected = JSON.parse(JSON.stringify(this.defaultValue));
        }
      })
    }
  },
  mounted () {
    if (this.mode == 'multiple') {
      this.selected = [];
    } else {
      if (this.value) {
        this.selected = this.value;
      } else {
        this.selected = null;
      }
    }

    if (this.apiMode) {
      this.loadOptions();
    } else {
      this.selectOptions = this.options;
    }
  }
}
</script>

<style lang="scss">


.ant-form-item {
  .ant-select {
    .ant-select-selection {
      // background-color: #0004;
      // border-color: #000a;
      // color: #ccc;
    }
  }
}
</style>