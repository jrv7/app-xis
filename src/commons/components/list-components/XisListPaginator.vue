<template>
  <div id="XisListPaginator">
    <a-pagination
      :default-current="current"
      :total="totalResults"
      :page-size="pageSize"
      @change="pageChanged"
    />
    <a-select
      v-model="currentPageSize"
      style="width: 120px; margin-left: 12px"
    >
      <a-select-option
        v-for="size in [10, 20, 30, 50, 100]" :key="'list-pagination-size-selectot-option' + size"
        :value="size"
      >
        {{size}}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
export default {
  name: 'XisListPaginator',
  props: {
    current: {
      type: Number,
      defauilt: 1
    },
    totalResults: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    showSizeChanger: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentPageSize: 20
    }
  },
  watch: {
    currentPageSize (newValue, oldValue) {
      this.$emit('page-size-changed', this.current, newValue);
    }
  },
  methods: {
    pageChanged (currentPage) {
      this.$emit('page-changed', currentPage);
    },
  },
  created () {
    if (this.pageSize) {
      this.currentPageSize = this.deepClone(this.pageSize);
    }
  }
}
</script>

<style lang="scss">
  #XisListPaginator {
    position: relative;
    display: flex;
    margin-left: auto;
  }
</style>