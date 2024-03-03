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
      // openai_api_key: process.env.VUE_APP_OPENAI_API_KEY,
    };
  },
  methods: {
    // invokeRetrievalChain,
    // sendMessage() {
    //   if (this.message.trim() !== "") {
    //     console.log("message", this.message);
    //     this.$store.commit("addMessage", this.message);
    //     let botResponse = "You are right";
    //     if (this.message === "Who is Taylor Swift?") {
    //       botResponse =
    //         "Taylor Swift is an American singer-songwriter who has had a major influence on the music industry, popular culture, and politics. She is one of the world's best-selling musicians, known for her successful albums and numerous accolades.";
    //     } else if (this.message === "How many songs are on her album Lover?") {
    //       botResponse = `There are a total of 18 songs on Taylor Swift's album "Lover." Some of the notable singles from this album include "Me!", "You Need to Calm Down", "Lover", "The Man", and "Cruel Summer."`;
    //     }
    //     this.$store.commit("receiveBotResponse", botResponse);
    //     this.message = "";
    //   }
    // },
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

          // Clear the input field
          this.message = "";
        } catch (error) {
          console.error("Error sending message to backend:", error);
          // Handle error if needed
        }
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
  width: 80%;
  padding: 10px;
  border: 1px solid white;
  border-radius: 5px;
}
</style>
