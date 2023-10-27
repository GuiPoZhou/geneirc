<template>
  <div class="app-container">
    <!-- 统一样式 - 查询区域 -->
    <div class="a-c-top" v-show="showSearch">
      <!-- 表单 -->
      <el-form :inline="true" :model="queryParams" ref="queryParams" class="demo-form-inline" v-show="showSearch"
        label-width="100px">
        <el-form-item label="文件编号" prop="fileNumber">
          <el-input v-model="queryParams.fileNumber" placeholder="请输入文件编号" clearable @clear="handleQuery"
            class="input-with-select" style="width: 240px" size="small" />
        </el-form-item>
        <el-form-item label="文件名称" prop="fileName">
          <el-input v-model="queryParams.fileName" placeholder="请输入文件名称" clearable @clear="handleQuery"
            class="input-with-select" style="width: 240px" size="small" />
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType">
          <el-select v-model="queryParams.fileType" placeholder="请选择" style="width: 240px" size="small" clearable>
            <el-option v-for="item in fileTypelist" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" style="width: 240px" size="small" clearable>
            <el-option label="有效" :value="0"></el-option>
            <el-option label="作废" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <!-- 统一样式 - 查询区域 按钮 -->
        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="a-c-bottom">
      <el-row :gutter="20">
        <!--分类-->
        <el-col :span="5" :xs="24">
          <catalogueTree :treeList="treeList" @updata="getFiletree" @handleData="handleData"></catalogueTree>
        </el-col>
        <el-col :span="19" :xs="24">
          <div :class="fullscreen == true ? 'showFullScreen' : ''">
            <el-row :gutter="10" class="searchbox">
              <el-col :span="1.5">
                <el-button type="primary" :disabled="multiple" @click="handleAdd" size="mini" v-hasPermi="['micGenric:ctrManage:add']" >添加
                </el-button>
                <el-button type="primary" :disabled="!this.multipleSelection.length > 0" @click="handlePrint"
                  size="mini">打印
                </el-button>
                <el-button type="warning" :disabled="multiple" @click="handleExport" size="mini">导出
                </el-button>
              </el-col>
              <el-col :span="1.5"></el-col>
              <right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" @fullScreen="e_fullScreen"
                @changeBox="e_changeBox" :boxData="colData"></right-toolbar>
            </el-row>
            <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange"
              @sort-change="sortChange">
              <el-table-column type="selection" width="55" fixed />
              <el-table-column label="序号" align="center" type="index" width="50" fixed />
              <el-table-column prop="fileType" label="文件类型" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[0].istrue">
                <template slot-scope="scope">
                  <span v-if="scope.row.fileType === 1">受控文件</span>
                  <span v-if="scope.row.fileType === 2">外来文件</span>
                  <span v-if="scope.row.fileType === 3">机密文件</span>
                </template>
              </el-table-column>
              <el-table-column prop="fileName" label="文件名称" sortable="custom" show-overflow-tooltip width="100"
                align="center" v-if="colData[1].istrue" />
              <el-table-column prop="fileNumber" label="文件编号" sortable="custom" show-overflow-tooltip width="100"
                align="center" v-if="colData[2].istrue" />

              <el-table-column prop="version" label="版次" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[3].istrue" />
              <el-table-column prop="status" label="文档状态" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[4].istrue">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 0">有效</span>
                  <span v-if="scope.row.status === 1" style="color: #ff4949">作废</span>
                </template>
              </el-table-column>

              <el-table-column prop="createBy" label="编制人" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[5].istrue" />
              <el-table-column prop="remark" label="备注" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[6].istrue" />
              <!-- <el-table-column prop="createTime" label="创建日期" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[7].istrue" />
              <el-table-column prop="treeName" label="所属文件目录" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[8].istrue" /> -->
              <el-table-column prop="name" label="操作" align="center" width="200" fixed="right">
                <template slot-scope="scope">
                  <el-button v-hasPermi="['micGenric:ctrManage:detail']" size="mini" type="text"
                    @click="e_look(scope.row)">查看
                  </el-button>
                  <el-button v-hasPermi="['micGenric:ctrManage:edit']" size="mini" type="text"
                    @click="e_edit(scope.row)">修改
                  </el-button>
                  <el-button size="mini" type="text" @click="e_borrow(scope.row)">借阅</el-button>
                  <el-button size="mini" type="text" @click="e_print(scope.row)">打印</el-button>
                  <el-button v-hasPermi="['micGenric:ctrManage:delete']" size="mini" type="text"
                    @click="e_delete(scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize" @pagination="getList" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!--新增/修改-->
    <craeteFile v-if="showFile" ref="filefs" @close="showFile = false"></craeteFile>
    <!--借阅-->
    <borrow v-if="showborrow" ref="borrow" @close="showborrow = false"></borrow>
    <!--打印-->
    <print v-if="showprint" ref="print" @close="showprint = false"></print>
  </div>
