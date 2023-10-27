<template>
  <div style="padding: 20px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane label="设备维修记录申请" name="first">
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
              <el-form-item label="维修日期" prop="repairDateStr" style="width: 90%">
                <el-input placeholder="请输入维修日期" v-model="queryParams.repairDate" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维修人员" prop="repairPerson" style="width: 90%">
                <el-input placeholder="请输入维修人员" v-model="queryParams.repairPerson" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="维修单位" prop="repairCompany" style="width: 90%">
                <el-input placeholder="请输入维修单位" v-model="queryParams.repairCompany" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维修费用/元" prop="repairCost" style="width: 90%">
                <el-input placeholder="请输入维修费用/元" v-model="queryParams.repairCost" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="设备状况" prop="equipmentStatus" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.equipmentStatus" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="仪器设备现状及故障原因" prop="reason" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.reason" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="维修项目" prop="repairItem" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.repairItem" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="维修结果" prop="repairResult" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.repairResult" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="实验室意见" prop="labOpinion" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.labOpinion" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="设备仪器的重新检定情况" prop="recheck" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.recheck" disabled></el-input>
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
              <el-form-item label="录入日期" prop="updateTime" style="width: 90%">
                <el-input placeholder="请输入录入日期" v-model="queryParams.createTime" disabled></el-input>
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
