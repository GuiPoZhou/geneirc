<template>
    <div class="approvalRecords">
        <el-dialog title="审批记录" :visible.sync="approvalRecordsShow" center
                   :close-on-press-escape="false" :close-on-click-modal="false" :append-to-body="true" @open='open'
                   :before-close="close">
            <!-- 表格 -->
            <el-table v-loading="loading" :data="tableData1" align="center">
                <el-table-column prop="id" type="index" label="序号" width="55px"/>
                <el-table-column prop="userName" label="审批人"/>
                <el-table-column prop="updateTime" label="审批时间"/>
                <el-table-column prop="auditResultStr" label="审批结果"/>
                <el-table-column prop="auditOpinion" label="审批意见"/>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import { getAuditRecordList } from '@/api/detectionManage/resultEntry/completed'

    export default {
        name: 'approvalRecords',
        components: {},
        data() {
            return {
                loading: false,
                tableData1: []
            }
        },
        props: {
            approvalRecordsShow: {
                type: Boolean,
                default: false
            },
            rowData: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            //取消按钮操作
            close() {
                this.$emit('update:approvalRecordsShow', false)
            },
            open() {
                this.loading = true
                getAuditRecordList(this.rowData.id).then((res) => {
                    this.tableData1 = res.data
                    this.loading = false
                }, (err) => {
                })
            }
        }
    }
</script>
