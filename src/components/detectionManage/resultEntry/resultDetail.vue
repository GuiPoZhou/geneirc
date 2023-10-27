<template>
<div class="receiveTask">
   <el-dialog title="结果详情" :visible.sync="resultDetailShow" append-to-body width="1500px" @open="open"
        center :close-on-press-escape="false" :close-on-click-modal="false">

      <el-table :data="tableData" ref='multipleTable'>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="entrustCode" label="委托编号" :show-overflow-tooltip="true" />
        <el-table-column prop="detectTypeStr" label="检测类别" />
        <el-table-column prop="sampleCode" label="样品编码" />
        <el-table-column prop="itemName" label="检测项目名称" :show-overflow-tooltip="true" />
				<el-table-column prop="editHisCount" label="修改记录">
					<template slot-scope="scope">
						<a style="color: #1890ff;" @click="getEditHisCount(scope.row)">{{scope.row.editHisCount}}</a>
					</template>
				</el-table-column>
				<el-table-column prop="instrumentCount" label="检测仪器">
					<template slot-scope="scope">
						<a style="color: #1890ff;" @click="getInstrumentCount(scope.row)">{{scope.row.instrumentCount}}</a>
					</template>
				</el-table-column>
				<el-table-column prop="editHisCount" label="检测记录">
					<template slot-scope="scope">
						<a @click="getFile(scope.row)" style="color: #1890ff;">{{
							scope.row.itemFileList ? scope.row.itemFileList.length : 0
							}}</a>
					</template>
				</el-table-column>
				<el-table-column prop="detectResult" label="检测结果" />
				<el-table-column prop="detectResultUnitStr" label="结果单位" />
        <el-table-column prop="itemCode" label="方法编号" />
        <el-table-column prop="subname" label="子法名称" />
        <el-table-column prop="stroma" label="基质" />
        <el-table-column prop="customerAppoint" label="指定方法">
            <template slot-scope="scope">
              <span v-if="scope.row.customerAppoint==0">否</span>
              <span v-else>是</span>
            </template>
          </el-table-column>
        <el-table-column prop="detectLimit" label="方法检出限" />
        <el-table-column prop="detectUnitStr" label="检出限单位" />
        <el-table-column prop="rationLimit" label="定量限值" />
        <el-table-column prop="a" label="执行标准" />
        <el-table-column prop="b" label="判定指标" />
        <el-table-column prop="conclusion" label="判定结论" />
        <el-table-column prop="updateBy" label="录入人员" />
        <el-table-column prop="updateTime" label="录入日期" :show-overflow-tooltip="true" />
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total>0" :total="total" :page.sync="queryData.pageNum" :limit.sync="queryData.pageSize" @pagination="getResultList" />
      <div slot="footer">
        <el-button @click="close">取消</el-button>
      </div>
   </el-dialog>
   <instrumentInfo :instrumentShow.sync = 'instrumentShow' :instrumentIds='instrumentIds'/>
   <countHis :countHisShow.sync = 'countHisShow' :resultId='resultId'/>
	 <fileList :showFileOpen.sync="showFileOpen" :tableData.sync="fileList" :disabled="true"/>
</div>
</template>
<script>
import countHis from './countHis'
import instrumentInfo from './instrumentInfo'
import {getSampleListDetail,} from "@/api/detectionManage/resultEntry/completed"
import fileList from "./fileList";

export default {
  name:'recordResult',
  components:{
    countHis,
    instrumentInfo,
		fileList
  },
  data() {
    return {
      total:0,
      loading:false,
      tableData:[],
      queryData:{
        pageNum:1,
        pageSize:10,
        sampleItemIdList:null
      },
      resultId:null,
      countHisShow:false,//历史记录列表
      instrumentShow:false,
      instrumentIds:'',//仪器id

			showFileOpen: false,
			fileList: [],
    }
  },
  props:{
    resultDetailShow: {
      type: Boolean,
      default: false,
    },
    sampleItemIdLists:{
      type: Array,
      default:()=>([]),
    }
  },
  methods:{
    open() {
      this.getResultList()
    },


    //取消按钮操作
    close() {
      this.$emit("update:resultDetailShow", false);
    },

    //历史记录列表
    getEditHisCount(row){
      console.log('结果id==>',row.resultId)
      this.resultId = row.resultId
      this.countHisShow = true
    },
    //检测仪器
    getInstrumentCount(row){
      this.instrumentIds = row.instrumentIds
      this.instrumentShow = true
    },
    //录入结果列表
    getResultList() {
      this.loading = true
      this.queryData.sampleItemIdList = this.sampleItemIdLists.join(',')
      getSampleListDetail(this.queryData).then((res) => {
        this.tableData = res.data.list;
        this.total= res.data.total;
        this.loading = false;
      }, (err) => {})
    },
		getFile(row){
			this.fileList = row.itemFileList;
			this.showFileOpen = true;
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
/deep/.input_content{
  margin-left: 700px;
  margin-top: 14px;
}
/deep/.input_content2{
  margin-left: 900px;
  margin-top: 14px;
}

</style>
