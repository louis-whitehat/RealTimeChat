<template>
  <div class="container">
    <div class="col-lg-6 offset-lg-3">
      <div v-if="ready">
        <p v-for="user in info" :key="user">
          {{ user.username }} {{ user.type }}
        </p>
      </div>
      <div v-if="!ready">
        <h2>🔤️ 🔤️</h2>
        <h1>GIB DEINEN NAMEN EIN</h1>
        <H2>😎️ 😎️ 😎️ 😎️ 😎️ 😎️</H2>
        <form @submit.prevent="addUser">
          <div class="form-group row">
            <input
              type="text"
              class="form-control col-9"
              v-model="username"
              placeholder="🗨️ DEIN NAME 💬️"
            />
            <input
              type="submit"
              value="BEITRETEN"
              class="btn btn-sm btn-info ml-1"
            />
          </div>
        </form>
      </div>
      <h1 class="user" v-else>{{ username }}</h1>
      <div class="card bg-info" v-if="ready">
        <div class="card-header text-white"></div>
        <div class="list-group list-group-flush text-right">
          <small v-if="typing" class="text-white"
            >{{ schreibt }} is typing</small
          >
          <div
            class="list-group-item"
            v-for="message in messages"
            :key="message"
          >
            <span :class="{ 'float-left': message.type === 1 }">
              <small>{{ message.user }}: </small>
              <span class="message">
                {{ message.message }}
              </span>
            </span>
          </div>
        </div>

        <div class="card-body">
          <form @submit.prevent="send">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                v-model="newMessage"
                placeholder="📱️ 💻️ NACHRICHT 💻️ 📱️"
              />
              <h2>😎️ schreibe was 😎️</h2>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

var socket = io("ws://192.168.0.235:3000");

export default {
  name: "App",

  data() {
    return {
      newMessage: null,
      messages: [],
      typing: false,
      username: null,
      ready: false,
      info: [],
      connections: 0,
    };
  },

  created() {
    // Emitting 'leave' event on tab closed event.
    window.onbeforeunload = () => {
      socket.emit("leave", this.username);
    };

    // Listening to chat-message event emitted from the server and pushing to messages array
    socket.on("chat-message", (data) => {
      this.messages.push({
        message: data.message,
        type: 1,
        user: data.user,
      });
    });

    // Listening to typing event emitted from the server and setting the data (username) to the UI
    socket.on("typing", (data) => {
      this.typing = data;
    });

    // Listening to stopTyping event emitted from the server and setting the typing property to false
    socket.on("stopTyping", () => {
      this.typing = false;
    });

    // Listening to 'joined' event emitted from the server and pushing the data to info array
    socket.on("joined", (data) => {
      this.info.push({
        username: data,
        type: "joined",
      });

      // Setting a time out for the info array to be emptied
      setTimeout(() => {
        this.info = [];
      }, 5000);
    });

    // Listening to 'leave' event emitted from the server and pushing the data to info array
    socket.on("leave", (data) => {
      this.info.push({
        username: data,
        type: "left",
      });

      // Setting a time out for the info array to be emptied
      setTimeout(() => {
        this.info = [];
      }, 5000);
    });

    // Listening to 'connections' event emitted from the server to get the total number of connected clients
    socket.on("connections", (data) => {
      this.connections = data;
    });
  },

  // Vue Watch hook
  watch: {
    // Watching for changes in the message inbox box and emitting the either 'typing' or 'stopTyping' event
    newMessage(value) {
      value ? socket.emit("typing", this.username) : socket.emit("stopTyping");
    },
  },

  //Vue Methods hook
  methods: {
    //The send method stores the user message and emit an event to the server.
    send() {
      this.messages.push({
        message: this.newMessage,
        type: 0,
        user: "Du",
      });

      socket.emit("chat-message", {
        message: this.newMessage,
        user: this.username,
      });
      this.newMessage = null;
    },

    // The addUser method emit a 'joined' event with the username and set the 'ready' property to true.
    addUser() {
      this.ready = true;
      socket.emit("joined", this.username);
    },
  },
};
</script>

<style>
#app {
  text-align: center;
  color: #000000;
  margin-top: 60px;
}
.list-group-item {
  background: rgb(255, 255, 255);
  border: solid 1px rgb(255, 255, 255);
  padding: 5px;
  list-style-type: none;
}
.card-body {
  padding: 50px 0px 0px 0px;
}
.user {
  color: rgb(0, 0, 0);
}
.message {
  font-family: 'Courier New', Courier, monospace;
  color: blue;
}
</style>
