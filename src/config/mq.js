import Vue from "vue";
import VueMQ from "vue-mq";

Vue.use(VueMQ, {
  breakpoints: {
    xxs: 320,
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: Infinity
  }
});