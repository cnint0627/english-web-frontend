<template>
  <div class="exam-root-container">
    <a-tabs :activeKey="activeKey" @change="handleChangeTab">
      <a-tab-pane
          v-for="(material,index) in record.materials" v-bind:key="index"
          :force-render="true"
          :tab="'材料 '+(index+1)">
        <ReadingDetail :ref="'material-'+index" :id="material.materialId" :is-exam="true" :is-exam-completed="isSubmited" v-if="material.type==='reading'"></ReadingDetail>
        <ListeningDetail :ref="'material-'+index" :id="material.materialId" :is-exam="true" :is-exam-completed="isSubmited" v-if="material.type==='listening'"></ListeningDetail>
        <WritingDetail :ref="'material-'+index" :id="material.materialId" :is-exam="true" :is-exam-completed="isSubmited" v-if="material.type==='writing'"></WritingDetail>
      </a-tab-pane>
    </a-tabs>
    <div class="exam-question-bottom">
      <a-button type="primary" style="height: 50px" class="button" @click="handleSubmitAnswer" :disabled="isSubmited">Submit</a-button>
    </div>
  </div>
</template>

<script>
import {getAction, postAction} from "@/api/action";
import ReadingDetail from "@/views/Reading/ReadingDetail.vue";
import ListeningDetail from "@/views/Listening/ListeningDetail.vue";
import WritingDetail from "@/views/Writing/WritingDetail.vue";
import {message} from "ant-design-vue";

export default {
  name: "ExamDetail",
  components:{
    ReadingDetail,
    ListeningDetail,
    WritingDetail
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
        submitAnswer:"/exam/submitAnswer"
      }
    };
  },
  created() {
    console.log(this.$route)
    // 初始化听力内容及题目
    getAction(this.url.getById+"?id="+this.$route.params.id)
        .then(res=>{
          console.log(res)
          this.record=res.data
          if(this.record.isCompleted){
            this.isSubmited=true
          }
        })
  },
  methods:{
    // 点击更改TAB
    handleChangeTab(e){
      this.activeKey=e
    },

    handleSubmitAnswer(){
      if(this.validateAnswer()) {
        for(let index in this.record.materials){
          let ref=this.$refs["material-"+index][0]
          ref.handleSubmitAnswer()
        }
        postAction(this.url.submitAnswer+"?id="+this.record.id)
            .then(()=>{
              message.success("提交成功",1)
              this.isSubmited=true
            })
      }else{
        message.error("答案不能为空",1)
      }
    },

    validateAnswer(){
      // 验证答案合法性
      for(let index in this.record.materials){
        let ref=this.$refs["material-"+index][0]
        if("myAnswerRecord" in ref){
          if(ref.myAnswerRecord.indexOf(-1)!==-1 || ref.myAnswerRecord===''){
            return false
          }
        }
        if("myBlankRecord" in ref){
          if(ref.myBlankRecord.indexOf('')!==-1){
            return false
          }
        }
        if("myQuestionRecord" in ref){
          if(ref.myQuestionRecord.indexOf('')!==-1){
            return false
          }
        }
      }
      return true
    }
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
