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
          <el-form-item label="内审通知编号" prop="serial">
            <el-input
              placeholder="请输入内审通知编号"
              v-model="queryParams.serial"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="内审计划编号" prop="planSerial">
            <el-input
              placeholder="请输入内审计划编号"
              v-model="queryParams.planSerial"
              disabled
            ></el-input>
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
        <el-col :span="12">
          <el-form-item label="评审会议时间" prop="meetingTime">
            <el-date-picker
              v-model="queryParams.meetingTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期"
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
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="审核内容及时间安排" prop="content">
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
      <template v-if="this.messageType !== 'messageshow'">
        <div class="tabtit">
          <span>审核组名单</span>
          <el-button type="primary" @click="handleOption()" :disabled="isdisable"
          >选择</el-button
          >
        </div>
        <el-table ref="multipleTable" :data="queryParams.teamList" stripe border>
          <el-table-column label="序号" align="center" type="index" width="50" />
          <el-table-column prop="userDeptName" label="部门" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="userName" label="姓名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="status" label="是否已阅" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">未阅</span>
              <span v-if="scope.row.status == 2">已阅</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="text"
                  :disabled="isdisable"
                  @click="peopleDel(scope.$index)"
              >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="showType !== 'show'" @click="handleOk()"
        >保存发送通知</el-button
      >
      <el-button @click="cancelbtn">取消</el-button>
    </div>
    <!--人员名单-->
    <roleTreeTransfer
      v-if="showtree"
      ref="transfer"
      @close="showtree = false"
      @roleHandleData="handleData"
    ></roleTreeTransfer>
  </el-dialog>
</template>

<script>
import roleTreeTransfer from "@/views/qualityAssurance/common/roleTreeTransfer";
import { roleChoiceUser } from "@/api/qualityAssurance/index";
import { noticeadd, noticeedit } from "@/api/mass/config";

export default {
  name: "auditNotice",
  components: { roleTreeTransfer },
  data() {
    return {
      dialogShow: false,
      isFullScreen: true,
      screenName: "fullScreen",
      titles: "添加",
      showType: "add",
      queryParams: {
        planSerial: "",
        teamList: [],
        planId: "",
        serial: "",
        compilerName: "",
        compilerTime: "",
        location: "",
        meetingTime: "",
        id: "",
        content: "",
      },
      rules: {},
      isdisable: false,
      listData: [],
      showtree: false,
      selectItem: [],
      peoples: {},
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
      } else if (val == "update") {
        this.titles = "修改";
      } else if (val == "show") {
        this.titles = "查看";
        this.isdisable = true;
      } else if (val == "showIndex") {
        this.titles = "查看";
        this.isdisable = true;
      }
    },
  },
  methods: {
    // 接收父组件传递的数据
    init(show, data, message) {
      this.dialogShow = true;
      this.showType = show;
      this.messageType = message;
      if (this.showType == "add") {
        this.queryParams.planSerial = data.planSerial;
        this.queryParams.planId = data.planId;
      } else {
        this.queryParams.planSerial = data.planSerial;
        this.queryParams.planId = data.planId;
        this.queryParams.id = data.id;
        this.queryParams.serial = data.serial;
        this.queryParams.compilerName = data.compilerName;
        this.queryParams.compilerTime = data.compilerTime;
        this.queryParams.location = data.location;
        this.queryParams.meetingTime = data.meetingTime;
        // this.queryParams.teamList = data.teamList;
        this.queryParams.content = data.content;
        for (var i in data.teamList) {
          this.queryParams.teamList.push({
            status: data.teamList[i].status,
            userId: data.teamList[i].userId,
            userName: data.teamList[i].userName,
            userDeptId: data.teamList[i].userDeptId,
            userDeptName: data.teamList[i].userDeptName,
          });
        }
      }
    },
    open() {},
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    // 人员删除
    peopleDel(index) {
      this.queryParams.teamList.splice(index, 1);
    },
    // 选择人员
    handleOption() {
    	console.log('this.queryParams.teamList',this.queryParams.teamList)
      this.showtree = true;
      var data = [];
      for (var i in this.queryParams.teamList) {
        data.push(`${this.queryParams.teamList[i].userDeptId}-${this.queryParams.teamList[i].userId}`);
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
      this.queryParams.teamList = []
      for (var i in data) {
        this.queryParams.teamList.push({
          userId: data[i].userId,
          userName: data[i].roleName,
          userDeptId: data[i].userDeptId,
          userDeptName: data[i].userDeptName,
          status: 1
        });
      }
      /* 去重 */
      // this.queryParams.teamList = this.array_uniq(this.queryParams.teamList);
      // this.queryParams.teamList = data
      console.log(data);
      console.log(this.queryParams.teamList);
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
    // 执行添加和编辑的逻辑
    handleOk() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          if (this.queryParams.teamList.length === 0) {
            this.$message.error("请至少添加一条审核组信息，完善表格数据");
            return;
          }
          if (this.showType == "add") {
            noticeadd(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success("添加成功");
                this.$emit("complete");
              }
            });
          } else {
            noticeedit(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success("编辑成功");
                this.$emit("complete");
              }
            });
          }
        }
      });
    },
    cancelbtn() {
      this.$emit("close");
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
/deep/ .el-dialog__body .el-col {
  margin-bottom: 0;
}
</style>
