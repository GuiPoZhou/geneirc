<template>
<el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
  <el-upload ref="upload"
             :limit="1"
             accept=".xlsx, .xls"
             :headers="headers"
             :action="upload.url + '?updateSupport=' + upload.updateSupport"

             :on-progress="handleFileUploadProgress"
             :on-success="handleFileSuccess" :auto-upload="false" drag>

<!--	  :disabled="upload.isUploading"-->
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">
      将文件拖到此处，或
      <em>点击上传</em>
    </div>
    <div class="el-upload__tip" slot="tip" v-if="showTips">
<!--      <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据-->
      <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
    </div>
    <div class="el-upload__tip" slot="tip" v-if="!showTips">
      <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
    </div>
    <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
  </el-upload>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitFileForm">确定</el-button>
    <el-button @click="upload.open = false">取消</el-button>
  </div>
</el-dialog>

</template>
<script>
  import { getToken } from "@/utils/auth";

  export default {

    data(){
      return{

        headers: { Authorization: "Bearer " + getToken() },
      }
    },

    props:{
      upload:{
        type: Object
      },
      showTips:{
        type: Boolean,
        default: true
      }
    },

    methods:{

      /** 下载模板操作 */
      importTemplate() {
        this.$emit("importTemplate")

      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
      	console.info("handleFileSuccess")

        if(response.code === 200){
          this.upload.open = false;
          this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
          this.$refs.upload.clearFiles();
          this.$emit("afterImport")
        }else{
          this.$message({type: 'error',message: response.msg});
        }

		  this.$refs.upload.clearFiles();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },


    }

  }
</script>
