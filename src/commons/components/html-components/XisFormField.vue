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
        v-model="data[field.name]"
        :apiMode="true"
        :disabled="!!field.primary_key"
        :apiUrl="`/data/get-as-option/${joined.right_field.table.id}/${joined.visible_field.id}`"
        :readonly="readonly"
      ></xis-select>
    </div>

    <xis-select
      v-else-if="[18].includes(field.type.id)"
      :name="field.name"
      :placeholder="field.name"
      :label="`${field.table.name}.${field.name}`"
      v-model="data[field.name]"
      :options="JSON.parse(field.default_value)"
      :readonly="readonly"
    ></xis-select>

    <xis-boolean
      v-else-if="[8].includes(field.type.id)"
      v-model="data[field.name]"
      :fieldId="field.id"
      :name="field.name"
      :label="`${field.table.name}.${field.name}`"
      :hasIrrelevant="false"
      :readonly="readonly"
    ></xis-boolean>

    <xis-date-time
      v-else-if="[12, 13, 19, 21].includes(field.type.id)"
      v-model="data[field.name]"
      :fieldId="field.id"
      :name="field.name"
      :label="`${field.table.name}.${field.name}`"
      :readonly="readonly"
    ></xis-date-time>

    <xis-input
      v-else
      :name="field.name"
      :placeholder="field.name"
      :label="`${field.table.name}.${field.name}`"
      v-model="data[field.name]"
      :disabled="!!field.primary_key"
      :readonly="readonly"
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
    field: { type: Object, required: true },
    data: { type: Object, default: () => { return {} }},
    readonly: { type: Boolean, default: false }
  },
  data () {
    return {

    }
  },
  mounted () {
    // if (this.field.type.id == 10) {
      // console.log('Campo montado: ');
      // console.log(this.field);
    // }
  }
}
</script>

<style>

</style>