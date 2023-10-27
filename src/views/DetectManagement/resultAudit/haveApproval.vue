<!-- 已审批 -->
<template>
    <div>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-info"
                    @click="batchResultsDetailsHandle"
                >详情
                </el-button>
                <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-refresh"
                    @click="batchWithdrawalHandle"
                >撤回
                </el-button>
            </el-col>
        </el-row>
        <el-table
            :data="listData"
            @selection-change="handleSelectionChange"
            :height="mainTableHeight"
            align="center"
            stripe
            border
        >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column prop="sampleCode" label="样品编码" align="center"></el-table-column>
            <!--            <el-table-column prop="sampleBatch" label="样品批号" align="center"></el-table-column>-->
            <el-table-column prop="detectTypeStr" label="检测类别" align="center">
            </el-table-column>
            <el-table-column
                prop="itemName"
                label="检测项目名称" align="center"
                :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                prop="itemCode"
                label="方法编号" align="center"
                :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                prop="entrustCode"
                label="委托编号" align="center"
                :show-overflow-tooltip="true"
            >
            </el-table-column>

            <el-table-column
                prop="entrustDate"
                label="委托日期" align="center"
            ></el-table-column>

            <el-table-column prop="auditStatus" label="审批状态" align="center">
                <template slot-scope="scope">
                    {{ scope.row.auditStatus == 1 ? '审核通过' : '退回' }}
                </template>
            </el-table-column>

            <el-table-column prop="auditTime" label="审批时间" align="center"></el-table-column>

            <el-table-column fixed="right" label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="icon iconfont iconbsl-icon-xiangqing"
                        @click="resultsDetailsHandle(scope.row)"
                    >详情
                    </el-button>
                    <p v-if="scope.row.auditStatus === 1">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-refresh"
                            @click="withdrawalHandle(scope.row)"
                        >撤回
                        </el-button>
                    </p>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-info"
                        @click="auditLogDetail(scope.row)"
                    >审批记录
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import boContainerMixin from '@/mixins/boContainer'

    export default {
        name: 'haveApproval',
        mixins: [boContainerMixin],
        data() {
            return {}
        },
        props: {
            listData: {
                type: Array,
                default: []
            },
            InspectionTypeList: {
                type: Array,
                default: []
            },
            activeName: {
                type: String,
                default: 'first'
            }
        },
        methods: {
            // 审批记录
            auditLogDetail(row) {
                this.$emit('auditLogDetail', row)
            },
            // 撤回
            withdrawalHandle(row) {
                this.$emit('withdrawalHandle', row)
            },
            // 详情
            resultsDetailsHandle(row) {
                this.$emit('resultsDetailsHandle', row)
            },
            // 选择项发生改变
            handleSelectionChange(select) {
                this.$emit('handleSelectionChange', select)
            },
            // 批量查看详情
            batchResultsDetailsHandle() {
                this.$emit('batchResultsDetailsHandle')
            },
            // 批量撤回
            batchWithdrawalHandle() {
                this.$emit('batchWithdrawalHandle')
            }

        }
    }
</script>
