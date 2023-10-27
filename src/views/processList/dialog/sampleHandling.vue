<template>
    <div style="padding: 20px">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            :prop="queryParams"
            label-width="120px"
            label-position="top"
        >
            <el-row>
                <el-col :span="12">
                    <el-form-item label="处理日期" prop="submitTimeStr" >
                        <el-date-picker v-model="queryParams.submitTimeStr" value-format="yyyy-MM-dd"
                                        type="date" placeholder="选择日期" disabled
                                        style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请人员" prop="person">
                        <el-input placeholder="请输入申请人员" v-model="queryParams.submitPersonName" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="处理过程记录" prop="processDesc" >
                        <el-input placeholder="请输入内容" v-model="queryParams.processDesc"disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="处理完成情况" prop="resultDesc">
                        <el-input placeholder="请输入内容" v-model="queryParams.resultDesc"disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remarks">
                        <el-input placeholder="请输入备注" v-model="queryParams.remarks"
                                  disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div style="color: #606266;font-size: 14px;font-weight: 600;margin-bottom: 10px">申请处理样品列表</div>
        <div style="width: 90%">
            <el-table
                :data="listData"
                row-key="id"
                ref="selectTable"
            >
                <el-table-column label="序号" align="center" type="index" width="50"/>
                <el-table-column prop="sampleCode" align="center" label="样品编号"/>
                <el-table-column prop="sampleName" align="center" label="样品名称"/>
<!--                <el-table-column prop="entrustCompany" align="center" label="送检单位"/>-->
                <el-table-column prop="backCount" align="center" label="待处理样品数量"/>
                <el-table-column prop="invalidTimeStr" align="center" label="留存时间"/>
            </el-table>
        </div>
    </div>
</template>

<script>
    import boContainer from '@/mixins/boContainer'
    import Lang from './Lang'

    export default {
        name: 'materialBuyOrder',
        mixins: [boContainer],
        data() {
            return {
                Lang,
                supplierList: [],
                currencyList: [],
                samplePointList: [],
                queryParams: {},
                dataList: [],
                activeName: 'first',
                isdisabled: true,
                listData: [],
            }
        },
        methods: {
            init(params) {
                console.log(params)
                if (params) {
                    this.queryParams = params
                    this.listData = params.details
                }
            }
        }
    }
</script>


<style scoped lang="less">
    .cell .el-tag {
        background: none;
        border: none;
    }

    .flex {
        display: flex;
    }

    .flexdit {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        background-color: #fff;
        padding-top: 16px;
        border: 1px solid #dfe6ec;
    }

    .pointer {
        cursor: pointer;
    }

    .tabbody {
        background-color: #fff;
        border-bottom: 1px solid #dfe6ec;

        h3 {
            margin-bottom: 0;
            border-left: 1px solid #dfe6ec;
            border-right: 1px solid #dfe6ec;
            padding: 5px 10px;
            font-size: 14px;
            font-weight: bold;
        }

        .pagtion {
            border-left: 1px solid #dfe6ec;
            border-right: 1px solid #dfe6ec;
            position: relative;
            height: 50px;

            .el-pagination {
                position: absolute;
                right: 0;
                padding-top: 10px;
                padding-bottom: 10px;
            }
        }
    }

    .pagination-container {
        margin-top: 0;
    }

    .linel {
        border: 1px solid #dfe6ec;
        background-color: #fff;
        margin-top: 10px;
        padding-left: 10px;
        padding-top: 10px;
    }

    /deep/ .el-form--inline .el-form-item {
        width: 100%;

        .el-form-item__content {
            width: calc(100% - 140px);

            .el-date-editor, .el-select--medium, input {
                width: 100%;
            }
        }
    }
</style>
