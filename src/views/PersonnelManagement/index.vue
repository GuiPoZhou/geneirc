<template>
  <div class="app-container">
    <!-- 统一样式 - 查询区域 -->
    <div class="a-c-top" v-show="showSearch">
      <!-- 表单 -->
      <el-form
        :inline="true"
        :model="queryParams"
        ref="queryParams"
        class="demo-form-inline"
        label-width="100px"
      >
        <el-form-item label="人员姓名">
          <el-input v-model="queryParams.staffName" clearable style="width: 240px" size="small"
                    @clear="handleQuery"/>
        </el-form-item>
        <el-form-item label="员工编号">
          <el-input v-model="queryParams.staffCode" clearable style="width: 240px" size="small"
                    @clear="handleQuery"/>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-input clearable v-model="queryParams.departmentName" style="width: 240px" size="small"
                    @clear="handleQuery"/>
        </el-form-item>
        <el-form-item label="人员状态">
          <el-select v-model="queryParams.status" clearable placeholder="所有类型"
                     style="width: 240px" size="small">
            <el-option label="在职" :value="0"></el-option>
            <el-option label="离职" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <!-- 统一样式 - 查询区域 按钮 -->
        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
            >搜索
            </el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置
            </el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 统一样式 - 主列表区域 -->
    <div class="a-c-bottom">
      <!-- 按钮 -->
      <el-row>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="margin-left: 10px; margin-bottom: 10px"
            @click="handleAdd"
          >
            新增
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="margin-left: 10px; margin-bottom: 10px"
            @click="handleBatchWorkLicense"
          >
            批量维护上岗证
          </el-button>
          <el-button v-for="(v, i) in projectSlotButtonList.entrySlotButtonList" :key="i" :type="v.type" :size="v.size" @click="e_slotButtonEvents(v)">{{ v.label }}
          </el-button>
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getTableList"
        ></right-toolbar>
      </el-row>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        ref="personnelTable"
        align="center"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="index" type="index" label="序号" width="55px" align="center">
          <template slot-scope="scope">
            <span>{{
              (queryParams.pageNum - 1) * queryParams.pageSize +
              scope.$index +
              1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="staffCode"
          label="员工编号" align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="staffName" label="员工姓名" align="center"/>
        <el-table-column
          prop="departmentName"
          label="所属部门" align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="staffSex" label="性别" width="80" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.staffSex == 0">男</span>
            <span v-if="scope.row.staffSex == 1">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" align="center"/>
        <el-table-column prop="positionName" label="职务/岗位" width="160px" align="center"/>
        <el-table-column prop="staffEducation" label="学历" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.staffEducation == 0">硕士</span>
            <span v-if="scope.row.staffEducation == 1">本科</span>
            <span v-if="scope.row.staffEducation == 2">专科</span>
            <span v-if="scope.row.staffEducation == 3">博士</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="workLicenseTypeName"
          show-overflow-tooltip
          label="上岗证类型" align="center"
        />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">在职</span>
            <span v-if="scope.row.status == 1">离职</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="entryTime"
          label="入职时间" align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="departureTime"
          label="离职时间" align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-info"
              @click="viewHandle(scope.row)"
            >
              详情
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="editHandle(scope.row)"
            >
              修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteHandle(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getTableList"
      />
    </div>
    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" class="systemUserlog" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url"
                 :disabled="upload.isUploading" :on-progress="handleFileUploadProgress"
                 :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                   @click="importTemplate">下载模板
          </el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <saveOrEdit
      v-if="saveShow"
      @reload="getTableList"
      ref="saveOrEditH"
      :title="title"
      @close="saveShow = false"
      @func="getTableList"
    />
    <viewDetails
      :viewShow.sync="viewShow"
      @reload="getTableList"
      ref="viewDetailsH"
      :title="title"
    />
    <workLicenseBatch
      v-if="certificateShow"
      @reload="getTableList"
      @close="certificateShow = false"
      ref="workLicenseBatchH"
      :title="title"
      @func="getTableList"
    />
  </div>
</template>

<script>
  import {
    getPersonnelFileList,
    deleteApi
  } from '@/api/personnel/personnel'
  import { getToken } from "@/utils/auth";
  import saveOrEdit from './saveOrEdit'
  import viewDetails from './viewDetails'
  import workLicenseBatch from './workLicenseBatch'
  export default {
    name: 'personnel',
    components: {
      saveOrEdit,
      viewDetails,
      workLicenseBatch
    },
    data() {
      return {
        saveShow: false,
        viewShow: false,
        certificateShow: false,
        loading: true,
        // 显示搜索条件
        showSearch: true,
        //表单参数
        queryParams: {
          pageSize: 10,
          pageNum: 1,
          staffCode: '',
          staffName: '',
          departmentName: '',
          status: ''
        },
        total: 0,
        // 参数表格数据
        tableData: [],
        title: '',
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 模板下载地址
          templateUrl: '',
          // 上传文件的基础地址
          baseUrl: '', // 使用 baseUrl 初始化 baseUrl 属性
          // 上传的地址
          url: window.globalEnv.VUE_APP_BASE_API
        },
        projectSlotButtonList: {},//
      }
    },
    watch: {
      "upload.baseUrl"(val) {
        if (val) {
          this.upload.url = window.globalEnv.VUE_APP_BASE_API + val
        }
      },
    },
    methods: {
      //获取单元信息管理列表
      getTableList() {
        getPersonnelFileList(this.queryParams).then((response) => {
          console.log('getTableList', response.data.list)
          this.tableData = response.data.list
          this.total = response.data.total
          this.loading = false
        })
      },
      //查询按钮操作
      // onSubmit() {
      // 	this.getTableList()
      // },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams.staffCode = ''
        this.queryParams.staffName = ''
        this.queryParams.departmentName = ''
        this.queryParams.pageSize = 10
        this.queryParams.status = ''
        this.queryParams.pageNum = 1
        this.handleQuery()
      },
      e_slotButtonEvents(v) {
        var that = this
        new Function('that', v.events)(that)
      },
      /** 下载模板操作 */
      importTemplate() {
        this.$net(this.upload.templateUrl, 'getFile').then(response => {
          const blob = new Blob([response], { type: 'application/vnd.ms-excel' });
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `模板${new Date().getTime()}.xlsx`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(downloadUrl);
        })
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
        this.getList()
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      getList() {
        this.getTableList()
      },
      // //重置按钮操作
      // resetForm() {
      // 	this.queryParams.deptName = ''
      // 	this.$refs.queryParams.resetFields()
      // 	this.getTableList()
      // },
      //删除按钮操作
      deleteHandle(row) {
        const id = row.id
        this.$confirm('确定要删除吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function () {
            return deleteApi(id)
          })
          .then(() => {
            this.getTableList()
            this.$message.success('删除成功')
          })
          .catch(function () {
          })
      },
      //新增
      handleAdd() {
        this.title = '新增人员信息'
        this.saveShow = true
        this.$nextTick(() => {
          this.$refs.saveOrEditH.addInit()
        })
      },
      //编辑按钮操作
      editHandle(row) {
        const id = row.id
        this.title = '编辑人员信息'
        this.saveShow = true
        this.$nextTick(() => {
          this.$refs.saveOrEditH.editInIt(id, 1)
        })
      },
      //查看按钮操作
      viewHandle(row) {
        const id = row.id
        this.title = '查看人员信息'
        this.viewShow = true
        this.$refs.viewDetailsH.viewInIt(id)
      },
      //批量维护上岗证
      handleBatchWorkLicense() {
        if (this.$refs.personnelTable.selection.length == 0) {
          this.$message.success('请选择一条信息')
          return
        }

        let tempIds = []
        this.$refs.personnelTable.selection.forEach((item) => {
          tempIds.push(item.id)
        })

        this.title = '批量维护上岗证'
        this.certificateShow = true
        this.$nextTick(() => {
          this.$refs.workLicenseBatchH.init(tempIds.join(','))
        })
      }
    },
    async created() {
      this.getTableList()
      this.projectSlotButtonList = await this.getProjectSlotButtons('personnelButton')
    }
  }
</script>

<style scoped>
</style>
