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
export default {
  data() {
    return {
      message: "",
      // openai_api_key: process.env.VUE_APP_OPENAI_API_KEY,
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
  padding: 20px 10px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  position: sticky;
  bottom: 0;
}

.chat-input input {
  width: 100%;
  padding: 10px;
  border: 1px solid white;
  border-radius: 5px;
}
</style>
