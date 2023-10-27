<template>
  <div style="padding: 20px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane :label="titleMsg" name="first">
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
              <el-form-item
                label="处理日期"
                prop="submitTimeStr"
                style="width: 90%"
              >
                <el-date-picker
                  v-model="queryParams.submitTimeStr"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  :disabled="isdisable"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请人员" prop="person" style="width: 90%">
                <el-input
                  placeholder="请输入申请人员"
                  v-model="queryParams.submitPersonName"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="处理过程记录"
                prop="processDesc"
                style="width: 90%"
              >
                <el-input
                  placeholder="请输入内容"
                  v-model="queryParams.processDesc"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="处理完成情况"
                prop="resultDesc"
                style="width: 90%"
              >
                <el-input
                  placeholder="请输入内容"
                  v-model="queryParams.resultDesc"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注" prop="remarks" style="width: 90%">
                <el-input
                  placeholder="请输入备注"
                  v-model="queryParams.remarks"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!--样品申请处理-->
        <el-form
          :model="queryParams1"
          ref="queryForm"
          :inline="true"
          :prop="queryParams1"
          style="margin: 15px 0 0 50px"
          :rules="rules1"
          label-position="top"
          label-width="80px"
          v-if="samplehandle"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="申请日期"
                prop="submitTimestr"
                style="width: 90%"
              >
                <el-date-picker
                  v-model="queryParams1.submitTimestr"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  :disabled="isdisable"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="申请人员"
                prop="submitPersonName"
                style="width: 90%"
              >
                <el-input
                  placeholder="请输入申请人员"
                  v-model="queryParams1.submitPersonName"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="检测完成情况"
                prop="checkDesc"
                style="width: 90%"
              >
                <el-input
                  placeholder="请输入内容"
                  v-model="queryParams1.checkDesc"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="处理放法"
                prop="handleDesc"
                style="width: 90%"
              >
                <el-input
                  placeholder="请输入内容"
                  v-model="queryParams1.handleDesc"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注" prop="remarks" style="width: 90%">
                <el-input
                  placeholder="请输入备注"
                  v-model="queryParams1.remarks"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div
            style="
              color: #606266;
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 10px;
            "
          >
            申请处理样品列表
          </div>
          <div>
            <el-table
              v-loading="loading"
              :data="listData"
              row-key="id"
              ref="selectTable"
            >
              <el-table-column
                label="序号"
                align="center"
                type="index"
                width="50"
              />
              <el-table-column
                prop="sampleCode"
                label="样品编号"
                show-overflow-tooltip
              />
              <el-table-column
                prop="sampleName"
                label="样品名称"
                show-overflow-tooltip
              />
              <el-table-column
                prop="entrustCompany"
                label="送检单位"
                show-overflow-tooltip
              />
              <el-table-column
                prop="backCount"
                label="待处理样品数量"
                show-overflow-tooltip
                align="center"
              />
              <el-table-column
                prop="invalidTimeStr"
                label="留存时间"
                show-overflow-tooltip
              />
            </el-table>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!--    <div slot="footer" class="dialog-footer" v-if="showType !='look'">-->
    <!--      <div style="margin-top: 15px;display: flex; justify-content: center">-->
    <!--        <el-button type="primary" @click="handleSubmit">通过</el-button>-->
    <!--        <el-button type="danger" @click="handleReturn">退回</el-button>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "createEntrust",
  // components: {detectType, detectionInformation, chains},
  data() {
    return {
      dialogShow: false,
      activeName: "first",
      visible: false,
      queryParams: {},
      queryParams1: {
        submitTimestr: "",
        submitPersonName: "4444",
        checkDesc: "",
        handleDesc: "",
        remarks: "",
      },
      submitPersonName: "",
      rules: {
        submitTimeStr: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        person: [{ required: true, message: "请输入申请人", trigger: "blur" }],
        processDesc: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        resultDesc: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
      },
      rules1: {
        submitTimestr: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        submitPersonName: [
          { required: true, message: "请输入申请人", trigger: "blur" },
        ],
        checkDesc: [
          { required: true, message: "请输入检测完成情况", trigger: "blur" },
        ],
        handleDesc: [
          { required: true, message: "请输入处理放法", trigger: "blur" },
        ],
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
  props: {
    msg: String,
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
  },
  mounted() {
    let width = this.$store.state.app.leftWidth;
    if (width < 200) {
      this.screenName = "bigFullScreen";
    } else {
      this.screenName = "fullScreen";
    }
    console.log(this.queryParams1);
  },
  methods: {
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    init(params) {
      if (params) {
        console.log(this.msg);
        // 样品处理
        if (this.msg === "SAMPLE_HANDLE_APPLY") {
          console.log(params);
          this.titleMsg = "样品处理申请";
          this.samplehandle = true;
          this.queryParams1 = {
            ...params,
          };
          this.listData = params.details;
        } else {
          this.titleMsg = "处理申请";
          this.queryParams = {
            ...params,
          };
          this.samplehandle = true;
          this.queryParams1 = {
            ...params,
          };
          this.listData = params.details;
        }
        //  console.log(2)
        //  this.titleMsg = '样品处理申请'
        // console.log(params)
      }
      this.dialogShow = true;
    },
    cancelbtn() {
      this.$emit("close");
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 退回
    handleReturn() {
      // let that = this;
      // this.$prompt('请输入退回原因', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   // inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
      //   // inputErrorMessage: '退回原因不能为空!'
      // }).then(({ value }) => {
      //   let params = {
      //     returnReason: value
      //   }
      //   returnAccept(this.queryParams.id,params).then(() => {
      //     that.$parent.getList();
      //     that.$message.success("退回成功");
      //     that.cancelbtn()
      //   });
      // })
    },
    // 受理
    handleSubmit() {
      // this.subenrtust(100)
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