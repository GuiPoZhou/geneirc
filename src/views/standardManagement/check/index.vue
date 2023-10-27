<template>
    <div class="app-container">

        <!-- 统一样式 - 查询区域 -->
        <div class="a-c-top" v-show="showSearch">
            <!-- 表单 -->
            <el-form :inline="true" :model="checkForm" ref="checkForm" class="demo-form-inline" v-show="showSearch"
                     label-width="100px">
                <el-form-item label="类别名称">
                    <el-input v-model="checkForm.detectName" @keyup.enter.native="onSubmit" @clear="onSubmit" clearable
                              size="small" style="width: 240px;"></el-input>
                </el-form-item>
                <el-form-item label="类别状态">
                    <el-select v-model="checkForm.status"  clearable size="small"
                               style="width: 240px;">
                        <el-option label="启用" :value="false"></el-option>
                        <el-option label="停用" :value="true"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 统一样式 - 查询区域 按钮 -->
                <div class="a-c-t-btnarea">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="onSubmit">搜索</el-button>
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
                    <el-button
                        type="primary"
                        size="mini"
                        @click="handleAddcheck"
                        icon="el-icon-plus"
                    >新增
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getTablelist"></right-toolbar>
            </el-row>

            <!-- 表格 -->
            <el-table :data="tableData" v-loading="loading" default-expand-all row-key="id"
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="id" type="index" label="序号" width="55px"/>
                <el-table-column prop="detectName" label="类别名称" :show-overflow-tooltip='true' align="center"/>
                <el-table-column prop="abbreviation" label="类别简称" :show-overflow-tooltip='true' align="center"/>
                <el-table-column prop="remark" label="备注说明" :show-overflow-tooltip='true' align="center"/>
                <el-table-column prop="status" label="类别状态" width="120" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            active-color="#5B7BFA"
                            inactive-color="#dadde5"
                            v-model="scope.row.status"
                            :active-value=false
                            :inactive-value=true
                            @change=changeStatus($event,scope.row.id,scope.row)
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="createBy" label="编制人员" width="200" align="center"/>
                <el-table-column prop="createTime" label="编制时间" :show-overflow-tooltip="true" align="center"/>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope" align="center">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            v-if="scope.row.status == false"
                            @click="handleEdit(scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                            slot="reference"
                            icon="el-icon-delete"
                            size="mini"
                            type="text"
                            v-if="scope.row.status == true"
                            @click="handleDelete(scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="checkForm.pageNum" :limit.sync="checkForm.pageSize"
                        @pagination="getTablelist"/>

        </div>

        <checkAdd v-if="addShow" ref="addShowRef" v-on:func="reload" @close="addShow = false"/>
        <checkEdit v-if="editShow" ref="editShowRef" @close="editShow = false" :checkParams="checkParams" :checkIds="checkIds" @func="getTablelist"/>
    </div>

</template>
<script>
    import checkAdd from '@/components/project/checkAdd'
    import checkEdit from '@/components/project/checkEdit'
    import {
        getCheckList,
        deleteCheckList,
        getCheckListStatus,
        editCheckList,
        detailsCheckList
    } from '@/api/standardManagement/config'

    export default {
        name: 'checkManagement',
        components: {
            checkAdd,
            checkEdit
        },
        data() {
            return {
                // 控制搜索栏显示隐藏
                showSearch: true,
                addShow: false,
                editShow: false,
                enterShow: false,
                centerDialogVisible: false,
                //查询参数
                checkForm: {
                    detectName: null,
                    status: null,
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                // 参数表格数据
                tableData: [],
                //编辑表单的数据
                checkParams: {},
                checkIds: null,
                loading: false
            }
        },
        methods: {
            handleAddcheck () {
              this.addShow = true
                this.$nextTick(() => {
                    this.$refs.addShowRef.init()
                })
            },
            reload() {
                this.getTablelist()
                this.addShow = false
            },
            temp() {
                this.show = true
            },
            //查询按钮操作
            onSubmit() {
                this.checkForm.pageNum = 1
                this.getTablelist()
            },
            //重置按钮操作
            resetQuery() {
                this.checkForm.detectName = ''
                this.checkForm.status = ''
                this.resetForm('checkForm')
                this.onSubmit()
            },
            //表格中的状态
            changeStatus(value, id, row) {
                console.log('row', row)
                const status = { status: value }
                row.status = !value
                getCheckListStatus(id, status).then(response => {
                        row.status = value
                    }
                )
            },
            //编辑按钮操作
            handleEdit(row) {
                console.log('编辑按钮行数据的id==>', row.id)
                const checkId = row.id
                this.checkIds = row.id
                // this.editShow = true
                detailsCheckList(checkId).then(response => {
                        console.log(response.data)
                        this.checkParams = response.data
                    this.editShow = true
                    this.$nextTick(() => {
                        this.$refs.editShowRef.init()
                    })
                    }
                )
            },
            //删除按钮操作
            handleDelete(row) {
                const detectName = row.detectName
                const checkId = row.id
                this.$confirm('确定要删除"' + detectName + '"计量单位吗？', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function() {
                    return deleteCheckList(checkId)
                }).then(() => {
                    this.getTablelist()
                    this.$message.success('删除成功')
                }).catch(function() {
                })
            },
            //新增
            handleAdd() {
                this.visible = true
                this.modalTitle = '添加'
            },
            //获取检测类别列表
            getTablelist() {
                this.loading = true
                getCheckList(this.checkForm).then(response => {
                        // this.tableData = response.data.list;
                        // this.total = response.data.total;
                        console.info(response.data)
                        let result= response.data.sort(this.sortBy('orderNum'))
                        this.tableData = this.handleTree(result, 'id')
                        this.loading = false
                    }
                )
            },
            sortBy(attr, rev) {
                /**数组根据数组对象中的某个属性值进行排序的方法
                 * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
                 * @param attr 排序的属性 如number属性
                 * @param rev true表示升序排列，false降序排序
                 * */
                //第二个参数没有传递 默认升序排列
                if(rev == undefined) {
                    rev = 1;
                } else {
                    rev = (rev) ? 1 : -1;
                }

                return function(a, b) {
                    a = a[attr];
                    b = b[attr];
                    if(a < b) {
                        return rev * -1;
                    }
                    if(a > b) {
                        return rev * 1;
                    }
                    return 0;
                }
            }
        },
        created() {
            this.getTablelist()
        }
    }
</script>
<style lang="less">
    .checkManagement {
        margin-top: 20px;
        margin-left: 30px;
    }
</style>
