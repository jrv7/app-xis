<template>
  <a-form-item>
    <xis-translator :text="label" />
    <a-radio-group
      v-model="selected"
      @change="onChange"
      :disabled="readonly"
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
    value: {
      default: null
    },
    fieldId: { type: Number, retuired: true },
    name: { type: String, required: true },
    label: {},
    hasIrrelevant: { type: Boolean, default: true },
    readonly: { type: Boolean, default: false }
  },
  data () {
    return {
      selected: null
    }
  },
  watch: {
    defaultValue (newValue) {
      this.selected = newValue;
    }
  },
  methods: {
    onChange(e) {
      this.$emit('changed', this.fieldId, this.selected);
    }
  },
  mounted () {
    this.selected = this.value;
  }
}
</script>

<style>

</style>