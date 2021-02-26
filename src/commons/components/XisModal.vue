<template>
  <a-modal
    class="ant-modal-full-right"
    :width="width + 'vw'"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template slot="title"><xis-translator :text="title" /></template>
    <slot />
  </a-modal>
</template>

<script>
export default {
  name: 'XisModal',
  props: {
    'title': {},
    'value': {},
    width: {
      type: Number,
      default: 28
    }
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      loadingTimer: null
    }
  },
  watch: {
    'value' (newValue) {
      this.visible = newValue;
    },
    visible (newValue) {
      this.$emit('input', newValue);
    },
    confirmLoading (newValue) {
      if (!!!newValue) {
        if (this.loadingTimer != null) {
          clearTimeout(this.loadingTimer);
        }
      } else {
        if (this.loadingTimer != null) {
          clearTimeout(this.loadingTimer);
          this.loadingTimer = setTimeout(() => {
            this.confirmLoading = true;
          }, 10000);
        }
      }
    }
  },
  methods: {
    openModal () {
      this.visible = true;
    },
    startLoading () {
      this.confirmLoading = true;
      this.loadingTimer = setTimeout(() => {
        this.confirmLoading = true;
      }, 10000);
    },
    endLoading () {
      this.confirmLoading = false;
    },
    handleOk(e) {
      this.$emit('modal-confirmed');
    },
    handleCancel(e) {
      this.visible = false;
      this.$emit('modal-canceled', this.visible);
    },
    unsetLoading () {
      this.confirmLoading = false;
    }
  }
}
</script>

<style lang="scss">
.ant-modal-full-right {
  .ant-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 0;
    min-width: 580px;
  
    .ant-modal-content {
      border-radius: 0;
  
      .ant-modal-body {
        height: calc(100vh - 109px);
      }
    }
  }

}
  
.ant-modal-body {
  overflow: auto;
}
</style>