// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

// main.js or App.vue

// import Vue from "vue";
// import App from "./App.vue";
// import store from "./store/store";

// Vue.config.productionTip = false;

// new Vue({
//   render: (h) => h(App),
//   store,
// }).$mount("#app");

import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/store";

createApp(App).use(store).mount("#app");
