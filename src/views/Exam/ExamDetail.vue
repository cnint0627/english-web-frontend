<template>
  <div class="exam-root-container">
    <a-tabs :activeKey="activeKey" @change="handleChangeTab">
      <a-tab-pane
          v-for="(material,index) in record.materials" v-bind:key="index"
          :force-render="true"
          :tab="'材料 '+(index+1)">
        <ReadingDetail :id="material.materialId" :is-exam="true" v-if="material.type==='reading'"></ReadingDetail>
        <ListeningDetail :id="material.materialId" :is-exam="true" v-if="material.type==='listening'"></ListeningDetail>
      </a-tab-pane>
    </a-tabs>
    <div class="exam-question-bottom">
      <a-button type="primary" style="height: 50px" class="button" @click="handleSubmitAnswer" :disabled="isSubmited">Submit</a-button>
    </div>
  </div>
</template>

<script>
import {getAction} from "@/api/action";
import ReadingDetail from "@/views/Reading/ReadingDetail.vue";
import ListeningDetail from "@/views/Listening/ListeningDetail.vue";

export default {
  name: "ExamDetail",
  components:{
    ReadingDetail,
    ListeningDetail
  },
  data() {
    return {
      // 组卷记录
      record:{},
      // 是否提交
      isSubmited:false,
      // 当前TAB
      activeKey:0,
      url:{
        getById:"/exam/getById",
        getReadingById:"/reading/getById",
        getListeningById:"/listening/getById",
        getWritingById:"/writing/getById",
        getSpeakingById:"/speaking/getById",
        submitAnswer:"/listening/submitAnswer"
      }
    };
  },
  created() {
    // 初始化听力内容及题目
    getAction(this.url.getById+"?id="+this.$route.params.id)
        .then(res=>{
          console.log(res)
          this.record=res.data
        })
  },
  methods:{
    // 点击更改TAB
    handleChangeTab(e){
      this.activeKey=e
    },
  }
};
</script>

<style>
::-webkit-scrollbar{ width: 0px; }

.exam-root-container{
  width: 95vw;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 125px);
  overflow-y: hidden;
  overflow-x: hidden;
}
.exam-question-bottom{
  background-color: aliceblue;
  position: absolute;
  height:60px;
  bottom:0;
  width: 95vw;
  border-radius: 5px;
}

.button{
  margin-top: 5px;
  margin-right: 5px;
  float: right;
  width: 200px;
}
</style>
