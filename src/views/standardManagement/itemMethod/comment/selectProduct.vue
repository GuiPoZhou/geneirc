<template>
    <el-dialog
        :visible.sync="addShow"
        title="选择产品"
        @close="e_close"
        :before-close="e_close" width="60%" center
        append-to-body
        :close-on-click-modal="false"
    >
        <div style="display: flex; align-content: center">
            <div style="width: 200px">
                <el-card class="box-card">
                    <el-tree
                        key="trees"
                        ref="trees"
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
                    <el-form-item label="产品名称">
                        <el-input
                            v-model="queryParams.productionName"
                            clearable
                            size="small"
                            placeholder="请输入设备名称">
                        </el-input>
                    </el-form-item>
                    <el-form-item style="margin-left: 10px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-table key="aaaaa" :data="dataList" ref="multipleTables" border style="margin-top: 10px" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" label="序号" align="center"></el-table-column>
                    <el-table-column prop="productionName" label="产品名称" align="center"/>
                    <el-table-column prop="hardwareVersion" label="硬件版本" align="center"/>
                    <el-table-column prop="softwareVersion" label="软件版本" align="center"/>
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
                productionName: '',
                productionTypeIdStr: ''
            },
            rowList: [],
            choiceDataList: [],
            checkList: [],
            treeIdList: []
        }
    },
    methods: {
        init (data) {
            this.addShow = true
            this.choiceDataList =data
            this.treeIdList = this.choiceDataList.map(item => {
                return item.productionTypeId
            })
            this.checkList = this.treeIdList
            console.log( this.checkList)
            this.queryParams.productionTypeIdStr = this.treeIdList.join(',')
            this.getTreeList()
            this.getList()
        },
        // 获取树列表
        getTreeList () {
            this.$net('/productionTypeTree/selectTree', 'get').then(res => {
                this.treeData = res.data
            })
        },
        getList () {
            this.$net('/productionManage/selectProductionList', 'get', this.queryParams).then(res => {
                this.dataList = res.data
                if (this.treeIdList.length !== 0) {
                    if (this.choiceDataList.length !== 0) {
                        console.log(1)
                        this.choiceDataList.map(item => {
                            this.dataList.map(items => {
                                if (item.id == items.id) {
                                    this.$nextTick(() => {
                                        this.$refs.multipleTables.toggleRowSelection(items, true)
                                    })
                                }
                            })
                        })
                    } else {
                        this.$nextTick(() => {
                            this.dataList.map(item => {
                                this.$refs.multipleTables.toggleRowSelection(item, true)
                            })
                        })
                    }
                }
            })
        },
        handleCheck(data, checkedNodes) {
            // 处理选中节点的逻辑
            this.choiceDataList = []
            this.treeIdList = checkedNodes.checkedKeys
            this.queryParams.productionTypeIdStr = this.treeIdList.join(',')
            this.getList()
        },
        handleSelectionChange (val) {
            this.rowList = val
            var list = this.rowList.map(item => {
                return item.productionTypeId
            })
            this.checkList = [...new Set(list)];
            this.treeIdList = this.checkList
            this.$refs.trees.setCheckedKeys(this.treeIdList);
            this.queryParams.productionTypeIdStr = this.treeIdList.join(',')
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