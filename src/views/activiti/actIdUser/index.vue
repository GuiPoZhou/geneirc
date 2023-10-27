<template>
  <div class="app-container">
    <div class="a-c-top" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item label="账号" prop="id">
          <el-input
            v-model="queryParams.id"
            placeholder="请输入账号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="名字" prop="first">
          <el-input
            v-model="queryParams.first"
            placeholder="请输入姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="queryParams.email"
            placeholder="请输入邮箱"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="a-c-bottom">
      <el-row :gutter="10" class="mb8">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="handleQuery"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" :data="actIdUserList" border
					stripe>

        <el-table-column label="账号" align="center" prop="id" />
        <el-table-column label="姓名" align="center" prop="first" />
        <el-table-column label="邮箱" align="center" prop="email" />
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>


  </div>
</template>

<script>
import { listActIdUser } from "@/api/activiti/actIdUser";

export default {
  name: "ActIdUser",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 流程用户表格数据
      actIdUserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        first: null,
        email: null,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流程用户列表 */
    getList() {
      this.loading = true;
      listActIdUser(this.queryParams).then(response => {
        this.actIdUserList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

  }
};
</script>
