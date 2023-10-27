<template>
    <div class="app-container">
        <!-- 统一样式 - 查询区域 -->
        <div class="a-c-top" v-show="showSearch">
            <!-- 表单 -->
            <el-form :inline="true" ref="queryForm" :model="queryParams" class="demo-form-inline" v-show="showSearch"
                label-width="100px">
                <el-form-item label="检测类别" prop="detectCategory">
                    <el-input v-model="detectCategoryName" @clear="resetDetectCategory" @focus="categoryShow = true" clearable
                        size="small" style="width: 240px;">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="categoryShow = true"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="项目名称" prop="itemNameCn">
                    <el-input v-model="queryParams.itemNameCn" @keyup.enter.native="handleQuery" @clear="handleQuery"
                        clearable size="small" style="width: 240px;"></el-input>
                </el-form-item>
                <el-form-item label="方法编号" prop="methodCode">
                    <el-input v-model="queryParams.methodCode" @keyup.enter.native="handleQuery" @clear="handleQuery"
                        clearable size="small" style="width: 240px;"></el-input>
                </el-form-item>
                <el-form-item label="项目状态" prop="status">
                    <el-select v-model="queryParams.status" clearable size="small" style="width: 240px;">
                        <el-option label="启用" :value="false"></el-option>
                        <el-option label="停用" :value="true"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 统一样式 - 查询区域 按钮 -->
                <div class="a-c-t-btnarea">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!-- 统一样式 - 主列表区域 -->
        <div class="a-c-bottom">
            <!-- 按钮 -->
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="info" icon="icon iconfont iconbsl-icon-daoru" size="mini" @click="handleImport">
                        导入
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" icon="icon iconfont iconbsl-icon-daochu" size="mini" @click="handleExport">导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="initList"></right-toolbar>
            </el-row>
            <!-- 表格 -->
            <el-table v-loading="loading" ref="itemMethodList" :data="itemMethodList" height="700px" border>
                <el-table-column type="index" label="序号" width="55px" align="center">
                    <template slot-scope="scope">
                        <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="itemNameCn" label="项目中文名称" :show-overflow-tooltip='true' align="center" />
                <el-table-column prop="itemNameEn" label="项目英文名称" :show-overflow-tooltip='true' align="center" />
                <el-table-column prop="subCount" label="组分" :show-overflow-tooltip='true' align="center" />
                <el-table-column prop="itemMethodSubCount" label="子项目" :show-overflow-tooltip='true' align="center" />
                <el-table-column prop="detectCategoryName" label="检测类别" :show-overflow-tooltip='true' align="center" />
                <el-table-column prop="methodCode" label="方法编号" :show-overflow-tooltip='true' align="center" />
                <el-table-column prop="stroma" label="基质" :show-overflow-tooltip='true' align="center" />
                <el-table-column prop="childMethodName" label="子法名称" :show-overflow-tooltip='true' align="center" />
                <el-table-column prop="isScene" label="是否现场" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.isScene" :active-value="true" :inactive-value="false"
                            disabled></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="项目状态" width="100px" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" :active-value="false" :inactive-value="true"
                            @change="changeStatus(scope.row, $event)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-info" @click="handleDetail(scope.row.id)">详情
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete"
                            @click="deleteItem(scope.row.itemNameCn, scope.row.id)" v-show="scope.row.status">删除
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row.id)"
                            v-show="!scope.row.status">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="initList" :pageSizes="[100, 200, 500]" />
        </div>
        <selectDetectName :visible.sync="categoryShow" @handleParentName="backfillCategory" :onlyShowLeaf="true" />
        <itemMethodAdd v-if="addShow" @reload="initList" :operateType="operateType" ref="itemMethodAdd" @close="addShow=false"/>
        <upload :visible.sync="upload.open" :upload="upload" ref="upload" @importTemplate="importTemplate"
            @afterImport="initList" />
    </div>
