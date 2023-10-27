<template>
    <div>
        <div class="a-c-top" v-show="showSearch" style="margin-top: 0">
            <el-form ref="formsample2" :model="queryParams" label-width="100px" class="demo-form-inline" :inline="true">
                <el-form-item label="采购单号">
                    <el-input v-model="queryParams.orderNo" class="input-with-select" placeholder="请输入内容" clearable
                        @clear="searchPro" style="width: 240px" size="small"></el-input>
                </el-form-item>
                <el-form-item label="入库日期">
                    <el-date-picker v-model="storeInDate" style="width: 260px" size="small" value-format="yyyy-MM-dd"
                        @change="storeInDateChange" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="供应商名称">
                    <el-select v-model="queryParams.supplierName" placeholder="请选择供应商" style="width: 240px" size="small"
                        @change="searchPro" clearable>
                        <el-option :value="item.supplierName" :label="item.supplierName"
                            v-for="(item, index) in supplierList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="耗材编号">
                    <el-input v-model="queryParams.materialNumber" class="input-with-select" style="width: 240px"
                        size="small" placeholder="请输入内容" clearable @clear="searchPro"></el-input>
                </el-form-item>
                <el-form-item label="耗材名称">
                    <el-input v-model="queryParams.materialName" class="input-with-select" style="width: 240px" size="small"
                        placeholder="请输入内容" clearable @clear="searchPro"></el-input>
                </el-form-item>
                <div class="a-c-t-btnarea">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchPro">
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
                    <el-button size="mini" type="primary" @click="addStorehouse()">添加
                    </el-button>
                </el-col>
<!--                <el-col :span="1.5">-->
<!--                    <el-button size="mini" type="primary" @click="printLabel()" :disabled="selectionData.length <= 0">-->
<!--                        打印-->
<!--                    </el-button>-->
<!--                </el-col>-->
                <el-col :span="1.5">
                    <el-button size="mini" type="warning" @click="handleImport()">导入
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button size="mini" type="warning" @click="exportWaitStoreIns()">导出</el-button>
                </el-col>

                <el-col :span="1.5"></el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" @fullScreen="e_fullScreen"
                    @changeBox="e_changeBox" :boxData="colData" style="padding-right: 10px">
                </right-toolbar>
            </el-row>

            <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="序号" align="center" type="index" width="50" />
                <el-table-column prop="materialNumber" label="物料编号" sortable show-overflow-tooltip align="center"
                    v-if="colData[0].istrue" />
                    <el-table-column prop="supplierName" label="供应商名称" sortable show-overflow-tooltip width="160" align="center"
                    v-if="colData[1].istrue" />

                <el-table-column prop="materialName" label="耗材名称" sortable show-overflow-tooltip align="center"
                    v-if="colData[2].istrue" />
                    <el-table-column prop="materialModel" label="规格型号" sortable show-overflow-tooltip align="center"
                    v-if="colData[3].istrue" />
                <el-table-column prop="storeInDate" label="入库日期" sortable v-if="colData[4].istrue" align="center" />

                <el-table-column prop="materialCount" label="入库数量" sortable show-overflow-tooltip align="center"
                    v-if="colData[5].istrue" />
                <el-table-column prop="unit" label="单位" sortable show-overflow-tooltip v-if="colData[6].istrue"
                    align="center" />
                <el-table-column prop="storeSiteName" label="库位" sortable show-overflow-tooltip align="center"
                    v-if="colData[7].istrue" />
                <el-table-column prop="status" label="验收状态" sortable show-overflow-tooltip v-if="colData[8].istrue"
                    align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">暂存</span>
                        <span v-if="scope.row.status == 2">已提交</span>
                        <span v-if="scope.row.status == 3">审核通过</span>
                        <span v-if="scope.row.status == 4">退回</span>
                    </template>
                </el-table-column>

                <!-- <el-table-column prop="brand" label="品牌" sortable show-overflow-tooltip v-if="colData[5].istrue"
                    align="center" />
                <el-table-column prop="manufacturer" label="生产厂商" sortable show-overflow-tooltip align="center"
                    v-if="colData[6].istrue" />
                <el-table-column prop="grade" label="试剂级别" sortable show-overflow-tooltip v-if="colData[7].istrue"
                    align="center" />
                <el-table-column prop="price" label="单价" sortable show-overflow-tooltip v-if="colData[11].istrue"
                    align="center" />
                <el-table-column prop="amount" label="金额" sortable show-overflow-tooltip v-if="colData[12].istrue"
                    align="center" /> -->

                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" style="color: #409EFF" @click="viewInfo(scope.row)">
                            查看
                        </el-button>
                        <el-button type="text" style="color: #409EFF"
                            v-if="(scope.row.status == 1 || scope.row.status == 4)" @click="editRow(scope.row)">
                            修改
                        </el-button>
                        <el-button type="text" v-if="(scope.row.status == 1 || scope.row.status == 4)"
                            style="color: #409EFF" @click="delRow(scope.row)">
                            删除
                        </el-button>
                        <el-button type="text" v-if="scope.row.status == 3" style="color: #409EFF"
                            @click="returnOfGoods(scope.row)">
                            退货
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <warehousing v-if="isWarehousing" @handleOk="handleOk" :detail="detail" :showType="showType"
            @close="isWarehousing = false" :id="id"></warehousing>
        <retreat v-if="isRetreat" :showType="showType" @handleOk="handleOks" @close="isRetreat = false" :id="id"></retreat>
        <upload :visible.sync="upload.open" :upload="upload" ref="upload" @importTemplate="importTemplate"
            @afterImport="getList" :showTips="false" />
    </div>
