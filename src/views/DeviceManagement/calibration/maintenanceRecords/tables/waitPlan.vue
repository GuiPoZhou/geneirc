<template>
  <div style="height: 85vh">
    <!-- 统一样式 - 查询区域 -->
    <div class="a-c-top" v-show="showSearch">
      <!-- 表单 -->
      <el-form :inline="true" :model="queryParams" ref="queryParams" class="demo-form-inline" v-show="showSearch"
        label-width="100px">
        <el-form-item label="设备编号" prop="equipmentNumber">
          <el-input v-model="queryParams.equipmentNumber" placeholder="请输入设备编号" clearable class="input-with-select"
            style="width: 250px" @clear="handleQuery" />
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="queryParams.equipmentName" placeholder="请输入设备名称" clearable class="input-with-select"
            style="width: 250px" @clear="handleQuery" />
        </el-form-item>
        <el-form-item label="使用部门" prop="userDepartment">
          <treeselect style="width: 250px" v-model="queryParams.userDepartment" :options="deptOptions" :show-count="true"
            placeholder="请选择部门" />
        </el-form-item>
        <el-form-item label="存放地点" prop="position">
          <el-input v-model="queryParams.position" placeholder="请输入存放地点" clearable class="input-with-select"
            style="width: 250px" @clear="handleQuery" />
        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 250px">
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
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="a-c-bottom">
      <el-row :gutter="10">
        <el-col :span="4" :xs="24">
          <!--分类-->
          <catalogueTree @getTreedata="getTreedata" @handleData="handleData"></catalogueTree>
        </el-col>
        <el-col :span="20" :xs="24">
          <div :class="fullscreen == true ? 'showFullScreen' : ''" style="padding-bottom:4px; padding-right: 5px">
            <el-row :gutter="10" class="searchbox">
              <!--            <span style="font-size: 14px; font-weight: bold;color: #333;padding-top: 5px;line-height: 30px">设备基本信息</span>-->
              <right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" @fullScreen="e_fullScreen"
                @changeBox="e_changeBox" :boxData="colData"></right-toolbar>
            </el-row>
            <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange"
              @sort-change="sortChange">
              <el-table-column type="selection" width="55" fixed />
              <el-table-column label="序号" align="center" type="index" width="50" fixed />
              <el-table-column prop="equipmentNumber" label="设备编号" sortable="custom" show-overflow-tooltip width="100"
                fixed align="center" v-if="colData[0].istrue" />
              <el-table-column prop="equipmentName" label="设备名称" sortable="custom" show-overflow-tooltip width="100"
                align="center" v-if="colData[1].istrue" />
              <el-table-column prop="equipmentModel" label="规格型号" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[2].istrue" />
              <el-table-column prop="factoryNumber" label="出厂编号" sortable="custom" show-overflow-tooltip align="center"
                />
              <el-table-column prop="traceCompany" :label="deviceK18Info.code == 500 ? '计划溯源单位' : deviceK18Info.traceCompany" sortable="custom" show-overflow-tooltip align="center"
                />
              <el-table-column prop="userDepartmentName" label="使用部门" sortable="custom" show-overflow-tooltip
                align="center" v-if="colData[3].istrue" />
              <el-table-column prop="position" label="存放地点" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[4].istrue" />
              <el-table-column prop="administrator" label="保管人" sortabl e="custom" show-overflow-tooltip align="center"
                v-if="colData[5].istrue">
              </el-table-column>
              <el-table-column prop="calibrationCycle" label="溯源周期（月）" sortable="custom" show-overflow-tooltip
                align="center" v-if="colData[6].istrue">
              </el-table-column>
              <el-table-column prop="loseCalibrationDate" label="检定校准失效日期" sortable="custom" show-overflow-tooltip
                align="center" v-if="colData[7].istrue" />
              <el-table-column prop="planDate" label="计划实施日期" sortable="custom" show-overflow-tooltip align="center"
                v-if="colData[8].istrue" />
              <el-table-column prop="status" label="设备状态" sortable="custom" show-overflow-tooltip align="center"
                               v-if="colData[9].istrue">
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
              <el-table-column prop="name" label="操作" align="center" width="80" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="e_implement(scope.row)" style="color: #409EFF">执行</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize" @pagination="getList" />
          </div>
        </el-col>
      </el-row>
      <!--分类-->
    </div>
  </div>
</template>

<script>
import catalogueTree from '@/views/DeviceManagement/components/catalogueTree'
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getCalibrationRecordList } from '@/api/resources/deviceManagement/index.js'
import { eventBus } from '@/main.js'
export default {
  name: "index",
  components: { catalogueTree, Treeselect },
  data() {
    return {
      showSearch: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
      treeList: [],
      fullscreen: false,
      multiple: false,
      tableData: [],
      colData: [
        { title: "设备编号", istrue: true },
        { title: "设备名称", istrue: true },
        { title: "规格型号", istrue: true },
        { title: "使用部门", istrue: true },
        { title: "存放地点", istrue: true },
        { title: "保管人", istrue: true },
        { title: "溯源周期（月）", istrue: true },
        { title: "检定校准失效日期", istrue: true },
        { title: "计划实施日期", istrue: true },
        { title: "设备状态", istrue: true },
      ],
      ids: [],
      showstatus: false,
      showhistory: false,
      // 部门树选项
      deptOptions: [],

    }
  },
  props:{
    deviceK18Info:Object
  },
  mounted() {
    this.getTreeselect()
    this.getList()
  },
  created() {
    this.$EventBus.$on('getList', (message) => {
      this.getList()
    })

  },
  methods: {
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.treeId = null
      this.resetForm("queryParams");
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = val.map(item => item.id);
    },
    // 获取书列表
    getTreedata(data) {
      this.treeList = data
    },
    // 获取点击后的树列表
    handleData(data) {
      this.queryParams.treeId = data.id
      this.getList()
    },
    // 获取列表
    getList() {
      getCalibrationRecordList(this.queryParams).then(res => {
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
    // 修改
    e_implement(row) {
      this.$emit('implement', row)
    },
  }
}
</script>

<style scoped>
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
