<template>
  <div>
    <div class="a-c-top" v-show="showSearch" style="margin-top: 0">
      <el-form ref="formsample2" :inline="true" :model="queryParams" label-width="100px" class="demo-form-inline">
        <el-form-item label="采购单号">
          <el-input v-model="queryParams.orderNo" class="input-with-select"
                    placeholder="请输入内容" @keyup.enter.native="searchPro" clearable
                    @clear="searchPro" style="width: 240px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="采购日期">
          <el-date-picker
            v-model="orderDate" style="width: 260px" size="small" value-format="yyyy-MM-dd"
            @change="orderDateChange" type="daterange" range-separator="-"
            start-placeholder="选择开始日期" end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-select v-model="queryParams.supplierName" placeholder="请选择供应商" @change="searchPro" clearable
                     style="width: 240px" size="small">
            <el-option :value="item.supplierName" :label="item.supplierName"
                       v-for="(item,index) in supplierList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="要求到货日期">
          <el-date-picker
            v-model="finishDate" style="width: 260px" size="small" value-format="yyyy-MM-dd"
            @change="finishDateChange" type="daterange" range-separator="-"
            start-placeholder="选择开始日期" end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="流程状态">
          <el-select v-model="queryParams.status" placeholder="请选择流程状态" @change="searchPro" clearable
                     style="width: 240px" size="small">
            <el-option :value="item.id" :label="item.name"
                       v-for="(item,index) in processStatus"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交货状态">
          <el-select v-model="queryParams.storeStatus" placeholder="请选择交货状态" @change="searchPro" clearable
                     style="width: 240px" size="small">
            <el-option :value="item.id" :label="item.name"
                       v-for="(item,index) in deliveryStatus"></el-option>
          </el-select>
        </el-form-item>
        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="searchPro"
            >搜索
            </el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置
            </el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="a-c-bottom">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button size="mini" type="primary" @click="addBuyOrder">添加</el-button>
<!--          <el-button size="mini" type="primary" :disabled="selectionChange.length <= 0" @click="handlePrint">-->
<!--            打印-->
<!--          </el-button>-->
          <el-button size="mini" type="primary" :disabled="selectionChange.length <= 0" @click="submitOrder">
            提交
          </el-button>
          <el-button size="mini" type="warning" @click="exportOrder">导出</el-button>
        </el-col>
        <el-col :span="1.5"></el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" @fullScreen="e_fullScreen"
                       @changeBox="e_changeBox" :boxData="colData" style="padding-right: 10px"></right-toolbar>
      </el-row>

      <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange"
                @sort-change="sortChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="序号" align="center" type="index" width="50"/>
        <el-table-column prop="orderNo" label="采购单号" sortable v-if="colData[0].istrue" align="center"/>
        <el-table-column prop="orderDate" label="采购日期" sortable show-overflow-tooltip width="160"
                         align="center" v-if="colData[1].istrue"/>
        <el-table-column prop="supplierName" label="供应商名称" sortable show-overflow-tooltip
                         align="center" v-if="colData[2].istrue"/>
        <el-table-column prop="contact" align="center" label="联系人" sortable show-overflow-tooltip
                         v-if="colData[3].istrue"/>
        <el-table-column prop="phone" align="center" label="联系电话" sortable show-overflow-tooltip
                         v-if="colData[4].istrue"/>
        <el-table-column prop="finishDate" label="要求到货日期" sortable show-overflow-tooltip
                         align="center" v-if="colData[5].istrue"/>
        <el-table-column prop="amount" align="center" label="合计金额" sortable show-overflow-tooltip
                         v-if="colData[6].istrue"/>
        <el-table-column prop="createByStr" label="录入人" sortable show-overflow-tooltip
                         align="center" v-if="colData[7].istrue"/>
        <el-table-column prop="updateTimeStr" label="最新修改日期" sortable show-overflow-tooltip
                         align="center" v-if="colData[8].istrue"/>
        <el-table-column prop="status" align="center" label="流程状态" sortable show-overflow-tooltip
                         v-if="colData[9].istrue">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">暂存</span>
            <span v-if="scope.row.status == 2">已提交</span>
            <span v-if="scope.row.status == 3">审核通过</span>
            <span v-if="scope.row.status == 4">退回</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeStatus" label="交货状态" sortable show-overflow-tooltip
                         align="center" v-if="colData[10].istrue">
          <template slot-scope="scope">
            <span v-if="scope.row.storeStatus == 0">未完成</span>
            <span v-if="scope.row.storeStatus == 1">部分完成</span>
            <span v-if="scope.row.storeStatus == 2">全部完成</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyCount" label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <div>
              <el-tag type="primary" class="pointer" @click="examineRow(scope.row.id)">查看</el-tag>
              <el-tag type="primary" class="pointer" @click="editRow(scope.row.id)"
                      v-if="scope.row.status == 4||scope.row.status ==1">修改
              </el-tag>
              <el-tag type="primary" class="pointer" @click="delRow(scope.row.id)"
                      v-if="scope.row.status == 4 ||scope.row.status ==1">删除
              </el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize" @pagination="getList"/>
    </div>
    <addBuyOrder :convertParams="[]" v-if="isAddBuyOrder" :showType="showType" :id="id"
                 @close="isAddBuyOrder = false" @submits="submits"></addBuyOrder>
  </div>
</template>

