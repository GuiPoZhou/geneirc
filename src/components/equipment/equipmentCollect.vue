<template>
  <el-dialog :title="title" :visible.sync="equipmentCollectShow" append-to-body width="800px" @open="open"
             center :show-close="true" :close-on-press-escape="false" :close-on-click-modal="false"
             :before-close="close">
    <el-form ref="queryForm" :model="queryParams" @submit.native.prevent :inline="true">
      <!-- 搜索栏 -->
      <el-form-item label="设备分类">
        <el-cascader
          v-model="treeId"
          @clear="handleQuery"
          clearable
          size="small"
          :options="equipmentTypeOption"
          :props="cascaderProps"
          filterable
          @visible-change="handleQuery"
          @change="setTreeId"
          clearable></el-cascader>
      </el-form-item>
      <el-form-item label="设备编号" prop="equipmentNumber">
        <el-input @keyup.enter.native="handleQuery" @clear="handleQuery" v-model="queryParams.equipmentNumber"
                  clearable size="small"
                  placeholder="请输入设备编号"></el-input>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div>
      <el-table v-loading="loading" :data="tableData" ref="multipleTable">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="62px">
          <template slot-scope="scope">
            <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="equipmentNumber" label="设备编号" align="center"/>
        <el-table-column prop="equipmentName" label="设备名称" align="center"/>
        <el-table-column prop="equipmentModel" label="设备型号" align="center"/>
        <el-table-column prop="treeNodeName" label="设备分类" align="center"/>
        <el-table-column prop="createTime" label="领用时间" align="center" v-if="showCollect"/>
      </el-table>
      <pagination v-show="total>0" v-if="distinguishCode == 'collect'" :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize" @pagination="getReceivelist"/>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="commit">确认</el-button>
      <el-button @click="close">取消</el-button>
    </div>

  </el-dialog>
</template>
<script>
  import {
    receiveEquipmentList,
    receiveEquipmentListSave,
    returnEquipmentList,
    returnEquipmentListSave
  } from '@/api/equipment/equipment'
  import {getDicts} from '@/api/system/dict/data'

  export default {

    data() {
      return {
        // 查询参数
        queryParams: {
          equipmentNumber: null,
          treeId: '',
          pageSize: 10,
          pageNum: 1

        },
        loading: false,
        treeId: [],
        tableData: [],
        total: 0,
        cascaderProps: {
          checkStrictly: true,
          value: 'id',
          children: 'childList',
          label: 'nodeName',
          expandTrigger: 'hover'
        },
        //设备类型
        equipmentTypeOption: []
      }
    },
    components: {},
    props: {
      equipmentCollectShow: {
        type: Boolean,
        default: false
      },
      //识别码 collect  return
      distinguishCode: {
        type: String,
        default: false
      },
      showCollect: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      open() {
        this.getEquipmentTypeList()
        if (this.distinguishCode == 'collect') {
          this.getReceivelist()
        } else {
          this.getReturnlist()
        }
      },
      setTreeId(e) {
        this.queryParams.treeId = e[0]
      },
      //初始化设备分类的字典值
      async getEquipmentTypeList() {
        let getData = await this.$net('/equipmentTree/selectTree', 'get')
        if (getData.code == 200) {
          this.equipmentTypeOption = getData.data
        }
      },
      /** input框搜索操作 */
      handleQuery() {
        if (this.distinguishCode == 'collect') {
          this.getReceivelist()
        } else {
          this.getReturnlist()
        }
      },
      //获取可领用设备列表
      getReceivelist() {
        this.loading = true
        console.log('获取可领用设备列表=>', this.queryParams)
        receiveEquipmentList(this.queryParams).then(response => {
            this.tableData = response.data.list
            this.total = response.data.total
            this.loading = false
          }
        )
      },
      //获取可归还设备列表
      getReturnlist() {
        this.loading = true
        console.log('获取可归还设备列表=>', this.queryParams)
        returnEquipmentList(this.queryParams).then(response => {
            this.tableData = response.data.list
            this.total = response.data.total
            this.loading = false
          }
        )
      },
      //取消按钮操作
      close() {
        this.$emit('update:equipmentCollectShow', false)
        this.queryParams = {
          equipmentNumber: null,
          treeId: '',
          pageSize: 10,
          pageNum: 1

        }
      },
      //确认按钮操作
      commit() {
        let equipmentId = this.$refs.multipleTable.selection.map(item => item.id)
        if (equipmentId.length == 0) {
          this.$message.error('请至少选择一台设备')
          return false
        }
        this.loading = true
        if (this.distinguishCode == 'collect') {
          console.log('设备领用确认按钮传递的id数据=>', equipmentId)
          receiveEquipmentListSave(equipmentId).then(response => {
              this.loading = false
              this.close()
              this.$parent.initList()
            }
          )
        } else {
          returnEquipmentListSave(equipmentId).then(response => {
              this.loading = false
              this.close()
              this.$parent.initList()
            }
          )
        }
      }
    },

    watch: {
      'queryParams.equipmentClass'(val) {
        this.handleQuery()
      }
    },

    computed: {
      title() {
        switch (this.distinguishCode) {
          case 'collect':
            return '设备领用'
            break
          case 'return':
            return '设备归还'
            break
        }
      }
    },
    created() {

    }
  }
</script>
