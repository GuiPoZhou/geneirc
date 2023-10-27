<template>
<div class="returnTask">
   <el-dialog :title="title" :visible.sync="returnTaskShow" append-to-body width="1250px" @open="open"
        center :close-on-press-escape="false" :close-on-click-modal="false">
      <el-table :data="tableData" @selection-change= "handleSelectionChange" ref='multipleTable'>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="itemCode" label="项目名称" :show-overflow-tooltip="true" > </el-table-column>
        <el-table-column prop="sampleCode" label="方法编号"> </el-table-column>
        <el-table-column prop="subname" label="子法名称"> </el-table-column>
        <el-table-column prop="stroma" label="基质"> </el-table-column>
        <el-table-column prop="customerAppoint" label="指定方法">
			<template slot-scope="scope">
				<span v-if="scope.row.customerAppoint==0">否</span>
				<span v-else>是</span>
			</template>
		</el-table-column>
        <el-table-column prop="sampleCode" label="样品编码"> </el-table-column>
        <el-table-column prop="detectTypeStr" label="检测类别"> </el-table-column>
        <el-table-column prop="entrustCode" label="委托编码"> </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="primary" @click="submitForm" center >确认</el-button>
        <el-button @click="close">取消</el-button>
      </div>
   </el-dialog>
</div>
</template>
<script>

import {
    getSampleListResult,
    getItemListResult,
    receiveTask,
    returnTask
  } from "@/api/detectionManage/resultEntry/noReceived"
export default {
  name:'returnTask',
  components:{

  },
  data() {
    return {
      //按样品查询参数
      queryDataSample:{
       detectStatusList:[10],
       sampleList:[{
         entrustId:null,//协议ID
         detectType:null,//检测类别ID
         sampleId:null,//样品编码ID
       }]
      },
      //按项目查询参数
      queryDataItem:{
       detectStatusList:[10],
       itemList:[{
         entrustId:null,//协议ID
         detectType:null,//检测类别ID
         itemName:null,//项目名称
         itemCode:null,//方法编号
       }]
      },
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      //多选框选中的数据
      checkData:[],
      total:0,
      loading:false,
      tableData:[],

    }
  },
  props:{
    returnTaskShow: {
      type: Boolean,
      default: false,
    },
    rowDatas:{
      type: Array,
      default: ()=>([{}]),
    },
    //识别码
    distinguishCode:null,

  },
  methods:{
    open() {
      console.log('识别码==>',this.distinguishCode)
      if(this.distinguishCode == 'SampleReturnTask'){
        this.queryDataSample.sampleList = this.rowDatas
        this.getSampleList()

      }else{
        // 按项目
        this.queryDataItem.itemList = this.rowDatas
        this.getItemList()

      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      // console.log('多选框选中的ids=>',this.ids.join(","))
      // console.log('多选选中的数据的个数=>',this.ids.length)
      this.single = selection.length!==1
      this.multiple = !selection.length
      //多选框选中的数据
      this.checkData = selection;
      console.log('多选框选中的数据=>',this.checkData)
    },
    //取消按钮操作
    close() {
      this.$emit("update:returnTaskShow", false);
      this.queryDataSample.sampleList = [{
         entrustId:null,
         detectType:null,
         sampleId:null,
         detectCompleteDate:null
      }]
      this.queryDataItem.itemList = [{
         entrustId:null,
         detectType:null,
         sampleId:null,
         detectCompleteDate:null
       }]
    },
    //确认按钮操作
    submitForm(){
      console.log('多选框选中的id==>',this.ids)
      if(this.distinguishCode == 'SampleReceivedTask' || this.distinguishCode == 'ItemReceivedTask'){
        receiveTask(this.ids).then((res) => {
          this.close()
          this.$message.success("交回成功");
          this.$emit('init')
        }, (err) => {
        })
      }else{
        returnTask(this.ids).then((res) => {
          this.close()
          this.$message.success("交回成功");
          this.$emit('init')
        }, (err) => {
        })
      }
    },

    //按样品列表渲染
    getSampleList() {
      this.loading = true
      getSampleListResult(this.queryDataSample).then((res) => {
        console.log('按样品请求的任务列表==>',res.data)
        this.tableData = res.data.list;
        this.$nextTick(()=>{
          for(let i = 0; i < this.tableData.length; i++){
            this.$refs.multipleTable.toggleRowSelection(this.tableData[i])
          }
        })
        this.loading = false;
      }, (err) => {})
    },
    //按项目列表渲染
    getItemList() {
      this.loading = true
      getItemListResult(this.queryDataItem).then((res) => {
        console.log('按项目请求的任务列表==>',res.data)
        this.tableData = res.data.list;
        this.$nextTick(()=>{
          for(let i = 0; i < this.tableData.length; i++){
            this.$refs.multipleTable.toggleRowSelection(this.tableData[i])
          }
        })
        this.loading = false;
      }, (err) => {})
    },
  },
  computed:{
    title(){
      switch (this.distinguishCode){

        case "SampleReturnTask":
          return "按样品-交回任务"
          break;

        case "ItemReturnTask":
          return "按项目-交回任务"
          break;
      }
   }
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
