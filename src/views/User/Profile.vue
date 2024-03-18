<template>
  <div>
    <h1>这是网页的User页</h1>
    <h3>您好，{{user.username}}</h3>
    <h3>ID: {{user.id}}</h3>
    <button @click="handleReadingRecord">阅读历史记录</button>
    <button @click="handleListeningRecord">听力历史记录</button>
  </div>
</template>

<script>
import loginCheck from "@/api/loginCheck";
import {getAction} from "@/api/action";

export default {
  name: "User",
  data() {
    return {
      user:{

      },
      url:{
        getReadingRecord:"/user/getRecord/reading",
        getListeningRecord:"/user/getRecord/listening"
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
    handleReadingRecord(){
      getAction(this.url.getReadingRecord)
          .then(res=>{
            console.log(res)
          })
    },
    handleListeningRecord(){
      getAction(this.url.getListeningRecord)
          .then(res=>{
            console.log(res)
          })
    }
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
