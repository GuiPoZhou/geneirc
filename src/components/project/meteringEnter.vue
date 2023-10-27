<!--
 * @Autor: 焦政
 * @Date: 2021-01-27 11:51:12
 * @Description: 
-->
<template>
  <el-dialog title="导入计量单位" :visible.sync="enterShow" center
  :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-link type="primary" :underline="false" @click="downTemplate"
      style="color:#027DB4; font-family:Arial;font-size: 18px; font-weight: 800; margin-bottom:30px">导入模板下载</el-link>
      <el-form :model="unitParams" ref="unitForm" :inline="true" label-width="100px">
        <el-form-item label="导入计量单位" prop="unitName" label-width="96px">
          <el-input
            style="width:580px;"
            v-model="unitParams.unitName"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            ref="upload"
            :show-file-list="false"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" type="primary" style="width:81px;height:30px;">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')" center style="width:100px;height:35px;margin-right:76px">保存</el-button>
        <el-button @click="close" style="width:100px;height:35px;">取消</el-button>
      </div>
  </el-dialog>
</template>
<script>
import {downLoadTemplate} from '@/api/standardManagement/config'
export default {
  data() {
    return {
      // 计量单位参数
      unitParams: {
        unitName: null,
        Staff: null,
        time: null,
        otherName: null,
      },
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],

    }
  },
  props:{
    enterShow: {
      type: Boolean,
      default: false,
    },
  },
  methods:{
    //取消按钮操作
    close() {
      this.$emit("update:enterShow", false);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    //导入模板下载操作
    downTemplate(){
		downLoadTemplate().then((response) => {
      this.mbu_downloadExcel(response.msg)
		});
    }
  },
  computed:{

  },
  created() {

  },
  mounted () {

  }
}
</script>