</template>

<script>
import { getSelectList } from '@/api/chemical/purchaseOrder'
import {
    queryStoreInList,
    getImportTemplate,
    exportStoreIn,
    delMaterialStoreIn
} from '@/api/chemical/AcceptanceWarehousing'
import warehousing from '../dialog/warehousing'
import retreat from '../dialog/retreat'
import upload from '@/components/common/upload'

export default {
    name: 'inspectionIncomeLibrary',
    components: { warehousing, retreat, upload },
    data() {
        return {
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
                url: window.globalEnv.VUE_APP_BASE_API + '/material/v1/storeIn/importData'
            },
            selectionData: [],
            isRetreat: false,
            isWarehousing: false,
            showSearch: true,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                storeInDateBegin: '',
                storeInDateEnd: '',
                orderNo: '',
                supplierName: '',
                materialName: '',
                materialNumber: ''
            },
            showType: 'add',
            detail: {},
            id: 0,
            total: 0,
            supplierList: [],
            storeInDate: '',
            tableData: [],
            colData: [

                {
                    title: '物料编号',
                    istrue: true
                },
                {
                    title: '供应商名称',
                    istrue: true
                },
                {
                    title: '耗材名称',
                    istrue: true
                },
                {
                    title: '规格型号',
                    istrue: true
                },
                {
                    title: '入库日期',
                    istrue: true
                },
                {
                    title: '入库数量',
                    istrue: true
                },
                {
                    title: '单位',
                    istrue: true
                },
                {
                    title: '库位',
                    istrue: true
                },
                {
                    title: '验收状态',
                    istrue: true
                }

            ]
        }
    },
    mounted() {
        console.log(11111)
        this.getList()
        getSelectList().then(res => {
            this.supplierList = res.data
        })
    },
    methods: {
        searchPro() {
            this.getList()
        },
        printLabel() {
            // 1、获取选中行
            let array = this.$refs.multipleTable.selection.map(item => item.id)
            if (!array || array.length == 0) {
                return false
            }
            POBrowser.openWindowModeless(
                window.globalEnv.VUE_APP_BASE_API +
                '/fileManage/pageOffice/printControll?multipleSelection=' + array.join(','),
                'width=1440px;height=860px'
            )
        },
        exportWaitStoreIns() {
            exportStoreIn(this.queryParams).then(res => {
                if (res.code == 200) {
                    this.downLoadFile(res.msg)
                }
            })
        },
        storeInDateChange(v) {
            if (this.storeInDate) {
                this.queryParams.storeInDateBegin = v[0]
                this.queryParams.storeInDateEnd = v[1]
            } else {
                this.queryParams.storeInDateBegin = ''
                this.queryParams.storeInDateEnd = ''
            }
        },
        resetQuery() {
            this.storeInDate = ''
            this.queryParams = {
                pageNum: 1,
                pageSize: 10,
                storeInDateBegin: '',
                storeInDateEnd: '',
                orderNo: '',
                supplierName: '',
                materialName: ''
            }
            this.getList()
        },
        e_fullScreen() {

        },
        warehousingRow(data) {
            this.detail = data
            this.isWarehousing = true
        },
        handleSelectionChange(val) {
            this.selectionData = val
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
            queryStoreInList(this.queryParams).then(res => {
                this.tableData = res.data.list
                this.total = res.data.total
            })
        },
        handleOk() {
            this.isWarehousing = false
            this.resetQuery()
        },
        handleOks() {
            this.isRetreat = false
            this.resetQuery()
        },
        addStorehouse() {
            this.isWarehousing = true
            this.id = 0
            this.detail = {}
            this.showType = 'add'

        },
        viewInfo(val) {
            this.isWarehousing = true
            this.id = val.materialStoreInId
            this.showType = 'show'
        },
        editRow(val) {
            this.isWarehousing = true
            this.id = val.materialStoreInId
            this.showType = 'edit'
        },
        delRow(val) {
            this.$confirm('确定要删除该入库记录吗？', '提示').then(res => {
                delMaterialStoreIn(val.materialStoreInId).then(res => {
                    if (res.code == 200) {
                        this.$message.success('删除成功')
                        this.resetQuery()
                    }
                })
            })
        },
        importTemplate() {
            getImportTemplate().then(res => {
                if (res.code == 200) {
                    this.downLoadFile(res.msg)
                }
            })
        },
        returnOfGoods(val) {
            this.isRetreat = true
            this.id = val.materialStoreInId
        },
        handleImport() {
            this.upload.title = '设备信息导入'
            this.upload.open = true
        }
    }
}
</script>

<style scoped lang="less"></style>



