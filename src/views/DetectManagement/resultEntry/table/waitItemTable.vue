<template>
    <div>
        <el-row>
            <el-col>
                <el-button type="primary" size="small" @click="e_batchRecordEntry">{{
                    WaitTableLang[lang]['batchEntry'] }}
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
            <!--            项目名称-->
            <el-table-column
                prop="itemName"
                :label="WaitTableLang[lang]['sampleName']"
                align="center"
            />
            <!--            方法编号-->
            <el-table-column
                prop="itemCode"
                :label="WaitTableLang[lang]['methodNo']"
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
            <!--            &lt;!&ndash;            待录入样品数量&ndash;&gt;-->
            <!--            <el-table-column-->
            <!--                prop="dataCount"-->
            <!--                :label="WaitTableLang[lang]['waitEntrySampleNumber']"-->
            <!--                align="center"-->
            <!--            />-->
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
                    <!--                    结果录入-->
                    <el-button
                        size="mini"
                        type="text"
                        :disabled="scope.row.isReceiveSample == 0"
                        @click="e_ResultEntry(scope.row)"
                    >{{WaitTableLang[lang]['ResultEntry']}}
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
            }
        },
        methods: {
            //    批量录入
            e_batchRecordEntry() {
                this.$emit('batchRecordEntry')
            },
            // 选择项发生改变
            handleSelectionChange(select) {
                this.$emit('handleSelectionChange', select)
            },
            // 结果录入
            e_ResultEntry(row) {
                this.$emit('ResultEntry', row)
            }
        }
    }
</script>
