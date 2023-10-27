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
          label-width="100px"
      >
        <el-form-item label="计划日期">
          <el-date-picker
              v-model="dateRange"
              style="width: 260px"
			  size="small"
              value-format="yyyy-MM-dd"
              @change="ondateChange"
              type="daterange"
              range-separator="-"
              start-placeholder="选择开始日期"
              end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="计划年度" prop="planYear">
          <el-input
              v-model="queryParams.planYear"
              placeholder="请输入计划年度"
              clearable
              class="input-with-select"
			  style="width: 240px"
			  size="small"
			  @clear="handleQuery"
          />
        </el-form-item>
        <el-form-item label="计划单号" prop="planNo">
          <el-input
              v-model="queryParams.planNo"
              placeholder="请输入计划单号"
              clearable
              class="input-with-select"
			  style="width: 240px"
			  size="small"
			  @clear="handleQuery"
          />
        </el-form-item>
        <el-form-item label="计划状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable   style="width: 240px"
					 size="small">
            <el-option label="待提交" :value="1"></el-option>
            <el-option label="审批中" :value="2"></el-option>
            <el-option label="已批准" :value="3"></el-option>
            <el-option label="已退回" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成状态" prop="completionStatus">
					<el-select v-model="queryParams.completionStatus" placeholder="请选择"   clearable style="width: 240px"
							   size="small">
						<el-option label="未执行" :value="0"></el-option>
						<el-option label="进行中" :value="1"></el-option>
						<el-option label="已完成" :value="2"></el-option>
					</el-select>
				</el-form-item>
        <!-- 统一样式 - 查询区域 按钮 -->
        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
            >搜索
            </el-button
            >
            <el-button
                icon="el-icon-refresh"
                size="mini"
                @click="resetQuery('filesForm')"
            >重置
            </el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div
        class="a-c-bottom"
        :class="fullscreen == true ? 'showFullScreen' : ''"
    >
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" @click="handleAdd" size="mini">添加</el-button>
          <el-button type="primary" :disabled="ids.length != 1" size="mini"  @click="handlePrint">打印</el-button>
          <el-button type="primary" :disabled="!ids.length > 0" size="mini"  @click="handleSubmit">提交</el-button>
        </el-col>
        <el-col :span="1.5"></el-col>
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
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column
            label="序号"
            align="center"
            type="index"
            width="50"
        />
        <el-table-column prop="planDate" label="计划日期" align="center" sortable="custom" show-overflow-tooltip v-if="colData[0].istrue"/>
        <el-table-column prop="planNo" label="计划单号" align="center" sortable="custom" show-overflow-tooltip v-if="colData[1].istrue"/>
        <el-table-column prop="planYear" label="计划年度" align="center" sortable="custom" show-overflow-tooltip v-if="colData[2].istrue"/>
        <el-table-column prop="applyPerson" label="编制人员" align="center" sortable="custom" show-overflow-tooltip v-if="colData[3].istrue"/>
        <el-table-column prop="approvalUser" label="批准人" align="center" sortable="custom" show-overflow-tooltip v-if="colData[4].istrue"/>
        <el-table-column prop="approvalDate" label="批准日期" align="center" sortable="custom" show-overflow-tooltip v-if="colData[5].istrue"/>
        <el-table-column prop="describe" label="计划描述" align="center" show-overflow-tooltip v-if="colData[6].istrue"/>
        <el-table-column prop="status" label="计划状态" align="center" sortable="custom" show-overflow-tooltip v-if="colData[7].istrue">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">待提交</span>
            <span v-if="scope.row.status === 2">审批中</span>
            <span v-if="scope.row.status === 3">已批准</span>
            <span v-if="scope.row.status === 4">已退回</span>
          </template>
        </el-table-column>
        <el-table-column label="待执行计划" prop="UnexecutedPlan"></el-table-column>
				<el-table-column label="已执行计划" prop="ExecutedPlan"></el-table-column>
				<el-table-column prop="completionStatus" label="完成状态" show-overflow-tooltip align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.completionStatus == 0">未执行</span>
						<span v-if="scope.row.completionStatus == 1">进行中</span>
						<span v-if="scope.row.completionStatus == 2">已完成</span>
					</template>
					
				</el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="e_look(scope.row.id)" style="color: #409EFF">查看</el-button>
            <el-button size="mini" type="text" v-if="scope.row.status === 1 || scope.row.status === 4" @click="e_edit(scope.row.id)" style="color: #409EFF">修改</el-button>
            <el-button size="mini" type="text" v-if="scope.row.status === 1 || scope.row.status === 4" @click="e_del(scope.row.id)" style="color: #409EFF">删除</el-button>
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
    <!--添加/修改-->
    <createPlan v-if="showplan" ref="plan" @close="showplan = false"></createPlan>
  </div>
