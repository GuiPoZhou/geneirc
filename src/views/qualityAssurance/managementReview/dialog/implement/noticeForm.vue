<template>
  <el-dialog
    class="elDialog"
    center
    width="60%"
    :visible.sync="dialogShow"
    :fullscreen="isFullScreen"
    :modal-append-to-body="false"
    :modal="false"
    :show-close="false"
    @open="open"
  >
    <div slot="title" class="dialog-title">
      <span class="topTilte">{{ titles }}</span>
      <div class="topRight">
        <!-- 最小化 -->
        <i
          class="el-icon-minus rightIcon"
          v-if="isFullScreen"
          @click="e_changeBox(false)"
        ></i>
        <!-- 最大化 -->
        <i
          class="el-icon-full-screen rightIcon"
          v-if="!isFullScreen"
          @click="e_changeBox(true)"
        ></i>
        <!-- 关闭 -->
        <i class="el-icon-close rightIcon" @click="cancelbtn"></i>
      </div>
    </div>
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
          <el-form-item label="通知编号" prop="serial">
            <el-input
              placeholder="请输入通知编号"
              v-model="queryParams.serial"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管评计划编号" prop="planSerial">
            <el-input
              placeholder="请输入管评计划编号"
              v-model="queryParams.planSerial"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>

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
              type="date"
              placeholder="编制日期"
              style="width: 100%"
              :disabled="isdisable"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="评审地点" prop="location">
            <el-input
              placeholder="请输入评审地点"
              v-model="queryParams.location"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
		  <el-col :span="24">
			  <el-form-item label="评审会议时间" prop="meetingTime">
				  <el-input
					  placeholder="请输入评审会议时间"
					  v-model="queryParams.meetingTime"
					  :disabled="isdisable"
					  type="textarea"
					  autosize
				  ></el-input>
				  <!--            <el-date-picker
								v-model="queryParams.meetingTime"
								value-format="yyyy-MM-dd HH:mm:ss"
								type="datetime"
								placeholder="选择日期"
								style="width: 100%"
								:disabled="isdisable"
							  ></el-date-picker>-->
			  </el-form-item>
		  </el-col>
		  <el-col :span="24">
			  <el-form-item label="主要时间安排" prop="schedule">
				  <el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入主要时间安排"
					  v-model="queryParams.schedule"
					  :disabled="isdisable"
					  autosize
				  ></el-input>
			  </el-form-item>
		  </el-col>
		  <el-col :span="24">
			  <el-form-item label="评审内容" prop="content">
				  <el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容"
					  v-model="queryParams.content"
					  :disabled="isdisable"
					  autosize
				  ></el-input>
			  </el-form-item>
		  </el-col>
      </el-row>
      <template v-if="messageType !== 'messageshow'">
        <div class="tabtit">
          <span>参加评审人员</span>
          <el-button type="primary" @click="selectOrgan()" :disabled="isdisable"
          >选择</el-button
          >
        </div>
        <el-table
            ref="multipleTable"
            :data="queryParams.personList"
            stripe
            border
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="序号" align="center" type="index" width="50" />
          <el-table-column
              prop="userDeptName"
              label="部门"
              show-overflow-tooltip
          />
          <el-table-column prop="userName" label="姓名" show-overflow-tooltip />
          <el-table-column prop="status" label="是否已阅" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">未阅</span>
              <span v-if="scope.row.status === 2">已阅</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="text"
                  @click="delRow(scope)"
                  :disabled="isdisable"
              >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveNotice" v-if="showType !== 'show'"
        >保存发送通知</el-button
      >
      <el-button @click="cancelbtn">取消</el-button>
    </div>
    <roleTreeTransfer
      v-if="showTransfer"
      ref="transfer"
      @close="showTransfer = false"
      @roleHandleData="handleData"
    ></roleTreeTransfer>
  </el-dialog>
</template>

<script>
import {
  addNotice,
  editNotice,
} from "@/api/qualityAssurance/managementReview/auditImplement";
import { roleChoiceUser } from "@/api/qualityAssurance/index";
import roleTreeTransfer from "../../../common/roleTreeTransfer";

