<template>
  <div class="resultHis">
    <el-dialog
      title="检测记录"
      :visible.sync="showFileOpen"
      append-to-body
      width="1250px"
      @open="open"
      center
      :before-close="close"
    >
      <el-table :data="tableData">
        <el-table-column type="index" width="55" align="center" />
        <el-table-column prop="fileName" label="记录名称">
          <template slot-scope="scope">
            <el-link
              :underline="false"
              @click="getPDF(scope.row)"
              type="primary"
              >{{ scope.row.fileName }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="上传人员"> </el-table-column>
        <el-table-column prop="createTime" label="上传时间"> </el-table-column>
        <el-table-column
          prop="deptName"
          label="操作"
          align="center"
          width="180"
          fixed="right"
          v-if="!disabled"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="removeFile(scope.row.id, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="primary" @click="submitForm" v-if="!disabled"
          >保存</el-button
        >
        <el-button @click="close">取消</el-button>
      </div>
      <el-dialog
        :title="'查看文件'"
        :visible.sync="showFormDetail"
        append-to-body
        center
        :show-close="true"
        @close="closePdf"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <iframe
          style="width: 100%; height: 100vh"
          :src="pdfURL"
          frameborder="0"
          v-if="showFormDetail"
        ></iframe>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closePdf">取消</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "fileList",
  components: {},
  data() {
    return {
      loading: false,
      showFormDetail: false,
      pdfURL: null,
      removeIdList: [],
    };
  },
  props: {
    showFileOpen: {
      type: Boolean,
      default: false,
    },
    resultId: null,

    tableData: {
      type: Array,
      default: [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    open() {
      this.removeIdList = [];
    },
    //取消按钮操作
    close() {
      this.$emit("cancel");
    },
    removeFile(id, index) {
      let tempList = JSON.parse(JSON.stringify(this.tableData));
      tempList.splice(index, 1);
      this.$emit("update:tableData", tempList);
      // console.log("removeFile", id, index);
      this.removeIdList.push(id);
    },
    getPDF(row) {
      this.pdfURL =
        "/pdfjs/web/viewer.html?file=" +
        window.globalEnv.VUE_APP_BASE_API +'/'+
        row.filePath;
      this.showFormDetail = true;
    },
    closePdf() {
      this.pdfURL = null;
      this.showFormDetail = false;
    },
    submitForm() {
      this.$emit("removeFile", this.tableData, this.removeIdList);
      this.$emit("update:showFileOpen", false);
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
