<!-- 待审批 -->
<template>
    <div>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-info"
                    @click="batchApprovalHandle"
                >
                    审批
                </el-button>
            </el-col>
        </el-row>
        <!--            按样品-->
        <el-table
            :data="listData"
            @selection-change="handleSelectionChange"
            :height="mainTableHeight"
            ref="multipleTable"
            stripe
            border
            v-show="activeName == 'first'"
        >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column
                prop="sampleCode"
                label="样品编码" align="center"
            ></el-table-column>
            <el-table-column
                prop="detectTypeStr"
                label="检测类别" align="center"
            >
            </el-table-column>
            <el-table-column
                prop="entrustCode"
                label="委托编号" align="center"
            ></el-table-column>
            <el-table-column
                prop="dataCount"
                label="项目数量" align="center"
            ></el-table-column>

            <el-table-column
                prop="entrustDate"
                label="委托日期" align="center"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="approvalHandle(scope.row)"
                    >审批
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--            按项目-->
        <el-table
            :data="listData"
            @selection-change="handleSelectionChange"
            :height="mainTableHeight"
            ref="multipleTable"
            stripe
            border
            v-show="activeName == 'second'"
        >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column
                prop="sampleCode"
                label="样品编号" align="center"
            ></el-table-column>
            <el-table-column
                prop="detectTypeStr"
                label="检测类别"
                align="center"
            >
            </el-table-column>

            <el-table-column
                prop="itemName"
                label="项目名称"
                align="center"
            ></el-table-column>

            <el-table-column
                prop="itemCode"
                :key="1"
                label="方法编号" align="center"
            ></el-table-column>


            <el-table-column
                prop="dataCount"
                label="待审批样品数量" align="center"
            ></el-table-column>

            <el-table-column
                prop="entrustDate"
                label="委托日期" align="center"
            ></el-table-column>

            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="approvalHandle(scope.row)"
                    >审批
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import boContainerMixin from '@/mixins/boContainer'

    export default {
        name: 'pending',
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
            approvalHandle(row) {
                this.$emit('approvalHandle', row)
            },
            handleSelectionChange(select) {
                this.$emit('handleSelectionChange', select)
            },
            batchApprovalHandle() {
                this.$emit('batchApprovalHandle')
            }
        }
    }
</script>
