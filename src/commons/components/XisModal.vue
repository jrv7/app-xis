<template>
  <a-modal
    class="ant-modal-full-right"
    :title="title"
    :width="width + 'vw'"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
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
      confirmLoading: false
    }
  },
  watch: {
    'value' (newValue) {
      this.visible = newValue;
    },
    visible (newValue) {
      this.$emit('input', newValue);
    }
  },
  methods: {
    handleOk(e) {
      this.confirmLoading = true;
      this.$emit('go-for-ok');
    },
    handleCancel(e) {
      this.visible = false;
      this.$emit('go-for-cancel', this.visible);
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