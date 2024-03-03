<template>
  <div class="chat-messages">
    <div
      v-for="(message, index) in messages"
      :key="index"
      :class="{
        'user-message': message.fromUser,
        'bot-message': !message.fromUser,
      }"
    >
      {{ message.text }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["messages"],
};
</script>

<style scoped>
.chat-messages {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.user-message,
.bot-message {
  width: fit-content;
  max-width: 60%;
  border-radius: 5px;
  font-weight: bold;
}

.user-message {
  background-color: #c6e6f8;
  margin-bottom: 5px;
  padding: 5px;
  align-self: flex-end;
}

.bot-message {
  background-color: #e6e6e6;
  margin-bottom: 5px;
  padding: 5px;
  align-self: flex-start;
}
</style>
