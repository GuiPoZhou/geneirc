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
          <el-form-item label="会议记录编号" prop="serial">
            <el-input
              placeholder="请输入会议记录编号"
              v-model="queryParams.serial"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="会议类型" prop="type">
            <el-input
              value= "末次"
              disabled
            />
            <!-- <el-select v-model="queryParams.type" disabled>
              <el-option :value="1" label="首次"></el-option>
              <el-option :value="2" label="末次"></el-option>
            </el-select> -->
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
        <el-col :span="22">
          <el-form-item label="内审通知单" prop="scheduleSerial">
            <el-input
              placeholder="请选择内审通知单"
              v-model="queryParams.scheduleSerial"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1" style="padding-left: 25px">
          <el-button type="primary" @click="handleOption" :disabled="isdisable"
            >选择
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="会议名称" prop="name">
            <el-input
              placeholder="请输入会议名称"
              v-model="queryParams.name"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会议时间" prop="time">
            <el-date-picker
              v-model="queryParams.time"
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
          <el-form-item label="审核组长" prop="groupLeader">
            <el-input
              placeholder="请输入审核组长"
              v-model="queryParams.groupLeader"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="记录人" prop="recorder">
            <el-input
              placeholder="请输入记录人"
              v-model="queryParams.recorder"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="审核人员" prop="reviewer">
            <el-input
              placeholder="请输入审核人员"
              v-model="queryParams.reviewer"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="会议纪要" prop="content">
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
          <el-form-item label="附件上传" prop="standardNameCn">
            <el-upload
              ref="upload"
              :action="uploadUrl()"
              :on-success="uploadSuccess"
              :on-remove="uploadRemove"
              :limit="5"
              :file-list="fileList"
              :disabled="isdisable"
            >
              <div slot="file" slot-scope="{ file }">
                <span style="padding-right: 20px">{{
                  file.name ? file.name : file.fileName
                }}</span>
                <el-button type="text" size="small" @click="look_file(file)">
                  查看
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  style="color: #1cd0bd"
                  @click="down_file(file)"
                >
                  下载
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  style="color: #ff4949"
                  @click="uploadRemove(file)"
                  v-if="showType !== 'show'"
                >
                  删除
                </el-button>
              </div>
              <el-button
                type="primary"
                icon="el-icon-paperclip"
                :disabled="isdisable"
                >点击上传</el-button
              >
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="showType !== 'show'" @click="handleOk()"
        >保存
      </el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
    <!--内审通知单选择-->
    <el-dialog
      class="elDialog"
      center
      width="40%"
      :visible.sync="shownotice"
      append-to-body
      title="内审通知单选择"
    >
      <div class="cont">
        <p>请选择关联的内审通知</p>
      </div>
      <el-table
        ref="multipleTable"
        :data="meetList"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column
          prop="serial"
          label="内审通知编号"
          show-overflow-tooltip
        />
        <el-table-column
          prop="location"
          label="评审地点"
          show-overflow-tooltip
        />
      </el-table>
      <!-- 公共分页子组件 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="form.pageNum"
        :limit.sync="form.pageSize"
        @pagination="getList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="select">确定</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { meetadd, meetedit, noticelist } from "@/api/mass/config";

