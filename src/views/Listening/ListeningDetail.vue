<template>
  <div :style="isExam?'margin-left: 15vw':''" class="listening-root-container">
    <div class="listening-content" :style="'top:'+(isExam?'60px':'20px')">
    <div class="title">{{ record.title }}</div>
    <div>{{ record.createTime }}</div>
    <audio style="align-self: center;margin: 10px 0;" ref="audioPlayer" :src="'http://localhost:9000/audios/'+record.audioPath" controls></audio>
    <p>
      <span v-for="(blank,index) in record.blanks" v-bind:key="blank">
        <span v-for="word in blank.content.split(' ')" v-bind:key="word">
          {{word}}
          <br v-if="word && word.charAt(word.length-1)==='\n'"/>
        </span>
        <a-input v-if="record.blanks[index].hasBlank && !isSubmited" style="width: 180px" v-model="myBlankRecord[index]" :placeholder="index+1"></a-input>
        <br v-if="blank.answer && !isSubmited"/>
        <span v-if="isSubmited">
          <span v-if="record.blanks[index].hasBlank && submitAnswerRecord[record.blanks[index].sortNum].isCorrect" style="width: 180px;color:lightgreen">
            {{myBlankRecord[index]}}
            <br v-if="submitAnswerRecord[record.blanks[index].sortNum].answer && submitAnswerRecord[record.blanks[index].sortNum].answer.charAt(submitAnswerRecord[record.blanks[index].sortNum].answer.length-1)==='\n'"/>
          </span>
          <s v-if="record.blanks[index].hasBlank && !submitAnswerRecord[record.blanks[index].sortNum].isCorrect" style="width: 180px;color:red">
            {{myBlankRecord[index]}}
          </s>
          <span v-if="record.blanks[index].hasBlank && !submitAnswerRecord[record.blanks[index].sortNum].isCorrect" style="width: 180px;color:lightskyblue">
            {{submitAnswerRecord[record.blanks[index].sortNum].answer}}
            <br v-if="submitAnswerRecord[record.blanks[index].sortNum].answer && submitAnswerRecord[record.blanks[index].sortNum].answer.charAt(submitAnswerRecord[record.blanks[index].sortNum].answer.length-1)==='\n'"/>
          </span>
        </span>
      </span>
    </p>
      <!-- 选择题部分开始 -->
      <div class="question" v-for="(question,q_index) in record.questions" v-bind:key="question">
        <div style="margin-bottom: 20px">
          问题 {{record.questions[q_index].sortNum+1}} : {{question.title}}
        </div>
        <a-radio-group v-model="myQuestionRecord[q_index]" v-if="!isSubmited">
          <div class="option" v-for="(option,o_index) in question.options" v-bind:key="option">
            <a-radio :value="o_index"/>选项 {{o_index+1}} : {{option.content}}
          </div>
        </a-radio-group>
        <a-radio-group v-model="myQuestionRecord[q_index]" v-if="isSubmited" readonly>
          <div
              class="option"
              v-for="(option,o_index) in question.options"
              v-bind:key="option"
              :style="(o_index==myQuestionRecord[q_index]?(submitAnswerRecord[q_index].isCorrect?'color:yellowgreen;':'color:red;'):'')+
                    (o_index==submitAnswerRecord[q_index].answer?'color:yellowgreen;':'')"
          >
            <a-radio :value="o_index" onClick='javascript:return false'/>
            选项 {{o_index+1}} : {{option.content}}
          </div>
        </a-radio-group>
      </div>
      <!-- 选择题部分结束 -->
    </div>
    <div class="listening-question-bottom">
    <a-button v-if="!isExam" type="primary" style="height:50px" class="button" @click="handleSubmitAnswer" :disabled="isSubmited">提交答案</a-button>
    </div>
  </div>
</template>

<script>
import {getAction, postAction} from "@/api/action";
import {message} from "ant-design-vue";
export default {
  name: "ListeningDetail",
  props:{
    id: String,
    isExam: Boolean(false),
    isExamCompleted: Boolean(false)
  },
  data() {
    return {
      // 文章记录
      record:{},
      // 自己的填空记录
      myBlankRecord:[],
      // 自己的选择题记录,
      myQuestionRecord:[],
      // 提交后的答案记录
      submitAnswerRecord:[],
      // 是否提交
      isSubmited:false,
      url:{
        getById:"/listening/getById",
        submitAnswer:"/listening/submitAnswer"
      }
    };
  },
  created() {
    if(this.id){
      // 如果组件传参，传了id就用父组件传过来的id
      console.log("this is from a exam")
      console.log("exam completed:",this.isExamCompleted)
      this.$route.params.id=this.id
    }
    // 初始化听力内容及题目
    getAction(this.url.getById+"?id="+this.$route.params.id)
        .then(res=>{
          console.log(res)
          if(res.data) {
            this.record = res.data
            this.myBlankRecord = new Array(this.record.blanks.length).fill('')
            this.myQuestionRecord=new Array(this.record.questions.length).fill(-1)
            if(this.record.blanks.length>0 && !this.record.blanks[this.record.blanks.length-1].hasBlank){
              // 如果最后一个段落没有填空，则从我的回答记录中删除，这样页面渲染时就是正常的
              this.myBlankRecord.splice(0,1)
            }
            if(!this.isExam || this.isExamCompleted) {
              this.submitAnswerRecord = res.data.records
              if (this.submitAnswerRecord.length > 0) {
                this.isSubmited = true
                let i = 0
                for (let index in this.submitAnswerRecord) {
                  if (index < this.myBlankRecord.length) {
                    this.myBlankRecord[index] = this.submitAnswerRecord[index].record
                  } else {
                    this.myQuestionRecord[i] = parseInt(this.submitAnswerRecord[index].record)
                    i += 1
                  }
                }
              }
            }
            console.log(this.myQuestionRecord)
          }else{
            // 听力不存在
            this.record = {
              title: "该听力不存在"
            }
          }
        })
  },
  methods:{
    // 提交答案
    handleSubmitAnswer(){
      console.log(this.myBlankRecord)
      console.log(this.myQuestionRecord)
      let myAnswerRecord=this.myBlankRecord.concat(this.myQuestionRecord)
      if(this.validateAnswer(myAnswerRecord)) {
        postAction(this.url.submitAnswer + "?id=" + this.record.id, myAnswerRecord)
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
      return myAnswerRecord.indexOf('')===-1 && myAnswerRecord.indexOf(-1)===-1
    },

  }
};
</script>

<style>
::-webkit-scrollbar{ width: 0px; }

.listening-root-container{
  width: 65vw;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 125px);
  overflow-y: hidden;
  overflow-x: hidden;
}

.title{
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 40px;
}

.listening-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: start;
  font-size: larger;
  line-height: 36px;
  width: calc(65vw - 50px);
  overflow-y: scroll;
  position: absolute;
  bottom:60px;
}



.listening-question-bottom{
  background-color: aliceblue;
  position: absolute;
  height:60px;
  bottom:0;
  width: calc(65vw - 50px);
  border-radius: 5px;
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


.button{
  margin-top: 5px;
  margin-right: 5px;
  float: right;
  width: 200px;
}
</style>
