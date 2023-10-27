<template>
  <el-dialog :title="titles"
             :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
             :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open">
    <el-form :model="queryParams" ref="queryForm" :prop="queryParams" :rules="rules" label-width="120px">
      <el-tabs v-model="activeName" @tab-click="handleClick" :stretch='true'>
        <el-tab-pane label="文档基本信息" name="first">
          <el-row>
            <el-col :span="8">
              <el-form-item label="文件编号" prop="fileNumber">
                <el-input placeholder="请输入文件编号" v-model="queryParams.fileNumber" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="文件名称" prop="fileName">
                <el-input placeholder="请输入文件名称" v-model="queryParams.fileName" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="文件状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择" :disabled="isdisable">
                  <el-option label="有效" :value="0"></el-option>
                  <el-option label="作废" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="保管人" prop="keeperName">
                <el-input placeholder="请输入保管人" v-model="queryParams.keeperName" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="接收日期" prop="receiveData" style="width: 100%">
                <el-date-picker v-model="queryParams.receiveData" value-format="yyyy-MM-dd" type="date"
                                placeholder="选择日期" style="width:100%" :disabled="isdisable">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接收人" prop="receiverName">
                <el-input placeholder="请输入接收人" v-model="queryParams.receiverName" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.remark"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="附件上传" prop="standardNameCn">
                <el-upload
                  ref="upload"
                  :action="uploadUrl()"
                  :on-success="uploadSuccess"
                  :on-remove="uploadRemove"
                  :limit="5"
                  :file-list="fileList"
                  :disabled="isdisable"
                >
                  <div slot="file" slot-scope="{file}">
                    <span style="padding-right: 20px">{{file.name}}</span>
                    <el-button type="text" size="small" @click="look_file(file.response)">查看</el-button>
                    <el-button type="text" size="small" style="color: #1CD0BD" @click="down_file(file.response)">下载
                    </el-button>
                    <el-button type="text" size="small" style="color: #ff4949" @click="uploadRemove(file)"
                               v-if="showType !== 'show'">删除
                    </el-button>
                  </div>
                  <el-button type="primary" icon="el-icon-paperclip" :disabled="isdisable">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="授权信息" name="second">
          <el-row>
            <el-col :span="24">
              <el-form-item label="授权的岗位" prop="postId">
                <el-select v-model="queryParams.postId" filterable multiple placeholder="请选择" @change="postChange"
                           :disabled="isdisable" style="width: 100%">
                  <el-option
                    v-for="item in postList"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="授权的角色" prop="standardNameCn">
                <el-select v-model="queryParams.roleId" filterable multiple placeholder="请选择" @change="roleChange"
                           :disabled="isdisable" style="width: 100%">
                  <el-option
                    v-for="item in roleList"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="文件历史记录" name="third">
          <el-table
            ref="multipleTable"
            :data="tableData"
            stripe
            border
          >
            <el-table-column label="序号" align="center" type="index" width="50"/>
            <el-table-column prop="createTime" label="日期" sortable show-overflow-tooltip/>
            <el-table-column prop="createBy" label="操作人员" sortable show-overflow-tooltip/>
            <el-table-column prop="departmentName" label="所属部门" sortable show-overflow-tooltip/>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" v-if="scope.row.operateType === 10">创建文件</el-button>
                <el-button size="mini" type="text" v-if="scope.row.operateType === 20">修改文件</el-button>
                <el-button size="mini" type="text" v-if="scope.row.operateType === 30">查看文件</el-button>
                <el-button size="mini" type="text" v-if="scope.row.operateType === 40">下载文件</el-button>
                <el-button size="mini" type="text" v-if="scope.row.operateType === 50">借阅文件</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total > 0" :total="total" :page.sync="formdata.pageNum" :limit.sync="formdata.pageSize"
                      @pagination="getfileList"/>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk" :loading="isloading" v-if="showType !== 'show'">确定</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {treeselect} from "@/api/system/dept";
  import {
    getFileOperateRecordList,
    getselectPost,
    getselectRole,
    addExternalFile,
    editExternalFile,
    getInsertOperateRecord
  } from '@/api/filesManagement/filesManagement'

  export default {
    name: "craeteFile",
    components: {},
    data() {
      return {
        isloading: false,
        dialogShow: false,
        isFullScreen: true,
        screenName: "fullScreen",
        titles: '新增',
        showType: 'add',
        activeName: 'first',
        queryParams: {
          roleId: '',
          postId: '',
        },
        rules: {
          fileNumber: [{required: true, message: "请输入文件编号", trigger: "blur"}],
          fileName: [{required: true, message: "请输入文件名称", trigger: "blur"}],
        },
        formdata: {
          pageNum: 1,
          pageSize: 10
        },
        // 上传文件列表
        fileList: [],
        isdisable: false,
        // 授权岗位
        postList: [],
        tableData: [],
        treeOptions: [],
        uploadFileList: [],
        file: [],
        roleList: [],
        submitpostList: [],
        submitroleList: [],
        total: 0
      }
    },
    computed: {
      getLeftWidth() {
        return this.$store.state.app.leftWidth;
      }
    },
    watch: {
      getLeftWidth() {
        let width = this.$store.state.app.leftWidth;
        if (width < 200) {
          this.screenName = "bigFullScreen";
        } else {
          this.screenName = "fullScreen";
        }
      },
      showType(val) {
        if (val == "add") {
          this.titles = "新增";
        } else if (val == "update") {
          this.titles = "修改";
        } else if (val == 'show') {
          this.titles = "查看";
          this.isdisable = true
        }
      },
    },
    methods: {
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      open() {
        if (this.queryParams.id) {
          if (this.queryParams.uploadFileList.length !== 0) {
            this.fileList = this.queryParams.uploadFileList.map(item => {
              console.log(item)
              return {
                name: item.fileName,
                response: {
                  data: {
                    filePath: item.filePath,
                    id: item.id
                  }
                }
              }
            })
            this.uploadFileList = this.fileList.map(item => {
              console.log(item)
              return {
                fileName: item.name,
                filePath: item.response.data.filePath,
              }
            })
          }
        }
      },
      init(show, data) {
        this.dialogShow = true
        this.showType = show
        if (this.showType === 'add') {
        } else {
          console.log(data)
          this.queryParams = {
            ...data,
          };
          const arr = data.postList.map(item => {
            return item.postId
          })
          this.$set(this.queryParams, 'postId', arr)
          const arr1 = data.roleList.map(item => {
            return item.roleId
          })
          this.$set(this.queryParams, 'roleId', arr1)
          this.submitpostList = data.postList
          this.submitroleList = data.roleList
        }
        this.getTreeselect();
        this.getQuerlist()
      },
      // 文件历史记录
      handleClick(e) {
        if (e.index === '2') {
          if (this.queryParams.id) {
            this.getfileList()
          }
        }
      },
      getfileList() {
        const param = {
          ...this.formdata,
          fileId: this.queryParams.id
        }
        getFileOperateRecordList(param).then(res => {
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      // 文件上传路径返回
      uploadUrl() {
        return window.globalEnv.VUE_APP_BASE_API + "/fileManage/upload";
      },
      // 文件上传成功
      uploadSuccess(res, file, fileList) {
        if (200 == res.code) {
          this.fileList = fileList
          console.log(this.fileList)
          if (this.fileList.length > 0) {
            this.uploadFileList = this.fileList.map(item => {
              return {
                fileName: item.name,
                filePath: item.response.data.filePath,
              }
            })
            console.log(this.uploadFileList)
          }
        } else {
          this.fileList = []
          this.uploadFileList = []
        }
      },
      // 文件删除
      uploadRemove(file) {
        let index = this.fileList.findIndex(fileItem => {
          return fileItem.name === file.name
        })
        this.fileList.splice(index, 1);
        if (this.fileList.length > 0) {
          this.uploadFileList = this.fileList.map(item => {
            return {
              fileName: item.name,
              filePath: item.response.data.filePath,
            }
          })
          console.log(this.uploadFileList)
        } else {
          this.uploadFileList = []
        }
      },
      // 查看文件
      look_file(data) {
        this.recordInfo(30)
        window.open(window.globalEnv.VUE_APP_BASE_API + '/' + data.data.filePath, '_blank');
      },
      // 下载文件
      down_file(data) {
        this.recordInfo(40)
        this.mbu_downloadFile(data.data.filePath)
      },
      // 记录
      recordInfo(type) {
        if (this.queryParams.id) {
          getInsertOperateRecord(this.queryParams.id, type).then(res => {
            console.log(res)
          })
        }
      },
      // 获取相对应的接口
      getQuerlist() {
        // 获取岗位
        getselectPost().then(res => {
          this.postList = res.data
        })
        // 获取角色
        getselectRole().then(res => {
          this.roleList = res.data
        })
      },
      postChange(v) {
        const lists = []
        v.map(item => {
          lists.push({
            postId: item
          })
        })
        this.submitpostList = lists
      },
      roleChange(v) {
        const lists = []
        v.map(item => {
          lists.push({
            roleId: item
          })
        })
        this.submitroleList = lists
      },
      // 提交
      handleOk() {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            this.queryParams.postList = this.submitpostList
            this.queryParams.roleList = this.submitroleList
            this.queryParams.uploadFileList = this.uploadFileList
            this.queryParams.fileType = 2
            console.log(this.queryParams)
            this.isloading = true
            if (this.queryParams.id) {
              editExternalFile(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.$message.success('修改成功')
                  this.$parent.getList()
                  this.cancelbtn()
                }
              }).finally(_=> {
                this.isloading = false
              })
            } else {
              addExternalFile(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.$message.success('新增成功')
                  this.$parent.getList()
                  this.cancelbtn()
                }
              }).finally(_=> {
                this.isloading = false
              })
            }
          }
        })
      },
      cancelbtn() {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-dialog__body .el-col {
    margin-bottom: 0;
  }

  .el-tabs__content {

  }

  /deep/ .el-tabs .el-tabs__content {
    overflow: initial !important;
  }

  /deep/ .el-dialog__body .el-table {
    background-color: #fff;
  }
</style>
