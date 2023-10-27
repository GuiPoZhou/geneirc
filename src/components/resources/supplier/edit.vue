<template>
  <div class="infoEdit">
    <bo-dialog :diaLogShow="showlog" diaLogTitle="编辑供应商信息" diaLogWidth="60%" @close="close">

      <template slot="bologbody">
        <el-form :model="editParams" :rules="rules" ref="checkForm" :inline="true" label-width="120px" @close="close">
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="editParams.supplierName" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商地址" prop="address">
                <el-input v-model="editParams.address" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真" prop="fax">
                <el-input v-model="editParams.fax" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人" prop="contacts">
                <el-input v-model="editParams.contacts" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="contactsPhone">
                <el-input v-model="editParams.contactsPhone" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮编" prop="zipCode">
                <el-input v-model="editParams.zipCode" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系邮箱" prop="contactsEmail">
                <el-input v-model="editParams.contactsEmail" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户银行" prop="openBank">
                <el-input v-model="editParams.openBank" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户账号" prop="account">
                <el-input v-model="editParams.account" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="overMd">
              <el-form-item label="统一社会信用代码" prop="creditCode" label-width="125px">
                <el-input v-model="editParams.creditCode" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="附件上传" prop="standardNameCn">
                <el-upload ref="upload" :action="uploadUrl()" :on-success="uploadSuccess" :on-remove="uploadRemove"
                  :limit="5" :file-list="fileList">
                  <div slot="file" slot-scope="{file}">
                    <span style="padding-right: 20px">{{ file.name }}</span>
                    <el-button type="text" size="small" @click="look_file(file.response)">查看</el-button>
                    <el-button type="text" size="small" style="color: #1CD0BD"
                      @click="down_file(file.response)">下载</el-button>
                    <el-button type="text" size="small" style="color: #ff4949" @click="uploadRemove(file)">删除</el-button>
                  </div>
                  <el-button type="primary" icon="el-icon-paperclip">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template slot="bologfooter">
        <el-button type="primary" @click="submitForm('checkForm')" center>
          保存
        </el-button>
        <el-button @click="close">取消</el-button>
      </template>
    </bo-dialog>
  </div>
</template>
<script>
import { editCheck } from "@/api/resources/supplier/supplier";

export default {
  components: {},
  data() {
    return {
      showlog:false,
      rules: {
        supplierName: [
          { required: true, message: "请输入供应商名称", trigger: "blur" },
        ],
      },
      isFullScreen: true,
      fileList: [],
      uploadFileList: []
    };
  },
  props: {
  
    editParams: {
      type: Object,
    },
  },
  methods: {
    open() {
      // console.log(this.editParams.uploadFileList)
    },
    init(data) {
      this.showlog = true
      if (data) {
        console.log(data)
        if (data.uploadFileList.length !== 0) {
          this.fileList = data.uploadFileList.map(item => {
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
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    //取消按钮操作
    close() {
      this.uploadFileList = []
      this.fileList = []
      this.$emit("close", false);
      this.$refs.checkForm.resetFields();
    },
    // 文件上传路径返回
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + "/fileManage/upload";
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
      window.open(process.env.VUE_APP_BASE_API + '/' + data.data.filePath, '_blank');
    },
    // 下载文件
    down_file(data) {
      window.location.href = process.env.VUE_APP_BASE_API + "/common/downloadFile?fileName=" + encodeURI(data.data.filePath) + "&delete=" + true;
    },
    //保存接口操作
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const saveDate = {
            id: this.editParams.id,
            supplierName: this.editParams.supplierName,
            address: this.editParams.address,
            fax: this.editParams.fax,
            contacts: this.editParams.contacts,
            contactsPhone: this.editParams.contactsPhone,
            zipCode: this.editParams.zipCode,
            contactsEmail: this.editParams.contactsEmail,
            openBank: this.editParams.openBank,
            account: this.editParams.account,
            creditCode: this.editParams.creditCode,
            uploadFileList: this.uploadFileList
          };
          editCheck(saveDate, this.editParams.id)
            .then(() => {
              //触发父组件传递过来的函数getTablelist()
              this.$emit("func", null);
              this.$message.success("保存成功");
              this.close();
            })
            .catch(function () {
            });
        }
      })

    },
  },
  computed: {},
  created() {
  },
  mounted() {
  },
};
</script>
<style lang="less" scoped>
.infoEdit {

  ul,
  li {
    list-style: none;
    padding: 0;
  }
}

.searchParentName {
  display: flex;
}

/deep/.el-dialog__body .el-col {
  margin-bottom: -5px !important;
}

.overMd {
  /deep/ .el-form-item__content {
    width: calc(100% - 125px) !important;
  }
}
</style>
