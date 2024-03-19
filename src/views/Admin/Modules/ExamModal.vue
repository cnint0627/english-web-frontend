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
                  placeholder="请输入组卷标题" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%">
          <a-card v-for="(material,index) in model.materials" v-bind:key="index">
            <a-col :span="12">
              <a-form-model-item
                  label="材料类型"
                  :prop="'materials.'+index+'.type'"
                  :rules="[
                    {required: true, message: '请选择材料类型！'},
                  ]"
                  :label-col="{span:6}"
                  :wrapper-col="{span:18}"
              >
                <a-select v-model="material.type" @change="handleTypeChange(material)">
                  <a-select-option value=""> 请选择 </a-select-option>
                  <a-select-option value="reading"> 阅读 </a-select-option>
                  <a-select-option value="listening"> 听力 </a-select-option>
                  <a-select-option value="writing"> 写作 </a-select-option>
                  <a-select-option value="speaking"> 口语 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                  label="材料选择"
                  :prop="'materials.'+index+'.materialId'"
                  :rules="[
                    {required: true, message: '请选择材料！'},
                  ]"
                  :label-col="{span:6}"
                  :wrapper-col="{span:18}"
              >
                <a-select v-model="material.materialId">
                  <a-select-option v-for="(item,index) in materialList[material.type]" v-bind:key="index" :value="item.id"> {{item.id}} {{item.title}} </a-select-option>
                </a-select>

              </a-form-model-item>
            </a-col>
            <a-button id="q-button" style="background-color: red" @click="handleDeleteMaterial(index)">删除材料</a-button>
          </a-card>
        </a-row>
        <a-button id="q-button" @click="handleAddMaterial">新增材料</a-button>
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

import {getAction, postAction} from "@/api/action";
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
          {required: true, message: '请输入组卷标题！'},
          {min: 0, max: 300, message: '长度不超过 300 个字符', trigger: 'change'},
        ]
      },
      // 材料列表
      materialList:{
        reading:[],
        listening:[],
        writing:[],
        speaking:[]
      },
      model: {
        title: '',
        materials:[],
      },
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 22
      },
      url: {
        listReading:"/reading/list",
        listListening:"/listening/list",
        listWriting:"/writing/list",
        listSpeaking:"/speaking/list",
        add: "/exam/add",
        edit: "/exam/edit"
      }
    };
  },
  created() {
    this.modelDefault=JSON.parse(JSON.stringify(this.model))
    getAction(this.url.listReading)
        .then(res=>{
          this.materialList.reading=res.data
        })
    getAction(this.url.listListening)
        .then(res=>{
          this.materialList.listening=res.data
        })
    getAction(this.url.listWriting)
        .then(res=>{
          this.materialList.writing=res.data
        })
  },
  methods:{
    handleOk(){
      console.log(this.model)
      this.$refs.form.validate(val => {
        if(val) {
          if(this.model.materials.length==0){
            message.error("至少选择一个材料进行组卷",1)
            return
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
    handleAddMaterial(){
      this.model.materials.push(JSON.parse(JSON.stringify(
          {
            materialId:'',
            type:"",
            sortNum:this.model.materials.length,
          }
      )))
      console.log(this.model)
    },


    // 删除材料
    handleDeleteMaterial(index){
      this.model.materials.splice(index,1)
    },

    // 更改材料类型时将已选择的材料清除
    handleTypeChange(material){
      material.materialId=''
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
