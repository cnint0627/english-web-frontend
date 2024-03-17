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
                  placeholder="请输入文章标题" />
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
                  style="height:200px;font-size: small;line-height: 18px"
                  v-model="model.content"
                  placeholder="请输入文章内容" />
            </a-form-model-item>
          </a-col>
        </a-row>
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
      validatorRules: {
        title: [
          {required: true, message: '请输入文章标题！'},
          {min: 0, max: 300, message: '长度不超过 300 个字符', trigger: 'change'},
        ],
        content: [
          {required: true, message: '请输入文章内容！'},
        ],
      },
      model: {
        title: '',
        content: '',
        questions: []
      },
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 22
      },
      url: {
        add: "/reading/add",
        edit: "/reading/edit"
      }
    };
  },
  created() {
    this.modelDefault=JSON.parse(JSON.stringify(this.model))
  },
  methods:{
    handleOk(){
      console.log(this.model)
      this.$refs.form.validate(val => {
        if(val) {
          if (this.model.questions.length === 0) {
            message.error("问题不能为空", 1)
            return
          }
          for (let index in this.model.questions) {
            if (this.model.questions[index].options.length === 0) {
              message.error("选项不能为空", 1)
              return
            }
          }
          this.confirmLoading = true
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
      this.$refs.form.clearValidate()
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

#o-button{
  width: 120px;
  float: right;
  background-color: lightskyblue;
  color:white;
  margin-left: 20px;
  margin-bottom: 20px;
}
</style>
