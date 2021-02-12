<template>
  <div id="app">
    <router-view/>
    <!-- <font-awesome-icon :icon="['far', action.fa_icon]" /> -->
  </div>
</template>

<script>
export default {
  name: 'Xis'
}
</script>
<style lang="scss">


.no-outline {
    outline: none;
    box-shadow: none;

    &:active, 
    &:hover, 
    &:link,
    &:focus {
        box-shadow: none;
    }
}
</style>
