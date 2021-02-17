<template>
  <div class="xis-list-actions">
    <router-link
      tag="button"
      class="btn btn-default btn-sm"
      v-for="action in blueprints.db.list_actions" :key="'list-action-' + action.id + '-' + row.id"
      :to="{ name: routeName(action), params: routeParams(action)}"
    >
      <font-awesome-icon :icon="['far', action.fa_icon]" />
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'XisListActions',
  props: {
    blueprints: {
      type: Object,
      required: true
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
  computed: {
  },
  methods: {
    routeParams (action) {
      let params = {};
      let idParams = [];
      let parsedParams = '-';

      this.blueprints.db.primary_keys.forEach(key => {
        idParams.push(String(key.id) + ':' + String(this.row[key.name]) + '-');
      });

      idParams.forEach(i => {
        parsedParams = parsedParams + i;
      });

      params = {
        mainMenuId: this.$route.params.mainMenuId,
        submenuId: action.menu.menu_url_hash,
        ids: parsedParams
      }

      return params;
    },
    routeName (action) {
      return 'default-' + action.menu_crud_action;
    },
    doAction (event) {
      console.log('Doing action');
      let ids = [];

      this.blueprints.db.primary_keys.forEach(key => {
        ids.push(
          {
            target: key.id, 
            value: this.row[key.name]
          }
        );
      });
      
      this.$emit('action-done', ids);
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