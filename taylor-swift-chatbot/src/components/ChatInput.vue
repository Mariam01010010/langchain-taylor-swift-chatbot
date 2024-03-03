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
import { backendUrl } from "@/config.js";

export default {
  data() {
    return {
      message: "",
      backendUrl,
      messageHistory: this.$store.state.messages,
    };
  },
  methods: {
    async sendMessage() {
      if (this.message.trim() !== "") {
        this.$store.commit("addMessage", this.message);
        try {
          const response = await fetch(`${backendUrl}/message`, {
            // Use the backendUrl variable
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: this.message.trim(),
              messageHistory: this.messageHistory,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to send message to backend");
          }

          const responseData = await response.json();
          console.log("Backend response:", responseData);
          this.$store.commit("receiveBotResponse", responseData.botMessage);
        } catch (error) {
          console.error("Error sending message to backend:", error);
          // Handle error if needed
        }
        // Clear the input field
        this.message = "";
      }
    },
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
  width: 80%;
  padding: 10px;
  border: 1px solid white;
  border-radius: 5px;
}
</style>
