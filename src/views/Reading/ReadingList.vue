<template>
  <div>
  <h1>阅读列表</h1>
  <a-table id="table"
           :dataSource="dataSource"
           :columns="columns"
           :pagination="pagination"
           :customRow="handleLoadReading"
           @change="handleChangePage"
  />
  </div>
</template>

<script>
import {getAction} from "@/api/action";

export default {
  name: "ReadingList",
  data() {
    return {
      dataSource: [
        { key: '1', name: 'John Doe', age: 32, address: 'New York' },
        { key: '2', name: 'Jane Smith', age: 42, address: 'London' },
        { key: '3', name: 'Bob Johnson', age: 28, address: 'Paris' }
      ],
      columns: [
        {
          title: '序号',
          customRender:(t,r,index)=>{
            return (this.pagination.current-1)*this.pagination.pageSize+index+1
        },
        },
        { title: '标题', dataIndex: 'title', key: 'title' },
        { title: '发布时间', dataIndex: 'createTime', key: 'createTime' }
      ],
      pagination:{
        total:0,
        current:1,
        pageSize:10,
        showQuickJumper:true
      },
      url:{
        page:"/reading/page"
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
    handleLoadReading(record){
      return {
        on: {
          click: () => {
            this.$router.push({path:"/reading/"+record.id})
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
  width:60%;
  margin-left: 20%;

}
</style>