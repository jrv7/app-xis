<template>
  <div
    class="xis-form-field"
  >
    <div
      v-if="[10].includes(field.type.id)"
    >
      <xis-select
        v-for="(joined, index) in field.joins" :key="'form-field-type-foreign-' + field.id + '-' + index"
        :name="field.name"
        :placeholder="field.name"
        :label="`${field.table.name}.${field.name}`"
        v-model="currentValue"
        :apiMode="true"
        :disabled="(!!field.primary_key) || disbaled"
        :apiUrl="`/data/get-as-option/${joined.right_field.table.id}/${joined.visible_field.id}`"
        :readonly="readonly"
        :required="required"
      ></xis-select>
    </div>

    <xis-select
      v-else-if="[18].includes(field.type.id)"
      :name="field.name"
      :placeholder="field.name"
      :label="`${field.table.name}.${field.name}`"
      v-model="currentValue"
      :options="JSON.parse(field.default_value)"
      :readonly="readonly"
      :disabled="disbaled"
      :required="required"
    ></xis-select>

    <xis-boolean
      v-else-if="[8].includes(field.type.id)"
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
      <xis-input
        type="password"
        :form="form"
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
        :form="form"
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
      :name="field.name"
      :placeholder="field.name"
      :label="`${field.table.name}.${field.name}`"
      v-model="currentValue"
      :disabled="(!!field.primary_key) || disbaled"
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
    required: { type: Boolean, defatul: false }
  },
  data () {
    return {
      currentValue: null,
      afterMounted: false
    }
  },
  watch: {
    currentValue (newValue) {
      if (this.afterMounted) {
        this.$emit('input', newValue);
      }
    }
  },
  created () {
    if (this.value) {
      this.currentValue = this.value;
    }

    setTimeout(() => {
      this.afterMounted = true;
    }, 200)
  }
}
</script>

<style>

</style>