<template>
  <div class="user-root-container">
    <div class="nav-left">
        <a-menu
                mode="inline"
                @click="handleClickMenu"
                :selectedKeys="[$route.path]"
        >

          <a-menu-item key='/profile' :class="activeRoute === '/user/profile'?'active-menu':'non-active-menu'">
            <a-icon type="user" />
            <span>个人资料</span>
          </a-menu-item>
          <a-menu-item key='/record' :class="activeRoute === '/user/record'?'active-menu':'non-active-menu'">
            <a-icon type="history" />
            <span>提交记录</span>
          </a-menu-item>
          <a-menu-item key='/setting' :class="activeRoute === '/user/setting'?'active-menu':'non-active-menu'">
            <a-icon type="setting" />
            <span>设置</span>
          </a-menu-item>
        </a-menu>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
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
      },
      openKeys:[],
      selectedKeys:[],
      activeRoute:'',
    };
  },
  created() {
    this.activeRoute = this.$route.path;
    this.$router.afterEach((to) => {
      this.activeRoute = to.path;
    });
  },
  methods:{
    handleClickMenu(e){
      if(this.$route.path!=="/user"+e.key) {
        this.$router.push({path: "/user" + e.key})
      }
    }

  }
};
</script>

<style>
.user-root-container{
  width: 50vw;
  display: flex;
  flex-direction: row;
  height: calc(100vh - 125px);
  overflow-y: hidden;
  overflow-x: hidden;
}
.nav-left{
  width:12vw;
}
.content{
  width:100%;
}

.non-active-menu{
  color: black !important;
}

.active-menu{
  color:white !important;
  background-color: #0095ff;
}

</style>
