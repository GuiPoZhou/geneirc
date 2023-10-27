<template>
  <div>
    <!-- 上部分表单 -->
    <div class="a-c-top" v-show="showSearch">
      <el-form :inline="true" ref="formsample" :model="queryParams" label-width="100px" class="demo-form-inline">
        <el-form-item label="耗材编号">
          <el-input v-model="queryParams.materialNumber" class="input-with-select" placeholder="请输入内容" clearable
                    @clear="searchPro" style="width: 240px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="耗材名称">
          <el-input v-model="queryParams.materialName" class="input-with-select" placeholder="请输入内容" clearable
                    @clear="searchPro" style="width: 240px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="可用状态">
          <el-select v-model="queryParams.status" clearable style="width: 240px" size="small">
            <el-option v-for="item in statuOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试剂级别">
          <el-select v-model="queryParams.grade" clearable style="width: 240px" size="small">
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.dictLabel"
                       :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产厂商">
          <el-input v-model="queryParams.manufacturer" class="input-with-select" style="width: 240px" size="small"
                    placeholder="请输入内容" clearable @clear="searchPro"></el-input>
        </el-form-item>
        <div class="a-c-t-btnarea">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchPro">查询
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
          <classification :type="type" :treeList="treeList" @updata="updata" @handleData="handleData"></classification>
        </el-col>
        <el-col :span="19" :xs="24" class="a-m-c-right">
          <!-- 中间按钮 -->
          <el-row :gutter="10" class="searchbox">
            <el-col :span="1.5">
              <el-button size="mini" type="primary" :disabled="queryParams.materialTreeId == ''"
                         @click="showdialog(0, 'add')">添加
              </el-button>
              <el-button size="mini" type="primary" :disabled="ids.length <= 0" @click="dialogShow = true">
                调整分类
              </el-button>

              <el-button size="mini" type="warning" @click="handleImport">
                导入
              </el-button>
              <el-button size="mini" type="warning" @click="exports">
                导出
              </el-button>
              <el-button size="mini" type="danger" :disabled="ids.length <= 0" @click="del">
                删除
              </el-button>
            </el-col>
            <el-col :span="1.5"></el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" @fullScreen="e_fullScreen"
                           @changeBox="e_changeBox" :boxData="colData" style="padding-right: 10px"></right-toolbar>
          </el-row>
          <!-- 底部表格 -->
          <el-table :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column sortable label="序号" align="center" type="index" width="50"/>
            <el-table-column sortable v-if="colData[0].istrue" prop="materialNumber" label="管理编号" align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column sortable v-if="colData[1].istrue" prop="materialName" label="名称" align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column sortable v-if="colData[2].istrue" prop="materialModel" label="规格型号" align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column sortable v-if="colData[3].istrue" prop="unit" label="计量单位" align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column sortable v-if="colData[4].istrue" prop="brand" label="品牌" align="center"
                             show-overflow-tooltip></el-table-column>
            <!-- <el-table-column sortable v-if="colData[5].istrue" prop="manufacturer" label="生产厂商"
                             align="center" show-overflow-tooltip></el-table-column> -->
            <!-- <el-table-column sortable v-if="colData[6].istrue" prop="grade" label="试剂级别"
                             align="center" show-overflow-tooltip></el-table-column> -->
            <el-table-column sortable v-if="colData[5].istrue" prop="storeCondition" label="储存条件" align="center"
                             show-overflow-tooltip></el-table-column>
            <!-- <el-table-column sortable v-if="colData[8].istrue" prop="safeStore" label="安全库存"
                             align="center" show-overflow-tooltip></el-table-column> -->
            <el-table-column sortable v-if="colData[6].istrue" prop="status" label="可用状态" align="center"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status === '0'">可用</span>
                <span v-if="scope.row.status === '1'">停用</span>
                <!--  <el-button v-if="scope.row.status === '0'" size="mini" type="text"-->
                <!--             @click="handleIndex(scope.row)">-->
                <!--      可用-->
                <!--  </el-button>-->
                <!--  <el-button v-if="scope.row.status === '1'" style="color: #f00;" size="mini" type="text"-->
                <!--             @click="handleIndex(scope.row)">-->
                <!--      停用-->
                <!--  </el-button>-->
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" align="center">
              <template slot-scope="scope">
                <el-button style="color: #409EFF" size="mini" type="text" @click="showdialog(scope.row.id, 'look')">
                  查看
                </el-button>
                <el-button size="mini" type="text" @click="showdialog(scope.row.id, 'edit')" style="color: #409EFF">
                  修改
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页子组件 -->
          <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                      :page-sizes="pageSizes"
                      :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </el-col>
      </el-row>
    </div>
    <addMatetial @handleOk="addOk" v-if="dialog" :showType="showType" @close="dialog = false"
                 :materialId="queryParams.materialTreeId" :detailId="detailId"></addMatetial>
    <upload :visible.sync="upload.open" :upload="upload" ref="upload" @importTemplate="importTemplate"
            @afterImport="getList" :showTips="false"/>

    <el-dialog class="elDialog" center width="30%" :visible.sync="dialogShow" :modal-append-to-body="false"
               :modal="false"
               :show-close="false">
      <div slot="title" class="dialog-title">
        <span class="topTilte">调整分类</span>
        <div class="topRight">
          <i class="el-icon-close rightIcon" @click="cancelbtn"></i>
        </div>
      </div>
      <el-tree ref="tree" :props="defaultProps" @node-click="handleNodeClick" :data="treeList" node-key="id"
               default-expand-all :filter-node-method="filterNode" :expand-on-click-node="false">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk">确定</el-button>
        <el-button @click="cancelbtn">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import addMatetial from './dialog/addMatetial.vue'
  import classification from './dialog/classification.vue'
  import upload from '@/components/common/upload'

  import {
    getMaterialTreelist,
    getMaterialList,
    getSelectMaterialList,
    delMaterial,
    getDataList,
    getStoreSiteList,
    exportMaterial,
    getImportTemplate,
    updateMaterialTree
  } from '@/api/chemical/essentialInformation.js'

  export default {
    data() {
      return {
        total: 0,
        treedata: [],
        defaultProps: {
          children: 'childList',
          label: 'name'
        },
        pageSizes: [20, 30, 50, 100],
        dialogShow: false,
        dialog: false,
        form: {},
        showType: '',
        queryParams: {
          pageNum: 1,
          pageSize: 50,
          materialName: '',
          materialNumber: '',
          materialTreeId: '',
          manufacturer: '',
          grade: '',
          status: ''
        },
        colData: [
          {title: '管理编号', istrue: true},
          {title: '名称', istrue: true},
          {title: '规格型号', istrue: true},
          {title: '计量单位', istrue: true},
          {title: '品牌', istrue: true},
          // {title: '生产厂商', istrue: true},
          // {title: '试剂级别', istrue: true},
          {title: '储存条件', istrue: true},
          // {title: '安全库存', istrue: true},
          {title: '可用状态', istrue: true}
        ],
        tableData: [],
        selectionList: [],
        dialogFull: false,
        treeList: [],
        count: 1,
        type: '0',
        trssdata: {},
        ids: [],
        gradeOptions: {},
        statuOptions: [{
          label: '可用',
          value: 0
        }, {
          label: '停用',
          value: 1
        }],
        storeConditionOptions: {},
        statusOptions: {},
        showSearch: true,
        detailId: 0,
        // 导入参数配置
        upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: '',
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 上传数据的地址
          url: window.globalEnv.VUE_APP_BASE_API + '/material/v1/base/importData'
        },
        threeId: 0
      }
    },
    mounted() {
      this.getList()
      this.getTreelist()
      getSelectMaterialList().then(res => {
      })
      this.getDataLists()
    },
    methods: {
      e_fullScreen() {
        this.fullscreen = !this.fullscreen
      },
      importTemplate() {
        getImportTemplate().then(res => {
          const a = document.createElement('a')
          const href = URL.createObjectURL(new Blob([res], {type: 'application/vnd.ms-excel'}))
          a.download = `耗材信息导入模板.xls`
          a.href = href
          a.click()
          URL.revokeObjectURL(href)
        })
      },
      addOk() {
        this.dialog = false
        this.getList()
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
        this.queryParams = {
          pageNum: 1,
          pageSize: 50,
          materialName: '',
          materialNumber: '',
          materialTreeId: '',
          manufacturer: '',
          grade: '',
          status: ''
        }
        this.getList()
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      getDataLists() {
        getDataList('material_grade').then(res => {
          this.gradeOptions = res.data
        })
      },
      //搜索
      searchPro() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      // 标准树查询
      getTreelist() {
        getMaterialTreelist().then(res => {
          this.treeList = res.data
        })
      },
      // 新增判定标准
      e_add() {
        this.showStand = true
        this.$nextTick(() => {
          this.$refs.standard.init(this.trssdata, 'add')
          this.$refs.standard.treedata(this.treeList)
        })
      },
      handleData(data, row) {
        this.queryParams.materialTreeId = data.id
        this.trssdata = data
        this.multiple = false
        this.ismultiple = true
        this.getList()
      },
      getList() {
        // this.queryParams.decideStandardTreeId = this.trssdata.id
        getMaterialList(this.queryParams).then(res => {
          console.log(111111)
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      updata() {
        this.getTreelist()
      },
      goSize() {

      },
      goPage() {

      },
      showdialog(id, type) {
        this.showType = type
        this.detailId = id
        this.dialog = true
      },
      hidedialog() {
        this.dialog = false
      },

      handleSelectionChange(selection) {
        this.selectionList = selection
        this.ids = selection.map(item => item.id)
      },
      del() {
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delMaterial(this.ids).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.queryParams.pageNum = 1
            this.getList()
          })
        }).catch(() => {
        })
      },
      async exports() {
        let params = {
          ...this.queryParams,
          idList: this.ids.join(',')
        }
        let getData = await this.$net('/material/v1/base/export', 'get', params)
        if (getData.code == 200) {
          this.mbu_download(getData.msg)
        }
      },
      handleImport() {
        this.upload.title = '耗材信息导入'
        this.upload.open = true
      },
      handleOk() {
        if (this.threeId == 0) {
          this.$message.error('请选择分类')
          return false
        }
        updateMaterialTree({materialIds: this.ids, materialTreeId: this.threeId}).then(res => {
          this.$message.success(res.msg)
          this.cancelbtn()
          this.queryParams.pageNum = 1
          this.getList()
        })
      },
      cancelbtn() {
        this.dialogShow = false
      },
      handleNodeClick(data, node, v) {
        this.threeId = data.id
      },
      filterNode(value, data) {
        if (!value) return true
        // return data.label.indexOf(value) !== -1;
      }
    },
    components: {
      classification, addMatetial, upload
    }
  }
</script>
<style scoped lang="less">
  .wid {
    width: 60%;
  }

  .diafot {
    position: absolute;
    bottom: 18px;
    left: 40%;
  }

  .el-select.el-select--medium {
    width: 100%;
  }

  .searchbox {
    margin: 10px 0;
  }
</style>
