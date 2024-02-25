import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      messages: [],
    };
  },
  mutations: {
    addMessage(state, message) {
      state.messages.push({ text: message, fromUser: true });
      // You can add logic here to handle bot's response
    },
    receiveBotResponse(state, botResponse) {
      state.messages.push({ text: botResponse, fromUser: false });
    },
  },
});

export default store;

// import Vue from "vue";
// import Vuex from "vuex";

// Vue.use(Vuex);

// export default new Vuex.Store({
//   state: {
//     messages: [],
//   },
//   mutations: {
//     addMessage(state, message) {
//       state.messages.push({ text: message, fromUser: true });
//       // add logic here to handle bot's response
//     },
//   },
// });
// store/index.js

// import Vue from 'vue';
// import Vuex from 'vuex';

// Vue.use(Vuex);

// export default new Vuex.Store({
//   state: {
//     messages: [] // Initial state for chat messages
//   },
//   mutations: {
//     addMessage(state, message) {
//       state.messages.push({ text: message, fromUser: true });
//       // You can add logic here to handle bot's response
//     }
//   },
//   actions: {
//     // If you need asynchronous logic, it can be placed here
//   },
//   getters: {
//     // If you need to compute derived state based on store state, it can be defined here
//   },
//   modules: {
//     // If your application grows and you need to split your store into multiple modules, they can be defined here
//   }
// });
