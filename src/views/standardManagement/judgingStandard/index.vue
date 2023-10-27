<template>
  <div class="app-container app-mall-container">
    <el-row :gutter="20">
      <!--分类-->
      <el-col :span="5" :xs="24">
        <classification :type="type" :treeList="treeList" @updata="updata"
                        @handleData="handleData"></classification>
      </el-col>
      <el-col :span="19" :xs="24" class="a-m-c-right">
        <!-- 查询区域 -->
        <div class="a-c-top" v-show="showSearch">
          <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            label-width="100px"
          >
            <el-form-item label="标准号" prop="standardCode">
              <el-input
                v-model="queryParams.standardCode"
                placeholder="请输入标准号"
                clearable
                class="input-with-select"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                clearable
                style="width: 240px"
              >
                <el-option label="现行" :value="0"></el-option>
                <el-option label="将实施" :value="1"></el-option>
                <el-option label="作废" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="检测类别" prop="detectcategory">
              <el-input
                v-model="queryParams.detectcategory"
                placeholder="请输入检测类别"
                clearable
                class="input-with-select"
                style="width: 240px"
              />
            </el-form-item>
            <el-form-item label="发布日期">
              <el-date-picker
                v-model="dateRange"
                style="width: 260px"
                value-format="yyyy-MM-dd"
                @change="ondateChange"
                type="daterange"
                range-separator="-"
                start-placeholder="选择开始日期"
                end-placeholder="选择结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="实施日期">
              <el-date-picker
                v-model="dateRange1"
                style="width: 260px"
                value-format="yyyy-MM-dd"
                @change="ondateChange1"
                type="daterange"
                range-separator="-"
                start-placeholder="选择开始日期"
                end-placeholder="选择结束日期"
              ></el-date-picker>
            </el-form-item>
            <div class="a-c-t-btnarea">
              <el-form-item>
                <el-button
                  type="cyan"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery">搜索
                </el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                >重置
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="a-c-bottom">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="e_add"
                :disabled="multiple"
              >新增
              </el-button
              >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                :disabled="ismultiple"
                @click="e_edit"
              >修改
              </el-button
              >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-document-copy"
                :disabled="ismultiple"
                @click="e_copy"
              >复制
              </el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                :disabled="ismultiple"
                @click="e_del"
              >删除
              </el-button>
              <el-button
                type="success"
                size="mini"
                v-loading="isloading"
                @click="e_leadingOut"
              >导出模板
              </el-button>
              <el-button
                type="success"
                size="mini"
                @click="e_leadingIn"
              >导入数据
              </el-button>
            </el-col>
            <el-col :span="1.5"></el-col>
            <right-toolbar
              :showSearch.sync="showSearch"
              @queryTable="resetQuery"
              @changeBox="e_changeBox"
              :boxData="colData"
            ></right-toolbar>
          </el-row>
          <!-- 列表区域 -->
          <el-table
            v-loading="loading"
            :data="listData"
            row-key="id"
            ref="selectTable"
            highlight-current-row
            stripe
            border
          >
            <!--@current-change="handleCurrentChange"-->
            <el-table-column label="" width="40" align="center">
              <template scope="scope">
                <el-radio :label="scope.$index" @change.native="handleCurrentChange(scope.row)"
                          v-model="radio"></el-radio>
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
            />
            <el-table-column
              prop="standardCode"
              label="标准号"
              show-overflow-tooltip
              v-if="colData[0].istrue"
            />
            <el-table-column
              prop="standardNameCn"
              label="标准名称"
              show-overflow-tooltip
              v-if="colData[1].istrue"
            />
            <el-table-column
              prop="status"
              label="状态"
              show-overflow-tooltip
              v-if="colData[2].istrue"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status === '0'">现行</span>
                <span v-if="scope.row.status === '1'">将实施</span>
                <span v-if="scope.row.status === '2'">作废</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="publishDate"
              label="发布日期"
              show-overflow-tooltip
              v-if="colData[3].istrue"
            />
            <el-table-column
              prop="startDate"
              label="实施日期"
              show-overflow-tooltip
              v-if="colData[4].istrue"
            />
            <el-table-column
              prop="detectcategoryNameStr"
              label="关联检测类别"
              show-overflow-tooltip
              v-if="colData[5].istrue"
            />
            <el-table-column
              prop="decideStandardTreeName"
              label="自定义标准分类"
              show-overflow-tooltip
              v-if="colData[6].istrue"
            />
            <el-table-column
              prop="standardTypeName"
              label="标准分类"
              show-overflow-tooltip
              v-if="colData[7].istrue"
            />
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleIndex(scope.row)"
                >维护判定指标
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </el-col>
    </el-row>
    <create-standard
      v-if="showStand"
      ref="standard"
      @close="handleclose"
    ></create-standard>
    <maintenance-criteria
      v-if="showIndex"
      ref="criteria"
      @close="showIndex = false">
    </maintenance-criteria>
    <!--        导入模板-->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm" :loading="isUpload">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import classification from './components/classification.vue'
  import createStandard from './dialog/createStandard.vue'
  import maintenanceCriteria from './dialog/maintenanceCriteria'
  import {
    getStandardTreelist,
    getStandardList,
    detailStandard,
    copyStandard,
    delStandard,
    downloadFile
  } from '@/api/standardManagement/standardManagement.js'
  import {getToken} from "@/utils/auth";

  export default {
    name: "index",
    components: {
      classification,
      createStandard,
      maintenanceCriteria
    },
    data() {
      return {
        isUpload: false,
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
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: window.globalEnv.VUE_APP_BASE_API + "/decideStandard/v1/standard/action/import"
        },
        //查询条件
        queryParams: {
          decideStandardTreeId: "",
          standardCode: "",
          status: "",
          publishDateBegin: "",
          publishDateEnd: "",
          detectcategory: "",
          startDateBegin: "",
          startDateEnd: "",
          pageNum: 1,
          pageSize: 10
        },
        showStand: false,
        showIndex: false,
        showSearch: true,
        dateRange: [],
        dateRange1: [],
        dateValue: [],
        dateValue1: [],
        loading: false,
        isloading: false,
        listData: [],
        colData: [
          {title: "标准号", istrue: true},
          {title: "标准名称", istrue: true},
          {title: "状态", istrue: true},
          {title: "发布日期", istrue: true},
          {title: "实施日期", istrue: true},
          {title: "关联检测类别", istrue: true},
          {title: "自定义标准分类", istrue: true},
          {title: "标准分类", istrue: true},
        ],
        type: '0',
        treeList: [],
        trssdata: {},
        total: 0,
        multiple: true,
        ismultiple: true,
        tabledataList: [],
        productTreeList: [],
        radio: ''
      }
    },
    mounted() {
      this.getTreelist()
      this.getList()
    },
    methods: {
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
        this.getList();
        this.isUpload = false
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      /**
       * @author Coder
       * @date 2023/3/31
       * @des 导出
       */
      e_leadingOut() {
        this.isloading = true
        downloadFile().then(re => {
          const a = document.createElement('a')
          const href = URL.createObjectURL(new Blob([re], {type: 'application/vnd.ms-excel'}))
          a.download = `判断标准模板.xls`
          a.href = href
          a.click()
          URL.revokeObjectURL(href)
          this.isloading = false
        })
      },
      /**
       * @author Coder
       * @date 2023/3/31
       * @des 导入
       */
      e_leadingIn() {
        this.upload.open = true
      },
      submitFileForm() {
        this.isUpload = true
        this.$refs.upload.submit();
      },
      ondateChange(v) {
        this.dateValue = v;
        if (!v) {
          v = [];
        } else {
          this.queryParams.publishDateBegin = v[0];
          this.queryParams.publishDateEnd = v[1];
        }
      },
      ondateChange1(v) {
        this.dateValue1 = v;
        if (!v) {
          v = [];
        } else {
          this.queryParams.startDateBegin = v[0];
          this.queryParams.startDateEnd = v[1];
        }
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.dateRange1 = [];
        this.queryParams.publishDateBegin = undefined;
        this.queryParams.publishDateEnd = undefined;
        this.queryParams.startDateBegin = undefined;
        this.queryParams.startDateEnd = undefined;
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        if (this.dateValue === null) {
          this.queryParams.publishDateBegin = undefined;
          this.queryParams.publishDateEnd = undefined;
        }
        if (this.dateValue1 === null) {
          this.queryParams.startDateBegin = undefined;
          this.queryParams.startDateEnd = undefined;
        }
        this.queryParams.pageNum = 1;
        this.getList();
      },
      e_changeBox(list) {
        let arrList = this.colData.filter(i => !list.includes(i.title));
        let titleList = arrList.map(item => {
          return item.title;
        });
        this.colData.filter(i => {
          if (titleList.indexOf(i.title) != -1) {
            i.istrue = false;
          } else {
            i.istrue = true;
          }
        });
      },
      // 标准树查询
      getTreelist() {
        getStandardTreelist().then(res => {
          this.treeList = res.data
        })
      },
      handleIndex(row) {
        this.showIndex = true
        this.$nextTick(() => {
          this.$refs.criteria.init(row);
          this.$refs.criteria.gettreeData(row.id);
        });
      },
      // 新增判定标准
      e_add() {
        this.showStand = true;
        this.$nextTick(() => {
          this.$refs.standard.init(this.trssdata, 'add');
          this.$refs.standard.treedata(this.treeList);
        });
      },
      updata() {
        this.getTreelist()
      },
      // 获取标准列表
      handleData(data, row) {
        this.radio = ''
        this.$refs.selectTable.setCurrentRow(row);
        this.trssdata = data
        this.multiple = false
        this.ismultiple = true
        this.getList()
      },
      getList() {
        this.queryParams.decideStandardTreeId = this.trssdata.id
        getStandardList(this.queryParams).then(res => {
          this.listData = res.data.list
          this.total = res.data.total
        })
      },
      // 修改判定标准
      e_edit() {
        this.showStand = true;
        detailStandard(this.tabledataList.id).then(res => {
          this.$nextTick(() => {
            this.$refs.standard.init(res.data, 'update');
            this.$refs.standard.treedata(this.treeList);
          });
        })
      },
      // 复制标准
      e_copy() {
        copyStandard(this.tabledataList.id).then(res => {
          if (res.code === 200) {
            this.$message.success('复制成功')
            this.getList()
          }
        })
      },
      // 删除标准
      e_del() {
        this.$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delStandard(this.tabledataList.id).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getList()
              this.ismultiple = true
            }
          })
        })
      },
      // 表格单选
      handleCurrentChange(val) {
        this.tabledataList = val
        this.ismultiple = false
      },
      handleclose(row) {
        this.$refs.selectTable.setCurrentRow(row);
        this.radio = ''
        this.showStand = false
        this.tabledataList = []
        this.ismultiple = true
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ .el-radio__label {
    display: none;
  }
</style>
