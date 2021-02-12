<template>
  <div class="xis-list-actions">
    <button
      class="btn btn-default btn-sm"
      v-for="action in actions" :key="'list-action-' + action.id + '-' + row.id"
    >
      <font-awesome-icon :icon="['far', action.fa_icon]" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'XisListActions',
  props: {
    actions: {
      type: Array,
      default: () => {
        return [];
      }
    },
    row: {
      type: Object,
      default: () => {
        return {
          id: 0
        }
      }
    }
  },
  data () {
    return {

    }
  },
  mounted () {
    // console.log(this.actions);
  }
}
</script>

<style lang="scss">
  .xis-list-actions {
    position: relative;
    display: flex;
    width: 100%;

    &>button {
      opacity: .4;
      transition: all .4s ease-in-out;
      outline: none;

      &:active,
      &:hover, 
      &:link,
      &:visited,
      &:focus {
        box-shadow: none;
      }
    }

    &:hover > button {
      opacity: 1;
    }
  }
</style>