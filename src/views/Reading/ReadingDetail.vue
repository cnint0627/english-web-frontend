<template>
  <div id="root-container">
  <h1>{{ record.title }}</h1>
    <div id="createTime">{{ record.createTime }}</div>
    <div id="content">{{ record.content }}</div>
    <div id="question" v-for="(question,q_index) in record.questions" v-bind:key="question">
      问题 {{q_index+1}} : {{question.title}}
      <a-radio-group v-model="myAnswerRecord[q_index]" v-if="!isSubmited">
        <div id="option" v-for="(option,o_index) in question.options" v-bind:key="option">
          <a-radio :value="o_index"/>选项 {{o_index+1}} : {{option.content}}
        </div>
      </a-radio-group>
      <a-radio-group v-model="myAnswerRecord[q_index]" v-if="isSubmited" readonly>
        <div
            id="option"
            v-for="(option,o_index) in question.options"
            v-bind:key="option"
            :style="(o_index==myAnswerRecord[q_index]?(submitAnswerRecord[q_index].isCorrect?'color:yellowgreen;':'color:red;'):'')+
                    (o_index==submitAnswerRecord[q_index].answer?'color:yellowgreen;':'')"
            >
          <a-radio :value="o_index" onClick='javascript:return false'/>选项 {{o_index+1}} : {{option.content}}
        </div>
      </a-radio-group>
    </div>
    <a-button v-if="record.questions.length>0" id="button" @click="handleSubmitAnswer" :disabled="isSubmited">提交答案</a-button>
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
/* 添加一些样式以美化导航栏 */
#root-container{
  width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#content{
  width: 1000px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: start;
  font-size: larger;
  line-height: 36px;
}

#question{
  display:flex;
  flex-direction: column;
  color:blue;
  background-color: lightblue;
  width:800px;
  margin: 20px 0;
  padding: 20px 0;
}

#option{
  display: flex;
  flex-direction: row;
  color:black;
  align-items: start;
  padding: 20px 40px;
  text-align: start;
  word-wrap: break-word;
  overflow-wrap: break-word;
}


#button{
  background-color: lightgreen;
  float: right;
  width: 120px;
  margin-top: 20px;
  margin-bottom: 100px;
}
</style>
