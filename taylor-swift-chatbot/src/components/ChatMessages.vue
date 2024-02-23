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
}

.user-message {
  background-color: #dcf8c6;
  margin-bottom: 5px;
  padding: 5px;
}

.bot-message {
  background-color: #e6e6e6;
  margin-bottom: 5px;
  padding: 5px;
}
</style>