<script>
  import {
    queryBuyOrderList,
    submitBuyOrder,
    getSelectList,
    exportBuyOrder,
    delBuyOrder
  } from '@/api/chemical/purchaseOrder'
  import addBuyOrder from '../dialog/addBuyOrder.vue'

  export default {
    name: 'purchaseOrders',
    components: {addBuyOrder},
    data() {
      return {
        isAddBuyOrder: false,
        showSearch: true,
        showType: 'add',
        id: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          orderDateBegin: '',
          orderDateEnd: '',
          orderNo: '',
          finishDateBegin: '',
          finishDateEnd: '',
          supplierName: '',
          materialName: '',
          status: '',
          storeStatus: ''
        },
        processStatus: [
          {name: '暂存', id: 1},
          {name: '已提交', id: 2},
          {name: '审核通过', id: 3},
          {name: '退回', id: 4}
        ],
        deliveryStatus: [
          {name: '未完成', id: 0},
          {name: '部分完成', id: 1},
          {name: '全部完成', id: 2}
        ],
        total: 0,
        tableData: [],
        colData: [
          {title: '采购单号', istrue: true},
          {title: '采购日期', istrue: true},
          {title: '供应商名称', istrue: true},
          {title: '联系人', istrue: true},
          {title: '联系电话', istrue: true},
          {title: '要求到货日期', istrue: true},
          {title: '合计金额', istrue: true},
          {title: '录入人', istrue: true},
          {title: '最新修改日期', istrue: true},
          {title: '流程状态', istrue: true},
          {title: '交货状态', istrue: true}
        ],
        orderDate: '',
        finishDate: '',
        selectionChange: [],
        supplierList: []
      }
    },
    mounted() {
      this.getList()
      getSelectList().then(res => {
        this.supplierList = res.data
      })
    },
    methods: {
      submitOrder() {
        var ids = []
        for (var i in this.selectionChange) {
          ids.push(this.selectionChange[i].id)
        }
        submitBuyOrder(ids).then(res => {
          if (res.code == 200) {
            this.$message.success('提交成功')
            this.resetQuery()
          }
        })
      },
      handlePrint() {
        let array = this.selectionChange.map(item => item.id)
        if (!array || array.length == 0) {
          return false
        }
        POBrowser.openWindowModeless(
          process.env.VUE_APP_BASE_API +
          '/fileManage/pageOffice/printControll?multipleSelection=' + array.join(','),
          'width=1440px;height=860px'
        )
      },
      exportOrder() {
        exportBuyOrder(this.queryParams).then(res => {
          if (res.code) {
            this.downLoadFile(res.msg)
          }
        })
      },
      orderDateChange(v) {
        if (this.orderDate) {
          this.queryParams.orderDateBegin = v[0]
          this.queryParams.orderDateEnd = v[1]
        } else {
          this.queryParams.orderDateBegin = ''
          this.queryParams.orderDateEnd = ''
        }
        this.searchPro()
      },
      finishDateChange(v) {
        if (this.finishDate) {
          this.queryParams.finishDateBegin = v[0]
          this.queryParams.finishDateEnd = v[1]
        } else {
          this.queryParams.finishDateBegin = ''
          this.queryParams.finishDateEnd = ''
        }
        this.searchPro()
      },
      initParams() {
        this.orderDate = ''
        this.finishDate = '',
          this.queryParams = {
            pageNum: 1,
            pageSize: 10,
            orderDateBegin: '',
            orderDateEnd: '',
            orderNo: '',
            finishDateBegin: '',
            finishDateEnd: '',
            supplierName: '',
            materialName: '',
            status: '',
            storeStatus: ''
          }
      },
      submits() {
        this.isAddBuyOrder = false
        this.resetQuery()
      },
      e_changeBox(list) {
        let arrList = this.colData.filter(i => !list.includes(i.title))
        let titleList = arrList.map(item => {
          return item.title
        })
        this.colData.filter(i => {
          if (titleList.indexOf(i.title) != -1) {
            i.istrue = false
          } else {
            i.istrue = true
          }
        })
      },
      searchPro() {
        this.getList()
      },
      e_fullScreen() {

      },
      resetQuery() {
        this.initParams()
        this.getList()
      },

      handleSelectionChange(val) {
        this.selectionChange = val
      },
      sortChange() {

      },
      getList() {
        queryBuyOrderList(this.queryParams).then(res => {
          this.tableData = res.data.list
          this.total = res.data.total

        })
      },
      addBuyOrder() {
        this.isAddBuyOrder = true
        this.id = 0
        this.showType = 'add'
      },
      examineRow(id) {
        this.isAddBuyOrder = true
        this.id = id
        this.showType = 'show'
      },
      editRow(id) {
        this.isAddBuyOrder = true
        this.id = id
        this.showType = 'edit'
      },
      delRow(id) {
        this.$confirm('确认删除该采购订单吗？', '提示').then(() => {
          delBuyOrder(id).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.resetQuery()
            }
          })
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .cell .el-tag {
    background: none;
    border: none;
  }

  .flex {
    display: flex;
  }

  .flexdit {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    padding-top: 16px;
    border: 1px solid #dfe6ec;
  }

  .pointer {
    cursor: pointer;
  }

  .tabbody {
    background-color: #fff;
    border-bottom: 1px solid #dfe6ec;

    h3 {
      margin-bottom: 0;
      border-left: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      padding: 5px 10px;
      font-size: 14px;
      font-weight: bold;
    }

    .pagtion {
      border-left: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      position: relative;
      height: 50px;

      .el-pagination {
        position: absolute;
        right: 0;
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
  }

  .pagination-container {
    margin-top: 0;
  }

  .linel {
    border: 1px solid #dfe6ec;
    background-color: #fff;
    margin-top: 10px;
    padding-left: 10px;
    padding-top: 10px;
  }
</style>