export default {
  name: "createlastMeet",
  data() {
    return {
      dialogShow: false,
      isFullScreen: true,
      screenName: "fullScreen",
      titles: "新增",
      showType: "add",
      queryParams: {
        planSerial: "",
        serial: "",
        type: 2,
        fileNumber: "",
        name: "",
        time: "",
        groupLeader: "",
        recorder: "",
        reviewer: "",
        content: "",
        id: "",
        standardNameCn: "",
        fileList: [],
        scheduleSerial: "",
        meetingScheduleList: [],
      },
      form: {
        pageNum: 1,
        pageSize: 10,
        planId: "",
      },
      rules: {},
      isdisable: false,
      fileList: [],
      meetList: [],
      shownotice: false,
      planSerials: [],
      total: 0,
      planSerialsName: "",
      planser: [],
      selction: [],
      serial: [],
      uploadFileList: [],
      scheduleSerial: [],
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
        this.titles = "新增";
      } else if (val == "update") {
        this.titles = "修改";
      } else if (val == "show") {
        this.titles = "查看";
        this.isdisable = true;
      }
    },
  },
  methods: {
    init(show, data) {
      console.log(data);
      this.showType = show;
      this.dialogShow = true;
      this.queryParams.planSerial = data.planSerial;
      this.queryParams.planId = data.planId;
      this.form.planId = data.planId;
      if (this.showType == "add") {
        this.queryParams.type = data.type;
        console.log(data.type);
      } else {
        this.queryParams.serial = data.serial;
        this.queryParams.id = data.id;

        this.queryParams.standardNameCn = data.standardNameCn;
        this.queryParams.content = data.content;
        this.queryParams.reviewer = data.reviewer;
        this.queryParams.recorder = data.recorder;
        this.queryParams.groupLeader = data.groupLeader;
        this.queryParams.time = data.time;
        this.queryParams.name = data.name;
        this.queryParams.fileNumber = data.fileNumber;
        // this.queryParams.scheduleSerial = data.scheduleSerial;
        this.uploadFileList = data.fileList;
        this.fileList = data.fileList;
        this.queryParams.fileList = data.fileList;
        // this.queryParams.scheduleId = data.scheduleId;
        // this.queryParams.meetingScheduleList = data.meetingScheduleList;
        this.queryParams.meetingScheduleList = [];
        for (var i in data.meetingScheduleList) {
          this.queryParams.meetingScheduleList.push({
            scheduleId: data.meetingScheduleList[i].id,
            scheduleSerial: data.meetingScheduleList[i].serial,
          });
        }

        this.queryParams.scheduleSerial = data.meetingScheduleList
          .map((item) => item.scheduleSerial)
          .join(",");

        // this.planSerialsName = "";
        // for (var i in data.meetingScheduleList) {
        //   this.planSerialsName +=
        //     data.meetingScheduleList[i].scheduleSerial +
        //     (i < data.meetingScheduleList.length - 1 ? "，" : "");
        // }
      }
      this.getList();
    },
    getList() {
      noticelist(this.form).then((response) => {
        this.meetList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    // 文件上传路径返回
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + "/common/upload";
    },
    // 文件上传成功
    uploadSuccess(res, file, fileList) {
      if (200 == res.code) {
        this.fileList = fileList;
        if (this.fileList.length > 0) {
          this.uploadFileList = this.fileList.map((item) => {
            console.log(item);
            return {
              fileName: item.name ? item.name : item.fileName,
              filePath: item.response ? item.response.fileName : item.filePath,
            };
          });
          console.log(this.uploadFileList);
        }
      } else {
        this.fileList = [];
        this.uploadFileList = [];
      }
    },
    // 文件删除
    uploadRemove(file) {
      let index = this.fileList.findIndex((fileItem) => {
        return (
          (fileItem.name ? fileItem.name : fileItem.fileName) ===
          (file.name ? file.name : file.fileName)
        );
      });
      this.fileList.splice(index, 1);
      if (this.fileList.length > 0) {
        this.uploadFileList = this.fileList.map((item) => {
          return {
            fileName: item.name,
            filePath: item.response.fileName,
          };
        });
        console.log(this.uploadFileList);
      } else {
        this.uploadFileList = [];
      }
    },
    // 查看文件
    look_file(data) {
      console.log(data);
      window.open(
        process.env.VUE_APP_BASE_API +
          "/" +
          (data.filePath ? data.filePath : data.response.url),
        "_blank"
      );
    },
    // 下载文件
    down_file(data) {
      this.mbu_downloadFile(data.filePath ? data.filePath : data.response.url)
    },
    // 内审通知
    handleOption() {
      this.shownotice = true;
    },
    close() {
      this.shownotice = false;
    },
    cancelbtn() {
      this.$emit("close");
    },
    // 将数据填充到表单中
    handleSelectionChange(val) {
      this.selction = val;
    },
    select() {
      var val = this.selction;
      this.queryParams.meetingScheduleList = [];
      for (var i in val) {
        this.queryParams.meetingScheduleList.push({
          scheduleId: val[i].id,
          scheduleSerial: val[i].serial,
        });
      }
      this.queryParams.scheduleSerial = val
        .map((item) => item.serial)
        .join(",");
      // this.incompatibleSerial = [];
      // this.planser = [];
      // for (var item in val) {
      //   this.incompatibleSerial.push(val[item].serial);
      //   this.planser.push({
      //     incompatibleId: val[item].id,
      //     incompatibleSerial: val[item].serial,
      //   });
      // }
      this.shownotice = false;
    },
    // select() {
    //   var val = this.selction;
    //   this.planSerialsName = "";
    //   this.planSerials = [];
    //   this.planser = [];

    //   for (var item in val) {
    //     this.planSerials.push(val[item].serial);
    //     this.planSerialsName +=
    //       val[item].serial + (item < val.length - 1 ? "，" : "");
    //     this.planser.push({
    //       scheduleId: val[item].id,
    //       scheduleSerial: val[item].serial,
    //     });
    //   }
    //   // /* 去重 */
    //   // this.queryParams.personList = this.array_uniq(
    //   //   this.queryParams.personList
    //   // );
    //   // for (var i in this.queryParams.personList) {
    //   //   this.personName +=
    //   //     this.queryParams.personList[i].userName +
    //   //     (i < data.length - 1 ? "，" : "");
    //   // }
    //   this.shownotice = false;
    // },
    // 执行添加和编辑的逻辑
    handleOk() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          // 添加内审通知单
          // this.queryParams.meetingScheduleList = this.meetList;
          this.queryParams.fileList = this.uploadFileList;
          if (this.queryParams.meetingScheduleList.length === 0) {
            this.$message.error("请至少添加一条内审通知，完善表格数据");
            return;
          }
          if (this.queryParams.id) {
            meetedit(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success("编辑成功");
                this.$emit("lastmeet");
              }
            });
          } else {
            meetadd(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success("添加成功");
                this.$emit("lastmeet");
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.cont {
  font-size: 14px;
  color: #333333;
  font-weight: bold;
}

/deep/ .el-dialog__body .el-table {
  background-color: #fff;
}
</style>
