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
    async sendMessage() {
      if (this.message.trim() !== "") {
        try {
          const response = await fetch("/message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: this.message.trim() }),
          });

          if (!response.ok) {
            throw new Error("Failed to send message to backend");
          }

          const responseData = await response.json();
          console.log("Backend response:", responseData);

          // Clear the input field
          this.message = "";
        } catch (error) {
          console.error("Error sending message to backend:", error);
          // Handle error if needed
        }
      }
    },
  },
};
</script>

<style scoped>
.chat-input {
  padding: 10px;
  height: 80%;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.chat-input input {
  width: 100%;
  padding: 10px;
  border: 1px solid white;
  border-radius: 5px;
}
</style>
