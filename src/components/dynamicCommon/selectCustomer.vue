<template>
  <el-dialog title="客户选择" :visible.sync="visible" append-to-body width="800px"
    center :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="queryForm" :model="queryParams" label-width="80px">
      <!-- 搜索栏 -->
      <el-form-item label="客户名称">
        <el-input
        @keyup.enter.native="handleQuery"
        v-model="queryParams.customerName"
        clearable
        placeholder="请输入客户名称">
        </el-input>
      </el-form-item>
      <!-- 表格 -->
      <el-table v-loading="loading" :data="dynamicList" >
        <el-table-column prop="customerName" label="客户名称" width="180" :show-overflow-tooltip="true"/>
        <el-table-column prop="contact" label="联系人" width="180" />
        <el-table-column prop="contactPhone" label="联系电话" width="180" />
        <el-table-column label="操作" align="center" class-name="right">
          <template slot-scope="scope">
            <el-button @click="selectCustomerHandleClick(scope.row)" type="primary" round size="mini">选择</el-button>
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
  getEnvCustomerList
} from "@/api/dynamicCommon/config";
export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerName: null,
        contact: null,
        contactPhone: null
      },
      // 参数表格数据
      tableData: [],
      //选择的类别名称
      selectDetectName:"",
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
  },
  methods:{
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      getEnvCustomerList(this.queryParams).then(response => {
        this.dynamicList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
    },
    //取消按钮操作
    close() {
      this.$emit("update:visible", false);
    },
    //选择按钮操作
    selectCustomerHandleClick(row) {
      this.$emit("selectCustomerHandleClick", row);
      this.close();
    },
  },
  computed:{
  },
  created() {
    this.getList();
  },
}
</script>
