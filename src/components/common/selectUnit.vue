<template>
  <el-dialog title="选择计量单位" :visible.sync="visible" append-to-body width="600px"
    center :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
    <el-form ref="queryForm" :model="queryParams"  @submit.native.prevent :inline="true">
      <!-- 搜索栏 -->
      <el-form-item label="单位名称">
        <el-input
          @keyup.enter.native="handleQuery"
          v-model="queryParams.unitName"
          clearable
          size="small"
          placeholder="请输入选择单位名称">
        </el-input>

      </el-form-item>
      <el-form-item >
          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
     </el-form-item>

    </el-form>
     <!-- 表格 -->
     <div>
      <el-table   height="500" :data="unitList">
        <el-table-column type="index" prop="id" label="序号" width="55px" />
        <el-table-column prop="unitName" label="单位名称" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="unitAlias" label="单位别名" align="center" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" round size="mini">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { listAllUnit } from "@/api/standardManagement/measuringUnit"
export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        unitName:null
      },
      //单位列表
      unitList: [],
    }
  },
  props:{
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods:{
    /** input框搜索操作 */
    handleQuery() {
      this.getlist();
    },
    //获取检测类别列表
    getlist() {
      listAllUnit(this.queryParams).then(response => {
          this.unitList = response.data;
        }
      );
    },
    //取消按钮操作
    close() {
      this.$emit("update:visible", false);
    },
    //选择按钮操作
    handleClick(row) {
      this.$emit('backfill',row)
      this.close()
    },

  },
  computed:{

  },
  created() {
    this.handleQuery();
  },
}
</script>
