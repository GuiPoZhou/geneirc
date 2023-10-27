<template>
    <el-dialog
        :visible.sync="addShow"
            title="选择设备"
            @close="e_close"
            :before-close="e_close" width="60%" center
            append-to-body
            :close-on-click-modal="false"
    >
        <div style="display: flex; align-content: center">
            <div style="width: 200px">
                <el-card class="box-card">
                    <el-tree
                        key="trees1"
                        ref="tree"
                        default-expand-all
                        :data="treeData"
                        :node-key="nodeKey"
                        show-checkbox
                        @check="handleCheck"
                        :props="defaultProps"
                        :default-checked-keys="checkList"
                    ></el-tree>
                </el-card>
            </div>
            <div style="margin-left: 10px;flex: 2;">
                <el-form ref="queryForm" class="forms" :model="queryParams" @submit.native.prevent :inline="true" label-width="80px">
                    <!-- 搜索栏 -->
                    <el-form-item label="设备名称">
                        <el-input
                            v-model="queryParams.equipmentName"
                            clearable
                            size="small"
                            placeholder="请输入设备名称">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="设备编号">
                        <el-input
                            v-model="queryParams.equipmentNumber"
                            clearable
                            size="small"
                            placeholder="请输入设备编号">
                        </el-input>
                    </el-form-item>
                    <el-form-item style="margin-left: 10px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="dataList" ref="multipleTable" border style="margin-top: 10px" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" label="序号" align="center"></el-table-column>
                    <el-table-column prop="equipmentTypeName" label="设备分类" align="center"/>
                    <el-table-column prop="equipmentNumber" label="设备编号" align="center"/>
                    <el-table-column prop="equipmentName" label="设备名称" align="center"/>
                    <el-table-column prop="equipmentModel" label="设备型号" align="center"/>
                </el-table>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="handleClick">确认</el-button>
            <el-button size="small" @click="e_close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data () {
        return {
            addShow: false,
            treeData: [],
            nodeKey: 'id', // 标识节点的字段名
            defaultProps: {
                children: 'childList',
                label: "nodeName",
                checked: 'checked'
            },
            dataList: [],
            queryParams: {
                equipmentName: '',
                equipmentNumber: '',
                treeIdList: []
            },
            rowList: [],
            choiceDataList: [],
            checkList: []
        }
    },
    methods: {
        init (data) {
          this.addShow = true
            this.choiceDataList = data
            this.queryParams.treeIdList = this.choiceDataList.map(item => {
                return item.treeId
            })
            this.checkList = this.queryParams.treeIdList
            this.getTreeList()
            this.getList()
        },
        // 获取树列表
        getTreeList () {
          this.$net('/equipmentTree/selectTree', 'get').then(res => {
              this.treeData = res.data
          })
        },
        getList () {
          this.$net('/equipmentInstrument/queryEquipmentList', 'post', this.queryParams).then(res => {
              this.dataList = res.data
              if (this.queryParams.treeIdList.length !== 0) {
                  if (this.choiceDataList.length !== 0) {
                      this.choiceDataList.map(item => {
                          this.dataList.map(items => {
                              if (item.id == items.id) {
                                  this.$nextTick(() => {
                                    this.$refs.multipleTable.toggleRowSelection(items, true)
                                  })
                              }
                          })
                      })
                  } else {
                      this.$nextTick(() => {
                          this.dataList.map(item => {
                              this.$refs.multipleTable.toggleRowSelection(item, true)
                          })
                      })
                  }
              }
          })
        },
        handleCheck(data, checkedNodes) {
            // 处理选中节点的逻辑
            this.choiceDataList = []
            this.queryParams.treeIdList = checkedNodes.checkedKeys
            this.getList()
        },
        handleSelectionChange (val) {
          this.rowList = val
          var list = this.rowList.map(item => {
                return item.treeId
            })
            this.checkList = [...new Set(list)];
            this.queryParams.treeIdList = this.checkList
            this.$refs.tree.setCheckedKeys(this.queryParams.treeIdList);
        },
        handleClick () {
            console.log(this.rowList)
            this.$emit('tableList', this.rowList)
            this.e_close()
        },
        e_close () {
            this.$emit('close')
        }
    }
}
</script>

<style scoped>
.forms .el-form-item {
    width: auto;
    margin-right: 0;
    margin-bottom: 5px;
}
</style>