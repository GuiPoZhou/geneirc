<template>
  <div>
    <div class="a-c-top" v-show="showSearch" style="margin-top: 0">
      <el-form ref="formsample2" :model="queryParams" label-width="100px" class="demo-form-inline" :inline="true">
        <el-form-item label="出库日期">
          <el-date-picker
              style="width: 260px" size="small"
              v-model="outerDate"
              @change="outerDateChange"
              type="daterange"
              range-separator="—"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="耗材编号">
          <el-input v-model="queryParams.materialNumber" class="input-with-select" style="width: 240px" size="small"
                    placeholder="请输入内容" clearable
                    @clear="searchPro"></el-input>
        </el-form-item>
        <el-form-item label="耗材名称">
          <el-input v-model="queryParams.materialName" class="input-with-select" style="width: 240px" size="small"
                    placeholder="请输入内容" clearable
                    @clear="searchPro"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="queryParams.materialModel" class="input-with-select" style="width: 240px" size="small"
                    placeholder="请输入内容" clearable
                    @clear="searchPro"></el-input>
        </el-form-item>
        <el-form-item label="批号">
          <el-input v-model="queryParams.batchNumber" class="input-with-select" style="width: 240px" size="small"
                    placeholder="请输入内容" clearable
                    @clear="searchPro"></el-input>
        </el-form-item>
        <el-form-item v-if="deviceK18Info.code == 500?false :deviceK18Info.dangerFlag == '危化品'?true:false"
                      :label="deviceK18Info.dangerFlag">
          <el-select v-model="queryParams.dangerFlag" clearable style="width: 240px" size="small">
            <el-option :value="0" label="安全"></el-option>
            <el-option :value="1" label="危险"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="queryParams.status" clearable style="width: 240px" size="small">
            <el-option :value="item.value" :label="item.label"
                       v-for="(item,index) in statusList"></el-option>
          </el-select>
        </el-form-item>
        <div class="a-c-t-btnarea">
          <el-form-item class="">
            <el-button type="primary"
                       icon="el-icon-search"
                       size="mini" @click="searchPro">
              查询
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="a-c-bottom">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button size="mini" type="primary" @click="showStoreOut()">添加
          </el-button>
          <!--          <el-button size="mini" type="primary" @click="">打印</el-button>-->
          <el-button size="mini" type="warning" @click="handleExport()">导出</el-button>
        </el-col>

        <el-col :span="1.5"></el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery"
                       @fullScreen="e_fullScreen" @changeBox="e_changeBox" :boxData="colData"
                       style="padding-right: 10px">
        </right-toolbar>
      </el-row>
      <!-- 列表区域 -->
      <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="序号" align="center" type="index" width="50"/>
        <el-table-column prop="outerDate" label="出库日期" sortable show-overflow-tooltip align="center"
                         v-if="colData[0].istrue"/>
        <el-table-column prop="materialNumber" label="耗材编号" sortable show-overflow-tooltip align="center"
                         v-if="colData[1].istrue"/>
        <el-table-column prop="materialName" label="耗材名称" sortable show-overflow-tooltip align="center"
                         v-if="colData[2].istrue"/>
        <el-table-column prop="materialModel" label="规格型号" sortable show-overflow-tooltip align="center"
                         v-if="colData[3].istrue"/>
        <el-table-column prop="brand" label="品牌" sortable show-overflow-tooltip align="center"
                         v-if="colData[4].istrue"/>
        <el-table-column prop="manufacturer" label="生产厂商" sortable show-overflow-tooltip align="center"
                         v-if="colData[5].istrue"/>
        <el-table-column prop="grade" label="试剂级别" sortable show-overflow-tooltip align="center"
                         v-if="colData[6].istrue"/>
        <el-table-column prop="batchNumber" label="批号" sortable show-overflow-tooltip align="center"
                         v-if="colData[7].istrue"/>
        <el-table-column prop="certificateNo" label="证书编号" sortable show-overflow-tooltip align="center"
                         v-if="colData[8].istrue"/>
        <el-table-column prop="materialCount" label="出库数量" sortable show-overflow-tooltip align="center"
                         v-if="colData[9].istrue"/>
        <el-table-column prop="unit" label="计量单位" sortable show-overflow-tooltip align="center"
                         v-if="colData[10].istrue"/>
        <el-table-column prop="storeSiteName" label="出库库位" sortable show-overflow-tooltip align="center"
                         v-if="colData[11].istrue"/>
        <el-table-column prop="costPrice" label="单价" sortable show-overflow-tooltip align="center"
                         v-if="colData[12].istrue"/>
        <el-table-column prop="costTotal" label="金额" sortable show-overflow-tooltip align="center"
                         v-if="colData[13].istrue"/>
        <el-table-column prop="remark" label="备注" sortable show-overflow-tooltip align="center"
                         v-if="colData[14].istrue"/>
        <el-table-column prop="status" label="审批状态" sortable show-overflow-tooltip align="center"
                         v-if="colData[15].istrue">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">暂存</span>
            <span v-if="scope.row.status == 2">已提交</span>
            <span v-if="scope.row.status == 3">审核通过</span>
            <span v-if="scope.row.status == 4">退回</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="lookRow(scope.row.id)" style="color: #409EFF">查看</el-button>
            <el-button type="text"
                       v-if="(scope.row.status == 1 || scope.row.status == 4)"
                       @click="editRow(scope.row.id)" style="color: #409EFF">修改
            </el-button>
            <el-button type="text"
                       v-if="(scope.row.status == 1 || scope.row.status == 4)"
                       @click="delRow(scope.row.id)" style="color: #409EFF">删除
            </el-button>
            <el-button type="text"
                       v-if="scope.row.status == 3"
                       @click="retreatRow(scope.row.id)"
                       style="color: #409EFF">退库
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize" @pagination="getList"/>
    </div>
    <stockRefund v-if="isStockRefund" :id="tid" @close="isStockRefund = false" :showType="showType2"
                 @handleOk="handleOk()"></stockRefund>
    <stockOut v-if="isStockOut" :id="id" @close="isStockOut = false" :showType="showType"
              @handleOk="handleOk()"></stockOut>
  </div>
