<template>
  <a-modal
    :width="1000"
    :title="formAction=='add'?'新增':'编辑'"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :mask-closable="false"
    :closable="false"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
          :model="model"
          ref="form"
          :rules="validatorRules"
          id="form"
      >
        <a-row style="width: 100%">
          <a-col :span="24">
            <a-form-model-item
                label="标题"
                prop="title"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
            >
              <a-input
                  v-model="model.title"
                  placeholder="请输入听力标题" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%">
          <a-col :span="24">
            <a-form-model-item
                label="听力音频"
                required prop="audioPath"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
            >
              <a-upload name="file" :multiple="false" :file-list="fileList" :before-upload="handleUpload" :remove="handleRemove" >
                <a-button type="primary" icon="upload">上传音频</a-button>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%">
          <a-col :span="24">
            <a-form-model-item
                label="内容"
                prop="content"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
            >
              <a-textarea
                  v-if="!isEditQuestion"
                  style="height:200px;font-size: small;line-height: 18px"
                  v-model="model.content"
                  placeholder="请输入听力完整内容" />
              <p class="content" v-if="isEditQuestion">
                <span :style="'cursor: pointer;'+(blankList.indexOf(index)===-1?'':'color:lightgreen')" v-for="(word, index) in model.content" v-bind:key="word" @click="handleSetBlank(index)">
                  {{word}}
                  <br v-if="word.charAt(word.length-1)==='\n'"/>
                </span>
              </p>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-button :disabled="isEditQuestion" :style="isEditQuestion?'background-color: gray':''" id="q-button" @click="handleEditQuestion">编辑题目</a-button>
        <!-- 填空题部分结束 -->
          <a-card style="width: 100%;margin:20px 0" v-for="(question, q_index) in model.questions" v-bind:key="question">
            <a-form-model-item
                label="题目标题"
                :prop="'questions.'+q_index+'.title'"
                :rules="[
                  {required: true, message: '请输入题目标题！'},
                  {min: 0, max: 300, message: '长度不超过 300 个字符', trigger: 'blur'},
                ]"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
            >
              <a-input
                  v-model="model.questions[q_index].title"
                  placeholder="请输入题目标题" />
            </a-form-model-item>
            <a-form-model-item
                label="题目答案"
                :prop="'questions.'+q_index+'.answer'"
                :rules="[
                  {required: true, message: '请输入题目答案！'},
                  {min: 0, max: 100, message: '长度不超过 100 个字符', trigger: 'blur'},
                ]"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
            >
              <a-input
                  v-model="model.questions[q_index].answer"
                  placeholder="请输入题目答案" />
            </a-form-model-item>
            <a-row style="width: 100%" v-for="(option, o_index) in model.questions[q_index].options" v-bind:key="option">
              <a-col :span="22">
                <a-form-model-item
                    label="题目选项"
                    :prop="'questions.'+q_index+'.options.'+o_index+'.content'"
                    :rules="[
                    {required: true, message: '请输入题目选项！'},
                    {min: 0, max: 300, message: '长度不超过 300 个字符', trigger: 'blur'},
                  ]"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                  <a-input
                      v-model="model.questions[q_index].options[o_index].content"
                      placeholder="请输入题目选项" />
                </a-form-model-item>
              </a-col>
              <a-col :span="2">
                <a-button style="margin-left: 10px;background-color: red;color:white;margin-top: 3px" @click="handleDeleteOption(q_index,o_index)">删除</a-button>
              </a-col>
            </a-row>
            <a-button id="o-button" @click="handleAddOption(q_index)">新增选项</a-button>
            <a-button id="o-button" style="background-color: red" @click="handleDeleteQuestion(q_index)">删除题目</a-button>
          </a-card>
          <a-button id="q-button" @click="handleAddQuestion">新增题目</a-button>
        <div id="action">
          <a-button id="action-button" style="background-color: lightgreen" @click="handleOk">确定</a-button>
          <a-button id="action-button" @click="handleCancel">取消</a-button>
          <a-button id="action-button" @click="handleReset">重置</a-button>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>

</template>

<script>

import {postAction} from "@/api/action";
import {message} from "ant-design-vue";

