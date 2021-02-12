<template>
  <a-form-item :label="label">
    <a-select
      :mode="mode"
      v-model="selected"
      :placeholder="_XisT('Please select')"
      style="width: 100%"
      @change="handleChange"
    >
      <a-select-option
        v-for="(option, index) in selectOptions" :key="'select-' + name + '-option-' + index"
        :value="option.id"
      >
        {{option.value}}
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
      selected: []
    }
  },
  methods: {
    handleChange (value) {
      this.$emit('change', this.name, value);
    },
    loadOptions () {
      this.$axios.get(this.apiUrl).then( ({data}) => {
        this.selectOptions = data;
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
      this.selected = null
    }

    if (this.apiMode) {
      this.loadOptions();
    } else {
      this.selectOptions = this.options;
    }
  }
}
</script>

<style>

</style>