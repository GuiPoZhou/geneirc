<template>
    <el-dialog title="选择计量单位" :visible.sync="showUnit" center :before-close="close" :close-on-press-escape="false"
               :close-on-click-modal="false" width="40%">
        <el-form :inline="true" :model="staffTemp" class="forms" label-width="80px">
            <el-form-item label="单位名称" prop="unitName">
                <el-input v-model="staffTemp.unitName" placeholder="请输入单位名称" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 10px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border stripe>
            <el-table-column type="index" prop="id" align="center" label="序号" width="55px"/>
            <el-table-column prop="unitName" label="单位名称" key="unitName" :show-overflow-tooltip="true" align="center"/>
            <el-table-column prop="unitAlias" label="单位别称" key="unitAlias" align="center"/>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="e_select(scope.row)">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="staffTemp.startPage"
            :limit.sync="staffTemp.pageSize"
            @pagination="getList"
        />
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" size="small">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data () {
        return {
            showUnit: false,
            staffTemp: {
                startPage: 1,
                pageSize: 10,
                unitName: '',
                status: false
            },
            tableData: [],
            total: 0,
            unitName: ''
        }
    },
    methods: {
        init (name) {
            this.showUnit = true
            this.unitName = name
            this.getList()
        },
        getList () {
            this.$net('/standard/v1/measuringUnits', 'get',this.staffTemp).then(res => {
                this.tableData = res.data.list
                this.total = res.data.total
                if (this.unitName !== '') {
                    this.tableData.map((item, index) => {
                        if (item.unitName == this.unitName) {
                            this.tableData.splice(index, 1)
                        }
                    })
                }
            })
        },
        e_select (row) {
            this.$emit('selectUnit', row)
            this.close()
        },
        close () {
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