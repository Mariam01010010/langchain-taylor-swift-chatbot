<template>
  <div class="chat-container tortured">
    <ChatHeader />
    <ChatMessages :messages="messages" />
    <ChatInput
      @message="
        addMessage;
        receiveBotResponse;
      "
    />
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
      messages: this.$store.state.messages,
    };
  },
  methods: {
    addMessage(message) {
      this.messages.push({ text: message, fromUser: true });
    },
    receiveBotResponse(text) {
      this.messages.push({ text: text, fromUser: false });
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
