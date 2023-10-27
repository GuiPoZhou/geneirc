<template>
  <div style="padding: 20px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane label="期间核查计划申请" name="first">
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
              <el-form-item label="计划日期" prop="planDate" style="width: 90%">
                <el-input placeholder="请输入计划日期" v-model="queryParams.planDate" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划单号" prop="planNo" style="width: 90%">
                <el-input placeholder="请输入计划单号" v-model="queryParams.planNo" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="编制人员" prop="applyPerson" style="width: 90%">
                <el-input placeholder="请输入编制人员" v-model="queryParams.applyPerson" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划年度" prop="planYear" style="width: 90%">
                <el-input placeholder="请输入计划年度" v-model="queryParams.planYear" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="批准人" prop="approvalUser" style="width: 90%">
                <el-input placeholder="请输入批准人" v-model="queryParams.approvalUser" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="批准日期" prop="approvalDate" style="width: 90%">
                <el-input placeholder="请输入批准日期" v-model="queryParams.approvalDate" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="计划描述" prop="describe" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.describe" disabled></el-input>
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
        <el-table
            v-loading="loading"
            :data="listData"
            row-key="id"
            ref="selectTable"
            border
            stripe
        >
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column prop="equipmentNumber" label="设备编号" />
          <el-table-column prop="equipmentName" label="设备名称" show-overflow-tooltip/>
          <el-table-column prop="equipmentModel" label="规格型号" show-overflow-tooltip/>
          <el-table-column prop="calibrationCycle" label="溯源周期（月）" show-overflow-tooltip/>
          <el-table-column prop="loseCalibrationDate" label="检定校准失效日期" show-overflow-tooltip/>
          <el-table-column prop="executeDate" label="计划实施日期" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleDate(scope.row)">{{scope.row.executeDate}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="liablePerson" label="责任人" show-overflow-tooltip/>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--添加实施计划日期-->
    <planDate v-if="showeplanedate" ref="planedate" @close="showeplanedate = false"></planDate>
  </div>
</template>

<script>
  import moment from "moment";
  import planDate from "@/views/resources/deviceManagement/components/planDate";

  export default {
    name: "intermediateChecks",
    // components: {detectType, detectionInformation, chains},
    components: { planDate },
    data() {
      return {
        dialogShow: false,
        activeName: "first",
        visible: false,
        queryParams: {},
        rules: {
          planDate: [{required: true, message: "请选择计划日期", trigger: "change"}],
          planNo: [{required: true, message: "请输入计划单号", trigger: "blur"}],
          planYear: [{required: true, message: "请选择计划年度", trigger: "change"}],
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
          this.listData = params.detailList;
        }
        this.dialogShow = true;
      },
      cancelbtn() {
        this.$emit("close");
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 实施计划日期
      handleDate (row) {
        this.showeplanedate = true
        this.$nextTick(() => {
          this.$refs.planedate.init(row, 'show')
        })
      },
    },
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
