<template>
    <div>
        <BoContainer ref="BoContainer" pageTitle="" :total="total" @changePage="changePage">
            <template slot="boMain">
                <BoMain>
                    <template slot="botabs">
                        <el-tabs v-model="activeName" @tab-click="handleTab" type="card">
                            <el-tab-pane label="计量单位" name="1"></el-tab-pane>
                            <el-tab-pane label="计量单位转换" name="2"></el-tab-pane>
                        </el-tabs>
                    </template>
                    <template slot="bosearch">
                        <el-form :inline="true" :model="unitForm" ref="unitForm1" class="demo-form-inline"
                                 label-width="80px">
                            <el-form-item label="单位名称">
                                <el-input v-model="unitForm.unitName" @keyup.enter.native="onSubmit" @clear="onSubmit"
                                          clearable size="small"
                                          style="width: 240px;"></el-input>
                            </el-form-item>
                            <el-form-item label="状态" v-if="activeName == 1">
                                <el-select v-model="unitForm.status" clearable size="small" style="width: 240px;">
                                    <el-option label="启用" :value="false"></el-option>
                                    <el-option label="停用" :value="true"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" size="mini" @click="onSubmit">搜索
                                </el-button>
                                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </template>
                    <template slot="tableArea">
                        <el-row :gutter="10" class="mb8">
                            <el-col :span="1.5">
                                <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">新增</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="info" size="mini" icon="icon iconfont iconbsl-icon-daoru" @click="handleImport">导入
                                </el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="warning" size="mini" @click="exportExeal" icon="icon iconfont iconbsl-icon-daochu">导出
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-table :data="tableData" border stripe :height="mainTableHeight">
                          <el-table-column type="index" prop="id" align="center" label="序号" width="55px"/>
                          <el-table-column prop="unitName" label="单位名称" key="unitName" :show-overflow-tooltip="true" align="center" v-if="activeName == 1"/>
                          <el-table-column prop="unitAlias" label="单位别称" key="unitAlias" align="center" v-if="activeName == 1"/>
                          <el-table-column prop="unitNameA" label="单位A" key="unitNameA" align="center" v-if="activeName == 2"/>
                          <el-table-column prop="unitNameB" label="单位B" key="unitNameB" align="center" v-if="activeName == 2"/>
                          <el-table-column prop="conversionCoefficient" label="转换系数" key="conversionCoefficient" align="center" v-if="activeName == 2"/>
                          <el-table-column prop="remark" label="备注说明" key="remark" :show-overflow-tooltip="true" align="center"/>
                          <el-table-column prop="status" label="状态" key="status" width="100px" align="center" v-if="activeName == 1">
                            <template slot-scope="scope">
                              <el-switch active-color="#5B7BFA" inactive-color="#dadde5" v-model="scope.row.status" :active-value="false"
                                         :inactive-value="true"
                                         @change="changeStatus($event, scope.row.id, scope.row)"></el-switch>
                            </template>
                          </el-table-column>
                          <el-table-column prop="createBy" label="编制人员" key="createBy" width="100px" align="center"/>
                          <el-table-column prop="createTime" label="编制时间" key="createTime" :show-overflow-tooltip="true" align="center"/>
                          <el-table-column fixed="right" label="操作" align="center">
                            <template slot-scope="scope">
                              <el-button size="mini" icon="el-icon-edit" type="text" v-if="scope.row.status == false && activeName == 1"
                                         @click="handleEdit(scope.row)">编辑
                              </el-button>
                              <el-button slot="reference" size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status == true && activeName == 1"
                                         @click="handleDelete(scope.row)">删除
                              </el-button>
                                <el-button size="mini" icon="el-icon-edit" type="text" v-if="activeName == 2"
                                           @click="e_edit(scope.row)">编辑
                                </el-button>
                                <el-button slot="reference" size="mini" type="text" icon="el-icon-delete" v-if="activeName == 2"
                                           @click="e_del(scope.row)">删除
                                </el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                    </template>
                </BoMain>
            </template>
        </BoContainer>
          <meteringAdd v-if="addShow" ref="addShowRef" @close="addShow = false" v-on:func="getTablelist"/>
          <meteringEnter :enterShow.sync="enterShow"/>
          <meteringEdit v-if="editShow" ref="editShowRef" @close="editShow = false" :unitParams="unitParams" v-on:func="getTablelist"/>
          <upload :visible.sync="upload.open" :upload="upload" ref="upload" @importTemplate="importTemplate"
                  @afterImport="getTablelist"/>
          <!--  计量单位转换  -->
        <unitsConvert v-if="showConvert" ref="convertRef" @close="showConvert = false"></unitsConvert>
    </div>
</template>
<script>
import meteringAdd from '@/components/project/meteringAdd'
import meteringEdit from '@/components/project/meteringEdit'
import meteringEnter from '@/components/project/meteringEnter'
import upload from '@/components/common/upload'
import unitsConvert from './dialog/unitsConvert.vue'
//引入导出
import {exportCsv} from '@/utils/export'
import {
    getMeasuringList,
    deleteMeasuringList,
    exportMeasuringList,
    selectMeasuringList,
    getMeasuringListStatus,
    downLoadTemplate
} from '@/api/standardManagement/config'

