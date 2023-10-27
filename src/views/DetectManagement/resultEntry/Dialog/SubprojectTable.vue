<template>
    <BoDialog
        diaLogWidth="40"
        diaLogTitle="子项目列表"
        :diaLogShow="showDialog"
        @close="handleCancel">
        <template slot="bologbody">
            <el-table
                v-loading="loading"
                :data="listData"
                ref="selectTable"
                border
                stripe
            >
                <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
                <el-table-column align="center" label="子项目名称" prop="subItemName"/>
                <el-table-column align="center" label="检测结果" prop="testResult">
                    <template scope="scope">
                        <el-input v-model="scope.row.testResult"
                                  oninput="value=value.replace(/[^\d^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <template slot="bologfooter">
            <el-button type="primary" @click="handleGetData">确定
            </el-button>
            <el-button @click="handleCancel">取消</el-button>
        </template>
    </BoDialog>
</template>

<script>
    export default {
        name: 'add',
        components: {},
        data() {
            return {
                showDialog: false,
                total: 0,
                loading: false,
                ids: [],
                listData: []
            }
        },
        methods: {
            init(data) {
                this.listData = data
                this.showDialog = true
            },
            // 取消
            handleCancel() {
                this.showDialog = false
                this.$emit('close')
                this.listData = []
            },
            handleGetData() {
                this.$emit('reload', this.listData)
                this.showDialog = false
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
