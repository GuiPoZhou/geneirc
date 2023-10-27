<template>
    <div>
        <BoDialog :diaLogShow="recordsShow"
                  diaLogTitle="审批记录"
                  diaLogWidth="40%" @close="close">
            <template slot="bologbody">
                <!-- 表格 -->
                <el-form :model="recordsParams" ref="recordsForm" :inline="true" style="margin: 20px 0px"
                         label-width="200px" stripe
                         border>
                    <el-table v-loading="loading" :data="recordsParams.recordsData" align="center">
                        <el-table-column prop="id" type="index" label="序号" width="55px" align="center"/>
                        <el-table-column prop="userName" label="审批人" align="center"/>
                        <el-table-column prop="updateTime" label="审批时间" align="center"/>
                        <el-table-column prop="auditResultStr" label="审批结果" align="center"/>
                        <el-table-column prop="auditOpinion" label="审批意见" align="center"/>
                    </el-table>
                </el-form>
            </template>
            <template slot="bologfooter">
                <el-button @click="close">取消</el-button>
            </template>
        </BoDialog>
    </div>
</template>
<script>
    export default {
        name: 'approvalRecords',
        components: {},
        data() {
            return {
                loading: false
            }
        },
        props: {
            recordsShow: {
                type: Boolean,
                default: false
            },
            recordsParams: {
                type: Object
            }
        },
        methods: {
            //取消按钮操作
            close() {
                this.$emit('update:recordsShow', false)
            }
        }
    }
</script>
