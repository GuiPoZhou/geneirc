<template>
  <el-form
    :model="queryParams"
    ref="queryForm"
    :inline="true"
    :prop="queryParams"
    style="margin: 15px 0 0 0"
    :rules="rules"
    label-width="120px"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="计划编号" prop="serial">
          <el-input
            placeholder="请输入计划编号"
            v-model="queryParams.serial"
            :disabled="isdisable"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="计划年度" prop="year">
          <el-date-picker
            v-model="queryParams.year"
            type="year"
            value-format="yyyy"
            :disabled="isdisable"
            placeholder="选择计划年度"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="编制人员" prop="compilerName">
          <el-input
            placeholder="请输入编制人员"
            v-model="queryParams.compilerName"
            :disabled="isdisable"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="编制日期" prop="compilerTime">
          <el-date-picker
            v-model="queryParams.compilerTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
            style="width: 100%"
            :disabled="isdisable"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="内审目的" prop="purpose">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="queryParams.purpose"
            :disabled="isdisable"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="内审范围" prop="internalAuditScope">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="queryParams.internalAuditScope"
            :disabled="isdisable"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="内审依据" prop="basis">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="queryParams.basis"
            :disabled="isdisable"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="审核办法" prop="method">
          <el-checkbox-group v-model="queryParams.method" :disabled="isdisable">
            <el-radio-group v-model="queryParams.method" :disabled="isdisable">
              <el-radio :label="1">抽样检查有关资料、记录</el-radio>
              <el-radio :label="2">现场检测</el-radio>
            </el-radio-group>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="评审内容" prop="content">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="queryParams.content"
            :disabled="isdisable"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="发放范围" prop="distributionScope">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="queryParams.distributionScope"
            :disabled="isdisable"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="tabtit">
      <span>参加人员</span>
    </div>
    <el-table
      v-loading="loading"
      :data="personalData"
      row-key="id"
      ref="selectTable"
      style="margin-top: 20px"
      highlight-current-row
      border
    >
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="职务" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-select
              v-model="scope.row.userPostName"
              :ref="'userPostName' + scope.$index"
              :disabled="isdisable"
          >
            <el-option value="1" label="评审组长"></el-option>
            <el-option value="2" label="组员"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.userName"
            :disabled="isdisable"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            style="color: #ff4949"
            :disabled="isdisable"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="tabtit" style="margin-top: 20px">
      <span>日程安排</span>
    </div>
    <el-table
      v-loading="loading"
      :data="schedulelData"
      row-key="id"
      ref="selectTable"
      style="margin-top: 20px"
      highlight-current-row
      border
    >
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column label="日期" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.time"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            :disabled="isdisable"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="评审人员" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.userName"
            :disabled="isdisable"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="评审内容" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.content"
            :disabled="isdisable"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            style="color: #ff4949"
            :disabled="isdisable"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import { auditdetail } from "@/api/mass/config";
export default {
  name: "auditPlan",
  data() {
    return {
      queryParams: {
        serial: "",
        year: "",
        compilerName: "",
        compilerTime: "",
        purpose: "",
        internalAuditScope: "",
        basis: "",
        method: "",
        content: "",
        distributionScope: "",
        planPersonList: [],
        planScheduleList: [],
      },
      rules: {},
      isdisable: true,
      auditMode: [],
      modeList: [
        { value: "1", label: "抽样检查有关资料、记录", ischecked: false },
        { value: "2", label: "现场检测", ischecked: false },
      ],
      loading: false,
      personalData: [],
      schedulelData: [],
    };
  },
  watch: {
    firstTbsdata(val) {
      console.log("wooooo", val);
      this.queryParams = val;
      this.personalData = this.queryParams.planPersonList;
      this.schedulelData = this.queryParams.planScheduleList;
      // this.queryParams.userPostName = data.userPostName
      //   this.queryParams.userPostId = data.userPostId
    },
  },
  props: {
    firstTbsdata: Object,
  },
  mounted() {},
  methods: {
    modeChange(val, label) {
      if (this.auditMode.indexOf(label) > -1) {
        this.auditMode = [];
        this.auditMode.push(label);
      }
    },
  },
};
</script>

<style scoped>
</style>
