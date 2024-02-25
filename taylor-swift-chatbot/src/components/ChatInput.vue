<template>
  <div class="chat-input">
    <input
      type="text"
      v-model="message"
      @keyup.enter="sendMessage"
      placeholder="Type your message..."
    />
  </div>
</template>

<script>
// import { invokeRetrievalChain } from "../helpers/tsChatbotIntegrated";

export default {
  data() {
    return {
      message: "",
      openai_api_key: process.env.VUE_APP_OPENAI_API_KEY,
    };
  },
  methods: {
    // invokeRetrievalChain,
    sendMessage() {
      if (this.message.trim() !== "") {
        console.log("message", this.message);
        this.$store.commit("addMessage", this.message);
        this.$store.commit("receiveBotResponse", "You are right");
        this.message = "";
      }
    },
    // async submitUserInput(input) {
    //   const result = await invokeRetrievalChain(input);
    //   console.log("result.answer", result.answer);
    // },
  },
};
</script>

<style scoped>
.chat-input {
  padding: 10px;
}

.chat-input input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
