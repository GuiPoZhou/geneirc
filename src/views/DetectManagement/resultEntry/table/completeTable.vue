<template>
    <div>
        <el-row>
            <el-col>
<!--                <el-button type="primary" size="small" @click="e_pushSAP">{{ WaitTableLang[lang]['pushSAP'] }}-->
<!--                </el-button>-->
                <el-button type="primary" size="small" @click="e_batchSeeDetail">详情</el-button>
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
            <!--            检验批ID-->
            <el-table-column
                prop="date"
                align="center"
                :label="WaitTableLang[lang]['inspectionLotId']"
            />
            <!--            检测类别-->
            <el-table-column
                prop="detectTypeStr"
                label="检测类别"
                align="center"
            >
            </el-table-column>
            <!--        方法编号-->
            <el-table-column
                prop="itemCode"
                :label="WaitTableLang[lang]['methodNo']"
                align="center"
            />
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
            <!--            录入人员-->
            <el-table-column
                prop="updateBy"
                align="center"
                :label="WaitTableLang[lang]['entryUser']"
            />
            <!--            审批状态-->
            <el-table-column
                prop="detectStatus"
                align="center"
                :label="WaitTableLang[lang]['approvalStatus']"
            >
                <template scope="scope">
                    <span v-if="scope.row.detectStatus == 0">待接收</span>
                    <span v-if="scope.row.detectStatus == 10">待录入</span>
                    <span v-if="scope.row.detectStatus == 15">已录入</span>
                    <span v-if="scope.row.detectStatus == 20">待审批</span>
                    <span v-if="scope.row.detectStatus == 30">审批中</span>
                    <span v-if="scope.row.detectStatus == 40">已通过</span>
                    <span v-if="scope.row.detectStatus == 50">已退回</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="date"
                :label="WaitTableLang[lang]['operate']"
                align="center"
            >
                <template slot-scope="scope">
                    <!--                    查看详情-->
                    <el-button
                        size="mini"
                        type="text"
                        @click="e_seeDetail(scope.row)"
                    >查看详情
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
            // 查看详情
            e_seeDetail(row) {
                this.$emit('seeDetail', row)
            },
            // 推送ASP
            e_pushSAP() {
                this.$emit('pushSAP')
            },
            // 审批详情
            e_approvalRecord(row) {
                this.$emit('approvalRecord', row)
            },
            e_batchSeeDetail() {
                this.$emit('batchSeeDetail')
            }
        }
    }
</script>
