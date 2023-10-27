<template>
    <div>
        <el-row>
            <el-col>
                <el-button type="primary" size="small" @click="e_batchAllocation">
                    批量分配
                </el-button>
            </el-col>
        </el-row>
        <el-table :height="mainTableHeight"
                  :data="listData"
                  style="width: 100%;margin-top: 8px"
                  @selection-change="handleSelectionChange"
                  stripe
                  border
        >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column align="center" label="样品编号" prop="sampleCode"/>
            <el-table-column align="center" :label="Lang[lang]['entryName']" prop="itemName"/>
            <el-table-column align="center" :label="Lang[lang]['MethodNumber']" prop="methodCode"/>
            <el-table-column align="center" :label="Lang[lang]['TaskType']" prop="planType">
                <template scope="scope">
                    {{echoData(scope.row.entrustType,EntrustTaskTypeList)}}
                </template>
            </el-table-column>
            <el-table-column align="center" :label="Lang[lang]['DetectionCategory']"
                             prop="detectTypeStr"/>
            <el-table-column align="center" :label="Lang[lang]['NumberOfItemsToBeAllocated']"
                             prop="waitAssignmentSampleNum"/>
            <el-table-column :label="Lang[lang]['Operation']" align="center"
                             class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="icon iconfont iconbsl-icon-fenpei"
                               @click="e_Allocation(scope.row)">去分配
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
            // 批量分配
            e_batchAllocation() {
                this.$emit('batchAllocation')
            },
            // 分配
            e_Allocation(row) {
                this.$emit('Allocation', row)
            }
        }
    }
</script>
