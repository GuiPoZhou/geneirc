<template>
  <div class="app-container">
    <div class="a-c-top" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="业务编码" prop="businessCode">
        <el-input
          v-model="queryParams.businessCode"
          placeholder="请输入业务编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
		  @change="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务名称" prop="businessName">
        <el-input
          v-model="queryParams.businessName"
          placeholder="请输入业务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
		  @change="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务表名" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入业务表名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
		  @change="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="createUser">
        <el-input
          v-model="queryParams.createUser"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
		  @change="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改人" prop="updateUser">
        <el-input
          v-model="queryParams.updateUser"
          placeholder="请输入最后一次修改人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
		  @change="handleQuery"
        />
      </el-form-item>
      <div class="a-c-t-btnarea">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
      </el-form>
    </div>

    <div class="a-c-bottom">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="templateList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="业务编码" align="center" prop="businessCode" />
        <el-table-column label="业务名称" align="center" prop="businessName" />
        <el-table-column label="业务表名" align="center" prop="tableName" />
        <el-table-column label="默认表单模板" align="center" prop="defaultTemplate" v-if="defaultTemplateShow"/>
        <el-table-column label="创建人" align="center" prop="createUser" />
        <el-table-column label="最后一次修改人" align="center" prop="updateUser" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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
    </div>

    <!-- 添加或修改业务单默认配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="业务编码" prop="businessCode" v-show="isAdd">
          <el-input v-model="form.businessCode" placeholder="请输入业务编码" />
        </el-form-item>
        <el-form-item label="业务名称" prop="businessName" v-show="isAdd">
          <el-input v-model="form.businessName" placeholder="请输入业务名称" />
        </el-form-item>
        <el-form-item label="业务表名" prop="tableName" v-show="isAdd">
          <el-input v-model="form.tableName" placeholder="请输入业务表名" />
        </el-form-item>
        <el-form-item label="业务表名" prop="tableName" >
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.defaultTemplate">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate, exportTemplate } from "@/api/system/template";

export default {
  name: "Template",
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
      // 业务单默认配置表格数据
      templateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        businessCode: null,
        businessName: null,
        tableName: null,
        defaultTemplate: null,
        createUser: null,
        updateUser: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      defaultTemplateShow: false,
      isAdd: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询业务单默认配置列表 */
    getList() {
      this.loading = true;
      listTemplate(this.queryParams).then(response => {
        this.templateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        businessCode: null,
        businessName: null,
        tableName: null,
        defaultTemplate: null,
        createTime: null,
        createUser: null,
        updateTime: null,
        updateUser: null
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isAdd = true;
      this.title = "添加业务单默认配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
        console.log('row',row)
      this.reset();
      const id = row.id || this.ids
      this.isAdd = false;

      getTemplate(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改业务单默认配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
              this.form.defaultTemplateExt =JSON.parse(this.form.defaultTemplate)
            updateTemplate(this.form).then(response => {
              if (response.code === 200) {
                this.$message.success("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addTemplate(this.form).then(response => {
              if (response.code === 200) {
                this.$message.success("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除业务单默认配置编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTemplate(ids);
        }).then(() => {
          this.getList();
          this.$message.success("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有业务单默认配置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTemplate(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