export default {
    name: 'meteringManagement',
    components: {
        meteringAdd,
        meteringEdit,
        meteringEnter,
        upload,
        unitsConvert
    },
    data() {
        return {
            activeName: '1',
            showSearch: true,
            addShow: false,
            showConvert: false,
            editShow: false,
            enterShow: false,
            centerDialogVisible: false,
            //查询参数
            unitForm: {
                unitName: null,
                status: null,
                startPage: 1,
                pageSize: 10,
            },
            total: 0,
            // 参数表格数据
            tableData: [],
            //编辑表单的数据
            unitParams: {},
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
                url: '',
            },
        }
    },
    methods: {
        changePage(e) {
            this.unitForm.startPage = e.page
            this.unitForm.pageSize = e.limit
            this.getTablelist()
        },
        handleTab() {
            this.tableData = []
            this.resetQuery()
        },
        handleAdd () {
            if (this.activeName == 1) {
                this.addShow = true
                this.$nextTick(() => {
                    this.$refs.addShowRef.init()
                })
            } else {
                this.showConvert = true
                this.$nextTick(() => {
                    this.$refs.convertRef.init('add')
                })
            }
        },
        e_edit (row) {
            this.showConvert = true
            this.$nextTick(() => {
                this.$refs.convertRef.init('edit', row)
            })
        },
        e_del (row) {
            this.$confirm('确定删除该条数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$net(`/standard/v1/measuringUnitsConvert/${row.id}`, 'delete').then(res => {
                    this.$message.success(res.msg)
                    this.getTablelist()
                })
            }).catch(() => {
            });
        },
        temp() {
            this.show = true
        },
        //表格中的状态
        changeStatus($event, id, row) {
            console.log('row', row)
            console.log('id', id)
            console.log('状态', $event)
            const status = {status: $event}
            getMeasuringListStatus(id, status).then(response => {
            })
        },
        //查询按钮操作
        onSubmit() {
            this.unitForm.startPage = 1
            this.getTablelist()
        },
        //重置按钮操作
        resetQuery() {
            this.unitForm.unitName = ''
            this.unitForm.status = ''
            this.resetForm('unitForm1')
            this.onSubmit()
        },
        //表格中的状态
        change(index, row) {
            console.log(index, row)
        },
        //删除按钮操作
        handleDelete(row) {
            const unitName = row.unitName
            const meteringId = row.id
            this.$confirm('确定要删除"' + unitName + '"计量单位吗？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(function () {
                    return deleteMeasuringList(meteringId)
                })
                .then(() => {
                    this.getTablelist()
                    this.$message.success('删除成功')
                })
                .catch(function () {
                })
        },
        //编辑按钮操作
        handleEdit(row) {
            this.editShow = true
            this.unitParams = Object.assign({}, row)
            this.$nextTick(() => {
                this.$refs.editShowRef.init()
            })
        },
        //导入
        handleImport() {
            if (this.activeName == 1) {
                this.upload.title = '导入计量单位'
                this.upload.url = window.globalEnv.VUE_APP_BASE_API + '/standard/v1/measuringUnits/action/import'
            } else {
                this.upload.title = '导入计量单位转换'
                this.upload.url = window.globalEnv.VUE_APP_BASE_API + '/standard/v1/measuringUnitsConvert/import'
            }
            this.upload.open = true
        },
        //下载模板
        importTemplate() {
            if (this.activeName == 1) {
                downLoadTemplate().then(response => {
                    if (response.code == 200) {
                        this.mbu_downloadExcel(response.msg)
                    }
                })
            } else {
                const link = document.createElement('a')
                this.$net('/standard/v1/measuringUnitsConvert/importTemplate', 'getFile').then(res => {
                    let blob = new Blob([res], {type: 'application/vnd.ms-excel'});  // res就是接口返回的文件流了
                    let objectUrl = URL.createObjectURL(blob);
                    // window.location.href = objectUrl;
                    link.href = objectUrl
                    link.download = '计量单位转换导入模板' // 自定义文件名
                    link.click() // 下载文件
                    URL.revokeObjectURL(objectUrl); // 释放内存
                });
            }
        },
        //导出按钮操作
        exportExeal() {
            if (this.activeName == 1) {
                exportMeasuringList(this.unitForm).then(response => {
                    if (response.code == 200) {
                        this.mbu_downloadExcel(response.msg)
                    }
                })
            } else {
                this.$net('/standard/v1/measuringUnitsConvert/export', 'get', this.unitParams).then(res => {
                    if (res.code == 200) {
                        this.mbu_downloadExcel(res.msg)
                    }
                })
            }
        },

        //获取计量单位列表
        getTablelist() {
            if (this.activeName == 1) {
                getMeasuringList(this.unitForm).then(response => {
                    this.tableData = response.data.list
                    this.total = response.data.total
                    this.loading = false
                })
            } else {
                this.$net('/standard/v1/measuringUnitsConvert', 'get', this.unitForm).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
            }
        },
    },
    created() {
        this.getTablelist()
    },
}
</script>
<style lang="less">
.meteringManagement {
  margin-top: 20px;
  margin-left: 30px;
}
</style>
