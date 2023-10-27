<!--
 * @Autor: 焦政
 * @Date: 2021-06-28 10:58:58
 * @Description: pdf查看框
-->
<template>
  <div :class="isFullScreen ? screenName : ''">
    <el-dialog
      :visible.sync="pdfshow"
      :fullscreen="isFullScreen"
      :modal-append-to-body="false"
      :modal="false"
      width="80%"
      @close="e_close"
      center
      :show-close="false"
    >
      <div slot="title" class="dialog-title">
        <span class="topTilte">{{ pdftit }}</span>
        <div class="topRight">
          <!-- 最小化 -->
          <i
            class="el-icon-minus rightIcon"
            v-if="isFullScreen"
            @click="isFullScreen = false"
          ></i>
          <!-- 最大化 -->
          <i
            class="el-icon-full-screen rightIcon"
            v-if="!isFullScreen"
            @click="isFullScreen = true"
          ></i>
          <!-- 关闭 -->
          <i class="el-icon-close rightIcon" @click="e_close"></i>
        </div>
      </div>
      <div class="showarea">
        <iframe
          style="width: 100%; height: 100%"
          :src="pdfURL"
          frameborder="0"
        ></iframe>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click="e_close"
          >确 定</el-button
        >
        <el-button @click="e_close">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import pdf from "vue-pdf";
import { getReport, getCheckrecord, getOriPdf } from "@/api/report/config";
import LocalFile from "@/utils/LocalFile";
import { reportReleasepint } from "@/api/report/pigeonhole";
export default {
  components: {
    // pdf,
  },
  data() {
    return {
      isFullScreen: true,
      screenName: "fullScreen",
      pdfPage: 1,
      pageCount: 0,
      pdfURL: "",
      pdfshow: false,
      fullscreenLoading: false,
      pdftit: "报告查看",
    };
  },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleClosePdf() {
      this.pdfURL = "";
      this.pdfPage = 1;
      this.pageCount = 0;
    },
    //改变页数
    previousPage() {
      var p = this.pdfPage;
      p = p > 1 ? p - 1 : this.pageCount;
      this.pdfPage = p;
    },
    nextPage() {
      var p = this.pdfPage;
      p = p < this.pageCount ? p + 1 : 1;
      this.pdfPage = p;
    },
    //取消按钮操作
    e_close() {
      this.$emit("close");
    },
    append(id) {
      this.pdfshow = true;
      this.pdfURL = "";
      this.pdfPage = 1;
      this.pageCount = 0;
      getReport(id).then((re) => {
        this.pdfURL = LocalFile.base64ToUrl(re.data.report);
        this.pdfURL = "/pdfjs/web/noviewer.html?file=" + this.pdfURL;
      });
    },
    reportPint(ids) {
      this.pdfshow = true;
      this.pdfURL = "";
      this.pdfPage = 1;
      this.pageCount = 0;
      reportReleasepint(ids).then((res) => {
        this.pdfURL = LocalFile.base64ToUrl(res.data.report);
        this.pdfURL = "/pdfjs/web/viewer.html?file=" + this.pdfURL;
      });
    },
    // 查看检测记录
    checkedrecord(id) {
      this.pdftit = "检测记录";
      this.pdfshow = true;
      this.pdfURL = "";
      this.pdfPage = 1;
      this.pageCount = 0;
      getCheckrecord(id).then((res) => {
        this.pdfURL = LocalFile.base64ToUrl(res.msg);
        this.pdfURL = "/pdfjs/web/viewer.html?file=" + this.pdfURL;
      });
    },
    // 查看原始记录
    lookhistory(id) {
      this.pdftit = "检测记录";
      this.pdfshow = true;
      this.pdfURL = "";
      this.pdfPage = 1;
      this.pageCount = 0;
      getOriPdf(id).then((re) => {
        this.pdfURL = LocalFile.base64ToUrl(re.msg);
        this.pdfURL = "/pdfjs/web/viewer.html?file=" + this.pdfURL;
      });
    },
    // 借阅查看pdf(无下载和打印按钮)
    showPdfs(urls) {
      this.pdftit = "附件查看";
      this.pdfshow = true;
      this.pdfURL = "";
      this.pdfPage = 1;
      this.pageCount = 0;
      this.pdfURL = LocalFile.base64ToUrl(urls);
      this.pdfURL = "/pdfjs/web/noviewer.html?file=" + this.pdfURL;
    },
    // 打印查看pdf(无下载)
    showPrint(urls) {
      this.pdftit = "附件查看";
      this.pdfshow = true;
      this.pdfURL = "";
      this.pdfPage = 1;
      this.pageCount = 0;
      this.pdfURL = LocalFile.base64ToUrl(urls);
      this.pdfURL = "/pdfjs/web/nodownviewer.html?file=" + this.pdfURL;
    },
  },
};
</script>

<style lang="scss" scoped>
.showarea {
  width: 100%;
  height: 100%;
}
.sa-ifram {
  width: 100%;
  height: 100%;
}
</style>
