<template>
  <el-dialog title="领用详情" :visible.sync="equipmentDetailsShow" append-to-body width="850px" @open="open"
             center :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="queryForm" :model="this.detailData"  @submit.native.prevent :inline="true">
      <!-- 搜索栏 -->
      <el-form-item label="归还部门" prop="deptName">
        <el-input v-model="this.detailData.deptName"  disabled size="small"> </el-input>
      </el-form-item>
      <el-form-item label="归还人员" prop="userName">
        <el-input v-model="this.detailData.userName"  disabled size="small"> </el-input>
      </el-form-item>
      <el-form-item label="归还时间" prop="createTime">
         <el-input v-model="this.detailData.createTime" disabled  size="small"> </el-input>
      </el-form-item>
    </el-form>
     <!-- 表格 -->
     <div>
      <el-table v-loading="loading" :data="tableData" ref="multipleTable">
        <el-table-column type="index" label="序号" width="55px" />
        <el-table-column prop="equipmentNumber" label="设备编号" align="center" />
        <el-table-column prop="equipmentName" label="设备名称" align="center"/>
        <el-table-column prop="equipmentModel" label="设备型号" align="center"/>
        <el-table-column prop="equipmentClassName" label="设备分类" align="center"/>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
    </div>

  </el-dialog>
</template>
<script>
import{
    getEquipmentReturnDetail,

  } from "@/api/equipment/equipment"


export default {

  data() {
    return {
      // 查询参数
      queryParams: {
        userName: null,
        deptId: null,
      },
      deptName: null,
      loading: false,
      //类型列表
      tableData: [],
    }
  },
  components:{

  },
  props:{
    equipmentDetailsShow: {
      type: Boolean,
      default: false,
    },
    //识别码 collect  return
    distinguishCode:{
      type: String,
      default: false,
    },
    detailId:null,
    detailData:{
      type:Object,
      default:()=>({})
    }

  },
  methods:{
    open(){
      this.getlist();
    },
    /** input框搜索操作 */
    handleQuery() {
      this.getlist();
    },
    //获取设备归还列表
    getlist() {
      this.loading = true
      getEquipmentReturnDetail(this.detailId).then(response => {
          this.tableData = response.data;
          this.loading = false;
        }
      );
    },
    //取消按钮操作
    close() {
      this.$emit("update:equipmentDetailsShow", false);
    }
  },

  computed:{
    // title(){
    //   switch(this.distinguishCode){
    //     case 'collect':
    //       return '领用详情'
    //       break;
    //     case 'return':
    //       return '归还详情'
    //       break;
    //   }
    // }
  },
  created() {

  },
}
</script>
