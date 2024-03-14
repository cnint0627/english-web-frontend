<template>
  <a-modal
    :width="1200"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :mask-closable="false"
    cancel-text="关闭"
    ok-text="确定"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
          ref="form"
          :model="model"
          :rules="validatorRules"
      >
        <a-row style="width: 100%">
          <a-col :span="24">
            <a-form-model-item
                label="标题"
                required prop="title"
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
                required prop="content"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
            >
              <a-textarea
                  v-model="model.content"
                  placeholder="请输入文章内容" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>

</template>

<script>

export default {
  name: "ReadingModal",
  data() {
    return {
      visible:false,
      confirmLoading:false,
      model:{},
      labelCol:8,
      wrapperCol:16
    };
  },
  methods:{
    handleOk(){
      this.confirmLoading=true
      this.visible=false
    },
    handleCancel(){
      this.visible=false
    }
  }
};
</script>

<style>

</style>
