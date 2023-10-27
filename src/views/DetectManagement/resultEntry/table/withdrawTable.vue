<template>
    <div>
        <el-row>
            <el-col>
                <el-button type="primary" size="small" @click="e_batchEdit">修改</el-button>
            </el-col>
        </el-row>
        <el-table
            :height="mainTableHeight"
            :data="listData"
            stripe
            style="width: 100%;margin-top: 8px"
            border
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
                align="center"
            />
            <!--            样品编号-->
            <el-table-column
                prop="sampleCode"
                align="center"
                :label="WaitTableLang[lang]['sampleCode']"
            />
            <!--            检测类别-->
            <el-table-column
                prop="detectTypeStr"
                label="检测类别"
                align="center"
            >
            </el-table-column>
<!--            &lt;!&ndash;            样品批号&ndash;&gt;-->
<!--            <el-table-column-->
<!--                prop="sampleBatch"-->
<!--                align="center"-->
<!--                :label="WaitTableLang[lang]['sampleBatchNo']"-->
<!--            />-->
            <!--            委托编号-->
            <el-table-column
                prop="entrustCode"
                align="center"
                label="委托编号"
            />
            <!--            委托日期-->
            <el-table-column
                prop="entrustDate"
                align="center"
                label="委托日期"
            />
            <!--            录入人-->
            <el-table-column
                prop="updateBy"
                align="center"
                :label="WaitTableLang[lang]['entryUser']"
            />
            <!--            录入时间-->
            <el-table-column
                align="center"
                prop="updateTime"
                :label="WaitTableLang[lang]['entryTime']"
            />
<!--            &lt;!&ndash;            退回原因&ndash;&gt;-->
<!--            <el-table-column-->
<!--                align="center"-->
<!--                prop="returnReason"-->
<!--                :label="WaitTableLang[lang]['withdrawReason']"-->
<!--            />-->
            <el-table-column
                prop="date"
                :label="WaitTableLang[lang]['operate']"
                align="center"
            >
                <template slot-scope="scope">
                    <!--                    修改-->
                    <el-button
                        size="mini"
                        type="text"
                        @click="e_edit(scope.row)"
                    >修改
                    </el-button>
                    <!--                    审批详情-->
                    <el-button
                        size="mini"
                        type="text"
                        @click="e_approvalRecord(scope.row)"
                    >审批详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import BoContainerMixin from '@/mixins/boContainer'
    import WaitTableLang from './WaitTableLang'

    export default {
        mixins: [BoContainerMixin],
        data() {
            return {
                WaitTableLang
            }
        },
        props: {
            listData: {
                type: Array,
                default: []
            },
            InspectionTypeList: {
                type: Array,
                default: []
            }
        },
        methods: {
            // 选择项发生改变
            handleSelectionChange(select) {
                this.$emit('handleSelectionChange', select)
            },
            // 修改
            e_edit(row) {
                this.$emit('edit', row)
            },
            // 审批详情
            e_approvalRecord(row) {
                this.$emit('approvalRecord', row)
            },
            // 批量修改
            e_batchEdit(){
                this.$emit('batchEdit')
            }
        }
    }
</script>
