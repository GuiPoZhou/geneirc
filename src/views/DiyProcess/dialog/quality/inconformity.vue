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
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="queryParams.factDescription" disabled></el-input>
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
        listData: [],
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
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      init(params) {
        console.log(params)
        if (params) {
          this.queryParams = {
            ...params
          }
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
</style>
