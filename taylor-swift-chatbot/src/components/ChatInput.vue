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
    };
  },
  methods: {
    sendMessage() {
      if (this.message.trim() !== "") {
        console.log("message", this.message);
        this.$store.commit("addMessage", this.message);
        this.message = "";
      }
    },
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
