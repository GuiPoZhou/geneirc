<template>
  <div style="padding: 20px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane label="期间核查记录申请" name="first">
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
              <el-form-item label="设备编号" prop="equipmentNumber" style="width: 90%">
                <el-input placeholder="请输入设备编号" v-model="queryParams.equipmentNumber" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备名称" prop="equipmentName" style="width: 90%">
                <el-input placeholder="请输入设备名称" v-model="queryParams.equipmentName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="生产厂家" prop="manufacturer" style="width: 90%">
                <el-input placeholder="请输入生产厂家" v-model="queryParams.manufacturer" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="量程范围" prop="range" style="width: 90%">
                <el-input placeholder="请输入量程范围" v-model="queryParams.range" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="精度等级" prop="accuracyClass" style="width: 90%">
                <el-input placeholder="请输入精度等级" v-model="queryParams.accuracyClass" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上次检定日期" prop="lastCalibrationDate" style="width: 90%">
                <el-input placeholder="请输入上次检定日期" v-model="queryParams.lastCalibrationDate" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="检定失效日期" prop="loseCalibrationDate" style="width: 90%">
                <el-input placeholder="请输入检定失效日期" v-model="queryParams.loseCalibrationDate" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="核查日期" prop="checkDate" style="width: 90%">
                <el-input placeholder="请输入核查日期" v-model="queryParams.checkDate" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="核查人员" prop="checkPerson" style="width: 90%">
                <el-input placeholder="请输入核查人员" v-model="queryParams.checkPerson" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="核查内容及方法" prop="checkContent" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.checkContent" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="核查结果" prop="checkResult" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.checkResult" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="核查意见" prop="checkOpinion" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.checkOpinion" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="录入人" prop="createBy" style="width: 90%">
                <el-input placeholder="请输入录入人" v-model="queryParams.createBy" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最新修改日期" prop="updateTime" style="width: 90%">
                <el-input placeholder="请输入最新修改日期" v-model="queryParams.updateTime" disabled></el-input>
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
    name: "interchecksRecord",
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
