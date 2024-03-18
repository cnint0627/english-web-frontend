<template>
  <div class="root-container">
    <div class="nav-left">
      <a-menu :openKeys="openKeys" :selectedKeys="selectedKeys" mode="inline" theme="dark">
        <a-sub-menu key="1">
          <template #icon><pull-request-outlined /></template>
          <template #title>sub1</template>
          <a-menu-item key="1.1"><template #icon><PieChartOutlined /></template><i>option 1.1</i></a-menu-item>
        </a-sub-menu>
        <a-menu-item key="2"><template #icon><PieChartOutlined /></template><i>option 2</i></a-menu-item>
      </a-menu>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
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
      },
      openKeys:[],
      selectedKeys:[]
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
