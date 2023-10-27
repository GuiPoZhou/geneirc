<template>
    <div>
        <BoDialog :diaLogShow="showKevinLog" :fullScreen="fullScreen" diaLogTitle="模板维护" @close="e_close">
            <template slot="bologbody">
                <el-divider content-position="left">模板信息</el-divider>
                <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="模板名称" prop="templateName"
                                :rules="[{ required: true, message: '请输入模板名称', trigger: 'blur' }]">
                                <el-input v-model="ruleForm.templateName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="模板名称" prop="remark">
                                <el-input type="textarea" v-model="ruleForm.remark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-divider content-position="left">表头信息</el-divider>
                    <el-table :data="tableColumns" style="width: 100%" border>
                        <el-table-column prop="label" label="表头名称" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.label"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="prop" label="参数key" align="center">
                        </el-table-column>
                        <el-table-column prop="status" label="开启状态" align="center">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                                    active-color="#13ce66" inactive-color="#ff4949">
                                </el-switch>

                            </template>
                        </el-table-column>
                    </el-table>
                    <el-divider content-position="left">模板内容</el-divider>
                    <el-row>
                        <el-col :span="12">
                            <el-button type="primary" size="mini" style="margin-bottom: 0.7rem;"
                                @click="e_addRow">新增行</el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="点检频次" prop="checkInterval"
                                :rules="[{ required: true, message: '请设置点检频次', trigger: 'change' }]">
                                <kevinBatch :unitList="unitList" actionLabel="点检" :interval="ruleForm.checkInterval"
                                    :unit="ruleForm.checkIntervalUnit" :count="Number(ruleForm.checkIntervalCount)"
                                    @select="e_selectBatch" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-table :data="rowInfo" border style="width: 100%">
                        <!-- 固定的第一列 -->
                        <el-table-column label="点检项目" prop="checkItem" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.checkItem"></el-input>
                            </template>
                        </el-table-column>
                        <!-- 动态的其他列 -->
                        <el-table-column v-for="(column, index) in headerInfo" :key="index" :prop="column.prop"
                            :label="column.label">
                            <template slot-scope="scope">
                                <!-- 使用作用域插槽自定义单元格内容 -->
                                <el-input v-model="scope.row[column.prop]"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click="e_deleterow(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </template>
            <template slot="bologfooter">
                <el-button type="primary" size="small" @click="e_save">保存</el-button>
                <el-button size="small" @click="e_close">取消</el-button>
            </template>
        </BoDialog>
    </div>
</template>

<script>
import kevinBatch from './kevinBatch.vue'
export default {
    components: {
        kevinBatch
    },
    data() {
        return {
            unitList: [
                {
                    label: '秒',
                    value: 'SECOND'
                }, {
                    label: '分钟',
                    value: 'MINUTE'
                }, {
                    label: '小时',
                    value: 'HOUR'
                }, {
                    label: '天',
                    value: 'DAY'
                }, {
                    label: '周',
                    value: 'WEEK'
                }, {
                    label: '月',
                    value: 'MONTH'
                }, {
                    label: '季度',
                    value: 'QUARTER'
                }, {
                    label: '年',
                    value: 'YEAR'
                },
            ],
            showKevinLog: false,
            ruleForm: {
                checkInterval: '',
                checkIntervalUnit: '',
                checkIntervalCount: ''
            },
            fullScreen: true,
            tableColumns: [
                {
                    label: "第一列",
                    prop: "column1",
                    slotName:"column1",
                    vModelType: 'fixed',
                    vModelActionType: "-",
                    status: 1
                }, {
                    label: "第二列",
                    prop: "column2",
                    slotName:"column2",
                    vModelType: 'fixed',
                    vModelActionType: "-",
                    status: 1
                }, {
                    label: "第三列",
                    prop: "column3",
                    slotName:"column3",
                    vModelType: 'fixed',
                    vModelActionType: "-",
                    status: 1
                }, {
                    label: "第四列",
                    prop: "column4",
                    slotName:"column4",
                    vModelType: 'fixed',
                    vModelActionType: "-",
                    status: 1
                }
            ],
            rowInfo: [],
            headerInfo: [
                {
                    label: "第一列",
                    prop: "column1",
                    slotName:"column1",
                    vModelType: 'fixed',
                    vModelActionType: "-",
                    status: 1
                }, {
                    label: "第二列",
                    prop: "column2",
                    slotName:"column2",
                    vModelType: 'fixed',
                    vModelActionType: "-",
                    status: 1
                }, {
                    label: "第三列",
                    prop: "column3",
                    slotName:"column3",
                    vModelType: 'fixed',
                    vModelActionType: "-",
                    status: 1
                }, {
                    label: "第四列",
                    prop: "column4",
                    slotName:"column4",
                    vModelType: 'fixed',
                    vModelActionType: "-",
                    status: 1
                }
            ],
        }
    },
    watch: {
        tableColumns: {
            handler(val) {
                let list = val.filter(item => {
                    return item.status == 1
                })
                this.headerInfo = list
                this.e_checkStatusClose()
            },
            deep: true
        }
    },
    methods: {
        e_selectBatch(data) {
            this.ruleForm.checkInterval = data.interval
            this.ruleForm.checkIntervalCount = data.count
            this.ruleForm.checkIntervalUnit = data.unit
        },
        e_checkStatusClose() {
            let statusCloseList = this.tableColumns.filter(item => {
                return item.status == 0
            })
            if (this.rowInfo.length != 0 && statusCloseList.length != 0) {

                let statusClosepPropList = statusCloseList.map(item => {
                    return item.prop
                })

                this.rowInfo.forEach(item => {
                    for (let key in item) {
                        if (statusClosepPropList.indexOf(key) != -1) {
                            delete item[key]
                        }
                    }
                })
            }
        },
        e_deleterow(index) {
            this.$confirm('确定删除该行?').then(() => {
                this.rowInfo.splice(index, 1)
            })
        },
        e_addRow() {
            let obj = {
                checkItem: ''
            }
            this.headerInfo.forEach(item => {
                obj[item.prop] = ''
            })
            this.rowInfo.push(obj)
        },
        init() {
            this.showKevinLog = true
        },
        editInit(data) {
            this.showKevinLog = true
            this.ruleForm = data
            this.rowInfo = data.rowInfo
            this.headerInfo = data.headerInfo
            let tableColumns = JSON.parse(JSON.stringify(this.tableColumns))
            let headKey = this.headerInfo.map(item => {
                return item.prop
            })
            for (let i = 0; i < tableColumns.length; i++) {
                if (headKey.indexOf(tableColumns[i].prop) == -1) {
                    tableColumns[i].status = 0
                }else{
                    tableColumns[i].label = this.headerInfo.filter(item=>{
                        return item.prop == tableColumns[i].prop
                    })[0].label
                }

            }
            this.tableColumns = tableColumns
        },
        e_save() {
            this.$refs.ruleForm.validate(v => {
                if (v) {
                    if (this.rowInfo.length == 0) {
                        this.$message.error('请新增模板内容')
                        return
                    }

                    this.ruleForm.headerInfo = this.headerInfo
                    this.ruleForm.rowInfo = this.rowInfo
                    let requestType = 'post'
                    if (this.ruleForm.id) {
                        requestType = 'put'
                    }
                    this.$net('/v1/equipmentTemplate', requestType, this.ruleForm).then(re => {
                        if (re.code == 200) {
                            this.$message.success('保存成功')
                            this.$emit('saveReload')
                        } else {
                            this.$message.error(re.msg)
                        }
                    })
                }
            })

        },
        e_close() {
            this.$emit('close')
        }
    }
}
</script>

<style></style>