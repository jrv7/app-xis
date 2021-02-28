<template>
  <a-form-item
    :label-col="formItemLayout.labelCol"
    :wrapper-col="formItemLayout.wrapperCol"
  >
    <template
      slot="label"
      v-if="!!!isHidden"
    >
      {{_XisT(label)}}
    </template>
    <a-radio-group
      v-if="form"
      v-decorator="[
        name,
        {
          rules: [{ required: required, message: _XisT('Required.field') }],
          initialValue: (!!selected)
        },
      ]"
      @change="onChange"
      :disabled="readonly || disabled"
    >
      <a-radio-button
        :value="null"
        v-if="hasIrrelevant"
      >
        Irrelevant
      </a-radio-button>
      <a-radio-button :value="true">
        {{_XisT('Yes')}}
      </a-radio-button>
      <a-radio-button :value="false">
        {{_XisT('No')}}
      </a-radio-button>
    </a-radio-group>

    <a-radio-group
      v-else
      v-model="selected"
      @change="onChange"
      :disabled="readonly || disabled"
    >
      <a-radio-button
        :value="null"
        v-if="hasIrrelevant"
      >
        Irrelevant
      </a-radio-button>
      <a-radio-button :value="true">
        {{_XisT('Yes')}}
      </a-radio-button>
      <a-radio-button :value="false">
        {{_XisT('No')}}
      </a-radio-button>
    </a-radio-group>
  </a-form-item>
</template>

<script>
export default {
  name: 'XisBoolean',
  props: {
    form: {},
    value: {
      default: null
    },
    fieldId: { type: Number, retuired: true },
    name: { type: String, required: true },
    label: {},
    hasIrrelevant: { type: Boolean, default: true },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    formLayout: { type: String, default: 'horizontal' },
    'is-hidden': { type: Boolean, default: false },
  },
  data () {
    return {
      selected: null,
      afterMount: false
    }
  },
  watch: {
    value (newValue) {
      this.selected = ((newValue == null) ? null : (!!newValue));
    },
    defaultValue (newValue) {
      this.selected = newValue;
    },
    selected (newValue) {
      if (this.afterMount) {
        this.$emit('input', newValue);
      }
    }
  },
  computed: {
    formItemLayout() {
      const { formLayout } = this;
      return formLayout === 'horizontal'
        ? {
            labelCol: { span: 7 },
            wrapperCol: { span: 16, offset: 1 },
          }
        : {};
    },
  },
  methods: {
    onChange(e) {
      this.$emit('changed', this.fieldId, this.selected);
    }
  },
  mounted () {
    this.selected = ((this.hasIrrelevant) ? ((this.value == null) ? null : (!!this.value)) : (!!this.value));
    this.afterMount = true;
  }
}
</script>

<style>

</style>