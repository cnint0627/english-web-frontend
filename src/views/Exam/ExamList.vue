<template>
  <div>
    <h1>组卷列表</h1>
    <a-table id="table"
             :dataSource="dataSource"
             :columns="columns"
             :pagination="pagination"
             :customRow="handleView"
             @change="handleChangePage"
    />
  </div>
</template>

<script>
import {getAction} from "@/api/action";

export default {
  name: "ExamList",
  data() {
    return {
      dataSource: [

      ],
      columns: [
        {
          title: '序号',
          width: 100,
          align: 'center',
          customRender:(t,r,index)=>{
            return (this.pagination.current-1)*this.pagination.pageSize+index+1
          },
        },
        {
          title: '标题',
          width: 600,
          align: 'center',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '发布时间',
          width: 200,
          align: 'center',
          dataIndex: 'createTime',
          key: 'createTime'
        }
      ],
      pagination:{
        total:0,
        current:1,
        pageSize:10,
        showQuickJumper:true
      },
      url:{
        page:"/exam/page"
      }
    };
  },
  methods:{
    // 分页查询
    page(pageNum){
      getAction(this.url.page+"?pageNum="+pageNum+"&pageSize="+this.pagination.pageSize)
          .then(res=>{
            console.log(res.data)
            this.dataSource=res.data.records
            this.pagination.current=pageNum
            this.pagination.total=res.data.total
          })
    },
    // 页数变化
    handleChangePage(e){
      this.page(e.current)
    },
    // 点击进入阅读详情页
    handleView(record){
      return {
        on: {
          click: () => {
            window.open(this.$router.resolve({path:"/exam/"+record.id}).href,'_blank')
          }
        }
      }
    }
  },
  created() {
    this.page(this.pagination.current)
  }
};
</script>

<style>
#table{
  width:1200px;

}
</style>