<template>
  <el-form
      :model="queryParams"
      ref="queryForm"
      :prop="queryParams"
      :rules="rules"
      label-width="120px"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
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
            <el-form-item label="版次" prop="version">
              <el-input placeholder="请输入版次" v-model="queryParams.version" :disabled="isdisable"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="文件状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择" :disabled="isdisable">
                <el-option label="有效" :value="0"></el-option>
                <el-option label="作废" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属文件目录" prop="standardCode">
              <treeselect
                  :disabled="isdisable"
                  :default-expand-level="5"
                  v-model="queryParams.treeId"
                  :options="treeOptions"
                  :normalizer="normalizer"
                  :show-count="true"
                  placeholder="请选择文件目录"
                  @select="departTreeSelected"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属部门" prop="departmentId">
              <treeselect
                  :disabled="isdisable"
                  v-model="queryParams.departmentId"
                  :options="deptOptions"
                  :show-count="true"
                  @select="departmentSelected"
                  placeholder="请选择所属部门"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="文件类型" prop="fileType">
              <el-select v-model="queryParams.fileType" placeholder="请选择" :disabled="isdisable">
                <el-option label="受控文件" :value="1"></el-option>
                <el-option label="外来文件" :value="2"></el-option>
                <el-option label="机密文件" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.remark" :disabled="isdisable"></el-input>
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
                  :file-list="fileList"
                  multiple
                  :disabled="isdisable"
                  :before-upload="beforeUpload"
              >
                <div slot="file" slot-scope="{file}">
                  <span style="padding-right: 20px">{{file.name}}</span>
                  <el-button type="text" size="small" @click="look_file(file.response)">查看</el-button>
                  <el-button type="text" size="small" style="color: #1CD0BD" @click="down_file(file.response)">下载</el-button>
                  <el-button type="text" size="small" style="color: #ff4949" @click="uploadRemove(file)" v-if="showType !== 'show'">删除</el-button>
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
              <el-select v-model="queryParams.postId" filterable multiple placeholder="请选择" @change="postChange" :disabled="isdisable" style="width: 100%">
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
              <el-select v-model="queryParams.roleId" filterable multiple placeholder="请选择" @change="roleChange" :disabled="isdisable" style="width: 100%">
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
            @sort-change="sortChange"
        >
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column prop="createTime" label="日期" sortable="custom" show-overflow-tooltip/>
          <el-table-column prop="createBy" label="操作人员" sortable="custom" show-overflow-tooltip/>
          <el-table-column prop="departmentName" label="所属部门" sortable="custom" show-overflow-tooltip/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text" v-if="scope.row.operateType === 10">创建文件</el-button>
              <el-button size="mini" type="text" v-if="scope.row.operateType === 20">修改文件</el-button>
              <el-button size="mini" type="text" v-if="scope.row.operateType === 30">查看文件</el-button>
              <el-button size="mini" type="text" v-if="scope.row.operateType === 40">下载文件</el-button>
              <el-button size="mini" type="text" v-if="scope.row.operateType === 50">借阅文件</el-button>
              <el-button size="mini" type="text" v-if="scope.row.operateType === 60">打印文件</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="formdata.pageNum"
            :limit.sync="formdata.pageSize"
            @pagination="getfileList"
        />
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {treeselect} from "@/api/system/dept";
import {
  getFileOperateRecordList,
  getselectPost,
  getselectRole,
  addControllFile,
  editControllFile,
  getInsertOperateRecord
} from '@/api/filesManagement/filesManagement'
export default {
  name: "craeteFile",
  components: {Treeselect},
  data() {
    return {
      dialogShow: false,
      isFullScreen: true,
      screenName: "fullScreen",
      titles: '新增',
      showType: 'add',
      activeName: 'first',
      queryParams: {
        // treeId: null,
        treeName: '',
        departmentId: null,
        departmentName: '',
        roleId: '',
        postId: '',
        orderByColumn: '',
        orderByType: ''
      },
      formdata: {
        pageNum: 1,
        pageSize: 10
      },
      rules: {
        fileNumber: [{required: true, message: "请输入文件编号", trigger: "blur"}],
        fileName: [{required: true, message: "请输入文件名称", trigger: "blur"}],
        version:[{required: true, message: "请输入版次", trigger: "blur"}],
      },
      // 上传文件列表
      fileList: [],
      isdisable: false,
      // 授权岗位
      postList: [],
      tableData: [],
      treeOptions: [],
      // 部门树选项
      deptOptions: [],
      uploadFileList: [],
      file:[],
      roleList:[],
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
  mounted() {
    this.$net('/fileManage/tree/select','get').then(res => {
      if (res.code === 200) {
        this.treeOptions = res.data
      }
    })
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
    normalizer(node) {
      if (node.childList && !node.childList.length) {
        delete node.childList;
      }
      return {
        id: node.id,
        label: node.nodeName,
        children: node.childList,
        parentId: node.parentId
      };
    },
    init(show, data) {
      this.dialogShow = true
      this.showType = show
      if (this.showType === 'add') {
        console.log(data)
        // this.queryParams.treeId = data.id
        this.queryParams.treeName = data.nodeName
      } else {
        console.log(data)
        this.queryParams = {
          ...data,
        };
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
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      // this.queryParams.deptId = data.id;
      // this.getList();
      console.log(data)
    },
    treedata (data, id) {
      this.treeOptions = data
      if (this.showType === 'add') {
        this.queryParams.treeId = id
      }
    },
    departTreeSelected (node) {
      this.queryParams.treeId = node.id
      this.queryParams.treeName = node.nodeName
    },
    departmentSelected (val) {
      this.queryParams.departmentId = val.id
      this.queryParams.departmentName = val.label
    },
    // 文件上传路径返回
    uploadUrl() {
      return window.globalEnv.VUE_APP_BASE_API + "/fileManage/upload";
    },
    // 文件上传前校验
    beforeUpload (file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["pdf", "doc", "docx", "xls", "xlsx", "png", "jpeg", "jpg"];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error("上传文件只能是 pdf、doc、docx、xls、xlsx、png、jpeg、jpg格式");
        return false;
      }
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
      let index = this.fileList.findIndex( fileItem => {
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
    down_file (data) {
      this.recordInfo(40)
      window.location.href = window.globalEnv.VUE_APP_BASE_API + "/common/downloadFile?fileName=" + encodeURI(data.data.filePath) + "&delete=" + true;
    },
    // 记录
    recordInfo (type) {
      if (this.queryParams.id) {
        getInsertOperateRecord(this.queryParams.id, type).then(res => {
          console.log(res)
        })
      }
    },
    // 文件历史记录
    handleClick (e) {
      if (e.index === '2') {
        if (this.queryParams.id) {
          this.getfileList()
        }
      }
    },
    // 排序
    sortChange (column, prop, order) {
      this.formdata.orderByColumn = this.toLine(column.prop)
      if (column.order === 'descending') {
        this.formdata.orderByType = 'DESC'
      } else if (column.order === 'ascending') {
        this.formdata.orderByType = 'ASC'
      } else {
        this.formdata.orderByType = ''
      }
      this.getfileList()
    },
    toLine(name) {
      return name.replace(/([A-Z])/g,"_$1").toLowerCase();
    },
    getfileList () {
      const param = {
        ...this.formdata,
        fileId: this.queryParams.id
      }
      getFileOperateRecordList(param).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.total;
      })
    },
    // 获取相对应的接口
    getQuerlist () {
      // 获取岗位
      getselectPost().then(res => {
        this.postList = res.data
      })
      // 获取角色
      getselectRole().then(res => {
        this.roleList = res.data
      })
    },
    postChange (v) {
      const lists = []
      v.map(item => {
        lists.push({
          postId: item
        })
      })
      this.submitpostList = lists
    },
    roleChange (v) {
      const lists = []
      v.map(item => {
        lists.push({
          roleId: item
        })
      })
      this.submitroleList = lists
    },
    // 提交
    handleOk () {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.queryParams.postList = this.submitpostList
          this.queryParams.roleList = this.submitroleList
          this.queryParams.uploadFileList = this.uploadFileList
          console.log(this.queryParams)
          if (this.queryParams.id) {
            editControllFile(this.queryParams).then(res => {
              if (res.code === 200) {
                this.$message.success('修改成功')
                this.$parent.getList()
                this.cancelbtn()
              }
            })
          } else {
            addControllFile(this.queryParams).then(res => {
              if (res.code === 200) {
                this.$message.success('新增成功')
                this.$parent.getList()
                this.cancelbtn()
              }
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
/deep/.el-dialog__body .el-col {
  margin-bottom: 0;
}
.el-tabs__content {

}
/deep/.el-tabs .el-tabs__content {
  overflow: initial !important;
}
/deep/.el-dialog__body .el-table {
  background-color: #fff;
}
/deep/ .el-form-item.three .el-form-item__content {
  width: calc(100% - 120px);
}
</style>
