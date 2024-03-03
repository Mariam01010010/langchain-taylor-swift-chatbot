<template>
  <ChatContainer />
</template>

<script>
import ChatContainer from "./components/ChatContainer.vue";
import store from "./store/store.js";

export default {
  name: "App",
  components: {
    ChatContainer,
  },
  data() {
    return {
      // articles: articles,
    };
  },
  store,
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  height: 100%;
}

body {
  height: calc(100vh - 75px);
  background-image: url("./assets/lover-album-cover.png");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
