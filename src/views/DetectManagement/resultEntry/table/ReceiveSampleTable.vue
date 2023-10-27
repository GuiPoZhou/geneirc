<template>
    <div>
        <el-row>
            <el-col>
                <el-button type="primary" size="small" @click="e_batchReceiveTask">
                    批量接收任务
                </el-button>
                <el-button type="primary" size="small" @click="e_batchReturnTask">
                    批量交回任务
                </el-button>
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
                :label="WaitTableLang[lang]['sampleCode']"
                align="center"
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
<!--                :label="WaitTableLang[lang]['sampleBatchNo']"-->
<!--                align="center"-->
<!--            />-->
            <!--            項目數量-->
            <el-table-column
                prop="dataCount"
                align="center"
                :label="WaitTableLang[lang]['itemNumber']"
            />
            <!--            委托编号-->
            <el-table-column
                prop="entrustCode"
                label="委托编号"
                align="center"
            />
            <!--            委托日期-->
            <el-table-column
                prop="entrustDate"
                label="委托日期"
                align="center"
            />
            <!--            操作-->
            <el-table-column
                prop="date"
                :label="WaitTableLang[lang]['operate']"
                align="center"
            >
                <template slot-scope="scope">
                    <!--                    接收任务-->
                    <el-button
                        size="mini"
                        type="text"
                        @click="e_ReceiveTask(scope.row)"
                    >{{WaitTableLang[lang]['ReceiveTask']}}
                    </el-button>
                    <!--                    交回任务-->
                    <el-button
                        size="mini"
                        type="text"
                        @click="e_ReturnTask(scope.row)"
                    >{{WaitTableLang[lang]['ReturnTheTask']}}
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
        mounted() {

        },
        methods: {
            // 选择项发生改变
            handleSelectionChange(select) {
                this.$emit('handleSelectionChange', select)
            },
            // 批量接收任务
            e_batchReceiveTask() {
                this.$emit('batchReceiveTask')
            },
            // 批量交回任务
            e_batchReturnTask() {
                this.$emit('batchReturnTask')
            },
            // 接收任务
            e_ReceiveTask(row) {
                this.$emit('ReceiveTask', row)
            },
            // 交回任务
            e_ReturnTask(row) {
                this.$emit('ReturnTask', row)
            }
        }
    }
</script>
