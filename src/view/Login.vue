<template>
  <div class="container">
    <h2>注册</h2>
    <form v-on:submit.prevent="login">
      <div class="form-group">
        <label for="username">用户名：</label>
        <input type="text" v-model="loginData.username" required>
      </div>
      <div class="form-group">
        <label for="password">密码：</label>
        <input type="password" v-model="loginData.password" required>
      </div>
      <button type="submit">登录</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <button v-on:click="register" type="register">注册</button>
  </div>
</template>

<script>
import cookie from 'vue-cookie';
import {postAction} from "@/api/action";
import router from "@/router";

export default {
  name:'loginPage',
  data() {
    return {
      loginData: {
        username: '',
        password: ''
      },
      registerData: {
        username: '',
        password: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    login() {
      postAction('user/login', this.loginData)
        .then(response => {
          console.log(response);
          // Redirect to dashboard or desired page
          if(response.data){
            console.log(response.data)
            cookie.set("token", response.data);
            router.push({path:'/reading'});
          }else{
            this.errorMessage = 'Login failed. Please try again.';
          }
        })
        .catch(error => {
          // Handle login error
          console.error('Login error:', error);
          this.errorMessage = 'Login failed. Please try again.';
        });
    },
    register() {
        postAction('user/register', this.loginData)
          .then(response => {
            console.log(response);
            // this.$router.push('/dashboard');
          })
          .catch(error => {
            console.error('Register error:', error);
            this.errorMessage = 'Register failed. Please try again.';
          });

}
}
};

</script>


<style>
.container {
  width: 300px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #edebeb;
  border-radius: 3px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #0095ff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
}
</style>
