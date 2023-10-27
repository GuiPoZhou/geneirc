<template>
  <div>
    <div class="a-c-top" v-show="showSearch">
      <el-form ref="formsample2" :model="queryParams" label-width="100px" class="demo-form-inline" :inline="true">
        <el-form-item label="出库日期">
          <el-date-picker
            style="width: 260px"
            size="small"
            v-model="changeDate"
            @change="changeDateChange"
            type="daterange"
            range-separator="—"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="耗材编号">
          <el-input v-model="queryParams.materialNumber" class="input-with-select" placeholder="请输入内容"
                    clearable @clear="searchPro"
                    style="width: 240px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="耗材名称">
          <el-input v-model="queryParams.materialName" class="input-with-select" placeholder="请输入内容"
                    clearable @clear="searchPro"
                    style="width: 240px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="queryParams.materialModel" class="input-with-select" placeholder="请输入内容"
                    clearable @clear="searchPro"
                    style="width: 240px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="批号">
          <el-input v-model="queryParams.batchNumber" class="input-with-select" placeholder="请输入内容"
                    clearable @clear="searchPro"
                    style="width: 240px" size="small"></el-input>
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
          <el-button size="mini" type="primary" @click="showAddStockMove()">添加
          </el-button>
<!--          <el-button size="mini" type="primary" @click="">打印</el-button>-->
          <el-button size="mini" type="warning" @click="handleExport">导出</el-button>
        </el-col>
        <el-col :span="1.5"></el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery"
                       @fullScreen="e_fullScreen" @changeBox="e_changeBox" :boxData="colData"
                       style="padding-right: 10px">
        </right-toolbar>
      </el-row>
      <!-- 列表区域 -->
      <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" align="center" type="index" width="50"/>
        <el-table-column prop="changeDate" label="转移日期" sortable show-overflow-tooltip align="center"
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
        <el-table-column prop="unit" label="计量单位" sortable show-overflow-tooltip align="center"
                         v-if="colData[7].istrue"/>
        <el-table-column prop="fromStoreSiteName" label="转出库位" sortable show-overflow-tooltip align="center"
                         v-if="colData[8].istrue"/>
        <el-table-column prop="toStoreSiteName" label="转入库位" sortable show-overflow-tooltip align="center"
                         v-if="colData[9].istrue"/>
        <el-table-column prop="materialCount" label="数量" sortable show-overflow-tooltip align="center"
                         v-if="colData[10].istrue"/>
        <el-table-column prop="remark" label="备注" sortable show-overflow-tooltip align="center"
                         v-if="colData[11].istrue"/>
        <el-table-column label="操作" show-overflow-tooltip width="75" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="lookRow(scope.row.id)" style="color: #409EFF">查看</el-button>
            <!--						<el-button type="text" @click="delRow(scope.row.id)" style="color: #ffba00">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize" @pagination="getList"/>
    </div>

    <addStockMove v-if="isAddStockMove" :showType="showType" :id="id" @close="isAddStockMove = false"
                  @handleOk="handleOk"></addStockMove>
  </div>
</template>

<script>
  import {queryStoreChangeList, exportStoreChange} from '@/api/chemical/stock'
  import addStockMove from './dialog/addStockMove'

  export default {
    name: 'stockMove',
    components: {addStockMove},
    data() {
      return {
        showSearch: true,
        isAddStockMove: false,
        showType: 'add',
        colData: [
          {title: '转移日期', istrue: true},
          {title: '耗材编号', istrue: true},
          {title: '耗材名称', istrue: true},
          {title: '规格型号', istrue: true},
          {title: '品牌', istrue: true},
          {title: '生产厂商', istrue: true},
          {title: '试剂级别', istrue: true},
          {title: '计量单位', istrue: true},
          {title: '转出库位', istrue: true},
          {title: '转入库位', istrue: true},
          {title: '数量', istrue: true},
          {title: '备注', istrue: true}
        ],
        tableData: [],
        queryParams: {
          pageNum: 1,
          pageSize: 10
        },
        changeDate: '',
        total: 0
      }
    },
    created() {
      this.getList()
    },
    methods: {
      changeDateChange(v) {
        this.changeDate = v
        if (this.changeDate) {
          this.queryParams.changeDateBegin = v[0]
          this.queryParams.changeDateEnd = v[1]
        } else {
          this.queryParams.changeDateBegin = ''
          this.queryParams.changeDateEnd = ''
        }
      },
      handleSelectionChange() {

      },
      searchPro() {
        this.getList()
      },
      resetQuery() {
        this.queryParams = {
          changeDateBegin: '',
          changeDateEnd: '',
          materialNumber: '',
          materialName: '',
          materialModel: '',
          batchNumber: '',
          pageNum: 1,
          pageSize: 10
        }
        this.changeDate = ''
        this.queryParams.changeDateBegin = ''
        this.queryParams.changeDateEnd = ''
        this.getList()
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
      getList() {
        queryStoreChangeList(this.queryParams).then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      showAddStockMove() {
        this.showType = 'add'
        this.isAddStockMove = true
      },
      handleOk() {
        this.isAddStockMove = false
        this.getList()
      },
      lookRow(id) {
        this.id = id
        this.isAddStockMove = true
        this.showType = 'show'
      },
      delRow(id) {

      },
      //导出
      handleExport() {
        exportStoreChange(this.queryParams).then(res => {
          if (res.code === 200) {
            this.downLoadFile(res.msg)
          }
        })
      }
    }
  }
</script>


<style scoped lang="less">
</style>
