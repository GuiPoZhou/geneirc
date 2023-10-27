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
        <el-form-item label="设备编号" prop="equipmentNumber">
          <el-input
              v-model="queryParams.equipmentNumber"
              placeholder="请输入设备编号"
              clearable
              class="input-with-select"
              style="width: 240px"
              size="small"
          />
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input
              v-model="queryParams.equipmentName"
              placeholder="请输入设备名称"
              clearable
              class="input-with-select"
              style="width: 240px"
              size="small"
          />
        </el-form-item>
        <el-form-item label="使用部门" prop="userDepartment">
          <treeselect style="width: 240px" size="mini" v-model="queryParams.userDepartment"
                      :options="deptOptions" :show-count="true" placeholder="请选择部门"/>
        </el-form-item>
        <el-form-item label="存放地点" prop="position">
          <el-input
              v-model="queryParams.position"
              placeholder="请输入存放地点"
              clearable
              class="input-with-select"
              style="width: 240px"
              size="small"
          />
        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" style="width: 240px"
                     size="small">
            <el-option label="正常" :value="1"></el-option>
            <el-option label="停用" :value="2"></el-option>
            <el-option label="维修" :value="3"></el-option>
            <el-option label="保养" :value="4"></el-option>
            <el-option label="报废" :value="5"></el-option>
            <el-option label="封存" :value="6"></el-option>
            <el-option label="核查" :value="7"></el-option>
            <el-option label="故障" :value="8"></el-option>
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
    <div class="a-c-bottom">
      <el-row :gutter="10">
        <el-col :span="4" :xs="24">
          <!--分类-->
          <catalogueTree ref="chilstree" :type="type" @getTreedata="getTreedata"
                         @handleData="handleData"></catalogueTree>
        </el-col>
        <el-col :span="20" :xs="24">
          <div :class="fullscreen == true ? 'showFullScreen' : ''"
               style="padding-bottom:10px; padding-right: 5px">
            <el-row :gutter="10" class="searchbox">
              <el-col :span="1.5">
                <el-button type="primary" :disabled="addmultiple1" size="mini" @click="handleAdd">
                  添加
                </el-button>
                <el-button type="primary" :disabled="!ids.length > 0" size="mini"
                           @click="handlEadjust">调整分类
                </el-button>
                <el-button type="primary"
                           v-if="!$store.state.user.permissions.includes('micGenric:standingBook:NOprintSampleLabel')"
                           :disabled="!(multipleSelection.length > 0 && multipleSelection.length < 2)"
                           size="mini" @click="handlePrintTag">打印标签
                </el-button>
                <el-button type="primary" :disabled="!ids.length > 0" size="mini"
                           @click="handlePrint">打印
                </el-button>
                <!--<el-button type="warning" :disabled="addmultiple">导入</el-button>-->
                <el-button type="warning" :disabled="addmultiple" size="mini" @click="handleImport">导入</el-button>

                <el-button type="warning" :disabled="addmultiple" size="mini" @click="handleExport">
                  导出
                </el-button>
                <el-button type="danger" :disabled="!ids.length > 0" size="mini" @click="handleDel">
                  删除
                </el-button>
              </el-col>
              <el-col :span="1.5"></el-col>
            </el-row>
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
              <el-table-column prop="equipmentNumber" label="设备编号" sortable="custom"
                               show-overflow-tooltip
                               fixed align="center"
                               v-if="colData[0].istrue"/>
              <el-table-column prop="equipmentName" label="设备名称" sortable="custom"
                               show-overflow-tooltip align="center"
                               v-if="colData[1].istrue"/>
              <el-table-column prop="equipmentModel" label="规格型号" sortable="custom"
                               show-overflow-tooltip align="center"
                               v-if="colData[2].istrue"/>
              <!-- <el-table-column prop="unit" label="计量单位" sortable="custom" show-overflow-tooltip align="center"
                               v-if="colData[3].istrue"/> -->
              <el-table-column prop="manufacturer" label="制造厂商" sortable="custom"
                               show-overflow-tooltip align="center"
                               v-if="colData[3].istrue"/>
              <el-table-column prop="factoryNumber" label="出厂编号" sortable="custom"
                               show-overflow-tooltip align="center"
              />
              <el-table-column prop="purchaseDate" label="购置日期" sortable="custom"
                               show-overflow-tooltip align="center"
              />
              <el-table-column prop="assemblyDate" label="安装日期" sortable="custom"
                               show-overflow-tooltip align="center"
              />
              <!-- <el-table-column prop="userDepartmentName" label="使用部门" sortable="custom"
                               show-overflow-tooltip align="center"
                               v-if="colData[5].istrue">
              </el-table-column>
              <el-table-column prop="position" label="存放地点" sortable="custom" show-overflow-tooltip align="center"
                               v-if="colData[6].istrue">
              </el-table-column> -->
              <el-table-column prop="administrator" label="管理人" sortable="custom" align="center"
                               show-overflow-tooltip
                               v-if="colData[4].istrue"/>
              <!-- <el-table-column prop="calibrationCycle" label="溯源周期(月)" sortable="custom" align="center"
                               show-overflow-tooltip
                               v-if="colData[8].istrue"/>
              <el-table-column prop="lastCalibrationDate" label="上次检定校准日期" sortable="custom" align="center"
                               show-overflow-tooltip
                               v-if="colData[9].istrue"/>
              <el-table-column prop="loseCalibrationDate" label="检定校准失效日期" sortable="custom" align="center"
                               show-overflow-tooltip
                               v-if="colData[10].istrue"/>-->
              <el-table-column prop="status" label="设备状态" sortable="custom" show-overflow-tooltip align="center"
                               v-if="colData[5].istrue">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 1">正常</span>
                  <span v-if="scope.row.status === 2">停用</span>
                  <span v-if="scope.row.status === 3">维修</span>
                  <span v-if="scope.row.status === 4">保养</span>
                  <span v-if="scope.row.status === 5">报废</span>
                  <span v-if="scope.row.status === 6">封存</span>
                  <span v-if="scope.row.status === 7">核查</span>
                  <span v-if="scope.row.status === 8">故障</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="操作" align="center" width="120" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="e_look(scope.row)">查看</el-button>
                  <el-button size="mini" type="text" @click="e_edit(scope.row)">修改</el-button>
                  <el-button type="text" size="mini"
                             v-show="(!actionInfo.disabled ||actionInfo.disabled == '') ? true : checkActionButton(actionInfo.disabled, scope)"
                             v-for="(actionInfo, actionIndex) in projectSlotButtonList.actionButtons" :key="actionIndex"
                             @click="e_actionButtonEvents(actionInfo, scope)">{{ actionInfo.label }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
                v-show="total > 0"
                :total="total"
                :page-sizes="pageSizes"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <!--新增/修改/查看-->
    <createBook v-if="showbook" ref="book" @close="showbook = false"></createBook>
    <!--调整分类-->
    <el-dialog
        class="elDialog"
        center
        width="25%"
        :visible.sync="showClass"
        append-to-body
        title="设备分类"
        style="height: 70%"
    >
      <div class="cont">
        <el-tree
            ref="tree"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :data="treedata"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="adjustSubmit">确定</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
    <!--	  printTag-->
    <printTag v-if="printTag" :printTagShow="printTag" @cancel="printTag = false" @printCallBack="e_printCallBack"
              :datas="multipleSelection"></printTag>
    <!--        导入-->
    <UpLoad
        ref="UpLoad"
        @close="showUpLoad = false"
        @reload="handleUpLoad"
        @downloadTemplate="downloadTemplate"
    />
    <!--    // 设备排期甘特图-->
    <ganttChart
        ref="gant"
        @close="showGant = false"
    />
  </div>
</template>

<script>
import catalogueTree from '../components/catalogueTree'
import createBook from './dialog/createBook'
import {treeselect} from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import printTag from './dialog/printTag'
import ganttChart from "../../../components/standingBook/ganttChart";
import UpLoad from '@/components/FileUpload/upLoad'
import {
  getBookList,
  getEquipmentdetail,
  adjustTreeclass,
  deleteEquipment,
  exportEquipment
} from '@/api/resources/deviceManagement/index.js'
import Vue from 'vue'

export default {
  name: 'index',
  components: {catalogueTree, createBook, Treeselect, printTag, UpLoad, ganttChart},
  data() {
    return {
      showGant: false,
      showSearch: true,
      showUpload: false,
      pageSizes: [20, 30, 50, 100],
      queryParams: {
        pageNum: 1,
        pageSize: 50,
        orderByColumn: '',
        orderByType: '',
        equipmentName: '',
        equipmentNumber: '',
        userDepartment: null,
        position: '',
        status: null,
        treeId: null
      },
      total: 0,
      fullscreen: false,
      addmultiple: true,
      addmultiple1: true,
      tableData: [],
      colData: [
        {title: '设备编号', istrue: true},
        {title: '设备名称', istrue: true},
        {title: '规格型号', istrue: true},
        // { title: '计量单位', istrue: true },
        {title: '制造厂商', istrue: true},
        // { title: '使用部门', istrue: true },
        // { title: '存放地点', istrue: true },
        {title: '管理人', istrue: true},
        // { title: '校准检定周期（月）', istrue: true },
        // { title: '上次检定校准日期', istrue: true },
        // { title: '检定校准失效日期', istrue: true },
        {title: '设备状态', istrue: true}
      ],
      ids: [],
      showbook: false,
      type: 'add',
      // 部门树选项
      deptOptions: [],
      treeList: [],
      showClass: false,
      defaultProps: {
        children: 'childList',
        label: 'nodeName'
      },
      treedata: [],
      adjustId: null,
      multipleSelection: [],
      printTag: false,
      microProjectEntry: {},
      projectSlotButtonList: {},
    }
  },
  mounted() {
    this.getTreeselect()
    this.getList()
  },
  async created() {
    await this.doLoadMicroApp('microProject', this.microProjectEntry)
    Vue.component('ganttChart', window.commonComponents.ganttChart)
    this.projectSlotButtonList = await this.getProjectSlotButtons('standingBookButton')

  },
  methods: {
    handleExport() {
      // const baseURL = window.globalEnv.VUE_APP_BASE_API
      let params = {
        ...this.queryParams,
        selectedIdList: this.ids.join(',')
      }
      exportEquipment(params).then(res => {
        if (res.code === 200) {
          this.mbu_download(res.msg)
        }
      })
    },
    // 导入
    handleImport() {
      let url = window.globalEnv.VUE_APP_BASE_API + '/equipmentInstrument/importData'
      this.$nextTick(() => {
        this.showUpload = true
        this.$refs.UpLoad.init(url, this.queryParams.treeId)
      })
    },
    // 导入回调
    handleUpLoad() {
      this.showUpload = false
      this.getList()
    },
    // 下载模板
    downloadTemplate() {
      const link = document.createElement('a')
      this.$net('/equipmentInstrument/exportTemplate', 'getFile').then(res => {
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'});  // res就是接口返回的文件流了
        let objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl
        link.download = '设备台账导入模板.xls' // 自定义文件名
        link.click() // 下载文件
        URL.revokeObjectURL(objectUrl); // 释放内存
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.treeId = null
      this.addmultiple1 = true
      this.$refs.chilstree.isdisable = true
      this.$refs.chilstree.adddisable = true
      this.resetForm('queryParams')
      this.handleQuery()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data
      })
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
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.ids = val.map(item => item.id)
    },
    // 获取书列表
    getTreedata(data) {
      this.treeList = data
    },
    // 获取点击后的树列表
    handleData(data) {
      // this.radio = ''
      // this.$refs.selectTable.setCurrentRow(row);
      // this.trssdata = data
      this.addmultiple = false
      this.addmultiple1 = false
      // this.ismultiple = true
      this.queryParams.treeId = data.id
      this.getList()
    },
    // 获取列表
    getList() {
      getBookList(this.queryParams).then(res => {
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
    // 新增
    handleAdd() {
      this.showbook = true
      this.$nextTick(() => {
        this.$refs.book.init('add')
        this.$refs.book.treedata(this.treeList, this.queryParams.treeId)
      })
    },
    // 查看
    e_look(row) {
      this.showbook = true
      this.getlistDetail(row.id, 'show')
    },
    // 修改
    e_edit(row) {
      this.showbook = true
      this.getlistDetail(row.id, 'update')
    },
    // 设备排期
    e_gant(row) {
      this.showGant = true
      this.$nextTick(() => {
        this.$refs.gant.init(row)
      })
    },
    // 获取详情
    getlistDetail(id, type) {
      getEquipmentdetail(id).then(res => {
        this.$nextTick(() => {
          this.$refs.book.init(type, res.data)
          this.$refs.book.treedata(this.treeList, this.queryParams.treeId)
        })
      })
    },
    // 删除
    handleDel() {
      const idList = JSON.parse(JSON.stringify(this.ids))
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteEquipment({equipmentIds: idList}).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.info(res.msg)
          }
        })
      })
    },
    /***调整分类***/
    handlEadjust() {
      this.showClass = true
      this.treedata = this.treeList
    },
    handleNodeClick(data, node, v) {
      this.adjustId = data.id
    },
    adjustSubmit() {
      const param = {
        treeId: this.adjustId,
        equipmentIds: this.ids
      }
      adjustTreeclass(param).then(res => {
        if (res.code === 200) {
          this.$message.success('调整成功')
          this.getList()
          this.close()
        }
      })
    },
    e_actionButtonEvents(v, scope) {
      var that = this
      new Function('that', 'scope', v.clickEvents)(that, scope)
    },
    checkActionButton(events, scope) {
      return eval(events)
    },
    close() {
      this.showClass = false
    },
    handlePrint() {
      POBrowser.openWindowModeless(
          window.globalEnv.VUE_APP_BASE_API +
          '/equipment/pageOffice/printEquipment?ids=' + this.ids.join(','),
          'width=1440px;height=860px'
      )
    },
    handlePrintTag() {
      this.printTag = true
    },
    async e_printCallBack(ids) {
      // this.printTagOpen = false;
      // // 打印后更改状态
      // let changeRes = await this.$net(
      //   "/qualctrl/changePrintStatus",
      //   "put",
      //   ids
      // );
      // if (changeRes.code == 200) {
      //   this.e_getList();
      // }
    }
  }
}
</script>

<style scoped lang="less">
.searchbox {
  margin: 10px 0;
}

aside {
  padding: 0;
}

.ant-layout {
  background: #ffffff;
  height: 100%;
}

/deep/ .el-dialog--center {
  text-align: left !important;
}
</style>
