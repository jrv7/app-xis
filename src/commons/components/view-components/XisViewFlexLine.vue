<template>
    <div
      class="xis-view-flex-line"
      :class="{
        'span-1': (span == 1),
        'span-2': (span == 2),
        'span-3': (span == 3),
        'span-4': (span == 4),
        'span-5': (span == 5),
        'span-6': (span == 6),
        'span-7': (span == 7),
        'span-8': (span == 8),
        'span-9': (span == 9),
        'span-10': (span == 10),
        'span-11': (span == 11),
        'span-12': (span == 12),
        'span-13': (span == 13),
        'span-14': (span == 14),
        'span-15': (span == 15),
        'span-16': (span == 16),
        'span-17': (span == 17),
        'span-18': (span == 18),
        'span-19': (span == 19),
        'span-20': (span == 20),
        'span-21': (span == 21),
        'span-22': (span == 22),
        'span-23': (span == 23),
        'span-24': (span == 24)
      }"
    >
        <slot/>
    </div>
</template>

<script>
export default {
  name: 'XisViewLine',
  props: {
    span: {
      type: Number,
      default: 24
    },
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
.xis-view-flex-line {
  position: relative;
  display: flex;
  flex-flow: nowrap;
  justify-content: flex-end;
  justify-content: space-between;
  width: calc(50% - 12px);
  overflow: hidden;
  z-index: 1;

  &>* {
      margin: auto 0;
  }

  &.span-1 { width: calc( ((100% / 24) * 1) - 12px); }
  &.span-2 { width: calc( ((100% / 24) * 2) - 12px); }
  &.span-3 { width: calc( ((100% / 24) * 3) - 12px); }
  &.span-4 { width: calc( ((100% / 24) * 4) - 12px); }
  &.span-5 { width: calc( ((100% / 24) * 5) - 12px); }
  &.span-6 { width: calc( ((100% / 24) * 6) - 12px); }
  &.span-7 { width: calc( ((100% / 24) * 7) - 12px); }
  &.span-8 { width: calc( ((100% / 24) * 8) - 12px); }
  &.span-9 { width: calc( ((100% / 24) * 9) - 12px); }
  &.span-10 { width: calc( ((100% / 24) * 10) - 12px); }
  &.span-11 { width: calc( ((100% / 24) * 11) - 12px); }
  &.span-12 { width: calc( ((100% / 24) * 12) - 12px); }
  &.span-13 { width: calc( ((100% / 24) * 13) - 12px); }
  &.span-14 { width: calc( ((100% / 24) * 14) - 12px); }
  &.span-15 { width: calc( ((100% / 24) * 15) - 12px); }
  &.span-16 { width: calc( ((100% / 24) * 16) - 12px); }
  &.span-17 { width: calc( ((100% / 24) * 17) - 12px); }
  &.span-18 { width: calc( ((100% / 24) * 18) - 12px); }
  &.span-19 { width: calc( ((100% / 24) * 19) - 12px); }
  &.span-20 { width: calc( ((100% / 24) * 20) - 12px); }
  &.span-21 { width: calc( ((100% / 24) * 21) - 12px); }
  &.span-22 { width: calc( ((100% / 24) * 22) - 12px); }
  &.span-23 { width: calc( ((100% / 24) * 23) - 12px); }
  &.span-24 { width: calc( ((100% / 24) * 24) - 12px); }
}
</style>