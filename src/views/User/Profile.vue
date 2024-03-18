<template>
  <div>
    <h1>您好，{{user.username}}</h1>
    <h3>ID: {{user.id}}</h3>
    <h3>这是您加入本站的第 {{user.createTime?Math.floor(Math.abs(Date.now() - Date.parse(user.createTime))  / (1000 * 3600 * 24)):'0'}} 天</h3>
  </div>
</template>

<script>

import loginCheck from "@/api/loginCheck";

export default {
  name: "User",
  data() {
    return {
      user:{

      },
      url:{

      }
    };
  },
  created() {
    loginCheck()
        .then(res=>{
          this.user=res.data
        })
  },
  methods:{

  }
};
</script>

<style>
.root-container{
  width: 50vw;
  display: flex;
  flex-direction: row;
  height: calc(100vh - 125px);
  overflow-y: hidden;
  overflow-x: hidden;
}
.nav-left{

}
.content{
  width:100%;
}
</style>
