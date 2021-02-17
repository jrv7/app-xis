<template>
  <a-form-item :label="_XisT(label)">
    <a-date-picker
      :default-value="value ? moment(value, dateFormat) : null"
      :format="dateFormat"
      @change="onChange"
    />
  </a-form-item>
</template>

<script>
import moment from 'moment';

export default {
  name: 'XisDatepicker',
  props: {
    value: {
      default: null
    },
    fieldId: { type: Number, retuired: true },
    name: { type: String, required: true },
    label: {},
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      monthFormat: 'YYYY-MM',
      dateFormatList: ['DD-MM-YYYY', 'DD-MM-YY'],
    }
  },
  methods: {
    moment,
    onChange (date, dateString) {
      console.log(date, dateString);
    }
  }
}
</script>

<style>

</style>