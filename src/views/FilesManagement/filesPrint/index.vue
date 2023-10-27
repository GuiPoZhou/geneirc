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
        <el-form-item label="文件编号" prop="fileNumber">
          <el-input
              v-model="queryParams.fileNumber"
              placeholder="请输入文件编号"
			  clearable
			  @clear="handleQuery"
              class="input-with-select"
			  style="width: 240px"
			  size="small"
          />
        </el-form-item>
        <el-form-item label="文件名称" prop="fileName">
          <el-input
              v-model="queryParams.fileName"
              placeholder="请输入文件名称"
			  clearable
			  @clear="handleQuery"
              class="input-with-select"
			  style="width: 240px"
			  size="small"
          />
        </el-form-item>
        <el-form-item label="借阅日期">
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
        <el-form-item label="归还状态" prop="returnStatus">
          <el-select v-model="queryParams.returnStatus" placeholder="请选择"  clearable style="width: 240px"
					 size="small">
            <el-option label="未归还" :value="0"></el-option>
            <el-option label="归还" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择"  clearable style="width: 240px"
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
    <!-- 主列表区域 -->
    <div
        class="a-c-bottom"
        :class="fullscreen == true ? 'showFullScreen' : ''"
    >
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
              type="primary"
			  size="mini"
              :disabled="!this.multipleSelection.length > 0"
              @click="handlePrint"
          >打印
          </el-button
          >
          <el-button
              type="warning"
			  size="mini"
              @click="handleExport"
          >导出
          </el-button>
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
        <el-table-column
            label="序号"
            align="center"
            type="index"
            width="50"
            fixed
        />
        <el-table-column label="申请类型" prop="businessType" sortable="custom" show-overflow-tooltip fixed v-if="colData[0].istrue">
          <template slot-scope="scope">
            <span v-if="scope.row.businessType === 1">借阅</span>
            <span v-if="scope.row.businessType === 2">打印</span>
          </template>
        </el-table-column>
        <el-table-column prop="departmentName" label="借阅部门/申请部门" sortable="custom" show-overflow-tooltip width="160" align="center"
                         v-if="colData[1].istrue"/>
        <el-table-column prop="applyUser" label="借阅人" sortable="custom" show-overflow-tooltip align="center"
                         v-if="colData[2].istrue"/>
        <el-table-column prop="fileNumber" label="文件编号" sortable="custom" show-overflow-tooltip align="center"
                         v-if="colData[3].istrue"/>
        <el-table-column prop="fileName" label="文件名称" sortable="custom" show-overflow-tooltip align="center"
                         v-if="colData[4].istrue"/>
        <el-table-column prop="amount" label="数量" sortable="custom" show-overflow-tooltip v-if="colData[5].istrue" align="center"/>
        <el-table-column prop="printCount" label="查看/打印次数" sortable="custom" show-overflow-tooltip align="center"
                         v-if="colData[6].istrue"/>
        <el-table-column prop="applyDate" label="借阅日期/申请日期" sortable="custom" show-overflow-tooltip width="160" align="center"
                         v-if="colData[7].istrue"/>
        <el-table-column prop="approvalDate" label="批准日期" sortable="custom" show-overflow-tooltip width="100" align="center"
                         v-if="colData[8].istrue"/>
        <el-table-column prop="returnDate" label="归还日期" sortable="custom" show-overflow-tooltip width="100" align="center"
                         v-if="colData[9].istrue"/>
        <el-table-column label="审批状态" prop="status" sortable="custom" show-overflow-tooltip width="100" v-if="colData[10].istrue" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">待提交</span>
            <span v-if="scope.row.status === 2">审批中</span>
            <span v-if="scope.row.status === 3">已批准</span>
            <span v-if="scope.row.status === 4">已退回</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" sortable="custom" show-overflow-tooltip width="100" v-if="colData[11].istrue" align="center"/>
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template slot-scope="scope">
            <template  v-if="scope.row.status !== 4">