</template>
<script>
import selectDetectName from '@/components/project/selectDetectName'
import upload from '@/components/common/upload'
import itemMethodAdd from './itemMethodAdd'
import {
    listItemMethod,
    exportData,
    deleteItem,
    updateStatus,
    downLoadTemplate
} from '@/api/standardManagement/itemMethod'
export default {
    name: 'itemMethod',
    components: {
        selectDetectName,
        itemMethodAdd,
        upload
    },
    data() {
        return {
            addShow: false,
            editShow: false,
            enterShow: false,
            centerDialogVisible: false,
            loading: false,
            total: 0,
            //是否显示搜索
            showSearch: true,
            //是否显现类别列表
            categoryShow: false,

            // 查询参数
            queryParams: {
                pageSize: 100,
                pageNum: 1,
                detectCategory: undefined,
                itemNameCn: undefined,
                methodCode: undefined,
                status: undefined
            },
            //检测类别名称
            detectCategoryName: undefined,
            //列表数据
            itemMethodList: [],
            //项目操作类型：add:新增、detail:详情、update:编辑
            operateType: undefined,
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
                url: window.globalEnv.VUE_APP_BASE_API + '/standard/v1/itemMethods/importData'
            }

        }
    },
    methods: {
        /** 重置按钮操作 */
        resetQuery() {
            this.detectCategoryName = ''
            this.resetForm('queryForm')
            this.handleQuery()
        },
        //搜索
        handleQuery() {
            this.queryParams.pageNum = 1
            this.initList()
        },
        resetDetectCategory() {
            this.queryParams.detectCategory = ''
            this.handleQuery()
        },
        //新增
        handleAdd() {
            this.addShow = true
            this.operateType = 'add'
            this.$nextTick(() => {
                this.$refs.itemMethodAdd.init()
            })
        },
        handleDetail(itemMethodId) {
            this.addShow = true
            this.operateType = 'detail'
            this.$refs.itemMethodAdd.getDetail(itemMethodId)
        },
        handleUpdate(itemMethodId) {
            this.addShow = true
            this.operateType = 'update'
            this.$refs.itemMethodAdd.getDetail(itemMethodId)
        },
        //获取项目方法列表
        initList() {
            this.loading = true
            listItemMethod(this.queryParams).then(
                (response) => {
                    if (response.code === 200) {
                        let data = response.data
                        this.itemMethodList = data.list
                        this.total = data.total
                    }
                    this.loading = false
                }
            )
        },
        //回填检测类别
        backfillCategory(detectCategory) {
            this.queryParams.detectCategory = detectCategory.id
            this.detectCategoryName = detectCategory.selectDetectName
        },

        //删除
        deleteItem(itemName, id) {
            this.$confirm('确认删除【' + itemName + '】项目吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //删除
                deleteItem(id).then(
                    (response) => {
                        if (response.code === 200) {
                            this.$message({ type: 'success', message: '删除成功!' })
                            //重新加载列表
                            this.initList()
                        }
                    })
            })
        },

        //导出
        handleExport() {
            const baseURL = window.globalEnv.VUE_APP_BASE_API
            exportData(this.queryParams).then(
                (response) => {
                    if (response.code === 200) {
                        this.mbu_download(response.msg)
                    }
                })
        },

        //导入
        handleImport() {
            this.upload.title = '项目方法导入'
            this.upload.open = true
        },
        //下载模板
        importTemplate() {
            downLoadTemplate()
        },
        // 修改项目状态
        changeStatus(row, val) {
            updateStatus(row.id, val).then(
                (response) => {
                    if (response.code === 200) {
                        this.$message({ message: '操作成功！', type: 'success' })
                    }
                }
            )
        }

    },
    watch: {
        itemMethodList: {
            handler(val) {
                if (val) {
                    this.$nextTick(() => {
                        this.$refs.itemMethodList.doLayout()
                    })
                }
            }
        }
    },
    created() {
        this.initList()
    }
}
</script>
