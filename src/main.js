// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import antd from 'ant-design-vue';
import axios from 'axios'
import api from './fetch/api'
import store from './vuex/store'
import 'ant-design-vue/dist/antd.css';
import * as staticData from "./staticData/staticData";
import * as utils from "./utils/utils";
import isNum from "isnumber-js";
let dateFormat = require("format-datetime");
Vue.prototype.$staticData = staticData;
Vue.prototype.$api = api;
Vue.prototype.$http = axios;
Vue.prototype.$time = dateFormat;
Vue.prototype.$utils = utils;
Vue.prototype.$isNum = isNum;
Vue.use(antd);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
