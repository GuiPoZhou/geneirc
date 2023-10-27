<template>
  <div class="resultHis">
    <el-dialog
      title="查看检测记录"
      :visible.sync="detectHistoryShow"
      append-to-body
      width="1250px"
      @open="open"
      center
      :before-close="handleClose"
    >
      <el-table :data="tableData1">
        <el-table-column type="index" width="55" align="center" />
        <el-table-column prop="fileName" label="记录名称"> </el-table-column>
        <el-table-column prop="createBy" label="上传人员"> </el-table-column>
        <el-table-column prop="createTime" label="上传时间"> </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="$emit('cancel')">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "detectInstrument",
  components: {},
  data() {
    return {
      loading: false,
      tableData: [],
    };
  },
  props: {
    detectHistoryShow: {
      type: Boolean,
      default: false,
    },
    resultId: null,
    tableData1: {
      type: Array,
      default: [],
    },
  },
  methods: {
    //关闭按钮设置函数
    handleClose() {
      this.$emit("cancel");
    },
    open() {
      this.resultHisList();
    },
    //列表
    resultHisList() {},
  },
  computed: {},
  created() {},
  mounted() {},
  updated() {},
};
</script>
<style lang="less" scoped>
</style>
