<template>
  <div>
    <div class="a-c-top" v-show="showSearch" style="margin-top: 0">
      <el-form ref="formsample" :inline="true" :model="queryParams" label-width="100px"
               class="demo-form-inline">
        <el-form-item label="申请人员">
          <el-input v-model="queryParams.applyPersonName" class="input-with-select"
                    placeholder="请输入内容" @keyup.enter.native="searchPro" clearable
                    @clear="searchPro" style="width: 240px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="申请日期">
          <el-date-picker style="width: 260px" size="small"
                          v-model="applyDate" value-format="yyyy-MM-dd"
                          @change="applyDateChange" type="daterange" range-separator="-"
                          start-placeholder="选择开始日期" end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="申请部门">
          <el-input v-model="queryParams.applyDeptName" class="input-with-select"
                    placeholder="请输入内容" @keyup.enter.native="searchPro" clearable
                    @clear="searchPro" style="width: 240px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="使用日期">
          <el-date-picker
            v-model="useDate"
            style="width: 260px" size="small"
            value-format="yyyy-MM-dd"
            @change="useDateChange"
            type="daterange"
            range-separator="-"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="耗材名称">
          <el-input v-model="queryParams.materialName" class="input-with-select"
                    placeholder="请输入内容" @keyup.enter.native="searchPro" clearable
                    @clear="searchPro" style="width: 240px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="生产厂商">
          <el-input v-model="queryParams.manufacturer" class="input-with-select"
                    placeholder="请输入内容" @keyup.enter.native="searchPro" clearable
                    @clear="searchPro" style="width: 240px" size="small"></el-input>
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

    <div class="a-c-bottom" style="margin-top: 10px">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" size="mini" :disabled="selectionChange.length<=0"
                     @click="addBuyOrder">转采购单
          </el-button>
        </el-col>
        <el-col :span="1.5"></el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="resetQuery"
          @fullScreen="e_fullScreen"
          @changeBox="e_changeBox"
          :boxData="colData"
          style="padding-right: 10px">
        </right-toolbar>
      </el-row>

      <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" align="center" type="index" width="50"/>
        <el-table-column prop="applyNo" label="申请单号" sortable v-if="colData[0].istrue" align="center"/>
        <el-table-column prop="applyDate" label="申请日期" sortable show-overflow-tooltip width="160"
                         align="center" v-if="colData[1].istrue"/>
        <el-table-column prop="applyPersonName" label="申请人员" sortable show-overflow-tooltip
                         align="center" v-if="colData[2].istrue"/>
        <el-table-column prop="applyDeptName" label="申请部门" sortable show-overflow-tooltip
                         align="center" v-if="colData[3].istrue"/>
        <el-table-column prop="materialModel" label="规格型号" sortable show-overflow-tooltip
                         align="center" v-if="colData[4].istrue"/>
        <el-table-column prop="unit" label="计量单位" sortable show-overflow-tooltip
                         align="center" v-if="colData[5].istrue"/>
       <el-table-column prop="applyCount" label="申请数量" sortable show-overflow-tooltip
                         align="center" v-if="colData[6].istrue"/>
       <el-table-column prop="orderCount" label="下单数量" sortable show-overflow-tooltip
                         align="center" v-if="colData[7].istrue" width="151px">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.orderCount" size="mini"/>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" sortable show-overflow-tooltip
												 align="center" v-if="colData[8].istrue"/>
        <!-- <el-table-column prop="useDate" label="使用日期" sortable show-overflow-tooltip
                         align="center" v-if="colData[9].istrue"/>
        <el-table-column prop="materialName" label="耗材名称" sortable show-overflow-tooltip
                         align="center" v-if="colData[10].istrue"/>
       
        <el-table-column prop="manufacturer" label="生产厂商" sortable show-overflow-tooltip
                         align="center" v-if="colData[11].istrue"/>
        <el-table-column prop="grade" label="试剂级别" sortable show-overflow-tooltip
                         align="center" v-if="colData[12].istrue"/>
         -->
      
     
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize" @pagination="getList"/>

    </div>
    <addBuyOrder v-if="isAddBuyOrder" @submits="handleOk()" :convertParams="convertParams"
                 @close="isAddBuyOrder = false"></addBuyOrder>
  </div>
</template>

