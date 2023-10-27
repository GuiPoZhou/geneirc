<template>
  <el-dialog title="检测方案选择" :visible.sync="visible" append-to-body width="800px"
    center :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" @open="open">
    <el-form ref="queryForm" :model="queryParams" label-width="80px">
      <!-- 搜索栏 -->
      <el-form-item label="方案编码">
        <el-input
        @keyup.enter.native="handleQuery"
        v-model="queryParams.schemeCode"
        clearable
        placeholder="请输入客户名称">
        </el-input>
      </el-form-item>
      <!-- 表格 -->
      <el-table v-loading="loading" :data="dynamicList" >
        <el-table-column type="index" prop="id" label="序号" width="55px" />
        <el-table-column prop="schemeCode" label="方案编码" width="180" />
        <el-table-column prop="customerName"  label="客户名称" :show-overflow-tooltip="true"/>
        <el-table-column prop="projectName"  label="项目名称" :show-overflow-tooltip="true" />
        <el-table-column prop="sampleSource"  label="样品来源"  width="100px" :formatter="formatter"/>
        <el-table-column prop="executeDate"  label="执行日期" />
        <el-table-column label="操作" align="center" class-name="right">
          <template slot-scope="scope">
            <el-button @click="selectDetectSchemeHandleClick(scope.row)" type="primary" round size="mini">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getDetectSchemeList,
  getDetectSchemeDetailByDate,
} from "@/api/dynamicCommon/config";
export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        schemeCode: null,
        sampleSource: null
      },
      // 参数表格数据
      tableData: [],
      //选择的类别名称
      dynamicList: [],
      loading: false,
      total: 0

    }
  },
  props:{
    visible: {
      type: Boolean,
      default: false,
    },
    sampleSource: {
      type: Number,
      default: null,
    }
  },
  methods:{
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    getList() {
      if(this.sampleSource) {
        this.loading = true;
        getDetectSchemeList(this.queryParams).then(response => {
          this.dynamicList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        })
      }
    },
	formatter(row, column, cellValue, index) {
		if (column.property === "sampleSource") {
			if (cellValue === 1) {
				return "采样";
			} else {
				return "送样";
			}
		}
		return cellValue;
	},
    //取消按钮操作
    close() {
      this.$emit("update:visible", false);
    },
    //选择按钮操作
    selectDetectSchemeHandleClick(row) {
      getDetectSchemeDetailByDate(row.id, row.executeDate).then(response => {
        this.$emit("selectDetectSchemeHandleClick", response.data);
        this.close();
      })
    },
    open() {
      this.queryParams.sampleSource = this.sampleSource;
      this.getList();
    }
  },
  computed:{
  },
  created() {
    // this.getList();
  },
}
</script>
