<template>
    <div>
        <el-tabs tab-position="left">
            <el-tab-pane label="基本信息扩展">
                <el-table
                        :data="formJSON"
                        ref="formJSONTable"
                        border
                        :height="height"
                        style="width: 100%">
                    <el-table-column
                            prop="label"
                            label="表单标题"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="表单类型"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="keyName"
                            label="参数Key"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="col"
                            label="所占行"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <el-input-number size="small" v-model="scope.row.col" :min="1" :max="24"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <el-button v-if="checkKey(scope.row.keyName)" type="text" @click="e_selFormItem(scope.row)">
                                选择
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="委托样品扩展">
                <el-table
                        :data="entrustSampleExtData"
                        ref="formJSONTable"
                        border
                        :height="height"
                        style="width: 100%">
                    <el-table-column
                            prop="label"
                            label="表单标题"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="表单类型"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="keyName"
                            label="参数Key"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="col"
                            label="所占行"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <el-input-number size="small" v-model="scope.row.col" :min="1" :max="24"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <el-button v-if="checkKey(scope.row.keyName)" type="text" @click="e_selFormItem(scope.row)">
                                选择
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="编码样品扩展">
                <el-table
                        :data="codingSampleExtData"
                        ref="formJSONTable"
                        border
                        :height="height"
                        style="width: 100%">
                    <el-table-column
                            prop="label"
                            label="表单标题"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="表单类型"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="keyName"
                            label="参数Key"
                            align="center"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="col"
                            label="所占行"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <el-input-number size="small" v-model="scope.row.col" :min="1" :max="24"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <el-button v-if="checkKey(scope.row.keyName)" type="text" @click="e_selFormItem(scope.row)">
                                选择
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

        </el-tabs>

    </div>

</template>
<script>
export default {
    name: "addFormItem",
    data() {
        return {
            showlog: false,
            currentlist: [],
            // 已支持的form类型
            configFormType: ['input', 'textarea', 'checkbox', 'radio', 'time', 'date', 'select', 'number'],
            paramsTypeList: [
                {
                    label: '固定字段',
                    value: 'fixed'
                },
                {
                    label: '扩展字段',
                    value: 'ext'
                }
            ]
        }
    },
    props: {
        formJSON: {
            typeof: Array,
            default: () => {
            }
        },
        entrustSampleExtData: {
            typeof: Array,
            default: () => {
            }
        },
        codingSampleExtData: {
            typeof: Array,
            default: () => {
            }
        },
        currentSelList: {
            typeof: Array,
            default: () => {
            }
        },
        addType: {
            typeof: 'String',
            default: ''
        },
        height: {
            typeof: Number,
            default: 400
        }

    },
    methods: {
        checkKey(prop) {
            let propList = this.currentSelList.map(item => {
                return item.prop
            })
            if (propList.indexOf(prop) == -1) {
                return true
            } else {
                return false
            }
        },
        e_selFormItem(row) {
            if (this.addType == 'form') {
                if (this.configFormType.indexOf(row.type) == -1) {
                    this.$message.warning('暂不支持该类型')
                    return
                }
                let obj = {
                    label: row.label,
                    prop: row.keyName,
                    type: 'ext',
                    col: row.col,
                    component: row.type,
                    options: row.options,
                    isHide: false,
                    anchorPoint: row.keyName
                }
                this.$emit('selFormItem', obj)
            } else if (this.addType == 'table') {
                let obj = {
                    label: row.label,
                    prop: row.keyName,
                }
                this.$emit('selFormItem', obj)
            }

        }
    },
}
</script>
