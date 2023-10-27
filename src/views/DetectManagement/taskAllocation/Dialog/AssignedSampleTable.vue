<template>
    <div>
        <el-row>
            <el-col>
                <el-button type="primary" size="small" @click="e_batchCancelAllocation">
                    批量取消分配
                </el-button>
            </el-col>
        </el-row>
        <el-table :height="mainTableHeight"
                  :data="listData"
                  style="margin-top: 8px"
                  stripe
                  border
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column align="center" :label="Lang[lang]['SampleCode']" prop="sampleCode"/>
            <el-table-column align="center" :label="Lang[lang]['NumberOfItemsAllocated']"
                             prop="waitAssignmentItemNum"/>
            <el-table-column align="center" label="委托编号" prop="entrustCode"/>
            <el-table-column align="center" :label="Lang[lang]['TaskType']" prop="">
                <template scope="scope">
                    {{echoData(scope.row.entrustType,EntrustTaskTypeList)}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="委托日期"
                             prop="entrustDate"/>
            <el-table-column :label="Lang[lang]['Operation']" align="center"
                             class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="icon iconfont iconbsl-icon-xiangqing"
                               @click="e_CancelAllocation(scope.row)">取消分配
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
            },
            EntrustTaskTypeList: {
                type: Array,
                default: []
            }
        },
        methods: {
            // 选择项发生改变
            handleSelectionChange(select) {
                this.$emit('handleSelectionChange', select)
            },
            // 批量取消分配
            e_batchCancelAllocation() {
                this.$emit('batchCancelAllocation')
            },
            // 取消分配
            e_CancelAllocation(row) {
                this.$emit('CancelAllocation',row)
            },
        }
    }
</script>
