<template>
  <div>
    <h1>管理阅读列表</h1>
    <a-row style="width: 100%">
      <a-col style="float:right;width: 150px;margin-bottom: 20px">
        <a-button @click="handleAdd">新增</a-button>
      </a-col>
    </a-row>
    <a-table id="table"
             :dataSource="dataSource"
             :columns="columns"
             :pagination="pagination"
             @change="handleChangePage"
    >
       <span slot="action" slot-scope="text, record">
         <a @click="handleView(record)">详情</a>
         <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
              title="确定删除吗?"
              @confirm="() => handleDelete(record)"
          >
            <a style="color:red">删除</a>
          </a-popconfirm>
        </span>
    </a-table>
    <ReadingModal ref="modalForm"></ReadingModal>
  </div>
</template>

<script>
import {getAction, postAction} from "@/api/action";
import ReadingModal from "@/views/Admin/ReadingModal.vue";
import {message} from "ant-design-vue";

export default {
  name: "ReadingList",
  components:{
    ReadingModal
  },
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
        },
        {
          title: '操作',
          width: 200,
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination:{
        total:0,
        current:1,
        pageSize:10,
        showQuickJumper:true
      },
      url:{
        page:"/reading/page",
        getById:"/reading/getById",
        delete:"/reading/delete"
      }
    };
  },
  created() {
    this.page(this.pagination.current)
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
      window.open(this.$router.resolve({path:"/reading/"+record.id}).href,'_blank')
    },

    // 点击新增阅读文章
    handleAdd(){
      this.$refs.modalForm.model= JSON.parse(JSON.stringify(this.$refs.modalForm.modelDefault))
      this.$refs.modalForm.visible=true
    },

    // 点击编辑阅读文章
    handleEdit(record){
      console.log(record)
      getAction(this.url.getById+"?id="+record.id)
          .then(res=>{
            console.log(res)
            this.$refs.modalForm.model= JSON.parse(JSON.stringify(res.data))
            this.$refs.modalForm.visible=true
          })
    },

    // 点击删除阅读文章
    handleDelete(record){
      postAction(this.url.delete+"?id="+record.id)
          .then(res=>{
            console.log(res)
            message.success("删除成功",1)
            this.page(this.pagination.current)
          })
    }
  },
};
</script>

<style>
#table{
  width:1200px;
  align-self: center;
}
</style>