</template>

<script>
  import createPlan from './dialog/createPlan'
  import {
    getCheckPlanList,
    getEquipmentCheckPlanDetail,
    deleteCheckPlan,
    submitCheckPlan
  } from '@/api/resources/deviceManagement/index.js'
  export default {
    name: "index",
    components: {createPlan},
    data () {
      return {
        showSearch: true,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          planDateStart: '',
          planDateEnd: '',
          planNo: '',
          planYear: '',
          status: null,
          orderByColumn: '',
          orderByType: '',
        },
        total: 0,
        dateRange: [],
        dateValue: [],
        tableData: [],
        fullscreen: false,
        colData: [
          { title: "计划日期", istrue: true },
          { title: "计划单号", istrue: true },
          { title: "计划年度", istrue: true },
          { title: "编制人员", istrue: true },
          { title: "批准人", istrue: true },
          { title: "批准日期", istrue: true },
          { title: "计划描述", istrue: true },
          { title: "计划状态", istrue: true },
        ],
        ids: [],
        showplan: false
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      e_fullScreen() {
        this.fullscreen = !this.fullscreen;
      },
      e_changeBox(list) {
        let arrList = this.colData.filter(i => !list.includes(i.title));
        let titleList = arrList.map(item => {
          return item.title;
        });
        this.colData.filter(i => {
          if (titleList.indexOf(i.title) != -1) {
            i.istrue = false;
          } else {
            i.istrue = true;
          }
        });
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.queryParams.planDateStart = undefined;
        this.queryParams.planDateEnd = undefined;
        this.resetForm("queryParams");
        this.handleQuery();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      ondateChange(v) {
        if (this.dateRange) {
			this.queryParams.planDateStart = v[0];
			this.queryParams.planDateEnd = v[1];
        } else {
			this.queryParams.planDateStart = ''
			this.queryParams.planDateEnd = ''
        }
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
      },
      getList () {
        getCheckPlanList(this.queryParams).then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      // 排序
      sortChange (column, prop, order) {
        this.queryParams.orderByColumn = this.toLine(column.prop)
        if (column.order === 'descending') {
          this.queryParams.orderByType = 'DESC'
        } else if (column.order === 'ascending') {
          this.queryParams.orderByType = 'ASC'
        } else {
          this.queryParams.orderByType = ''
        }
        this.getList()
      },
      toLine(name) {
        return name.replace(/([A-Z])/g, "_$1").toLowerCase();
      },
      // 添加
      handleAdd () {
        this.showplan = true
        this.$nextTick(() => {
          this.$refs.plan.init('add')
        })
      },
      // 修改
      e_edit (id) {
        this.getDetails(id, 'update')
      },
      // 查看
      e_look (id) {
        this.getDetails(id, 'show')
      },
      // 获取详情
      getDetails (id, type) {
        this.showplan = true
        getEquipmentCheckPlanDetail(id).then(res => {
          this.$nextTick(() => {
            this.$refs.plan.init(type, res.data)
          })
        })
      },
      // 删除
      e_del (id) {
        this.$confirm('确定删除该条数据吗?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteCheckPlan(id).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        });
      },
      // 批量提交
      handleSubmit () {
        console.log(this.ids)
        const idList = JSON.parse(JSON.stringify(this.ids));
        this.$confirm("确定提交吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          submitCheckPlan({idList: idList}).then(res => {
            if (res.code == 200) {
              this.$message.success("提交成功");
              this.getList();
            } else {
              this.$message.info(res.msg);
            }
          });
        });
      },
		handlePrint(){
			POBrowser.openWindowModeless(
				window.globalEnv.VUE_APP_BASE_API +
				"/equipment/pageOffice/printCheckPlan?id=" + this.ids[0],
				"width=1440px;height=860px"
			);
		}
    }
  }
</script>

<style scoped>

</style>
