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
        <el-form-item label="年度" prop="planYear">
          <el-input
              v-model="queryParams.planYear"
              placeholder="请输入内容"
			  clearable
			  @clear="handleQuery"
              class="input-with-select"
              style="width: 240px"
			  size="small"
          />
        </el-form-item>
        <el-form-item label="计划描述" prop="planDesc">
          <el-input
              v-model="queryParams.planDesc"
              placeholder="请输入内容"
			  clearable
			  @clear="handleQuery"
              class="input-with-select"
			  style="width: 240px"
			  size="small"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" style="width: 240px"
					 size="small" clearable >
            <el-option label="待提交" :value="1"></el-option>
            <el-option label="审批中" :value="2"></el-option>
            <el-option label="已批准" :value="3"></el-option>
            <el-option label="已退回" :value="4"></el-option>
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
                @click="resetQuery"
            >重置
            </el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 主列表区域 -->
    <div class="a-c-bottom" :class="fullscreen == true ? 'showFullScreen' : ''">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button size="mini" type="primary" @click="handleAdd">添加</el-button>
          <el-button size="mini" type="primary">打印</el-button>
          <el-button size="mini" type="warning" @click="handleExport">导出</el-button>
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
        <el-table-column type="selection" width="55" fixed/>
        <el-table-column label="序号" align="center" type="index" width="50"/>
        <el-table-column prop="planNo" label="计划编号" align="center" sortable show-overflow-tooltip v-if="colData[0].istrue"/>
        <el-table-column prop="planYear" label="年度" align="center" sortable show-overflow-tooltip v-if="colData[1].istrue"/>
        <el-table-column prop="planDesc" label="计划描述" align="center" width="500" sortable show-overflow-tooltip v-if="colData[2].istrue"/>
        <el-table-column prop="status" label="状态" align="center" sortable show-overflow-tooltip v-if="colData[3].istrue">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1" >待提交</span>
            <span v-if="scope.row.status === 2" >审批中</span>
            <span v-if="scope.row.status === 3" >已批准</span>
            <span v-if="scope.row.status === 4" >已退回</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="e_look(scope.row.id)" style="color: #409EFF">查看</el-button>
            <el-button size="mini" type="text" v-if="scope.row.status === 1" @click="e_edit(scope.row.id)" style="color: #409EFF">修改</el-button>
            <el-button size="mini" type="text"  style="color: #409EFF" v-if="scope.row.status === 1" @click="e_del(scope.row.id)">删除</el-button>
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
    <!--新增修改-->
    <createPlan v-if="showPlan" ref="plan" @close="showPlan = false"></createPlan>
  </div>
</template>

<script>
  import createPlan from './dialog/createPlan'
  import {
    getTrainPlanList,
    getTranplanDetail,
    deleteTrainplan,
    exportTrainplan
  } from '@/api/personnelManagement/index'
  export default {
    name: "index",
    components: {createPlan},
    data () {
      return {
        showSearch: true,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          planYear: '',
          planDesc: '',
          status: null,
          idStr: '',
          orderByType: ''
        },
        fullscreen: false,
        showPlan: false,
        colData: [
          { title: "计划编号", istrue: true },
          { title: "年度", istrue: true },
          { title: "计划描述", istrue: true },
          { title: "状态", istrue: true }
        ],
        ids: [],
        tableData: [],
        total: 0
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.queryParams.dateStart = undefined;
        this.queryParams.dateEnd = undefined;
        this.resetForm("queryParams");
        this.handleQuery();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        if (this.dateValue === null) {
          this.queryParams.dateStart = undefined;
          this.queryParams.dateEnd = undefined;
        }
        this.queryParams.pageNum = 1;
        this.getList();
      },
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
      },
      // 列表
      getList () {
        getTrainPlanList(this.queryParams).then(res => {
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
      // 新增
      handleAdd () {
        this.showPlan = true
        this.$nextTick(() => {
          this.$refs.plan.init('add')
        })
      },
      // 查看
      e_look (id) {
        this.showPlan = true
        this.getdetail(id,'show')
      },
      // 修改
      e_edit (id) {
        this.showPlan = true
        this.getdetail(id, 'update')
      },
      // 删除
      e_del (id) {
        this.$confirm("确定删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteTrainplan(id).then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getList();
            } else {
              this.$message.info(res.msg);
            }
          });
        });
      },
      // 获取详情
      getdetail (id, type) {
        getTranplanDetail(id).then(res => {
          this.$nextTick(() => {
            this.$refs.plan.init(type, res.data)
          })
        })
      },
      //导出
      handleExport() {
        this.queryParams.idStr = this.ids.join(',')
        exportTrainplan(this.queryParams).then(res => {
          if (res.code === 200) {
              this.downLoadFile(res.msg)
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