export default {
  name: "ReadingModal",
  data() {
    return {
      visible: false,
      confirmLoading: false,
      // 弹窗状态：新增/编辑
      formAction:'',
      // 是否开始编辑题目
      isEditQuestion: false,
      validatorRules: {
        title: [
          {required: true, message: '请输入材料标题！'},
          {min: 0, max: 300, message: '长度不超过 300 个字符', trigger: 'change'},
        ],
        content: [
          {required: true, message: '请输入材料内容！'},
        ],
      },
      // 挖空的列表
      blankList: [],
      // 上传的音频文件回显
      fileList: [],
      model: {
        title: '',
        audioPath:'',
        blanks: [],
        questions:[],
        // 听力材料内容，后续会对其进行转化处理
        content:''
      },
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 22
      },
      url: {
        add: "/listening/add",
        edit: "/listening/edit",
        upload:"/file/upload"
      }
    };
  },
  created() {
    this.modelDefault=JSON.parse(JSON.stringify(this.model))
  },
  methods:{
    handleOk(){
      this.$refs.form.validate(val => {
        if(val) {
          if (this.fileList.length === 0) {
            message.error("请上传音频文件", 1)
            return
          }
          // if (this.blankList.length === 0) {
          //   message.error("至少选取一个单词作为题目", 1)
          //   return
          // }
          for (let index in this.model.questions) {
            if (this.model.questions[index].options.length === 0) {
              message.error("选项不能为空", 1)
              return
            }
          }
          this.confirmLoading = true

          // 将挖空转化为模型
          this.parseBlankToModel();
          console.log(this.model)
          // 设置题目编号
          this.setSortNum();
          console.log(this.model)

          // 上传音频文件
          postAction(this.url.upload, this.formData,{'Content-Type':'multipart/form-data'})
              .then(res=>{
                console.log(res)
              })

          if(this.formAction=='add') {
            postAction(this.url.add, this.model)
                .then(res => {
                  console.log(res)
                  this.confirmLoading = false
                  this.visible = false
                  this.$parent.page(this.$parent.pagination.current)
                  message.success("提交成功", 1)
                })
          }else if(this.formAction=='edit'){
            postAction(this.url.edit, this.model)
                .then(res => {
                  console.log(res)
                  this.confirmLoading = false
                  this.visible = false
                  this.$parent.page(this.$parent.pagination.current)
                  message.success("提交成功", 1)
                })
          }
        }else{
          return false
        }
      })
    },
    handleCancel(){
      this.visible=false
      this.$refs.form.clearValidate()
    },
    handleReset(){
      this.model= JSON.parse(JSON.stringify(this.modelDefault))
      this.isEditQuestion=false
      this.blankList=[]
      this.fileList=[]
      this.$refs.form.clearValidate()
    },

    // 按下编辑题目
    handleEditQuestion(){
        this.isEditQuestion=true
        this.model.content=this.model.content.replace(/\n/g,"\n ");
        this.model.content=this.model.content.split(" ")
        // for(let i in this.model.content){
        //   this.model.content[i]=this.model.content[i].replace(/^\s*((?:[\S\s]*\S)?)\s*$/, '$1')
        //   if(this.model.content[i]===''){
        //     this.model.content.splice(i,1)
        //   }
        // }
        console.log(this.model.content)
    },

    // 选择要挖空的单词
    handleSetBlank(index){
      console.log(index)
      // 该单词是否已经被挖
      let i =this.blankList.indexOf(index)
      if(i==-1) {
        this.blankList.push(index)
      }else{
        this.blankList.splice(i,1)
      }
      console.log(this.blankList)
    },

    // 对挖好空的模型进行转化
    parseBlankToModel(){
      this.model.blanks=[]
      // 这里是sort的一个坑，不传排序函数时会先将数字转换为字符串再根据ASCII排序，所以要给定排序函数
      this.blankList.sort(function (a, b) {
        return a - b;
      })
      console.log("this is sort",this.blankList)
      let blankList=this.blankList
      let content=this.model.content
      for(let index in blankList){
        this.model.blanks.push(
            {
              content:index===0?content.slice(0,blankList[index]).join(' '):content.slice(blankList[index-1]+1,blankList[index]).join(' '),
              answer:content[blankList[index]],
              sortNum:index
            }
        )
        if(index==blankList.length-1 && blankList[index]!=content.length-1){
          this.model.blanks.push(
              {
                content:content.slice(blankList[index]+1,content.length).join(' '),
                answer:null,
                sortNum:-1
              }
          )
        }
      }

    },

    // 将记录转化为挖空列表形式
    parseModelToBlank(){
      this.model.content=[]
      for(let index in this.model.blanks){
        if(this.model.blanks[index].content) {
          this.model.content.push(...this.model.blanks[index].content.split(' '))
        }
        if(this.model.blanks[index].answer){
          this.model.content.push(this.model.blanks[index].answer)
          this.blankList.push(this.model.content.length-1)
        }
      }
    },

    // 音频文件上传
    handleUpload(file){
      if(file.name.substring(file.name.length-4,file.name.length)!=='.mp3'){
        message.error("只能上传.mp3音频文件")
        return
      }
      this.fileList=[file]
      let name=file.name.substring(0,file.name.length-4)
      console.log("文件名：",name)
      if(!this.model.audioPath){
        // 如果没有音频文件名,随机生成一个音频文件名
        this.model.audioPath=name+'_'+this.randomID()+'.mp3'
      }
      file=new File([file],this.model.audioPath)
      this.formData = new FormData();
      this.formData.append('file', file);
      this.formData.append('bucketName','audios')
      return false
    },

    // 清空
    handleRemove(file){
      console.log(file)
      this.fileList=[]
    },



    // 生成随机ID
    randomID() {
      return Number(Math.random().toString().substr(2,0) + Date.now()).toString(36);
    },

    // 新增题目
    handleAddQuestion(){
      this.model.questions.push(JSON.parse(JSON.stringify(
          {
            title:'',
            options:[],
            answer:'',
          }
      )))
      console.log(this.model)
    },

    // 新增选项
    handleAddOption(index){
      this.model.questions[index].options.push(
          {
            content:''
          }
      )
    },

    // 删除题目
    handleDeleteQuestion(index){
      this.model.questions.splice(index,1)
    },

    // 删除选项
    handleDeleteOption(q_index,o_index){
      this.model.questions[q_index].options.splice(o_index,1)
    },

    // 为题目设置序号
    setSortNum(){
      // 从填空题之后开始编号
      let cur=this.model.blanks.length
      if(cur>0) {
        if (!this.model.blanks[cur - 1].answer) {
          // 如果填空最后一个不是题目，编号减一
          cur -= 1
        }
      }
      for(let index in this.model.questions){
        this.model.questions[index].sortNum=cur
        cur+=1
      }
    }
  }
};
</script>

<style>
#form{
  display: flex;
  flex-direction: column;
  align-items: end;
}

#action{
  display: flex;
  flex-direction: row;
  align-self: center;
}

#action-button{
  margin:0 20px;
  margin-top: 20px;
  width: 180px;
  height:40px;
}

#q-button{
  width: 120px;
  float: right;
  background-color: lightskyblue;
  color:white;
}

.content{
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
</style>
