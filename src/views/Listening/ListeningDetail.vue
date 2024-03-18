<template>
  <div class="listening-root-container">
    <h1>{{ record.title }}</h1>
    <div id="createTime">{{ record.createTime }}</div>
    <audio ref="audioPlayer" :src="'http://localhost:9000/audios/'+record.audioPath" controls></audio>
    <a-icon type="play" @click="handlePlayAudio"></a-icon>
    <p id="content">
      <span v-for="(blank,index) in record.blanks" v-bind:key="blank">
        <span v-for="word in blank.content.split(' ')" v-bind:key="word">
          {{word}}
          <br v-if="word && word.charAt(word.length-1)==='\n'"/>
        </span>
        <a-input v-if="record.blanks[index].hasBlank && !isSubmited" style="width: 180px" v-model="myAnswerRecord[index]" :placeholder="index+1"></a-input>
        <br v-if="blank.answer && !isSubmited"/>
        <span v-if="isSubmited">
          <span v-if="record.blanks[index].hasBlank && submitAnswerRecord[index].isCorrect" style="width: 180px;color:lightgreen">
            {{myAnswerRecord[index]}}
            <br v-if="submitAnswerRecord[index].answer && submitAnswerRecord[index].answer.charAt(submitAnswerRecord[index].answer.length-1)==='\n'"/>
          </span>
          <s v-if="record.blanks[index].hasBlank && !submitAnswerRecord[index].isCorrect" style="width: 180px;color:red">
            {{myAnswerRecord[index]}}
          </s>
          <span v-if="record.blanks[index].hasBlank && !submitAnswerRecord[index].isCorrect" style="width: 180px;color:lightskyblue">
            {{submitAnswerRecord[index].answer}}
            <br v-if="submitAnswerRecord[index].answer && submitAnswerRecord[index].answer.charAt(submitAnswerRecord[index].answer.length-1)==='\n'"/>
          </span>
        </span>
      </span>
    </p>
    <a-button v-if="record.blanks.length>0" id="button" @click="handleSubmitAnswer" :disabled="isSubmited">提交答案</a-button>
  </div>
</template>

<script>
import {getAction, postAction} from "@/api/action";
import {message} from "ant-design-vue";

export default {
  name: "ListeningDetail",
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
      // 是否正在播放音频
      isAudioPlaying:false,
      url:{
        getById:"/listening/getById",
        submitAnswer:"/listening/submitAnswer"
      }
    };
  },
  created() {
    // 初始化听力内容及题目
    getAction(this.url.getById+"?id="+this.$route.params.id)
        .then(res=>{
          console.log(res)
          if(res.data) {
            this.record = res.data
            this.myAnswerRecord = new Array(this.record.blanks.length).fill('')
            if(!this.record.blanks[this.record.blanks.length-1].hasBlank){
              // 如果最后一个段落没有填空，则从我的回答记录中删除，这样页面渲染时就是正常的
              this.myAnswerRecord.splice(0,1)
            }
            this.submitAnswerRecord=res.data.records
            if(this.submitAnswerRecord.length>0){
              this.isSubmited=true
              for(let index in this.submitAnswerRecord){
                this.myAnswerRecord[index]=this.submitAnswerRecord[index].record
              }
            }
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
      return myAnswerRecord.indexOf('')===-1
    },

    // 播放/暂停音频
    handlePlayAudio(){
      if(this.isAudioPlaying){
        this.$refs.audioPlayer.pause()
      }else{
        this.$refs.audioPlayer.play()
      }
      this.isAudioPlaying=!this.isAudioPlaying
    }
  }
};
</script>

<style>
/* 添加一些样式以美化导航栏 */
.listening-root-container{
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



#button{
  background-color: lightgreen;
  float: right;
  width: 120px;
  margin-top: 20px;
  margin-bottom: 100px;
}
</style>
