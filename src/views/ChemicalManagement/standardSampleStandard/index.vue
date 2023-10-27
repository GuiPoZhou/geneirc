<template>
<div>
    <BoContainer pageTitle="" :total="total" ref="BoContainer" @changePage="changePage">
        <template slot="boMain">
            <BoMain>
                <template slot="bosearch">
                    <el-form ref="queryParams" :model="queryParams" :inline="true" label-width="100px">
                        <el-form-item label="标样类别" prop="sampleCategory">
                            <el-input v-model="queryParams.sampleCategory" placeholder="请输入标样类别" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="标样名称" prop="sampleClass">
                            <el-input v-model="queryParams.sampleClass" placeholder="请输入标样名称" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="样品名称" prop="sample">
                            <el-select v-model="sample" size="small" @change="handleSample" multiple filterable>
                                <el-option v-for="(item,index) in MaterialNameList" :key="index" :label="item.dictLabel" :value="item.dictCode"/></el-select>
                        </el-form-item>
                        <el-form-item label="标样编号" prop="sampleCode">
                            <el-input v-model="queryParams.sampleCode" placeholder="请输入标样编号" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="检测项目" prop="itemName">
                            <el-input v-model="queryParams.itemName" placeholder="请输入检测项目" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="委托类型：" prop="entrustType">
                            <el-select v-model="queryParams.entrustType" size="small" @change="handleEntrust">
                                <el-option v-for="(item,index) in EntrustTypeList" :key="index" :label="item.dictLabel" :value="item.dictCode"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态：" prop="status">
                            <el-select v-model="queryParams.status" size="small">
                                <el-option label="启用" :value="0"/>
                                <el-option label="停用" :value="1"/>
                            </el-select>
                        </el-form-item>
                        <div class="a-c-t-btnarea">
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索
                                </el-button>
                                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </template>
                <template slot="tableArea">
                    <el-row :gutter="10" class="mb8">
                        <el-col :span="1.5">
                            <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
                        </el-col>
                    </el-row>
                    <el-table
                        :data="tableData"
                        :height="mainTableHeight+60"
                        border
                        @selection-change="handleSelectionChange"
                        style="width: 100%">
                        <el-table-column type="selection" width="55" />
                        <el-table-column type="index" label="序号" width="55px" align="center"/>
                        <el-table-column show-overflow-tooltip prop="sampleCategory" label="标样类别" align="center" />
                        <el-table-column show-overflow-tooltip prop="sampleClass" label="标样名称" align="center" />
                        <el-table-column show-overflow-tooltip prop="detectTypeName" label="检测类别" align="center" />
                        <el-table-column show-overflow-tooltip prop="entrustTypeName" label="委托类型" align="center" />
                        <el-table-column show-overflow-tooltip prop="sampleName" label="样品名称" align="center" />
                        <el-table-column show-overflow-tooltip prop="sampleCode" label="标样编号" align="center" />
                        <el-table-column show-overflow-tooltip prop="itemName" label="检测项目" align="center" />
                        <el-table-column label="状态" align="center" key="status">
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.status"
                                    active-value="0"
                                    inactive-value="1"
                                    @change="handleStatusChange(scope.row)"
                                ></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="e_detail(scope.row, 'detail')">查看</el-button>
                                <el-button type="text" size="small" @click="e_detail(scope.row, 'edit')">修改</el-button>
                                <el-button type="text" size="small" @click="e_del(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </BoMain>
        </template>
    </BoContainer>
    <createStandsample v-if="showStandard" ref="standardRef" @close="showStandard = false"></createStandsample>
</div>
</template>