</template>

<script>
import {queryStoreOutList, exportStoreOut} from '@/api/chemical/collectingIssue'
import stockOut from '../dialog/stockOut'
import stockRefund from '../dialog/stockRefund'

export default {
  name: 'outOfStock',
  components: {stockOut, stockRefund},
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialName: '',
        materialNumber: '',
        materialModel: '',
        batchNumber: '',
        status: '',
        outerDateBegin: '',
        outerDateEnd: ''
      },
      outerDate: '',
      tableData: [],
      total: 0,
      statusList: [
        {label: '暂存', value: 1},
        {label: '已提交', value: 2},
        {label: '审核通过', value: 3},
        {label: '退回', value: 4}
      ],
      colData: [
        {title: '出库日期', istrue: true},
        {title: '耗材编号', istrue: true},
        {title: '耗材名称', istrue: true},
        {title: '规格型号', istrue: true},
        {title: '品牌', istrue: true},
        {title: '生产厂商', istrue: true},
        {title: '试剂级别', istrue: true},
        {title: '批号', istrue: true},
        {title: '证书编号', istrue: true},
        {title: '出库数量', istrue: true},
        {title: '计量单位', istrue: true},
        {title: '出库库位', istrue: true},
        {title: '单价', istrue: true},
        {title: '金额', istrue: true},
        {title: '备注', istrue: true},
        {title: '审批状态', istrue: true}
      ],
      showSearch: true,
      isStockOut: false,
      isStockRefund: false,
      showType2: 'add',
      id: 0,
      tid: 0,
      showType: 'add',
      deviceK18Info: {
        code: 500
      }
    }
  },
  mounted() {
    this.getList()
  },
  async created() {
    this.getProjectK18('collectingIssue').then(re => {
      this.deviceK18Info = re
    }).catch(error => {
      this.deviceK18Info = error
    })
  },
  methods: {
    //导出
    handleExport() {
      exportStoreOut(this.queryParams).then(res => {
        if (res.code === 200) {
          this.downLoadFile(res.msg)
        }
      })
    },
    getList() {
      queryStoreOutList(this.queryParams).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    showStoreOut() {
      this.id = 0
      this.showType = 'add'
      this.isStockOut = true
    },
    outerDateChange(val) {
      if (val) {
        this.queryParams.outerDateBegin = val[0]
        this.queryParams.outerDateEnd = val[1]
      } else {
        this.queryParams.outerDateBegin = ''
        this.queryParams.outerDateEnd = ''
      }
    },
    searchPro() {
      this.getList()
    },
    handleSelectionChange() {

    },
    e_fullScreen() {
      this.fullscreen = !this.fullscreen
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
    resetQuery() {
      this.outerDate = ''
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        materialName: '',
        materialNumber: '',
        materialModel: '',
        batchNumber: '',
        status: '',
        outerDateBegin: '',
        outerDateEnd: ''
      }
      this.getList()
    },
    handleOk() {
      this.isStockRefund = false
      this.isStockOut = false
      this.resetQuery()
    },
    lookRow(id) {
      this.id = id
      this.showType = 'show'
      this.isStockOut = true
    },
    editRow(id) {
      this.id = id
      this.showType = 'edit'
      this.isStockOut = true
    },
    delRow(id) {
      this.$confirm('确定删除该领用出库记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$net(`/material/v1/storeOut/delMaterialStoreOut/${id}`, 'get').then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      })
    },
    retreatRow(id) {
      this.tid = id
      this.isStockRefund = true
    }
  }

}
</script>

<style scoped lang="less">
</style>
