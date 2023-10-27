<template>
  <div style="padding: 20px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane label="检定校准记录申请" name="first">
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
              <el-form-item label="规格型号" prop="equipmentModel" style="width: 90%">
                <el-input placeholder="请输入规格型号" v-model="queryParams.equipmentModel" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="上次检定日期" prop="lastCalibrationDate" style="width: 90%">
                <el-input placeholder="请输入上次检定日期" v-model="queryParams.lastCalibrationDate" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检定/校准周期" prop="calibrationCycle" style="width: 90%">
                <el-input placeholder="请输入检定/校准周期" v-model="queryParams.calibrationCycle" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="检定/校准日期" prop="calibrationDate" style="width: 90%">
                <el-input placeholder="请输入检定/校准日期" v-model="queryParams.calibrationDate" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检定/校准到期日期" prop="loseCalibrationDate" style="width: 90%">
                <el-input placeholder="请输入检定/校准到期日期" v-model="queryParams.loseCalibrationDate" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="主要用途" prop="mainPurpose" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.mainPurpose" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="确认依据" prop="comfirmBasis" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.comfirmBasis" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="主要检定/校准项目及技术要求" prop="calibrationItem" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.calibrationItem" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="检定/校准结果" prop="calibrationResult" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.calibrationResult" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="校准所产生的修正值或修正因子" prop="correct" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.correct" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="确认结论" prop="comfirmConclusion" style="width: 95%">
                <el-select v-model="queryParams.comfirmConclusion" placeholder="请选择" disabled style="width: 95%">
                  <el-option label="符合" :value="1"></el-option>
                  <el-option label="不符合" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用方式" prop="useMode" style="width: 95%">
                <el-select v-model="queryParams.useMode" placeholder="请选择" disabled style="width: 95%">
                  <el-option label="正常使用" :value="1"></el-option>
                  <el-option label="按修正值使用" :value="2"></el-option>
                  <el-option label="不可正常使用" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="记录说明" prop="remark" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.remark" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="确认结果" prop="comfirmResult" style="width: 90%">
                <el-input placeholder="请输入确认结果" v-model="queryParams.comfirmResult" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认人" prop="comfirmPerson" style="width: 90%">
                <el-input placeholder="请输入确认人" v-model="queryParams.comfirmPerson" disabled></el-input>
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
    name: "calibrationRecord",
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
