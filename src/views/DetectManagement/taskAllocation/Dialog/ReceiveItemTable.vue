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
            border
            style="width: 100%;margin-top: 8px"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
                align="center"
            />
            <!--        样品名称-->
            <el-table-column
                prop="itemName"
                :label="Lang[lang]['sampleName']"
                align="center"
            />
            <!--        方法编号-->
            <el-table-column
                prop="itemCode"
                :label="Lang[lang]['methodNo']"
                align="center"
            />
            <!--        样品编号-->
            <el-table-column
                prop="sampleCode"
                :label="Lang[lang]['sampleCode']"
                align="center"
            />

            <!--            检测类别-->
            <el-table-column
                prop="detectTypeStr"
                label="检测类别"
                align="center"
            >
            </el-table-column>
            <!--            待录入样品数量-->
            <el-table-column
                prop="dataCount"
                :label="Lang[lang]['waitEntrySampleNumber']"
                align="center"
            />
            <!--            委托日期-->
            <el-table-column
                prop="entrustDate"
                label="委托日期"
                align="center"
            />
            <!--      操作-->
            <el-table-column
                prop="date"
                :label="Lang[lang]['operate']"
                align="center"
            >
                <template slot-scope="scope">
                    <!--                    接收任务-->
                    <el-button
                        size="mini"
                        type="text"
                        @click="e_ReceiveTask(scope.row)"
                    >{{Lang[lang]['ReceiveTask']}}
                    </el-button>
                    <!--                    交回任务-->
                    <el-button
                        size="mini"
                        type="text"
                        @click="e_ReturnTask(scope.row)"
                    >{{Lang[lang]['ReturnTheTask']}}
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>
<script>
    import BoContainerMixin from '@/mixins/boContainer'
    import Lang from './WaitTableLang'

    export default {
        mixins: [BoContainerMixin],
        data() {
            return {
                Lang
            }
        },
        props: {
            listData: {
                type: Array,
                default: []
            }
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
