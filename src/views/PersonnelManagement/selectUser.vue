<template>
    <el-dialog title="选择人员" :visible.sync="visible" append-to-body width="800px"
               center :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
        <el-form ref="queryForm" :model="queryParams" @submit.native.prevent :inline="true">
            <!-- 搜索栏 -->
            <el-form-item label="用户名称" prop="userName">
                <el-input @keyup.enter.native="handleQuery" v-model="queryParams.userName   " @clear="handleQuery"
                          clearable size="small"
                          placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>

        </el-form>
        <!-- 表格 -->
        <div>
            <el-table height="500" :data="userList" ref="multipleTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="nickName" label="用户名称" align="center"/>
                <el-table-column prop="userName" label="用户账号" align="center"/>
            </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="commit">确认</el-button>
            <el-button @click="close">取消</el-button>
        </div>

    </el-dialog>
</template>
<script>

    import {
        userList
    } from '@/api/personnel/personnel'

    export default {

        data() {
            return {
                // 查询参数
                queryParams: {
                    nickName: undefined
                },
                //类型列表
                userList: [],

                deptShow: false
            }
        },
        components: {},
        props: {
            visible: {
                type: Boolean,
                default: false
            }

        },
        mounted() {
            this.getList()
        },
        methods: {
            /** input框搜索操作 */
            handleQuery() {
                this.getList()
            },
            //获取用户列表
            async getList() {
                let getData = await this.$net('/personnel/v1/personnelFile/getUserList', 'get', this.queryParams)
                if (getData.code == 200) {
                    this.userList = getData.data
                }
            },
            //取消按钮操作
            close() {
                this.$emit('update:visible', false)
            },
            //选择按钮操作
            commit() {
                if (this.$refs.multipleTable.selection.length == 0) {
                    this.$message.success('请选择一条信息')
                    return
                }
                if (this.$refs.multipleTable.selection.length > 1) {
                    this.$message.success('只能选择一条信息')
                    return
                }

                let selectedUser = this.$refs.multipleTable.selection

                this.$emit('backfill', selectedUser)
                this.close()
            },
            //清空所有选中
            clearAll() {
                this.$refs.multipleTable.clearSelection()
            },
            resetQuery() {
                this.resetForm('queryForm')
                this.handleQuery()
            }
        },

        computed: {}
    }
</script>
