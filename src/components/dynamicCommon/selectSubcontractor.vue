<template>
  <el-dialog title="分包商选择" :visible.sync="visible" append-to-body width="800px"
             center :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" @open="open">
    <el-form ref="queryForm" :model="queryParams" label-width="80px">
      <!-- 搜索栏 -->
      <el-form-item label="分包商名称">
        <el-input
          @keyup.enter.native="handleQuery"
          v-model="queryParams.subcontractorName"
          clearable
          placeholder="请输入分包商名称">
        </el-input>
      </el-form-item>
      <!-- 表格 -->
      <el-table v-loading="loading" :data="dynamicList" >
        <el-table-column prop="subcontractorName" label="分包商名称" width="180" />
        <el-table-column prop="legalPerson" label="分包商法人" width="180" />
        <el-table-column prop="creditCode" label="统一社会信用代码" width="180" />
        <el-table-column label="操作" align="center" class-name="right">
          <template slot-scope="scope">
            <el-button @click="selectSubcontractorHandleClick(scope.row)" type="primary" round size="mini">选择</el-button>
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
    getSubcontractorList
  } from "@/api/dynamicCommon/config";
  export default {
    data() {
      return {
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          deptName: null
        },
        // 参数表格数据
        tableData: [],
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
        getSubcontractorList(this.executionTemplateId, this.queryParams).then(response => {
          this.dynamicList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        })
      },
      //取消按钮操作
      close() {
        this.$emit("update:visible", false);
      },
      //选择按钮操作
      selectSubcontractorHandleClick(row) {
        this.$emit("selectSubcontractorHandleClick", row);
        this.close();
      },
      open() {
        this.getList();
      },
    },
    computed:{
    },
  }
</script>
