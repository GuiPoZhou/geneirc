<template>
  <div class="instrumentManage">
    <el-dialog title="已选择仪器" :visible.sync="instrumentShow" center :show-close="true"
           :close-on-press-escape="false" :close-on-click-modal="false" :append-to-body="true" @close="close">
      <!-- 表格 -->
      <el-form :model="instrumentParams"  ref="instrumentForm" :inline="true" style="margin: 20px 0px" label-width="200px">
        <el-table v-loading="loading" :data="instrumentParams.instData" align="center">
          <el-table-column prop="id" type="index" label="序号" width="55px" />
          <el-table-column prop="equipmentClassStr" label="仪器分类" />
          <el-table-column prop="equipmentNumber" label="仪器编号" />
          <el-table-column prop="equipmentName" label="仪器名称" />
          <el-table-column prop="equipmentModel" label="仪器型号" />
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  export default {
    name : "instrumentManage",
    components: {  },
    data() {
      return {
        loading:false,
      }
    },
    props:{
      instrumentShow: {
        type: Boolean,
        default: false,
      },
      instrumentParams: {
        type: Object,
      },
    },
    methods:{
      //取消按钮操作
      close() {
        this.$emit("update:instrumentShow", false);
      },
    }
  }
</script>
