<template>
  <div>
    <div class="btnbox">
      <el-button type="primary" :disabled="disabled" @click="addMeetingLog()"
        >添加</el-button
      >
      <el-button type="success" @click="handlePrint" :disabled="!ids.length > 0"
        >打印</el-button
      >
      <el-button type="primary" :disabled="disabled" @click="next"
        >完成</el-button
      >
    </div>
    <p class="tabtit">管评会议记录列表</p>
    <el-table
      ref="multipleTable"
      :data="meetingLogData"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column
        prop="serial"
        label="会议记录编号"
        show-overflow-tooltip
      />
      <el-table-column
        prop="planSerial"
        label="管评计划编号"
        show-overflow-tooltip
      />
      <el-table-column
        prop="participants"
        label="与会人员"
        show-overflow-tooltip
      />
      <el-table-column prop="time" label="会议时间" show-overflow-tooltip />
      <el-table-column prop="location" label="会议地点" show-overflow-tooltip />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="lookMeetingLog(scope.row.id)"
            >查看</el-button>
          <el-button
            size="mini"
            v-if="!disabled"
            type="text"
            @click="editMeetingLog(scope.row.id)"
            >修改</el-button>
          <el-button
            size="mini"
            v-if="!disabled"
            type="text"
            @click="delMeetingLog(scope.row.id)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      style="height: 30px"
    />
    <!--添加/查看/修改管评通知-->
    <meetingForm
      v-if="showMeetingLog"
      ref="meetingLog"
      @complete="complete"
      @close="showMeetingLog = false"
    ></meetingForm>
  </div>
</template>

<script>
import meetingForm from "../implement/meetingForm";
import {
  getMeetingList,
  getMeetingInfo,
  delMeeting,
} from "@/api/qualityAssurance/managementReview/auditImplement";

export default {
  name: "meeting",
  components: { meetingForm },
  data() {
    return {
      showMeetingLog: false,
      meetingLogData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planId: 0,
      },
      total: 0,
      formData: {},
      ids: [],
    };
  },
  props: {
    id: 0,
    disabled: false,
  },
  mounted() {
    this.getList();
  },
  methods: {
    next() {
      this.$emit("nextStep", {
        planId: this.id,
        progress: 3,
      });
    },
    setData(data) {
      this.formData = {
        planId: data.id,
        planSerial: data.serial,
      };
    },
    complete() {
      this.showMeetingLog = false;
      this.getList();
    },

    addMeetingLog() {
      this.showMeetingLog = true;
      this.$nextTick(() => {
        this.$refs.meetingLog.init("add", this.formData);
      });
    },
    lookMeetingLog(id) {
      this.showMeetingLog = true;

      getMeetingInfo(id).then((res) => {
        this.$nextTick(() => {
          this.$refs.meetingLog.init("show", res.data);
        });
      });
    },
    editMeetingLog(id) {
      this.showMeetingLog = true;

      getMeetingInfo(id).then((res) => {
        this.$nextTick(() => {
          this.$refs.meetingLog.init("edit", res.data);
        });
      });
    },
    delMeetingLog(id) {
      this.$confirm("确定删除该管评会议记录吗？", "提示").then((res) => {
        delMeeting(id).then((res) => {
          this.$message.success("删除成功");
          this.getList();
        });
      });
    },
    getList() {
      this.queryParams.planId = this.id;
      getMeetingList(this.queryParams).then((res) => {
      	for(let i in res.data.list) {
      		console.log(res.data.list[i].participantsList)
      		if(res.data.list[i].participantsList) {
				res.data.list[i].participants = res.data.list[i].participantsList.map(item => item.nickName)
				res.data.list[i].participants = res.data.list[i].participants.join('，')
			}
		}
        this.meetingLogData = res.data.list;
        this.total = res.data.total;
      });
    },
    /***多选框选中数据***/
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },
    // 打印
    handlePrint() {
      var ids = this.ids.join(",");
      POBrowser.openWindowModeless(
        process.env.VUE_APP_BASE_API +
          "/qualityControl/pageOffice/printManagementReviewMeetingMinutes?ids=" +
          ids,
        "width=1440px;height=860px"
      );
    },
  },
};
</script>

<style scoped>
</style>
