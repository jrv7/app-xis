<template>
  <div
    class="xis-form-field"
  >
    <div
      v-if="[10].includes(field.type.id)"
    >
      <xis-select
        v-for="(joined, index) in field.joins" :key="'form-field-type-foreign-' + field.id + '-' + index"
        :form="form"
        :formLayout="formLayout"
        :name="field.name"
        :placeholder="field.name"
        :label="`${field.table.name}.${field.name}`"
        v-model="currentValue"
        :apiMode="true"
        :disabled="((!!field.primary_key) && (!!!field.editable)) || disbaled"
        :apiUrl="`/data/get-as-option/${joined.right_field.table.id}/${joined.visible_field.id}`"
        :readonly="readonly"
        :required="required"
      ></xis-select>
    </div>

    <xis-select
      v-else-if="[18].includes(field.type.id)"
      :form="form"
      :formLayout="formLayout"
      :name="field.name"
      :placeholder="field.name"
      :label="`${field.table.name}.${field.name}`"
      v-model="currentValue"
      :options="JSON.parse(field.default_value)"
      :readonly="readonly"
      :disabled="((!!field.primary_key) && (!!!field.editable)) || disbaled"
      :required="required"
    ></xis-select>

    <xis-boolean
      v-else-if="[8].includes(field.type.id)"
      :form="form"
      :formLayout="formLayout"
      v-model="currentValue"
      :fieldId="field.id"
      :name="field.name"
      :label="`${field.table.name}.${field.name}`"
      :hasIrrelevant="false"
      :readonly="readonly"
      :disabled="disbaled"
      :required="required"
    ></xis-boolean>

    <xis-date-time
      v-else-if="[12, 13, 19, 21].includes(field.type.id)"
      :form="form"
      :formLayout="formLayout"
      v-model="currentValue"
      :fieldId="field.id"
      :name="field.name"
      :label="`${field.table.name}.${field.name}`"
      :readonly="readonly"
      :disabled="disbaled"
      :required="required"
    ></xis-date-time>

    <div
      v-else-if="[14].includes(field.type.id)"
    >
      <a-button
        v-if="!!!displayFields"
        type="default"
        @click="showFields"
      >
        <xis-translator :text="'Change password'" />
      </a-button>
      <xis-input
        type="password"
        v-if="!!displayFields"
        :form="form"
        :formLayout="formLayout"
        :name="field.name"
        :placeholder="field.name"
        :label="`${field.table.name}.${field.name}`"
        v-model="currentValue"
        :disabled="(!!field.primary_key) || disbaled"
        :readonly="readonly"
        :isPassword="true"
      ></xis-input>
      <xis-input
        type="password"
        v-if="!!displayFields"
        :form="form"
        :formLayout="formLayout"
        :name="'confirm_' + field.name"
        :placeholder="_XisT('Confirm') + ' ' + field.name"
        :label="null"
        :disabled="(!!field.primary_key) || disbaled"
        :readonly="readonly"
        :compareTo="field.name"
      ></xis-input>
    </div>

    <xis-input
      v-else
      :form="form"
      :formLayout="formLayout"
      :name="field.name"
      :placeholder="field.name"
      :label="`${field.table.name}.${field.name}`"
      v-model="currentValue"
      :disabled="((!!field.primary_key) && (!!!field.editable)) || disbaled"
      :readonly="readonly"
      :required="required"
      :isHidden="(!!field.primary_key)"
    ></xis-input>
  </div>
</template>

<script>
import XisInput from '@/commons/components/html-components/XisInput.vue';
import XisSelect from '@/commons/components/html-components/XisSelect.vue';
import XisBoolean from '@/commons/components/html-components/XisBoolean.vue';
import XisDateTime from '@/commons/components/html-components/XisDateTime.vue';

export default {
  name: 'XisFormField',
  components: { XisInput, XisSelect, XisBoolean, XisDateTime },
  props: {
    form: {},
    value: {},
    field: { type: Object, required: true },
    data: { type: Object, default: () => { return {} }},
    readonly: { type: Boolean, default: false },
    disbaled: { type: Boolean, default: false },
    required: { type: Boolean, defatul: false },
    showConditionalFields: { type: Boolean, defatul: false },
    formLayout: { type: String, default: 'horizontal' },
  },
  data () {
    return {
      currentValue: null,
      afterMounted: false,
      displayFields: false
    }
  },
  watch: {
    value (newValue) {
      this.currentValue = newValue;
    },
    currentValue (newValue) {
      if (this.afterMounted) {
        this.$emit('input', newValue);
      }
    }
  },
  methods: {
    showFields () {
      this.displayFields = true;
    }
  },
  created () {
    if (this.value) {
      this.currentValue = this.value;
    }

    this.displayFields = this.showConditionalFields;

    setTimeout(() => {
      this.afterMounted = true;
    }, 200)
  }
}
</script>

<style>

</style>