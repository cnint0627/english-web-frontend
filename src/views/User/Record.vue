<template>
  <div>
    <a-tabs :activeKey="activeKey" @change="handleChangeTab">
      <a-tab-pane
          key="reading"
          :force-render="true"
          tab="阅读">
        <a-card style="margin-left: 20px" v-for="(record,index) in readingRecord" v-bind:key="record" @click="handleReadingDetail(record)">
          <div>
          记录{{index+1}}
          </div>
          <div>
          {{record.title}}
          </div>
        </a-card>
      </a-tab-pane>
      <a-tab-pane
          style="overflow-y: scroll;height:calc(100vh - 230px)"
          key="listening"
          :force-render="true"
          tab="听力">
        <a-card style="margin-left: 20px" v-for="(record,index) in listeningRecord" v-bind:key="record" @click="handleListeningDetail(record)">
          <div>
            记录{{index+1}}
          </div>
          <div>
            {{record.title}}
          </div>
        </a-card>
      </a-tab-pane>
      <a-tab-pane
          key="writing"
          :force-render="true"
          tab="写作">
        <a-card style="margin-left: 20px" v-for="(record,index) in writingRecord" v-bind:key="record" @click="handleWritingDetail(record)">
          <div>
            记录{{index+1}}
          </div>
          <div>
            {{record.title}}
          </div>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>


import {getAction} from "@/api/action";

export default {
  name: "User",
  data() {
    return {
      activeKey:'reading',
      readingRecord:[],
      listeningRecord:[],
      writingRecord:[],
      url:{
        getReadingRecord:"/user/getRecord/reading",
        getListeningRecord:"/user/getRecord/listening",
        getWritingRecord:"/user/getRecord/writing",
      },
    };
  },
  created() {
    getAction(this.url.getReadingRecord)
        .then(res=>{
          this.readingRecord=res.data
        })
    getAction(this.url.getListeningRecord)
        .then(res=>{
          this.listeningRecord=res.data
        })
    getAction(this.url.getWritingRecord)
        .then(res=>{
          this.writingRecord=res.data
        })
  },
  methods:{
    // 点击更改TAB
    handleChangeTab(e){
      this.activeKey=e
    },

    // 点击进入阅读详情页
    handleReadingDetail(record){
      window.open(this.$router.resolve({path:"/reading/"+record.id}).href,'_blank')
    },

    // 点击进入听力详情页
    handleListeningDetail(record){
      window.open(this.$router.resolve({path:"/listening/"+record.id}).href,'_blank')
    },

    // 点击进入写作详情页
    handleWritingDetail(record){
      window.open(this.$router.resolve({path:"/writing/"+record.id}).href,'_blank')
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
