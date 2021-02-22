<template>
  <a-form-item>
    <xis-translator :text="label" />
    <a-select
      :mode="mode"
      v-decorator="[
        name,
        {
          rules: validationRules,
          initialValue: selected
        }
      ]"
      :placeholder="_XisT('Please select')"
      style="width: 100%"
      :size="'large'"
      :disabled="disabled"
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
    },
    disabled: { type: Boolean, default: false }
  },
  data () {
    return {
      selectOptions: [],
      selected: null,
      useTranslation: false,
      afterMount: false
    }
  },
  watch: {
    selected (newValue) {
      if (this.afterMount) {
        this.$emit('input', newValue);
      }
    }
  },
  computed: {
    validationRules () {
      let rules = [];

      if (this.required) {
        rules.push({ required: true, message: this._XisT('Required.field') });
      }

      return rules;
    }
  },
  methods: {
    handleChange (value) {
      this.$emit('change', this.name, value);
    },
    loadOptions () {
      console.log('Carregando opcoes');
      console.log(this.$route.params);

      let params = {
        limiters: (this.$route.params.ids ? this.$route.params.ids : null)
      };
      this.$axios.get(this.apiUrl, {
        params: params
      }).then( ({data}) => {
        this.selectOptions = data;

        if (data.length <= 10) {
          this.useTranslation = true;
        }

        if (this.defaultValue) {
          this.selected = JSON.parse(JSON.stringify(this.defaultValue));
        } else if (data.length == 1) {
          this.selected = data[0].id;
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

    this.afterMount = true;

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