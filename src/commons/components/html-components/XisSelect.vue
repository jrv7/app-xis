<template>
  <a-form-item>
    <xis-translator :text="label" />
    <a-select
      v-if="form"
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
      :virtual="false"
      :defaultActiveFirstOption="false"
      :autoClearSearchValue="false"
      @change="handleChange"
    >
      <a-select-option
        :value="0"
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

    <a-select
      v-else
      :mode="mode"
      v-model="selected"
      :placeholder="_XisT('Please select')"
      style="width: 100%"
      :size="'large'"
      :virtual="false"
      :defaultActiveFirstOption="false"
      :autoClearSearchValue="false"
      @change="handleChange"
    >
      <a-select-option
        :value="0"
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
    form: {},
    value: {},
    defaultValue: {},
    name: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: null
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
      type: String
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

</style>