<script>
import createStandsample from './dialog/createStandsample.vue'
import axios from 'axios'
import {getToken} from "@/utils/auth";
export default {
    name: "index",
    components: {createStandsample},
    data () {
        return {
            total: 0,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                sampleCategory: '',
                sampleClass: '',
                sampleName: '',
                sampleCode: '',
                itemName: '',
                entrustType: '',
                entrustTypeName: '',
                sample: '',
                status: null
            },
            tableData: [],
            EntrustTypeList: [],
            MaterialNameList: [],
            sample: [],
            showStandard: false
        }
    },
    mounted() {
        this.getList();
        // 获取委托类型
        this.getDicts("Entrust_Type").then(response => {
            this.EntrustTypeList = response.data
        })
        // 获取样品名称
        this.getDicts("Material_Name").then(response => {
            this.MaterialNameList = response.data
        })
    },
    methods: {
        // 用户状态修改
        handleStatusChange(row) {
            console.log( process.env.VUE_APP_BASE_API)
            let text = row.status == "0" ? "启用" : "停用";
            this.$confirm('确认要' + text + '吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // axios.get(process.env.VUE_APP_BASE_API + `/material/v1/sample/standard/isOpen/${row.id}/${(row.status - 0)}`,
                //     { headers: { 'Authorization': getToken() } }).then(res => {
                //         if (res.code == 500) {
                //             this.statusChange(res.data.msg, row)
                //         } else {
                //             this.$message.success(res.data.msg)
                //         }
                // }).finally(() => {
                //     this.getList()
                // })
                this.$net(`/material/v1/sample/standard/isOpen/${row.id}/${(row.status - 0)}`, 'get').then(res => {
                    this.$message.success(res.msg)
                }).finally(() => {
                    this.getList()
                })
            }).catch(() => {
                row.status = row.status == "0" ? "1" : "0";
            });
        },
        statusChange (msg, row) {
            this.$confirm( msg + ',请确认冲突规则是否启用', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$net(`/material/v1/sample/standard/isOpen/${row.id}/2`, 'get').then(res => {
                    this.$message.success(res.msg)
                }).finally(() => {
                    this.getList()
                })
            }).catch(() => {
            });
        },
        handleEntrust (e) {
            var obj = {}
            obj = this.EntrustTypeList.find(function(item){
                return item.dictCode === e
            })
            this.queryParams.entrustTypeName = obj.dictLabel
        },
        handleSample (e) {
            var datas = []
            var datas1 = []
            this.MaterialNameList.map( (item) => {
                e.map(items => {
                    if (item.dictCode == items) {
                        datas.push(item.dictLabel)
                        datas1.push(item.dictCode)
                    }
                })
            })
            this.queryParams.sampleName =datas.join(',')
            this.queryParams.sample =datas1.join(',')
        },
        // 页码更改
        changePage(e) {
            this.queryParams.pageNum = e.page
            this.queryParams.pageSize = e.limit
            this.getList()
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.$refs.BoContainer.resetPage()
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.sample = []
            this.queryParams.entrustTypeName = ''
            this.queryParams.sampleName = ''
            this.resetForm("queryParams");
            this.handleQuery();
        },
        handleSelectionChange() {
        },
        getList() {
            this.$net('/material/v1/sample/standard/list', 'get', this.queryParams).then(res => {
                this.tableData = res.data.list
                this.tableData.map(item => {
                    item.status = item.status.toString()
                })
                this.total = res.data.total
            })
        },
        handleAdd() {
            this.showStandard = true
            this.$nextTick(() => {
                this.$refs.standardRef.init('add')
            })
        },
        e_detail(row, type) {
            this.$net(`/material/v1/sample/standard/byId`, 'get', {id: row.id}).then(res => {
                // const params = {
                //     ...row,
                //     list: res.data
                // }
                this.showStandard = true
                this.$nextTick(() => {
                    this.$refs.standardRef.init(type, res.data)
                })
            })
        },
        // 删除
        e_del(row) {
            this.$confirm('确认删除该条数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$net(`/material/v1/sample/standard/del/${row.id}`, 'get').then(res => {
                    this.$message.success(res.msg)
                    this.getList()
                })
            }).catch(() => {
            })
        }
    }
}
</script>

<style scoped>

</style>