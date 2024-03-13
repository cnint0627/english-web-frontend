<template>
  <div id="root-container">
  <h1>{{ record.title }}</h1>
    <div id="createTime">{{ record.createTime }}</div>
    <div id="content">{{ record.content }}</div>
    <div id="question" v-for="(question,q_index) in record.questions" v-bind:key="question">
      问题 {{q_index+1}} : {{question.title}}
      <a-radio-group id="option-container" v-model="answerRecord[q_index]">
        <a-radio id="option" v-for="(option,o_index) in question.options" v-bind:key="option" :value="o_index">
          选项 {{o_index+1}} : {{option.content}}
        </a-radio>
      </a-radio-group>
    </div>
    <a-button id="button" @click="handleSubmitAnswer">提交答案</a-button>
  </div>
</template>

<script>
import {getAction, postAction} from "@/api/action";
import {message} from "ant-design-vue";

export default {
  name: "ReadingDetail",
  data() {
    return {
      record:{},
      answerRecord:[],
      url:{
        getById:"/reading/getById",
        submitAnswer:"/reading/submitAnswer"
      }
    };
  },
  created() {
    getAction(this.url.getById+"?id="+this.$route.params.id)
        .then(res=>{
          console.log(res)
          if(res.data) {
            this.record = res.data
            this.answerRecord = new Array(this.record.questions.length).fill(-1)
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
      console.log(this.answerRecord)
      if(this.validateAnswer(this.answerRecord)) {
        postAction(this.url.submitAnswer + "?id=" + this.record.id, this.answerRecord)
            .then(res => {
              message.success("提交成功")
              console.log(res)
            })
      }else{
        message.error("答案不能为空")
      }

    },
    // 检查答案合法性
    validateAnswer(answerRecord){
      return answerRecord.indexOf(-1)===-1
    }
  }
};
</script>

<style>
/* 添加一些样式以美化导航栏 */
#root-container{
  width: 80%;
  margin-left: 10%;
}

#content{
  text-align: start;
}

#question{
  color:blue;
  background-color: lightblue;
  margin-top:20px;
}

#option-container{
  display: flex;
  flex-direction: column;
  color:black;
}

#option{

}

#button{
  background-color: lightgreen;
  float: right;
  width: 120px;
  margin-top: 20px;
}
</style>