<script>
  import addBuyOrder from '../dialog/addBuyOrder.vue'
  import {queryToBuyOrderList, queryBuyOrderList} from '@/api/chemical/purchaseOrder'

  var floatObj = require('../../common/floatObj.js')

  export default {
    name: 'applicationApproved',
    components: {addBuyOrder},
    data() {
      return {
        selectionChange: [],
        isAddBuyOrder: false,
        applyDate: '',
        useDate: '',
        showSearch: true,
        total: 0,
        orderDate: '',
        finishDate: '',
        queryParams: {
          applyDateBegin: '',
          applyDateEnd: '',
          applyPersonName: '',
          applyDeptName: '',
          materialName: '',
          manufacturer: '',
          useDateBegin: '',
          useDateEnd: '',
          pageNum: 1,
          pageSize: 10
        },
        colData: [
          {title: '申请单号', istrue: true},
          {title: '申请日期', istrue: true},
          {title: '申请人员', istrue: true},
          {title: '申请部门', istrue: true},
          {title: '规格型号', istrue: true},
          {title: '计量单位', istrue: true},
          {title: '申请数量', istrue: true},
          {title: '下单数量', istrue: true},
          {title: '备注', istrue: true},
          // {title: '使用日期', istrue: true},
          // {title: '耗材名称', istrue: true},
          // {title: '生产厂商', istrue: true},
          // {title: '试剂级别', istrue: true},
       
        ],
        dateRange: '',
        tableData: [],
        convertParams: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      orderDateChange(val) {
        this.queryParams2.orderDateBegin = val[0]
        this.queryParams2.orderDateEnd = val[0]
      },
      finishDateChange(val) {
        this.queryParams2.finishDateBegin = val[0]
        this.queryParams2.finishDateEnd = val[0]
      },
      addBuyOrder() {
        this.$confirm('确定将选择的耗材转为采购订单吗？', '转采购单提示').then(res => {
          this.convertParams = []
          for (var i in this.selectionChange) {
            this.convertParams.push({
              applyCount: this.selectionChange[i].applyCount,
              applyDetailId: this.selectionChange[i].applyDetailId,
              amount: floatObj.accMul(this.selectionChange[i].price, this.selectionChange[i].orderCount),
              applyDept: this.selectionChange[i].applyDept,
              applyDeptName: this.selectionChange[i].applyDeptName,
              applyPerson: this.selectionChange[i].applyPerson,
              applyPersonName: this.selectionChange[i].applyPersonName,
              applyDate: this.selectionChange[i].applyDate,
              brand: this.selectionChange[i].brand,
              buyApplyId: this.selectionChange[i].buyApplyId,
              buyApplyNo: this.selectionChange[i].applyNo,
              buyOrderId: null,
              grade: this.selectionChange[i].grade,
              manufacturer: this.selectionChange[i].manufacturer,
              materialId: this.selectionChange[i].materialId,
              materialModel: this.selectionChange[i].materialModel,
              materialName: this.selectionChange[i].materialName,
              materialNumber: this.selectionChange[i].materialNumber,
              orderCount: this.selectionChange[i].orderCount,
              price: this.selectionChange[i].price,
              usedCount: this.selectionChange[i].usedCount,
              remark: this.selectionChange[i].remark,
              unit: this.selectionChange[i].unit
            })
            this.isAddBuyOrder = true
          }

        })
      },

      useDateChange(v) {
        if (this.useDate) {
          this.queryParams.useDateBegin = v[0]
          this.queryParams.useDateEnd = v[1]
        } else {
          this.queryParams.useDateBegin = ''
          this.queryParams.useDateEnd = ''
        }
        this.searchPro()
      },
      applyDateChange(v) {
        if (this.applyDate) {
          this.queryParams.applyDateBegin = v[0]
          this.queryParams.applyDateEnd = v[1]
        } else {
          this.queryParams.applyDateBegin = ''
          this.queryParams.useDateEnd = ''
        }
        this.searchPro()
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
      ondateChange(e) {
      },
      searchPro() {
        this.getList()
      },
      resetQuery() {
        this.applyDate = ''
        this.useDate = ''
        this.queryParams = {
          applyDateBegin: '',
          applyDateEnd: '',
          applyPersonName: '',
          applyDeptName: '',
          materialName: '',
          manufacturer: '',
          useDateBegin: '',
          useDateEnd: '',
          pageNum: 1,
          pageSize: 10
        }
        this.getList()
      },

      handleSelectionChange(val) {
        this.selectionChange = val
      },
      toLine(name) {
        return name.replace(/([A-Z])/g, '_$1').toLowerCase()
      },
      // 排序
      sortChange(column, prop, order) {

      },
      getList() {
        queryToBuyOrderList(this.queryParams).then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      handleOk() {
        this.resetQuery()
        this.isAddBuyOrder = false
        this.$emit('addOrder')
      },
      e_fullScreen() {
        this.fullscreen = !this.fullscreen
      }
    }
  }
</script>

<style scoped lang="less">
</style>
