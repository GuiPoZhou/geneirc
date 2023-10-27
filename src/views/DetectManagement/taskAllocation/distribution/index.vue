<template>
  <BoDialog
    diaLogWidth="70%"
    :diaLogTitle="extendedProperties.modalTitle"
    :diaLogShow="extendedProperties.visible"
    @close="handleCancel">
    <template slot="bologbody">
      <el-form
        ref="businessTypeForm"
        label-width="130px"
        :model="formData"
        :forceRender="true"
        :rules="formDataRules"
        v-if="!extendedProperties.isView"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              :label="formData.detectUserPostType == 1?'检测人员':'检测部门'"
              prop="detectUserPostName"
              :rules="[{ required: formData.detectUserPostType == 1?true:false, message: '请输入检测人员', trigger: 'change' }]"
            >
              <el-input
                placeholder="请输入内容"
                v-model="formData.detectUserPostName"
                class="input-with-select"
                readonly
                @focus="selectContent"
              >
                <el-select
                  v-model="formData.detectUserPostType"
                  slot="prepend"
                  placeholder="请选择"
                  @change="detectUserPostTypeChange"
                >
                  <el-option label="按人员" :value="1"></el-option>
                  <!--                                    <el-option label="按岗位" :value="2"></el-option>-->
                  <el-option label="按部门" :value="3"></el-option>
                </el-select>
                <el-button
                  slot="append"
                  class="el-button el-button--primary el-button--mini"
                  @click="selectContent"
                  size="mini"
                >
                  选择
                </el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测完成时间" prop="detectCompleteDate">
              <el-date-picker
                v-model="formData.detectCompleteDate"
                type="date"
                format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider v-if="!extendedProperties.isView"/>

      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        label-width="80px"
        :prop="queryParams"
        style="margin-top: 15px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目名称" prop="itemName">
              <el-input
                v-model="queryParams.itemName"
                placeholder="项目名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
                class="input-with-select"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="方法编号" prop="itemCode">
              <el-input
                v-model="queryParams.itemCode"
                placeholder="方法编号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
                class="input-with-select"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="样品编号" prop="sampleCode">
              <el-input
                v-model="queryParams.sampleCode"
                placeholder="样品编号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
                class="input-with-select"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="extendedProperties.isView">
            <el-form-item
              label="检测类别"
              prop="detectTypeName"
            >
              <el-input
                v-model="queryParams.detectTypeName"
                placeholder="检测类别"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
                readonly
                class="input-with-select"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="cateShow = true"
                />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="handleQuery"
              >搜索
              </el-button
              >
              <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
              >重置
              </el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        v-if="this.$parent.activeIndex == 1"
        v-loading="loading"
        :data="listData"
        @selection-change="handleSelectionChange"
        row-key="itemId+sampleCode+entrustCode"
        ref="selectTable"
        :max-height="isFullScreen== true?'580':'240'"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" label="项目名称" prop="itemName" :formatter="formatter"
                         show-overflow-tooltip/>
        <el-table-column align="center" label="方法编号" prop="itemCode" :formatter="formatter"
                         show-overflow-tooltip/>
        <el-table-column align="center" label="客户指定" prop="customerAppoint" :formatter="formatter"
                         show-overflow-tooltip/>
        <el-table-column align="center" label="样品编码" prop="sampleCode" :formatter="formatter"
                         show-overflow-tooltip/>
        <el-table-column align="center" label="检测类别" prop="detectTypeStr" :formatter="formatter"
                         show-overflow-tooltip/>
        <el-table-column align="center" label="委托编码" prop="entrustCode" :formatter="formatter"
                         show-overflow-tooltip/>
        <el-table-column align="center" label="检测部门" prop="detectDeptId" :formatter="formatter"
                         show-overflow-tooltip>
          <template scope="scope">
            {{ echoData(scope.row.detectDeptId*1,deptList) }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="this.$parent.activeIndex == 2"
        v-loading="loading"
        :data="listData"
        @selection-change="handleSelectionChange"
        row-key="itemId+sampleCode+entrustCode"
        ref="selectTable"
        :max-height="isFullScreen== true?'580':'240'"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" label="分配人员" prop="assignmentUser" :formatter="formatter"
                         show-overflow-tooltip/>
        <el-table-column align="center" label="分配时间" prop="assignmentTime" :formatter="formatter"
                         show-overflow-tooltip/>
        <el-table-column align="center" label="检测人员" prop="detectUserPostName" :formatter="formatter"
                         show-overflow-tooltip/>
        <el-table-column align="center" label="检测部门" prop="detectDeptId" :formatter="formatter"
                         show-overflow-tooltip>
          <template scope="scope">
            {{ echoData(scope.row.detectDeptId*1,deptList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="检测完成时间" prop="detectCompleteDate" :formatter="formatter"
                         show-overflow-tooltip/>
        <el-table-column align="center" label="接收人员" prop="receiveUser" :formatter="formatter"
                         show-overflow-tooltip/>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :pageSizes="[100, 200, 500]"
        @pagination="getList"
      />

      <selectUser :visible.sync="userShow" @backfill="backfillUser" ref="users" :showDefault="true"/>
      <selectDept :visible.sync="deptShow" @backfill="backfillDept" ref="depts"/>
      <selectMultiplePost
        :visible.sync="postShow"
        v-if="postShow"
        @backfill="backfillPost"
        ref="posts"
      />
      <detectType :visible.sync="cateShow" @handleClick="handleClick"/>
    </template>
    <template slot="bologfooter">
      <el-button type="primary" size="small" @click="handleGetData()">{{
        extendedProperties.buttonText
        }}
      </el-button>
      <el-button size="small" @click="handleCancel">取消</el-button>
    </template>
  </BoDialog>
</template>

<script>
  import selectUser from '@/components/common/selectUser'
  import selectDept from '@/components/common/selectDept'
  import selectMultiplePost from '@/components/common/selectMultiplePost'
  import detectType from '@/components/project/detectType'
  import {
    getSampleAssignmentList,
    getItemAssignmentList,
    saveAssignment,
    getAssignmentDetailList,
    cancelAssignment
  } from '@/api/detectionManage/taskAllocation/config'

  export default {
    name: 'add',
    watch: {
      'extendedProperties.visible': {
        handler(val, oldVal) {
          console.log(this.$parent.activeIndex, this.$parent.radio)
          if (val) {
            this.listData = []
            this.queryParams.sampleIdList = this.extendedProperties.sampleIdList
            this.queryParams.itemObjList = this.extendedProperties.itemObjList
            this.queryParams.entrustCode = this.extendedProperties.entrustCode
            this.queryParams.entrustId = this.extendedProperties.entrustId
            this.queryParams.handoverItemIdList = this.extendedProperties.handoverItemIdList
            this.queryParams.detectType = this.extendedProperties.extendedParam.detectType
            this.queryParams.detectTypeName = this.extendedProperties.extendedParam.detectTypeName
            this.queryParams.itemName = this.extendedProperties.extendedParam.itemName
            this.queryParams.itemCode = this.extendedProperties.extendedParam.itemCode
            this.getList()
            this.getDeptList()
            this.formData.detectUserPostType = 3
            this.formData.detectUserPostId = null
            this.formData.detectUserPostName = null
          }
        },
        deep: true
      }
    },
    props: {
      extendedProperties: {}
    },
    components: {
      selectUser,
      selectDept,
      selectMultiplePost,
      detectType,
      saveAssignment
    },
    data() {
      return {
        previewWidth: 950,
        confirmLoading: false,
        deptShow: false,
        isFullScreen: true,
        formData: {
          detectUserPostType: 3,
          detectUserPostName: null,
          detectUserPostId: null,
          detectCompleteDate: null,
          userPostList: [],
          itemDetailList: []
        },
        queryParams: {
          itemName: null,
          itemCode: null,
          sampleCode: null,
          pageNum: 1,
          pageSize: 100,
          sampleIdList: [],
          // 上级列表带入参数
          entrustCode: '',
          detectType: ''
        },
        total: 3,
        loading: false,
        ids: [],
        formDataRules: {},
        single: true,
        multiple: true,
        cateShow: false,
        listData: [],
        deptList: [],
        selectionList: [],
        userShow: false,
        postShow: false
      }
    },
    methods: {
      // 取消
      handleCancel() {
        this.extendedProperties.visible = false
        this.$refs.queryForm.resetFields()
        this.listData = []
      },
      async saveAssignment() {
        let itemDetailList = []
        this.selectionList.forEach((item) => {
          console.log(item)
          itemDetailList.push({
            entrustId: item.entrustId,
            entrustCode: item.entrustCode,
            detectType: item.detectType,
            sampleId: item.sampleId,
            sampleCode: item.sampleCode,
            itemId: item.itemId,
            itemName: item.itemName,
            itemCode: item.itemCode,
            subname: item.subname,
            stroma: item.stroma,
            sceneDetect: item.sceneDetect,
            sampleSource: item.sampleSource,
            urgentStatus: item.urgentStatus,
            completeDate: item.completeDate,
            customerAppoint: item.customerAppoint,
            detectUserPostType: this.formData.detectUserPostType,
            detectUserPostName: this.formData.detectUserPostName,
            detectCompleteDate: this.formData.detectCompleteDate
          })
        })
        if (this.selectionList.length < 1) {
          this.$message.error('至少选择一个项目进行分配!')
          this.confirmLoading = false
          return false
        }
        if (this.formData.detectUserPostType == 1) {
          if (!this.formData.detectUserPostId || this.formData.detectUserPostId === '') {
            this.$message.error('请选择检测人员!')
            this.confirmLoading = false
            return false
          }
        }
        if (this.formData.detectUserPostType == 1) {
          this.formData.itemDetailList = itemDetailList
          saveAssignment(this.formData).then(
            (res) => {
              this.$message.success(res.msg)
              this.confirmLoading = false
              this.extendedProperties.visible = false
              this.$parent.getListData()
            },
            (err) => {
              this.$message.error(err)
              this.confirmLoading = false
            }
          )
        } else if (this.formData.detectUserPostType == 3) {
          this.formData.itemDetailList = this.selectionList
          let getData = await this.$net('/v1/detectManage/taskAssignment/byDept', 'post', this.formData)
          if (getData.code == 200) {
            this.$message.success(getData.msg)
            this.confirmLoading = false
            this.extendedProperties.visible = false
            this.$parent.getListData()
          }
        }
      },
      // 获取部门列表数据
      async getDeptList() {
        let getData = await this.$net('/system/dept/list', 'get')
        if (getData.code == 200) {
          console.log(getData)
          getData.data.map((item) => {
            let obj = {
              value: item.deptId,
              label: item.deptName
            }
            this.deptList.push(obj)
          })
        }
      },
      cancelAssignment() {
        let idList = this.$refs.selectTable.selection.map((item) => item.id)
        if (!idList || idList.length < 1) {
          this.$message.error('至少选择一个项目进行取消!')
          return false
        }
        cancelAssignment(idList).then(
          (res) => {
            this.$message.success(res.msg)
            this.confirmLoading = false
            this.extendedProperties.visible = false
            this.$parent.getListData()
          },
          (err) => {
            // this.msgError(err);
            this.confirmLoading = false
          }
        )
      },
      handleGetData() {
        this.confirmLoading = true
        //远程请求
        if (this.extendedProperties.activeIndex === '1') {
          this.saveAssignment()
        } else {
          this.cancelAssignment()
        }
      },
      //填充检测单位
      backfillDept(dept) {
        console.log(dept)
        this.formData.detectUserPostName = dept.deptName
        this.selectionList.map((item1) => {
          this.listData.map((item2) => {
            if (item1.id == item2.id) {
              item2.detectDeptId = dept.deptId
            }
          })
        })
        // this.formData.userPostList.push({
        //     detectUserPostType: this.formData.detectUserPostType,
        //     detectUserPostId: dept.userId,
        //     detectUserPostName: dept.deptName
        // })
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.queryParams.sampleIdList = this.extendedProperties.sampleIdList
        this.queryParams.itemObjList = this.extendedProperties.itemObjList
        this.queryParams.entrustCode = this.extendedProperties.entrustCode
        this.queryParams.entrustId = this.extendedProperties.entrustId
        this.queryParams.detectType = this.extendedProperties.extendedParam.detectType
        this.queryParams.detectTypeName = this.extendedProperties.extendedParam.detectTypeName
        this.queryParams.itemName = this.extendedProperties.extendedParam.itemName
        this.queryParams.itemCode = this.extendedProperties.extendedParam.itemCode
        this.getList()
      },
      handleQuery() {
        this.getList()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        console.log(selection)
        this.selectionList = selection
        this.ids = selection.map((item) => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      getList() {
        if (this.extendedProperties.activeIndex === '1') {
          if (this.extendedProperties.radio === '按样品') {
            getSampleAssignmentList(this.queryParams).then((res) => {
              this.listData = res.data.list
              this.total = res.data.total
            })
          } else {
            getItemAssignmentList(this.queryParams).then((res) => {
              this.listData = res.data.list
              this.total = res.data.total
            })
          }
        } else {
          this.queryParams.entrustCode = null
          getAssignmentDetailList(this.queryParams).then((res) => {
            this.listData = res.data.list
            this.total = res.data.total
          })
        }
      },
      selectContent() {
        if (this.formData.detectUserPostType === 1) {
          this.userShow = true
          this.$nextTick(() => {
            this.$refs.users.getDefault()
          })
        } else if (this.formData.detectUserPostType === 3) {
          if (this.selectionList.length == 0) {
            this.$message.info('请选择要添加检测部门的数据')
            return
          }
          this.deptShow = true
          this.$nextTick(() => {
            this.$refs.depts.handleQuery()
          })
        }
      },
      //回填选中的用户
      backfillUser(resultUsers) {
        let tempIds = ''
        let tempNames = ''
        this.formData.userPostList = []
        resultUsers.forEach((item) => {
          tempIds += item.userId + ','
          tempNames += item.userName + ','
          this.formData.userPostList.push({
            detectUserPostType: this.formData.detectUserPostType,
            detectUserPostId: item.userId,
            detectUserPostName: item.userName
          })
        })
        this.updateSelected(tempIds, tempNames)
      },
      backfillPost(resultPosts) {
        let tempIds = ''
        let tempNames = ''
        this.formData.userPostList = []
        resultPosts.forEach((item) => {
          tempIds += item.postId + ','
          tempNames += item.postName + ','
          this.formData.userPostList.push({
            detectUserPostType: this.formData.detectUserPostType,
            detectUserPostId: item.postId,
            detectUserPostName: item.postName
          })
        })
        this.updateSelected(tempIds, tempNames)
      },
      updateSelected(tempIds, tempNames) {
        this.formData.detectUserPostId = tempIds.substr(0, tempIds.length - 1)
        this.formData.detectUserPostName = tempNames.substr(
          0,
          tempNames.length - 1
        )
      },
      detectUserPostTypeChange() {
        this.formData.detectUserPostId = null
        this.formData.detectUserPostName = null
      },
      handleClick(row) {
        this.queryParams.detectType = row.id
        this.queryParams.detectTypeName = row.detectName
        this.cateShow = false
      },
      formatter(row, column, cellValue, index) {
        if (column.property === 'customerAppoint') {
          if (cellValue === 0) {
            return '否'
          } else {
            return '是'
          }
        }
        return cellValue
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-select .el-input {
    width: 130px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .el-input-group__append {
    background-color: #1890ff;
    color: #ffffff;
  }

  /deep/ .ant-modal-title {
    margin: 0;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
    text-align: center;
    font-weight: bold !important;
  }

  /deep/ .ant-modal-footer {
    padding: 10px 16px;
    text-align: right;
    background: transparent;
    border-top: 1px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
    text-align: center;
  }
</style>
