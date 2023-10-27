<template>
  <div>
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
        <el-form-item label="维护日期">
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
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input
              v-model="queryParams.equipmentName"
              placeholder="请输入设备名称"
              clearable
              class="input-with-select"
			  style="width: 240px"
			  size="small"
			  @clear="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备编号" prop="equipmentNumber">
          <el-input
              v-model="queryParams.equipmentNumber"
              placeholder="请输入设备编号"
              clearable
              class="input-with-select"
			  style="width: 240px"
			  size="small"
			  @clear="handleQuery"
          />
        </el-form-item>
        <el-form-item label="审批状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 240px"
					 size="small">
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
          <el-button type="primary" :disabled="!ids.length > 0"  size="mini"  @click="handlePrint()">打印</el-button>
          <el-button type="primary" :disabled="!ids.length > 0" size="mini"  @click="handleSubmit()">提交</el-button>
          <el-button type="danger" :disabled="!ids.length > 0" size="mini"  @click="handleDel">删除</el-button>
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
        <el-table-column prop="equipmentNumber" label="设备编号" sortable="custom" show-overflow-tooltip align="center"
                         v-if="colData[0].istrue"/>
        <el-table-column prop="equipmentName" label="设备名称" sortable="custom" show-overflow-tooltip align="center"
                         v-if="colData[1].istrue"/>
        <el-table-column prop="equipmentModel" label="规格型号" sortable="custom" show-overflow-tooltip align="center"
                         v-if="colData[2].istrue"/>
        <el-table-column prop="planDate" label="计划实施日期" sortable="custom" show-overflow-tooltip align="center"
                         v-if="colData[3].istrue"/>
        <el-table-column prop="maintainDate" label="维护日期" sortable="custom" show-overflow-tooltip align="center"
                         v-if="colData[4].istrue"/>
        <el-table-column prop="deptName" label="维护班组" sortable="custom" show-overflow-tooltip v-if="colData[5].istrue" align="center"/>
        <el-table-column prop="maintainPerson" label="维护人员" sortable="custom" show-overflow-tooltip align="center"
                         v-if="colData[6].istrue"/>
        <el-table-column prop="status" label="审批状态" sortable="custom" show-overflow-tooltip v-if="colData[7].istrue" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">待提交</span>
            <span v-if="scope.row.status === 2">审批中</span>
            <span v-if="scope.row.status === 3">已批准</span>
            <span v-if="scope.row.status === 4">已退回</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="e_look(scope.row)" style="color: #409EFF">查看</el-button>
            <el-button size="mini" type="text" @click="e_del(scope.row.id)"
                       v-if="scope.row.status === 1 || scope.row.status === 4"  style="color: #409EFF">删除
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
      />
    </div>
  </div>
</template>

<script>
  import {getrecordList, deleteMaintainRecord, submitRecord} from '@/api/resources/deviceManagement/index.js'

  export default {
    name: "index",
    // components: {createPlan},
    data() {
      return {
        showSearch: true,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          equipmentName: '',
          equipmentNumber: '',
          status: null,
          recordDateStart: '',
          recordDateEnd: '',
          orderByColumn: '',
          orderByType: '',
        },
        total: 0,
        dateRange: [],
        dateValue: [],
        tableData: [],
        fullscreen: false,
        colData: [
          {title: "设备编号", istrue: true},
          {title: "设备名称", istrue: true},
          {title: "规格型号", istrue: true},
          {title: "计划实施日期", istrue: true},
          {title: "维护日期", istrue: true},
          {title: "维护部门", istrue: true},
          {title: "维护人员", istrue: true},
          {title: "审批状态", istrue: true},
        ],
        ids: [],
        showplan: false,
      }
    },
    mounted() {
      this.getList();
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
        this.queryParams.recordDateStart = undefined;
        this.queryParams.recordDateEnd = undefined;
        this.resetForm("queryParams");
        this.handleQuery();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      ondateChange(v) {
          this.dateRange = v
        if (this.dateRange) {
			this.queryParams.recordDateStart = v[0];
			this.queryParams.recordDateEnd = v[1];
        } else {
          this.queryParams.recordDateStart = ''
          this.queryParams.recordDateEnd = ''
        }
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
      },
      getList() {
        getrecordList(this.queryParams).then(res => {
          for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].planDate = res.data.list[i].planDate.split('-')[0] + '-' + res.data.list[i].planDate.split('-')[1]
        }
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      // 排序
      sortChange(column, prop, order) {
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
      e_look(row) {
        this.$emit('lookDetail', row)
      },
      // 删除
      e_del(id) {
        this.ids.push(id)
        this.handleDel()
      },
      handleDel() {
        this.$confirm("确定删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteMaintainRecord({idList: this.ids}).then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getList();
            } else {
              this.$message.info(res.msg);
            }
          });
        });
      },
      // 提交
      handleSubmit () {
        const idList = JSON.parse(JSON.stringify(this.ids));
        this.$confirm("确定提交吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          submitRecord({idList: idList}).then(res => {
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
				"/equipment/pageOffice/printMaintainRecord?ids=" + this.ids.join(","),
				"width=1440px;height=860px"
			);
		}
    }
  }
</script>

<style scoped>

</style>
