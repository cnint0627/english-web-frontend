<template>
  <div>
    <a-tabs :activeKey="activeKey" @change="handleTabChange">
      <a-tab-pane v-for="(item, index) in menuList" :key="item.id" :tab="item.name" :index="index">
        <div >
          <a-tabs :defaultActiveKey="currentTab" :tab-position="tabPosition"  @change="handleTabChangeTwo">
            <a-tab-pane v-for="(data, i) in item.children" :key="data.id" :tab="data.name" :index="i" >
              <a-col :md="8" :sm="24" v-for="(input,j) in data.children" :key="input.id" :index="j">
                <a-form-item :label="input.name">
                  <a-input   v-model="menuList[index].children[i].children[j].value"
                             :rules="{ required: true, message: '请输入' + input.name , trigger:'blur' }"
                             :placeholder="'请输入' + input.name"/>
                </a-form-item>
              </a-col>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>

export default {
  name: "User",
  data() {
    return {
      user:{

      },
      url:{
        getReadingRecord:"/user/getRecord/reading",
        getListeningRecord:"/user/getRecord/listening"
      }
    };
  },
  created() {
  },
  methods:{

  }
};
</script>

<style>
.root-container{
  width: 50vw;
  display: flex;
  flex-direction: row;
  height: calc(100vh - 125px);
  overflow-y: hidden;
  overflow-x: hidden;
}
.nav-left{

}
.content{
  width:100%;
}
</style>
