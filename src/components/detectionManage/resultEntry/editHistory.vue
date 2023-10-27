<template>
  <div class="resultHis">
    <el-dialog
      title="修改记录"
      :visible.sync="editHisShow"
      append-to-body
      width="1250px"
      @open="open"
      center
      :before-close="handleClose"
    >
      <el-table :data="tableData">
        <el-table-column type="index" width="55" align="center" />
        <el-table-column prop="detectResult" label="检测结果">
        </el-table-column>
        <el-table-column prop="itemCode" label="方法编号"> </el-table-column>
        <el-table-column prop="detectLimit" label="方法检出限">
        </el-table-column>
        <el-table-column prop="detectUnitStr" label="检出限单位">
        </el-table-column>
        <el-table-column prop="detectResultUnitStr" label="结果单位">
        </el-table-column>
        <el-table-column prop="rationLimit" label="定量限值"> </el-table-column>
        <el-table-column prop="conclusion" label="判定结论"> </el-table-column>
        <el-table-column prop="updateUserName" label="编制人员">
        </el-table-column>
        <el-table-column prop="updateTime" label="编制时间"> </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="$emit('cancel')">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getResultHis } from "@/api/detectionManage/resultEntry/noRecord";
export default {
  name: "editHistory",
  components: {},
  data() {
    return {
      loading: false,
      tableData: [],
    };
  },
  props: {
    editHisShow: {
      type: Boolean,
      default: false,
    },
    resultId: null,
  },
  methods: {
    open() {
      this.resultHisList();
    },
    //关闭按钮设置函数
    handleClose(done) {
      this.$emit("cancel");
    },
    //列表
    resultHisList() {
      this.loading = true;
      getResultHis(this.resultId).then(
        (res) => {
          console.log("历史记录列表==>", res.data);
          this.tableData = res.data;
          this.loading = false;
        },
        (err) => {}
      );
    },
  },
  computed: {},
  created() {},
  mounted() {},
  updated() {},
};
</script>
<style lang="less" scoped>
</style>
