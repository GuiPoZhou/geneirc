<template>
  <div>
    <div class="btnbox">
      <el-button :disabled="disabled" type="primary" @click="addImplement"
        >添加</el-button
      >
      <el-button type="success" @click="handlePrint" :disabled="!ids.length > 0"
        >打印</el-button
      >
      <el-button :disabled="disabled" type="primary" @click="next()"
        >完成</el-button
      >
    </div>
    <p class="tabtit">实施计划列表</p>
    <el-table
      ref="multipleTable"
      :data="implementData"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column
        prop="planSerial"
        label="管评计划编号"
        show-overflow-tooltip
      />
      <el-table-column
        prop="serial"
        label="实施计划编号"
        show-overflow-tooltip
      />
      <el-table-column
        prop="personNames"
        label="参与人员"
        show-overflow-tooltip
      />
      <el-table-column
        prop="compilerTime"
        label="会议时间安排"
        show-overflow-tooltip
      />
      <el-table-column prop="location" label="会议地点" show-overflow-tooltip />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="implementLook(scope.row.id)"
            >查看</el-button
          >
          <el-button
            v-if="!disabled"
            size="mini"
            type="text"
            @click="implementEdit(scope.row.id)"
            >修改
          </el-button>
          <el-button
            v-if="!disabled"
            size="mini"
            type="text"
            @click="implementDel(scope.row.id)"
            >删除
          </el-button>
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
    <!--添加/查看/修改管评会议记录 -->
    <implementForm
      v-if="showImplement"
      ref="implement"
      @complete="complete"
      @close="showImplement = false"
    ></implementForm>
  </div>
</template>

<script>
import implementForm from "../implement/implementForm.vue";
import {
  getImplementList,
  getImplementInfo,
  delImplement,
} from "@/api/qualityAssurance/managementReview/auditImplement";

export default {
  name: "implement",
  components: { implementForm },
  data() {
    return {
      implementData: [],
      showImplement: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planId: 0,
      },
      formData: {},
      total: 0,
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
    setData(data) {
      console.log(data);
      this.formData = {
        planId: data.id,
        planSerial: data.serial,
      };
    },
    complete() {
      this.showImplement = false;
      this.getList();
    },

    getList() {
      this.queryParams.planId = this.id;
      getImplementList(this.queryParams).then((res) => {
        this.implementData = res.data.list;
        this.total = res.data.total;
      });
    },
    addImplement() {
      this.showImplement = true;
      console.log(this.formData);
      this.$nextTick(() => {
        this.$refs.implement.init("add", this.formData);
      });
    },
    next() {
      this.$emit("nextStep", {
        planId: this.id,
        progress: 1,
      });
    },
    implementLook(id) {
      this.showImplement = true;
      getImplementInfo(id).then((res) => {
        this.$nextTick(() => {
          this.$refs.implement.init("show", res.data);
        });
      });
    },
    implementEdit(id) {
      this.showImplement = true;
      getImplementInfo(id).then((res) => {
        this.$nextTick(() => {
          this.$refs.implement.init("edit", res.data);
        });
      });
    },
    implementDel(id) {
      this.$confirm("确定删除该实施计划吗？", "提示").then((res) => {
        delImplement(id).then((res) => {
          this.$message.success("删除成功");
          this.getList();
        });
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
          "/qualityControl/pageOffice/printReviewTheImplementation?ids=" +
          ids,
        "width=1440px;height=860px"
      );
    },
  },
};
</script>

<style scoped>
</style>
