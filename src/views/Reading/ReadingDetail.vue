<template>
  <div class="reading-root-container">
    <div class="reading-text">
    <div class="title">{{ record.title }}</div>
    <div class="createTime">{{ record.createTime }}</div>
    <div class="content">{{ record.content }}</div>
    </div>
    <a-divider type="vertical" style="height:calc(100vh - 105px);width:0.1vw;margin-left:1vw;"></a-divider>
    <div class="reading-question">
      <div class="title">
        Questions
      </div>
      <div class="question-mid">
    <div class="question" v-for="(question,q_index) in record.questions" v-bind:key="question">
      <div style="margin-bottom: 20px">
      问题 {{q_index+1}} : {{question.title}}
      </div>
      <a-radio-group v-model="myAnswerRecord[q_index]" v-if="!isSubmited">
        <div class="option" v-for="(option,o_index) in question.options" v-bind:key="option">
          <a-radio :value="o_index"/>选项 {{o_index+1}} : {{option.content}}
        </div>
      </a-radio-group>
      <a-radio-group v-model="myAnswerRecord[q_index]" v-if="isSubmited" readonly>
        <div
            class="option"
            v-for="(option,o_index) in question.options"
            v-bind:key="option"
            :style="(o_index==myAnswerRecord[q_index]?(submitAnswerRecord[q_index].isCorrect?'color:yellowgreen;':'color:red;'):'')+
                    (o_index==submitAnswerRecord[q_index].answer?'color:yellowgreen;':'')"
            >
          <a-radio :value="o_index" onClick='javascript:return false'/>
          选项 {{o_index+1}} : {{option.content}}
        </div>
      </a-radio-group>
    </div>
    </div>
      <div class="question-bottom">
    <a-button v-if="record.questions.length>0" type="primary" style="height: 50px" class="button" @click="handleSubmitAnswer" :disabled="isSubmited">Submit</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import {getAction, postAction} from "@/api/action";
import {message} from "ant-design-vue";

export default {
  name: "ReadingDetail",
  data() {
    return {
      // 文章记录
      record:{},
      // 自己的答案记录
      myAnswerRecord:[],
      // 提交后的答案记录
      submitAnswerRecord:[],
      // 是否提交
      isSubmited:false,
      url:{
        getById:"/reading/getById",
        submitAnswer:"/reading/submitAnswer"
      }
    };
  },
  created() {
    // 初始化文章内容及题目
    getAction(this.url.getById+"?id="+this.$route.params.id)
        .then(res=>{
          console.log(res)
          if(res.data) {
            this.record = res.data
            this.myAnswerRecord = new Array(this.record.questions.length).fill(-1)
            this.submitAnswerRecord=res.data.records
            if(this.submitAnswerRecord.length>0){
              this.isSubmited=true
              for(let index in this.submitAnswerRecord){
                this.myAnswerRecord[index]=parseInt(this.submitAnswerRecord[index].record)
              }
            }
            console.log(this.myAnswerRecord)
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
        postAction(this.url.submitAnswer + "?id=" + this.record.id, this.myAnswerRecord)
            .then(res => {
              message.success("提交成功",1)
              console.log(res)
              this.submitAnswerRecord=res.data
              this.isSubmited=true
            })
      }else{
        message.error("答案不能为空",1)
      }

    },
    // 检查答案合法性
    validateAnswer(myAnswerRecord){
      return myAnswerRecord.indexOf(-1)===-1
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
  overflow-y: scroll;
}

.button{
  margin-top: 5px;
  margin-right: 5px;
  float: right;
  width: 200px;
}
</style>
