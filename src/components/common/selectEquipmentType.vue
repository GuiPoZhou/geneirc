<template>
  <el-dialog title="选择设备分类" :visible.sync="visible" append-to-body width="600px"
    center :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
     <!-- 表格 -->
     <div>
      <el-table   height="500" :data="equipmentTypeList" ref="multipleTable">
        <el-table-column type="selection"  width="55"></el-table-column>
        <el-table-column prop="dictLabel" label="设备分类" align="center" />
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="commit">确认</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { listData } from "@/api/system/dict/data"
export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        dictType:"equipment_type"
      },
      //类型列表
      equipmentTypeList: [],
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.getlist()
        }
      }
    }
  },
  props:{
    visible: {
      type: Boolean,
      default: false,
    },
    selectedEquipmentType:{
      type: Array,
      default: [],
    }
  },
  mounted() {
    this.getlist()
  },
  methods:{
    /** input框搜索操作 */
    handleQuery() {
      this.getlist();
    },
    //获取检测类别列表
    getlist() {
      listData(this.queryParams).then(response => {
            this.equipmentTypeList = response.rows;
          }
      );
    },
    //取消按钮操作
    close() {
      this.$emit("update:visible", false);
    },
    //选择按钮操作
    commit() {
      this.$emit('backfill',this.$refs.multipleTable.selection)
      this.close()
    },
    //勾选选中的
    initSelected(){

      let dictCodeArr =  this.selectedEquipmentType.map(type=>type.dictCode)

      this.equipmentTypeList.forEach(type=>{
        if(dictCodeArr.indexOf(type.dictCode)>-1){
          this.$refs.multipleTable.toggleRowSelection(type,true)
        }
      })
    }

  },
  created() {
    this.handleQuery();
  },
  updated(){
      this.initSelected()
  }
}
</script>
