<template>
  <div>
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
</template>

<script>
export default {
  name: "LogIn",
  
  data() {
    return {
      username: null
    }
  },

 methods: {
    addUser() {
      this.$emit("newUser", this.username);
    },
  },
};
</script>
