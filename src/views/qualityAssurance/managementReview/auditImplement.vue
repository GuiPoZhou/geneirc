<template>
  <div class="app-container">
    <!-- 统一样式 - 查询区域 -->
    <div class="a-c-top" v-show="showSearch">
      <!-- 表单 -->
      <el-form
        :inline="true"
        :model="queryParams"
        ref="queryParams"
        class="demo-form-inline"
        v-show="showSearch"
        label-width="50px"
      >
        <el-form-item label="年度" prop="year">
          <el-input
            v-model="queryParams.year"
            placeholder="请输入年度"
            clearable
            class="input-with-select"
            style="width: 240px"
          />
        </el-form-item>
        <!--				<el-form-item label="状态" prop="status">
					<el-select v-model="queryParams.status" placeholder="请选择">
						<el-option label="待提交" :value="1"></el-option>
						<el-option label="审批中" :value="2"></el-option>
						<el-option label="已批准" :value="3"></el-option>
						<el-option label="已退回" :value="4"></el-option>
					</el-select>
				</el-form-item>-->

        <!-- 统一样式 - 查询区域 按钮 -->
        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button
              type="cyan"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >查询
            </el-button>
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery('filesForm')"
              >重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 主列表区域 -->
    <div class="a-c-bottom" :class="fullscreen == true ? 'showFullScreen' : ''">
      <el-row :gutter="10" class="mb8">
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="resetQuery"
          @fullScreen="e_fullScreen"
          @changeBox="e_changeBox"
          :boxData="colData"
        ></right-toolbar>
      </el-row>
      <!-- 列表区域 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        border
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column
          prop="serial"
          label="计划编号"
          sortable="custom"
          show-overflow-tooltip
          v-if="colData[0].istrue"
        />
        <el-table-column
          prop="year"
          label="年度"
          sortable="custom"
          show-overflow-tooltip
          v-if="colData[1].istrue"
        />
        <el-table-column
          prop="planPersonNames"
          label="参加评审部门及人员"
          show-overflow-tooltip
          v-if="colData[2].istrue"
        />
        <el-table-column
          prop="reviewTime"
          label="评审时间安排"
          sortable="custom"
          show-overflow-tooltip
          v-if="colData[3].istrue"
        />
        <el-table-column
          prop="location"
          label="评审地点"
          sortable="custom"
          show-overflow-tooltip
          v-if="colData[4].istrue"
        />
        <el-table-column
          prop="status"
          label="状态"
          sortable="custom"
          show-overflow-tooltip
          v-if="colData[5].istrue"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1" style="color: #1cd0bd"
              >待提交</span
            >
            <span v-if="scope.row.status === 2" style="color: #f5bb4a"
              >审批中</span
            >
            <span v-if="scope.row.status === 3" style="color: #0d8ddb"
              >已批准</span
            >
            <span v-if="scope.row.status === 4" style="color: #ff2222"
              >已退回</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="e_look(scope.row)"
              >查看</el-button
            >
            <el-button size="mini" type="text" @click="e_edit(scope.row)"
              >实施</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!--实施/查看-->
    <createImplement
      v-if="showimple"
      ref="imple"
      @close="showimple = false"
    ></createImplement>
  </div>
</template>

<script>
import createImplement from "./dialog/createImplement";
import { getList } from "@/api/qualityAssurance/managementReview/auditImplement.js";
import { changeStatus } from "@/api/qualityAssurance/managementReview/auditImplement";

export default {
  name: "auditImplement",
  components: { createImplement },
  data() {
    return {
      showSearch: true,
      fullscreen: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: "",
        serial: "",
        year: "",
      },
      total: 0,
      colData: [
        { title: "内审计划编号", istrue: true },
        { title: "年度", istrue: true },
        { title: "内审目的", istrue: true },
        { title: "内审范围", istrue: true },
        { title: "审核办法", istrue: true },
        { title: "当前进度", istrue: true },
      ],
      tableData: [],
      showimple: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams.datdateStart = undefined;
      this.queryParams.dateEnd = undefined;
      this.resetForm("queryParams");
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.dateValue === null) {
        this.queryParams.datdateStart = undefined;
        this.queryParams.dateEnd = undefined;
      }
      this.queryParams.pageNum = 1;
      this.getList();
    },
    e_fullScreen() {
      this.fullscreen = !this.fullscreen;
    },
    e_changeBox(list) {
      let arrList = this.colData.filter((i) => !list.includes(i.title));
      let titleList = arrList.map((item) => {
        return item.title;
      });
      this.colData.filter((i) => {
        if (titleList.indexOf(i.title) != -1) {
          i.istrue = false;
        } else {
          i.istrue = true;
        }
      });
    },
    getList() {
      console.log(this.queryParams);
      getList(this.queryParams).then((res) => {
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    // 排序
    sortChange(column, prop, order) {
      this.queryParams.orderByColumn = this.toLine(column.prop);
      if (column.order === "descending") {
        this.queryParams.orderByType = "DESC";
      } else if (column.order === "ascending") {
        this.queryParams.orderByType = "ASC";
      } else {
        this.queryParams.orderByType = "";
      }
      this.getList();
    },
    toLine(name) {
      return name.replace(/([A-Z])/g, "_$1").toLowerCase();
    },
    // 实施
    e_edit(data) {
      this.showimple = true;
      this.$nextTick(() => {
        this.$refs.imple.init("add", data.id);
      });
    },
    // 查看
    e_look(data) {
      this.showimple = true;
      this.$nextTick(() => {
        this.$refs.imple.init("show", data.id);
      });
    },
  },
};
</script>

<style scoped>
</style>
