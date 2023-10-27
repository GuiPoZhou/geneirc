<template>
  <div class="modifyRecord">
    <el-dialog title="修改记录" :visible.sync="modifyShow" center :show-close="true"
               :close-on-press-escape="false" :close-on-click-modal="false" :append-to-body="true" @close="close">
      <el-form :model="modifyParams"  ref="modifyForm" :inline="true" label-width="200px">
          <el-table v-loading="loading" :data="modifyParams.modifyData" align="center">
          <el-table-column prop="id" type="index" label="序号" width="55px" />
          <el-table-column prop="itemCode" label="方法编号" />
          <el-table-column prop="detectLimit" label="方法检出限" />
          <el-table-column prop="detectUnitName" label="检出限单位" />
          <el-table-column prop="detectResult" label="检测结果" />
            <el-table-column prop="detectResultUnit" label="结果单位" />
          </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="close">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    name : "modifyRecord",
    components: {  },
    data() {
      return {
        loading:false,
      }
    },
    props:{
      modifyShow: {
        type: Boolean,
        default: false,
      },
      modifyParams: {
        type: Object,
      },
    },
    methods:{
      //取消按钮操作
      close() {
        this.$emit("update:modifyShow", false);
      },
    }
  }
</script>
