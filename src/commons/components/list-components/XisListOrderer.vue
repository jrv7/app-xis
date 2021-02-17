<template>
  <a-select
    v-model="selectedOrder"
    @change="changeOrder"
    size="small"
    class="order-select no-border"
  >
    <a-select-option
      v-for="option in options" :key="'xis-list-order-option-' + option.value"
      :value="option.value"
    >
      <font-awesome-icon :icon="option.icon" /> <slot/>
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'XisListOrderer',
  props: {
    fieldId: {
      type: Number,
      required: true
    },
    options: {
      type: Array,
      default: () => {
        return [
          {
            value: 0,
            icon: ['fas', 'sort']
          },
          {
            value: 1,
            icon: ['fas', 'sort-amount-down-alt']
          },
          {
            value: 2,
            icon: ['fas', 'sort-amount-down']
          },
        ]
      }
    }
  },
  data () {
    return {
      selectedOrder: 0
    }
  },
  methods: {
    changeOrder (order) {
      let vm = this;
      vm.$store.commit('setListOrder', {submenuId: vm.$route.params.submenuId, fieldId: vm.fieldId, order: order});
      setTimeout(() => {
        vm.$emit('ordered')
      }, 800)
    }
  },
  mounted () {
    let setOrders = this.$store.getters.getListOrders;

    if (setOrders) {
      let findIndex = setOrders.findIndex(i => { return (i.fieldId == this.fieldId) });
  
      if (findIndex >= 0) {
        this.selectedOrder = setOrders[findIndex].order;
      }
    }
  }
}
</script>

<style lang="scss">
  .no-border {
    border: none !important;
    box-shadow: none;

    &>.ant-select-selection {
      border: none !important;
      box-shadow: none;
    }
  }
</style>