</template>

<script>
import catalogueTree from '../components/catalogueTree'
import craeteFile from './dialog/craeteFile'
import borrow from './dialog/borrow'
import print from './dialog/print'
import {
  getFiletreeList,
  getFileList,
  getFileredetail,
  deleteControllFile,
  exportControll
} from '@/api/filesManagement/filesManagement'

export default {
  name: 'ctrManage',
  components: { catalogueTree, craeteFile, borrow, print },
  data() {
    return {
      showSearch: true,
      addShow: false,
      loading: true,
      multiple: true,
      showFile: false,
      showprint: false,
      showborrow: false,
      fullscreen: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        treeId: null,
        fileNumber: '',
        fileName: '',
        status: null,
        fileType: null,
        idList: [],
        orderByColumn: '',
        orderByType: ''
      },
      total: 0,
      fileTypelist: [
        { label: '受控文件', value: 1 },
        { label: '外来文件', value: 2 },
        { label: '机密文件', value: 3 }
      ],
      //参数表格数据
      tableData: [],
      multipleSelection: [],
      treeList: [],
      colData: [
        { title: '文件类型', istrue: true },
        { title: '文件名称', istrue: true },
        { title: '文件编号', istrue: true },
        { title: '版次', istrue: true },
        { title: '文档状态', istrue: true },
        { title: '编制人', istrue: true },
        { title: '备注', istrue: true },
        // { title: '创建日期', istrue: true },
        // { title: '所属文件目录', istrue: true }

      ],
      trssdata: {},
      ids: []
    }
  },
  mounted() {
    this.getFiletree()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.ids = val.map(item => item.id)
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
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryParams')
      this.handleQuery()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 列表
    getList() {
      getFileList(this.queryParams).then(res => {
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
      return name.replace(/([A-Z])/g, '_$1').toLowerCase()
    },
    // 文件目录列表
    getFiletree() {
      getFiletreeList().then(res => {
        this.treeList = res.data
      })
    },
    // 获取点击后的树列表
    handleData(data) {
      // this.radio = ''
      // this.$refs.selectTable.setCurrentRow(row);
      this.trssdata = data
      this.multiple = false
      this.ismultiple = true
      this.queryParams.treeId = this.trssdata.id
      this.getList()
    },
    // 添加
    handleAdd() {
      this.showFile = true
      this.$nextTick(() => {
        this.$refs.filefs.init('add', this.trssdata)
        this.$refs.filefs.treedata(this.treeList, this.queryParams.treeId)
      })
    },
    //pageOffice 打印
    handlePrint() {
      // console.log(this.tableData)
      // console.log(this.multipleSelection)
      let array = this.multipleSelection.map(item => item.id)
      if (!array || array.length == 0) {
        return false
      }
      POBrowser.openWindowModeless(
        process.env.VUE_APP_BASE_API +
        '/fileManage/pageOffice/printControll?ids=' + array.join(','),
        'width=1440px;height=860px'
      )
    },
    // 借阅
    e_borrow(row) {
      this.showborrow = true
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.$refs.borrow.init('update', row)
        })
      })
    },
    // 打印
    e_print(row) {
      this.showprint = true
      this.$nextTick(() => {
        this.$refs.print.init('update', row)
      })
    },
    // 修改
    e_edit(row) {
      this.showFile = true
      getFileredetail(row.id).then(res => {
        this.$nextTick(() => {
          this.$refs.filefs.init('update', res.data)
          this.$refs.filefs.treedata(this.treeList)
        })
      })
    },
    // 查看
    e_look(row) {
      this.showFile = true
      getFileredetail(row.id).then(res => {
        this.$nextTick(() => {
          this.$refs.filefs.init('show', res.data)
          this.$refs.filefs.treedata(this.treeList)
        })
      })
    },
    // 删除
    e_delete(row) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteControllFile(row.id).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.info(res.msg)
          }
        })
      })
    },
    //导出
    handleExport() {
      this.queryParams.idStr = this.ids.join(',')
      exportControll(this.queryParams).then(res => {
        if (res.code === 200) {
          this.downLoadFile(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.searchbox {
  margin: 10px 0;
}

/deep/ .pagination-container {
  background: none !important;
}
</style>