export default {
  name: "noticeForm",
  components: { roleTreeTransfer },
  data() {
    return {
      showTransfer: false,
      dialogShow: false,
      isFullScreen: true,
      screenName: "fullScreen",
      titles: "添加",
      showType: "add",
      queryParams: {
        serial: "",
        planSerial: "",
        compilerName: "",
        compilerTime: "",
        meetingTime: "",
        location: "",
        content: "",
		schedule: "",
        personList: [],
      },
      rules: {
        serial: [
          { required: true, message: "请输入通知编号", trigger: "blur" },
        ],
        compilerName: [
          { required: true, message: "请输入编制人员", trigger: "blur" },
        ],
        compilerTime: [
          { required: true, message: "请选择编制日期", trigger: "blur" },
        ],
        meetingTime: [
          { required: true, message: "请输入评审会议时间", trigger: "blur" },
        ],
        location: [
          { required: true, message: "请输入评审地点", trigger: "blur" },
        ],
      },
      isdisable: false,
      messageType: ''
    };
  },
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
    showType(val) {
      if (val == "add") {
        this.titles = "添加";
      } else if (val == "edit") {
        this.titles = "修改";
      } else if (val == "show") {
        this.titles = "查看";
        this.isdisable = true;
      }
    },
  },
  methods: {
    // 选择人员
    selectOrgan() {
    	console.log('this.queryParams.personList',this.queryParams.personList)
      this.showTransfer = true;
      var data = [];
      for (var i in this.queryParams.personList) {
        data.push(`${this.queryParams.personList[i].userDeptId}-${this.queryParams.personList[i].userId}`);
      }
		roleChoiceUser().then((res) => {
        this.$nextTick(() => {
          this.$refs.transfer.init(res.data, data);
        });
      });
    },
    //选择人员
    handleData(data) {
    	console.log('data',data)
      this.queryParams.personList = []
      for (var j in data) {
        this.queryParams.personList.push({
          userId: data[j].userId,
          userName: data[j].roleName,
          userDeptId: data[j].userDeptId,
          userDeptName: data[j].userDeptName,
          status: 1
        });
      }
      /* 去重 */
      // this.queryParams.personList = this.array_uniq(
      //   this.queryParams.personList
      // );
    },
    array_uniq(input_arr) {
      var h = {};
      var arr = [];
      for (var i = 0; i < input_arr.length; i++) {
        if (!h[JSON.stringify(input_arr[i])]) {
          h[JSON.stringify(input_arr[i])] = true;
          arr.push(input_arr[i]);
        }
      }
      return arr;
    },
    init(show, data, message) {
      this.showType = show;
      this.messageType = message;
      this.dialogShow = true;
      if (this.showType == "add") {
        this.queryParams.planSerial = data.planSerial;
        this.queryParams.planId = data.planId;
      } else {
        this.queryParams.personList = data.personList;
        this.queryParams.planId = data.planId;
        this.queryParams.serial = data.serial;
        this.queryParams.planSerial = data.planSerial;
        this.queryParams.compilerName = data.compilerName;
        this.queryParams.compilerTime = data.compilerTime;
        this.queryParams.meetingTime = data.meetingTime;
        this.queryParams.location = data.location;
        this.queryParams.content = data.content;
        this.queryParams.schedule = data.schedule;
        this.queryParams.id = data.id;
      }
    },
    open() {},
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    cancelbtn() {
      this.$emit("close");
    },
    saveNotice() {
      this.$refs.queryForm.validate((valid) => {
        this.queryParams.personList = this.queryParams.personList;
        if (this.queryParams.personList.length === 0) {
          this.$message.error("请至少添加一条人员信息，完善表格数据");
          return;
        }
        if (valid) {
          if (this.showType == "add") {
            addNotice(this.queryParams).then((res) => {
              this.$message.success("新增成功");
              this.$emit("complete");
            });
          } else {
            editNotice(this.queryParams).then((res) => {
              this.$message.success("修改成功");
              this.$emit("complete");
            });
          }
        }
      });
    },
    delRow(val) {
      this.queryParams.personList.splice(val.$index, 1);
    },
  },
};
</script>

<style scoped lang="less">
.tabtit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  span {
    font-size: 14px;
    color: #3c4353;
    font-weight: bold;
  }
}
/deep/ textarea {
	min-height: 50px!important;
}
</style>
