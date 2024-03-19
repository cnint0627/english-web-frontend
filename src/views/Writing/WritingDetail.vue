<template>
  <div class="reading-root-container">
    <div class="reading-text" :style="isExam?'height: calc(100% - 135px);overflow-y: scroll;':''">
      <div class="title">{{ record.title }}</div>
      <div class="createTime">{{ record.createTime }}</div>
      <div class="content">{{ record.content }}</div>
    </div>
    <a-divider type="vertical" :style="'height:calc(100vh - '+(isExam?255:0)+'px);width:0.1vw;margin-left:1vw;'"></a-divider>
    <div class="reading-question">
      <div class="title">
        My Writing
      </div>
      <div class="reading-question-mid" :style="isExam?'height: calc(100% - 180px);':''">
        <a-textarea :readonly="isSubmited" v-model="myAnswerRecord" style="margin:5% 0;height: 90%"/>
      </div>
      <div class="question-bottom">
        <a-button type="primary" style="height: 50px" class="button" @click="handleSubmitAnswer" :disabled="isSubmited">Submit</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import {getAction, postAction} from "@/api/action";
import {message} from "ant-design-vue";

export default {
  name: "WritingDetail",
  props:{
    id: String,
    isExam: Boolean(false),
    isExamCompleted: Boolean(false)
  },
  data() {
    return {
      // 文章记录
      record:{},
      // 我的答案记录
      myAnswerRecord:'',
      // 是否提交
      isSubmited:false,
      url:{
        getById:"/writing/getById",
        submitAnswer:"/writing/submitAnswer"
      }
    };
  },
  created() {
    if(this.id){
      // 如果组件传参，传了id就用父组件传过来的id
      console.log("this is from a exam")
      this.$route.params.id=this.id
    }
    // 初始化文章内容及题目
    getAction(this.url.getById+"?id="+this.$route.params.id)
        .then(res=>{
          console.log(res)
          if(res.data) {
            this.record = res.data
            if(!this.isExam || this.isExamCompleted) {
              if (this.record.records.length > 0) {
                this.myAnswerRecord = this.record.records[0].record
                this.isSubmited = true
              }
            }
          }else{
            // 文章不存在
            this.record = {
              title: "该文章不存在"
            }
          }
        })
  },
  methods:{
    // 提交答案
    handleSubmitAnswer(){
      console.log(this.myAnswerRecord)
      if(this.validateAnswer(this.myAnswerRecord)) {
        postAction(this.url.submitAnswer + "?id=" + this.record.id+"&record="+this.myAnswerRecord)
            .then(res => {
              message.success("提交成功",1)
              console.log(res)
              this.isSubmited=true
            })
      }else{
        message.error("答案不能为空",1)
      }

    },
    // 检查答案合法性
    validateAnswer(myAnswerRecord){
      return myAnswerRecord!==''
    }
  }
};
</script>

<style>
::-webkit-scrollbar{ width: 0px; }

.reading-root-container{
  width: 95vw;
  display: flex;
  flex-direction: row;
  height: calc(100vh - 125px);
  overflow-y: hidden;
  overflow-x: hidden;
}

.reading-text{
  float: left;
  margin-left:1vw;
  width: 45vw;
  overflow-y: scroll;
}

.reading-question{
  word-wrap: break-word;
  overflow-wrap: break-word;
  width:45vw;
  float: right;
  margin-left: 1vw;
}

.title{
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 40px;
}

.content{
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: start;
  font-size: larger;
  line-height: 36px;
}

.question{
  display:flex;
  flex-direction: column;
  color:blue;
  background-color: lightskyblue;
  margin:30px 0;
  border-radius: 20px;
  padding: 30px 30px;
  font-size: 20px;
}

.option{
  margin:10px 0;
  display: inline-block;
  color:black;
  align-items: start;
  text-align: start;
  width: 100%;
  line-height: 36px;
}

.question-bottom{
  background-color: aliceblue;
  position: absolute;
  height:60px;
  bottom:0;
  width: 45vw;
  border-radius: 5px;
}

.question-mid{
  height: calc(100% - 115px);
  overflow-y: hidden;
}

.button{
  margin-top: 5px;
  margin-right: 5px;
  float: right;
  width: 200px;
}
</style>
