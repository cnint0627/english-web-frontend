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
      },
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 22
      },
      url: {
        add: "/writing/add",
        edit: "/writing/edit"
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
