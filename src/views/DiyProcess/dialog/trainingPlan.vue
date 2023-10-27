<template>
  <div style="padding: 20px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane label="培训计划申请" name="first">
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
              <el-form-item label="编号" prop="planNo" style="width: 90%">
                <el-input placeholder="请输入编号" v-model="queryParams.planNo" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划年度" prop="planYear" style="width: 90%">
                <el-input placeholder="请输入编号" v-model="queryParams.planYear" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="编制人员" prop="formulatePerson" style="width: 90%">
                <el-input placeholder="请输入编制人员" v-model="queryParams.formulatePerson" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编制日期" prop="formulateDate" style="width: 90%">
                <el-input placeholder="请输入编制人员" v-model="queryParams.formulateDate" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="计划描述" prop="formulatePerson" style="width: 95%">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.planDesc" disabled></el-input>
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
          <el-table-column
              label="序号"
              align="center"
              type="index"
              width="50"
          />
          <el-table-column
              prop="trainContent"
              label="培训内容"
              show-overflow-tooltip
          />
          <el-table-column
              prop="sponsor"
              label="主办部门/人"
              show-overflow-tooltip
          />
          <el-table-column
              prop="joinPerson"
              label="参加人员"
              show-overflow-tooltip
          />
          <el-table-column
              prop="trainDate"
              label="培训时间"
              show-overflow-tooltip
              align="center"
          />
          <el-table-column
              prop="trainWay"
              label="培训方式"
              show-overflow-tooltip
          />
          <el-table-column
              prop="remark"
              label="备注"
              show-overflow-tooltip
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import moment from "moment";

  export default {
    name: "borrow",
    // components: {detectType, detectionInformation, chains},
    data() {
      return {
        dialogShow: false,
        activeName: "first",
        visible: false,
        queryParams: {},
        rules: {
          planNo: [{required: true, message: "请输入编号", trigger: "blur"}],
          planYear: [{required: true, message: "请输入文件名称", trigger: "blur"}],
        },
        isdisable: true,
        loading: false,
        isFullScreen: true,
        screenName: "fullScreen",
        showType: "add",
        showdisable: false,
        titleMsg: "",
        samplehandle: false,
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
          this.listData = params.trainPlanDetailList;
        }
        this.dialogShow = true;
      },
      cancelbtn() {
        this.$emit("close");
      },
      handleClick(tab, event) {
        console.log(tab, event);
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
