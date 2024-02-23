<template>
  <div class="chat-container">
    <ChatHeader />
    <ChatMessages :messages="messages" />
    <ChatInput @message="addMessage" />
  </div>
</template>

<script>
import ChatHeader from "./ChatHeader.vue";
import ChatMessages from "./ChatMessages.vue";
import ChatInput from "./ChatInput.vue";

export default {
  components: {
    ChatHeader,
    ChatMessages,
    ChatInput,
  },
  data() {
    return {
      messages: [],
    };
  },
  methods: {
    addMessage(message) {
      this.messages.push({ text: message, fromUser: true });
      // implement logic to handle bot's response
    },
  },
};
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100%;
}
</style>
