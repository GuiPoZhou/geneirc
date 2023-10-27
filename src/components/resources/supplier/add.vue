<template>
  <div>
    <bo-dialog :diaLogShow="addShow" diaLogTitle="新增供应商信息" diaLogWidth="60%" @close="close">
      <template slot="bologbody">
        <el-form :model="supplierParam" :rules="rules" ref="checkForm" :inline="true" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="supplierParam.supplierName" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商地址" prop="address">
                <el-input v-model="supplierParam.address" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真" prop="fax">
                <el-input v-model="supplierParam.fax" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人" prop="contacts">
                <el-input v-model="supplierParam.contacts" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="contactsPhone">
                <el-input v-model="supplierParam.contactsPhone" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮编" prop="zipCode">
                <el-input v-model="supplierParam.zipCode" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系邮箱" prop="contactsEmail">
                <el-input v-model="supplierParam.contactsEmail" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户银行" prop="openBank">
                <el-input v-model="supplierParam.openBank" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户账号" prop="account">
                <el-input v-model="supplierParam.account" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="overMd">
              <el-form-item label="统一社会信用代码" prop="creditCode" label-width="125px">
                <el-input v-model="supplierParam.creditCode" size="large" />
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
import "@/views/core/components_use";
import "ant-design-vue/dist/antd.css";
import { addCheck } from "@/api/resources/supplier/supplier";
import BoDialog from '../../Boshland/BoContainer/boDialog.vue';

export default {
  components: { BoDialog },
  data() {
    return {
      addShow: false,
      // 供应商信息表单数据
      supplierParam: {
        supplierName: null,
      },
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

  methods: {
    init() {
      this.addShow = true
    },
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //取消按钮操作
    close() {
      this.$emit("close", false);
      this.$refs.checkForm.resetFields();
    },
    // 文件上传路径返回
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + "/common/upload";
    },
    // 文件上传成功
    uploadSuccess(res, file, fileList) {
      console.log('fileList',fileList)
      if (200 == res.code) {
        this.fileList = fileList
        console.log(this.fileList)
        if (this.fileList.length > 0) {
          this.uploadFileList = this.fileList.map(item => {
            return {
              fileName: item.response.fileName,
              filePath: item.response.url,
            }
          })
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
            fileName: item.response.fileName,
            filePath: item.response.url,
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
            supplierName: this.supplierParam.supplierName,
            address: this.supplierParam.address,
            fax: this.supplierParam.fax,
            contacts: this.supplierParam.contacts,
            contactsPhone: this.supplierParam.contactsPhone,
            zipCode: this.supplierParam.zipCode,
            contactsEmail: this.supplierParam.contactsEmail,
            openBank: this.supplierParam.openBank,
            account: this.supplierParam.account,
            creditCode: this.supplierParam.creditCode,
            uploadFileList: this.uploadFileList
          };
          // console.log(saveDate)
          // return
          addCheck(saveDate)
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
    //删除按钮操作
    deleteHandle(row) {
    },
    //下载图片
    downloadHandle(row) {
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
/deep/.el-dialog__body .el-col {
  margin-bottom: -5px !important;
}

.infoAdd {

  ul,
  li {
    list-style: none;
    padding: 0;
  }
}

.searchParentName {
  display: flex;
}

.overMd {
  /deep/ .el-form-item__content {
    width: calc(100% - 125px) !important;
  }
}
</style>
