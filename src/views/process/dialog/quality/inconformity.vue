<template>
  <div style="padding: 20px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane label="不符合记录申请" name="first">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            :prop="queryParams"
            style="margin: 15px 0 0 50px"
            :rules="rules"
            label-position="top"
            label-width="80px"
            v-if="!samplehandle"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="不符合记录编号" prop="serial" style="width: 90%">
                <el-input placeholder="请输入不符合记录编号" v-model="queryParams.serial" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内审计划编号" prop="planSerial" style="width: 90%">
                <el-input placeholder="请输入内审计划编号" v-model="queryParams.planSerial" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="受审部门" prop="deptName" style="width: 90%">
                <el-input placeholder="请输入受审部门" v-model="queryParams.deptName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内审员" prop="reviewer" style="width: 90%">
                <el-input placeholder="请输入内审员" v-model="queryParams.reviewer" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="审核日期" prop="reviewTime" style="width: 90%">
                <el-input placeholder="请输入审核日期" v-model="queryParams.reviewTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="tit">不符合项事实描述</span>
            </el-col>
          </el-row>
          <el-row>
            <div class="borderbox">
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="queryParams.factDescription" disabled></el-input>
              <el-upload
                  style="margin-left: 20px"
                  ref="upload"
                  list-type="picture-card"
                  :file-list="file1List"
                  :disabled="true"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{ file }">
                  <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url ? file.url : baseUrl + file.filePath"
                      alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                        class="el-upload-list__item-preview"
                        @click="
                        handlePictureCardPreview(
                          file.url ? file.url : baseUrl + file.filePath
                        )
                      "
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </div>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="原因分析受审核负责人" prop="causeAnalysis" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.causeAnalysis" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="tit">纠正/预防措施 部门负责人</span>
            </el-col>
          </el-row>
          <el-row>
            <div class="borderbox">
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="queryParams.measure" disabled></el-input>
              <el-upload
                  style="margin-left: 20px"
                  ref="upload"
                  list-type="picture-card"
                  :file-list="file2List"
                  :disabled="true"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{ file }">
                  <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url ? file.url : baseUrl + file.filePath"
                      alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                        class="el-upload-list__item-preview"
                        @click="
                        handlePictureCardPreview(
                          file.url ? file.url : baseUrl + file.filePath
                        )
                      "
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </div>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="纠正/措施的完成情况部门负责人" prop="completion" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.completion" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="纠正/预防措施跟踪及有效性验证部门负责人" prop="validation" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.validation" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
  import moment from "moment";
  export default {
    name: "inconformity",
    data() {
      return {
        dialogShow: false,
        activeName: "first",
        visible: false,
        queryParams: {},
        rules: {
        },
        isdisable: true,
        loading: false,
        isFullScreen: true,
        screenName: "fullScreen",
        showType: "add",
        showdisable: false,
        titleMsg: "",
        samplehandle: false,
        showeplanedate: false,
        dialogVisible: false,
        dialogImageUrl: null,
        listData: [],
        file1List: [],
        file2List: [],
        baseUrl: window.globalEnv.VUE_APP_BASE_API + "/",
      };
    },
    // props: {
    //   msg: String,
    // },
    computed: {
      getLeftWidth() {
        return this.$store.state.app.leftWidth;
      },
    },
    watch: {
      getLeftWidth() {
        let width = this.$store.state.app.leftWidth;
        if (width < 200) {
          this.screenName = "bigFullScreen";
        } else {
          this.screenName = "fullScreen";
        }
      },
    },
    mounted() {
      let width = this.$store.state.app.leftWidth;
      if (width < 200) {
        this.screenName = "bigFullScreen";
      } else {
        this.screenName = "fullScreen";
      }
    },
    methods: {
      handlePictureCardPreview(file) {
        console.log(file);
        this.dialogImageUrl = file;
        this.dialogVisible = true;
      },
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      init(params) {
        console.log(params)
        if (params) {
          this.queryParams = {
            ...params
          }
          this.file1List = this.queryParams?.file1List
          this.file2List = this.queryParams?.file2List
        }
        this.dialogShow = true;
      },
      cancelbtn() {
        this.$emit("close");
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
    }
  };
</script>

<style scoped>
  .dialog-footer {
    background: #fff;
    position: fixed;
    width: 64%;
    bottom: 0;
    height: 60px;
    z-index: 10;
  }
  .borderbox {
    border: 1px solid #dde2ee;
    opacity: 1;
    border-radius: 3px;
    margin: 10px 0 !important;
    padding-bottom: 10px;
  /deep/ .el-textarea__inner {
    border: none;
  }
  /deep/ .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 126px;
  }
  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 120px;
  }
  }
</style>
