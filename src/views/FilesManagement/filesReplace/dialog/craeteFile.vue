<template>
  <div>
	<el-dialog :title="titles"
			   :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
			   :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open">
    <el-form
        :model="queryParams"
        ref="queryForm"
        :prop="queryParams"
        :rules="rules"
        label-width="120px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="文件编号" prop="fileNumber" >
            <!-- <el-input placeholder="请输入文件编号" v-model="queryParams.fileNumber" :disabled="isdisable" readonly="readonly"></el-input> -->
            <el-input placeholder="请输入文件编号" v-model="queryParams.fileNumber" :disabled="isdisable">

            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件名称" prop="fileName">
            <el-input placeholder="请输入文件名称" v-model="queryParams.fileName" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="替换/更改" prop="businessType">
            <el-select v-model="queryParams.businessType" placeholder="请选择" :disabled="isdisable" style="width: 100%">
              <el-option label="替换" :value="1"></el-option>
              <el-option label="更改" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="替换/更改日期" prop="replaceDate" style="width: 100%">
            <el-date-picker v-model="queryParams.replaceDate" value-format="yyyy-MM-dd" type="date"
                            placeholder="选择日期" style="width:100%" :disabled="isdisable">
            </el-date-picker>
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
                :on-remove="uploadRemove"
                :limit="5"
                :file-list="fileList"
                :disabled="isdisable"
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk" :loading="isloading" v-if="showType !== 'show'">确定</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
  <!-- <selectFile v-if="showFile" ref="selectfilefs" @close="showFile = false"></selectFile> -->
</div>
</template>

<script>
  import { addReplaceRecord, editReplaceRecord, getInsertOperateRecord } from '@/api/filesManagement/filesManagement'
  // import selectFile from './nextdialog/selectFile'

  export default {
    name: "craeteFile",
    // components: {selectFile},
    data() {
      return {
        isloading: false,
        showFile:false,
        dialogShow: false,
        dialogselectShow:false,
        isFullScreen: true,
        screenName: "fullScreen",
        titles: '新增',
        showType: 'add',
        activeName: 'first',
        queryParams: {},
        rules: {
          fileNumber: [{required: true, message: "请输入文件编号", trigger: "blur"}],
          fileName: [{required: true, message: "请输入文件名称", trigger: "blur"}],
        },
        // 上传文件列表
        fileList: [],
        isdisable: false,
        // 授权岗位
        postlist: [],
        tableData: [],
        activities1: [],
        showselectFile: false,

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
        } else if (val == "show") {
          this.titles = "查看";
          this.isdisable = true
        }
      },
    },
    methods: {
      getNowTime() {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日期
        month = month + 1;
        month = month.toString().padStart(2, "0");
        date = date.toString().padStart(2, "0");
        var defaultDate = `${year}-${month}-${date}`;
        this.$set(this.queryParams, "replaceDate", defaultDate);
      },
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      open() {
        this.getNowTime()
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
        this.showType = show
        if (data) {
          this.queryParams = {
            ...data
          }
        }
        this.dialogShow = true
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
        this.mbu_downloadFile(data.data.filePath)
      },
      // 记录
      recordInfo (type) {
        if (this.queryParams.id) {
          getInsertOperateRecord(this.queryParams.id, type).then(res => {
            console.log(res)
          })
        }
      },
      // 保存
      handleOk () {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            this.queryParams.uploadFileList = this.uploadFileList
            console.log(this.queryParams)
            this.isloading = true
            if (this.queryParams.id) {
              editReplaceRecord(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.$message.success('修改成功')
                  this.$parent.getList()
                  this.cancelbtn()
                }
              }).finally(() => {
                this.isloading = false
              })
            } else {
              addReplaceRecord(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.$message.success('新增成功')
                  this.$parent.getList()
                  this.cancelbtn()
                }
              }).finally(() => {
                this.isloading = false
              })
            }
          }
        })
      },
      cancelbtn() {
        this.$emit('close')
      },
        // 添加
      selectAdd() {
        this.showFile = true
        this.$nextTick(() => {
          this.$refs.selectfilefs.init()
        })
      },
    }
  }
</script>

<style scoped lang="less">
  /deep/ .el-dialog__body .el-col {
    margin-bottom: 0;

  }


  .processbox {
    ul {
      display: flex;

      li {
        color: #3C4353;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 30px;

        div {
          width: 16px;
          height: 16px;
          margin-right: 10px;
        }

        .nostep {
          background: #838A9D;
        }

        .finishstep {
          background: #1DD0BD;
        }

        .pendingstep {
          background: #F4BB4A;
        }
      }
    }
  }

  .timeline {
    position: relative;
    left: 250px;
  }

  .companydel {
    color: #909399;
    position: absolute;
    left: -200px;
    top: 1px;
    font-size: 12px;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .cont {
    background: #EEF6FF;
    padding: 16px 30px;

    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-inline-start: 0;

      li {
        width: 33.3333%;
        margin-bottom: 5px;
      }
    }
  }
</style>
