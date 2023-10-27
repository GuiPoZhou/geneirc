<template>
    <div class="infoUpload" >
        <el-dialog title="上传签章" :visible.sync="uploadShow" center :show-close="true"
				   :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
            <el-form :model="uploadParam" :rules="rules" ref="checkForm" :inline="true" label-width="200px">
                <div>
                    <el-form-item label="签章类型"  prop="signatureType">
                        <el-col :span="24">
                            <el-select v-model="signatureTypeOptionsSelect" size="small">
                                <el-option
                                v-for="item in signatureTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                />
                            </el-select>
                            </el-col>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="上传图片"  prop="signatureName">
                        <el-input v-model="uploadParam.signatureName" />
                    </el-form-item>
                    <el-form-item   prop="signatureUrl">
                        <el-input v-model="uploadParam.signatureUrl" :hidden="true" />
                    </el-form-item>
                    <el-form-item >
                        <el-upload ref="upload"
                            :action="uploadUrl()"
                            :on-success="uploadSuccess"
                            :on-remove="uploadRemove"
                            :limit="1"
                            :file-list="uploadParam.fileList">
                            <el-button type="primary" size="mini" icon="el-icon-upload">上传</el-button>
                        </el-upload>
                         <el-dialog :visible.sync="uploadParam.dialogVisible">
                            <img width="100%" :src="uploadParam.dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm" center>保存</el-button>
                <el-button @click="close">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    components:{
    },
    data() {
        return {
            loading: false,
            // 参数表格数据
            tableData: [],
            // 上传成功的文件列表
            uploadParam: {
                signatureType: null,
                signatureName: null,
                signatureUrl: null,
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: [],
            },
            rules: {
                signatureType: [
                  { required: true, message: '请选择签章类型', trigger: 'blur' }
                ],
            },
            // 新増编制方式选项
            signatureTypeOptions: [
            {
                "value": 0,
                "label": "公章"
            },{
                "value": 1,
                "label": "骑缝章"
            }, {
                "value": 2,
                "label": "CMA章"
            }, {
                "value": 3,
                "label": "其他"
            }, {
                "value": 4,
                "label": "CNAS章"
            }, {
                "value": 5,
                "label": "检验检测章"
              }
            ],
            // 新増编制方式默认选项
            signatureTypeOptionsSelect: 0,
        }
    },
    props:{
        uploadShow: {
            type: Boolean,
            default: false,
        },
    },
    methods:{
       // 文件上传路径返回
      uploadUrl() {
        return window.globalEnv.VUE_APP_BASE_API + "/common/upload";
      },
      // 文件上传成功
      uploadSuccess(res, file, fileList) {
        if (200 == res.code) {
          // 上传成功，赋值保存，用于保存修改
          console.log(res)
           console.log(file)
           console.log(fileList)
           console.log(file.name)
           console.log(res.url)
          this.uploadParam.signatureName = file.name;
          this.uploadParam.signatureUrl = res.url;
        //   this.handlePictureCardPreview(file);
        }
      },
      // 文件删除
      uploadRemove(file, fileList) {
          this.uploadParam.signatureName = '';
          this.uploadParam.signatureUrl = '';
      },
       // 重置表单数据
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.uploadParam.dialogImageUrl = file.url;
        this.uploadParam.dialogVisible = true;
      },
      //取消按钮操作
      close() {
        this.uploadParam.signatureName = '';
        this.uploadParam.signatureUrl = '';
        this.uploadParam.fileList = [];
        this.$emit("update:uploadShow", false);
      },
      //保存接口操作
      submitForm() {
        const uploadData = {
            signatureName:this.uploadParam.signatureName,
            signatureUrl:this.uploadParam.signatureUrl,
            signatureType:this.signatureTypeOptionsSelect
        }
        console.log(uploadData);
        this.$emit('uploadHandle',uploadData);
        this.close();
      },
    },
}
</script>
<style lang="less">
.infoUpload {
  ul,li {
    list-style: none;
    padding:0;
  }
}
.searchParentName {
  display:flex;
}
</style>
