<template>
<div class="selectMethod">
   <el-dialog title="检测方法选择" :visible.sync="selectMethodShow" append-to-body width="1250px" @open="open"
        center :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-table :data="tableData" ref='multipleTable'>
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="detectCategoryName" label="检测类别"> </el-table-column>
        <el-table-column prop="itemName" label="检测项目名称" :show-overflow-tooltip="true" > </el-table-column>
        <el-table-column prop="methodCode" label="方法编码"> </el-table-column>
        <el-table-column prop="childMethodName" label="子法名称"> </el-table-column>
        <el-table-column prop="stroma" label="基质"> </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-info" @click="handleSelect(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
      </div>
   </el-dialog>
</div>
</template>
<script>

import {getDetectCategoryList} from "@/api/detectionManage/resultEntry/noRecord"
export default {
  name:'selectMethod',
  data() {
    return {
      total:0,
      loading:false,
      tableData:[],
    }
  },
  props:{
    selectMethodShow: {
      type: Boolean,
      default: false,
    },
    parmas:{
      type: Object,
      default: ()=>({}),
    },

  },
  methods:{
    open() {
        this.getMethodList()
    },

    //取消按钮操作
    close() {
      this.$emit("update:selectMethodShow", false);
    },
    //选择按钮操作
    handleSelect(row){
      //获取methodCode传给录入结果页面
      console.log('row.methodCode==>',row.methodCode)
      this.$emit("changeItemCode", row.methodCode)
      this.close()
    },

    //列表渲染
    getMethodList() {
      this.loading = true
      getDetectCategoryList(this.parmas).then((res) => {
        console.log('查询参数==>',this.parmas)
        if(res.code == 200){
          this.tableData = res.data.list;
          this.loading = false;
        }
      }, (err) => {})
    },
  },
  computed:{

  },
  created() {


  },
  mounted () {

  },
  updated (){

  }
}
</script>
<style lang="less" scoped>
  .pagination-container{
    height: 33px;
  }
  /deep/.dialog-footer{
  display: flex;
  align-items: center;
  height: 50px;
  line-height: 16px;
  font-size: 16px;
  .left{
    border-right: 2px solid rgb(156, 153, 153);
    padding-right: 10px;
    span{
      color: blue;
    }
  }
  .right{
    display: flex;
    span{
      display: block;
      margin-right: 10px;
    }
    align-items: center;
    margin-left: 10px;
  }
}
</style>