<!--              <el-button size="mini" type="text" v-if="scope.row.businessType === 2">打印</el-button>-->
              <el-button size="mini" type="text" @click="e_look(scope.row)">查看</el-button>
              <el-button size="mini" type="text" v-if="scope.row.status === 3 && scope.row.returnStatus === 0" @click="e_return(scope.row)">归还</el-button>
              <el-button size="mini" type="text" @click="e_del(scope.row)">删除</el-button>
            </template>
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
    <!--借阅-->
    <borrow v-if="showborrow" ref="borrows" @close="showborrow = false"></borrow>
    <!--打印-->
    <print v-if="showprint" ref="print" @close="showprint = false"></print>
  </div>
</template>

<script>
  import {
    getBorrowPrintList,
    getBorrowPrintdetail,
    getRevertBorrow,
    delBorrowPrint,
    exportBorrowPrint
  } from '@/api/filesManagement/filesManagement'
  import borrow from "../ctrManage/dialog/borrow";
  import print from "../ctrManage/dialog/print";

  export default {
    name: 'filesPrint',
    components: {borrow, print},
    data() {
      return {
        showSearch: true,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          dateStart: '',
          dateEnd: '',
          fileName: '',
          fileNumber: '',
          status: null,
          returnStatus: null,
          orderByColumn: '',
          orderByType: ''
        },
        dateRange: [],
        dateValue: [],
        options: [],
        fullscreen: false,
        showborrow: false,
        showprint: false,
        multiple: true,
        total: 0,
        colData: [
          {title: "申请类型", istrue: true},
          {title: "借阅部门/申请部门", istrue: true},
          {title: "借阅人", istrue: true},
          {title: "文件编号", istrue: true},
          {title: "文件名称", istrue: true},
          {title: "数量", istrue: true},
          {title: "打印次数", istrue: true},
          {title: "借阅日期/申请日期", istrue: true},
          {title: "批准日期", istrue: true},
          {title: "归还日期", istrue: true},
          {title: "审批状态", istrue: true},
          {title: "备注", istrue: true},
        ],
        tableData: [],
        multipleSelection: [],
        ids: [],
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
      ondateChange(v) {
        if (this.dateRange) {
			this.queryParams.dateStart = v[0];
			this.queryParams.dateEnd = v[1];
        } else {
			this.queryParams.dateStart = ''
			this.queryParams.dateEnd = ''
        }
      },
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.multipleSelection = selection
        this.ids = selection.map(item => item.id);
      },
      getList() {
        getBorrowPrintList(this.queryParams).then(res => {
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
        return name.replace(/([A-Z])/g,"_$1").toLowerCase();
      },
      // 查看
      e_look(row) {
        getBorrowPrintdetail(row.id).then(res => {
          if (row.businessType === 1) {
            this.showborrow = true
            this.$nextTick(() => {
              this.$refs.borrows.init('show', res.data)
            })
          } else if (row.businessType === 2) {
            this.showprint = true
            this.$nextTick(() => {
              this.$refs.print.init('show', res.data)
            })
          }
        })
      },
      // 归还
      e_return (row) {
        this.$confirm("确定归还此文件吗?", "归还提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          getRevertBorrow(row.id).then(res => {
            if (res.code == 200) {
              this.$message.success("归还成功");
              this.getList();
            } else {
              this.$message.info(res.msg);
            }
          });
        });
      },
      // 删除
      e_del (row) {
        this.$confirm("确定删除此文件吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delBorrowPrint(row.id).then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getList();
            } else {
              this.$message.info(res.msg);
            }
          });
        });
      },
      //导出
      handleExport() {
        this.queryParams.idStr = this.ids.join(',')
        exportBorrowPrint(this.queryParams).then(res => {
          if (res.code === 200) {
            this.downLoadFile(res.msg)
          }
        })
      },
      //pageOffice 打印
      handlePrint() {
        let check = this.multipleSelection.find(item => item.businessType == 2);
        if (check) {
          this.$message.info("请选择文件借阅数据");
          return false;
        }
        let array = this.multipleSelection.map(item => item.id);
        if (!array || array.length == 0) {
          return false;
        }
        console.log(array)
        POBrowser.openWindowModeless(
          window.globalEnv.VUE_APP_BASE_API +
          "/fileManage/pageOffice/printBorrow?ids=" + array.join(","),
          "width=1440px;height=860px"
        );
      },
    }
  }
</script>

<style>

</style>
