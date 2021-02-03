<template>
  <div id="XisMainNav">
    <div class="breadcrumbs">
      <span>Breadcrumbs</span>
    </div>
    <div class="main-content-container">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'XisMainNav',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
  #XisMainNav {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 180px;
    display: flex;
    flex-flow: wrap;
    flex-direction: column;
    padding: 0;
    
    .breadcrumbs {
      position: relative;
      display: flex;
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      padding: 12px;
      border-bottom: 1px solid #ddd;
      background-color: #fff;
    }

    .main-content-container {
      position: relative;
      display: flex;
      width: 100%;
      padding: 12px;
    }
  }
</style>