<template>
    <div>
        <el-drawer
                :visible.sync="showDrawer"
                :append-to-body="true"
                :close-on-press-escape="false"
                :wrapperClosable="false"
                size="95%"
                :with-header="false">
            <el-tabs type="border-card" v-model="activeName">
                <el-tab-pane label="新增表单" name="form">
                    <el-tabs v-model="activeFormType">
                        <el-tab-pane label="固定字段" name="fixed">
                            <FixedForm :main-table-tags="this.mainTableTags" @confirm="e_confirmFixedAdd"/>
                        </el-tab-pane>
                        <el-tab-pane label="扩展字段" name="ext">

                            <AddFormItem :formJSON="extDataList" :entrustSampleExtData="entrustSampleExtData" :codingSampleExtData="codingSampleExtData" :height="500" :currentSelList="currentSelFormList"
                                         addType="form"
                                         @selFormItem="e_saveAddForm"/>
                        </el-tab-pane>
                    </el-tabs>
                </el-tab-pane>
                <el-tab-pane label="新增Table" name="table">
                    <AddFormItem :formJSON="extDataList" :entrustSampleExtData="entrustSampleExtData" :codingSampleExtData="codingSampleExtData" :currentSelList="currentTableUseList" addType="table"
                                 @selFormItem="e_addNewColumsByExt"/>
                    <el-form :model="newTableInfo" ref="newTableInfo" label-width="110px" class="demo-ruleForm"
                             style="margin:20px 0">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="table所占长度" prop="col">
                                    <el-input v-model="newTableInfo.col" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="table标签" prop="anchorPoint"
                                              :rules="[{ required: true, message: '请输入table标签', trigger: 'blur' }]">
                                    <el-input v-model="newTableInfo.anchorPoint"
                                              placeholder="用于定位该table，进行数据操作"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="table title" prop="title">
                                    <el-input v-model="newTableInfo.title"
                                              placeholder="用于显示table上方的标题"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="table高度" prop="tableHeight">
                                    <el-input v-model="newTableInfo.tableHeight"
                                              placeholder="设置table的高度"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="是否加入子表" prop="haveChild">
                                    <el-radio-group v-model="newTableInfo.haveChild" @input="e_checkIsNeedExpand">
                                        <el-radio :label="true">是</el-radio>
                                        <el-radio :label="false">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-divider content-position="left">Table列管理（即可从上方列表选择添加，也可手动添加）</el-divider>
                    <el-button @click="e_addNewColumn" type="success" size="mini" style="margin: 20px 0">添加新列
                    </el-button>
                    <el-table
                            :data="newTableInfo.tableColumns"
                            border
                            style="width: 100%">
                        <el-table-column
                                prop="label"
                                label="列名(label)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.label"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="prop"
                                label="键名(prop)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.prop"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="editType"
                                label="可输入插槽类型(editType)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.editType" clearable>
                                    <el-option label="span" value="span"></el-option>
                                    <el-option label="el-input" value="el-input"></el-option>
                                    <el-option label="el-input-number" value="el-input-number"></el-option>
                                    <el-option label="el-link" value="el-link"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="linkEvents"
                                label="ElLink事件脚本(linkEvents)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input type="textarea" v-model="scope.row.linkEvents"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="slotRenderEvents"
                                label="插槽事件脚本(slotRenderEvents)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input type="textarea" v-model="scope.row.slotRenderEvents"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="slotName"
                                label="键插槽标识(slotName)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.slotName"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="type"
                                label="列类型(type)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.type"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="align"
                                label="列对齐方式(align)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.align">
                                    <el-option label="left" value="left"></el-option>
                                    <el-option label="center" value="center"></el-option>
                                    <el-option label="right" value="right"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="valueType"
                                label="值类型（固定/扩展）(valueType)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.valueType">
                                    <el-option label="fixed" value="fixed"></el-option>
                                    <el-option label="ext" value="ext"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-button type="text" @click="e_deleteColumnslist(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-divider content-position="left">Table操作列功能按钮添加</el-divider>
                    <el-button @click="e_addNewSlotsButton" type="success" size="mini" style="margin: 20px 0">
                        添加功能按钮
                    </el-button>

                    <el-table
                            :data="newTableInfo.tableSlotButtons"
                            border
                            style="width: 100%">
                        <el-table-column
                                prop="label"
                                label="功能名称"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.label"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="isHide"
                                label="是否隐藏"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-radio-group v-model="scope.row.isHide">
                                    <el-radio :label="true">是</el-radio>
                                    <el-radio :label="false">否</el-radio>
                                </el-radio-group>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="events"
                                label="功能脚本"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input type="textarea" v-model="scope.row.events"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="type"
                                label="列类型"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.type"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click="e_deleteSlotsButton(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-if="newTableInfo.haveChild">
                        <el-divider content-position="left">Table子表列定义</el-divider>
                        <el-button @click="e_addChildTableColumns" type="success" size="mini" style="margin: 20px 0">
                            添加子表新列
                        </el-button>
                        <el-table
                                :data="newTableInfo.childTableColums"
                                border
                                style="width: 100%">
                            <el-table-column
                                    prop="label"
                                    label="列名(label)"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.label"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="prop"
                                    label="键名(prop)"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.prop"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="slotName"
                                    label="键插槽标识(slotName)"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.slotName"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    prop="align"
                                    label="列对齐方式(align)"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.align">
                                        <el-option label="left" value="left"></el-option>
                                        <el-option label="center" value="center"></el-option>
                                        <el-option label="right" value="right"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="valueType"
                                    label="值类型（固定/扩展）(valueType)"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.valueType">
                                        <el-option label="fixed" value="fixed"></el-option>
                                        <el-option label="ext" value="ext"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button type="text" @click="e_deleteChildColumnslist(scope.$index)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="新增按钮" name="button">
                    <el-button type="primary" size="mini" @click="e_addNewButton">新增按钮</el-button>
                    <el-table
                            :data="buttonInfo.formList"
                            style="width: 100%">
                        <el-table-column
                                prop="label"
                                label="按钮名称(label)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.label"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="label"
                                label="按钮标识(anchorPoint)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.anchorPoint"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="type"
                                label="主题类型(type)"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.type">
                                    <el-option label="默认" value="-"></el-option>
                                    <el-option label="primary" value="primary"></el-option>
                                    <el-option label="success" value="success"></el-option>
                                    <el-option label="warning" value="warning"></el-option>
                                    <el-option label="danger" value="danger"></el-option>
                                    <el-option label="info" value="info"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="size"
                                label="按钮尺寸"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.size">
                                    <el-option label="默认" value="-"></el-option>
                                    <el-option label="medium" value="medium"></el-option>
                                    <el-option label="small" value="small"></el-option>
                                    <el-option label="mini" value="mini"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="anchorPoint"
                                label="按钮唯一标签"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.anchorPoint"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="events"
                                label="按钮事件脚本"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-input type="textarea" v-model="scope.row.events"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center"
                        >
                            <template slot-scope="scope">
                                <el-button type="text" @click="e_delteButton(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane v-if="editFor=='bulletBox'" label="弹框信息" name="bulletBox">
                    <el-form :model="bulletBoxInfo" ref="bulletBoxInfo" label-width="110px" class="demo-ruleForm"
                             style="margin:20px 0">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="弹框标题" prop="title"
                                              :rules="[{ required: true, message: '请输入弹框标题', trigger: 'blur' }]">
                                    <el-input v-model="bulletBoxInfo.title"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="弹框唯一标记" prop="anchorPoint"
                                              :rules="[{ required: true, message: '请输入弹框唯一标记', trigger: 'blur' }]">
                                    <el-input v-model="bulletBoxInfo.anchorPoint"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-divider content-position="left">弹框底部按钮管理</el-divider>
                        <el-button type="primary" size="small" @click="e_addBulletBottomButton">新增底部按钮</el-button>
                        <el-table
                                :data="bulletBoxInfo.bodyButtons" border
                                style="width: 100%">
                            <el-table-column
                                    prop="label"
                                    label="按钮名称(label)"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.label"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="type"
                                    label="主题类型(type)"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.type">
                                        <el-option label="默认" value="-"></el-option>
                                        <el-option label="primary" value="primary"></el-option>
                                        <el-option label="success" value="success"></el-option>
                                        <el-option label="warning" value="warning"></el-option>
                                        <el-option label="danger" value="danger"></el-option>
                                        <el-option label="info" value="info"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="size"
                                    label="按钮尺寸"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.size">
                                        <el-option label="默认" value="-"></el-option>
                                        <el-option label="medium" value="medium"></el-option>
                                        <el-option label="small" value="small"></el-option>
                                        <el-option label="mini" value="mini"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="events"
                                    label="按钮事件脚本"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <el-input type="textarea" v-model="scope.row.events"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button type="text" @click="e_deleteBulletBottomButton(scope.$index)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </el-tab-pane>
                <el-row style="margin:20px 0">
                    <el-col :span="24">
                        <el-button type="primary" size="small" v-if="activeName !='form'" @click="e_saveNewTable">
                            保存
                        </el-button>
                        <el-button size="small" @click="e_close">关闭</el-button>
                    </el-col>
                </el-row>
            </el-tabs>

        </el-drawer>
    </div>
</template>
<script>
import AddFormItem from "./addFormItem.vue";
import FixedForm from "./components/fixedForm.vue";

export default {
    components: {
        AddFormItem,
        FixedForm
    },
    props: {
        businessConfigId: {
            typeof: String,
            default: ''
        },
        // 为谁编辑  主单-mainForm  弹框-bulletBox
        editFor: {
            typeof: String,
            default: ''
        },
        mainTableTags:{
            typeof:String,
            default:'ENTRUSTMENT_AGREEMENT'
        }
    },
    data() {
        return {
            showDrawer: false,
            activeFormType: 'fixed',
            activeName: "form",
            expandInfo: {
                "type": "expand",
                "width": "55",
                "fixed": "left",
                "slotName": "expand",
                "valueType": "fixed"
            },
            newTableInfo: {
                "col": 24,
                "component": "el-table",
                "haveChild": false,
                "isHide": false,
                "linkTarget": "",
                "anchorPoint": "",
                "tableHeight": "",
                "tableData": [],
                "tableColumns": [
                    {
                        "label": "选择",
                        "prop": "selection",
                        "type": "selection",
                        "width": "55",
                        "disabled": true,
                        "checked": true,
                        "fixed": "left"
                    },
                    // {
                    //     "label": "序号",
                    //     "prop": "index",
                    //     "type": "index",
                    //     "width": "55",
                    //     "disabled": true,
                    //     "checked": true,
                    //     "fixed": "left"
                    // },
                    {
                        "label": "操作",
                        "checked": true,
                        "align": "center",
                        "slotName": "action",
                        "fixed": "right",
                        "disabled": true,
                        "width": "220",
                        "valueType": "fixed"
                    }
                ],
                "tableSlotButtons": [],
                "tableButtons": [],
                "tableSelections": [],
                "childTableColums": [],
            },
            extDataList: [],//从表单实例获取的动态字段
            entrustSampleExtData: [],//委托样品扩展字段
            codingSampleExtData: [],//编码样品扩展字段
            currentSelFormList: [],
            currentTableUseList: [],
            buttonInfo: {
                col: 24,
                "component": "el-button",
                formList: []
            },
            bulletBoxInfo: {}
        }
    },
    methods: {
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 删除弹框底部按钮
         */
        e_deleteBulletBottomButton(index) {
            this.$confirm('确定删除该按钮吗？').then(() => {
                this.bulletBoxInfo.bodyButtons.splice(index, 1)
            })
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 新增弹框底部按钮
         */
        e_addBulletBottomButton() {
            let params = {
                label: '底部按钮',
                type: 'primary',
                events: ''
            }
            this.bulletBoxInfo.bodyButtons.push(params)
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 删除按钮
         */
        e_delteButton(index) {
            this.$confirm('确定删除该按钮？').then(() => {
                this.buttonInfo.formList.splice(index, 1)
            })
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 新增按钮
         */
        e_addNewButton() {
            let params = {
                label: '新按钮',
                type: 'primary',
                isHide: false,
                anchorPoint: '',
                size: "small"
            }
            this.buttonInfo.formList.push(params)
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 删除子表列
         */
        e_deleteChildColumnslist(index) {
            this.$confirm('确定删除子表的改列').then(() => {
                this.newTableInfo.childTableColums.splice(index, 1)
            })
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 添加子表列
         */
        e_addChildTableColumns() {
            let params = {
                "label": "子表列名",
                "prop": "",
                "checked": true,
                "align": "center",
                "slotName": "itemName",
                "valueType": "fixed"
            }
            this.newTableInfo.childTableColums.push(params)
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 查看是否是否需要子表
         */
        e_checkIsNeedExpand(e) {
            if (e) {
                this.newTableInfo.tableColumns.unshift(this.expandInfo)
            } else {
                this.newTableInfo.tableColumns.forEach((item, i) => {
                    if (item.slotName == 'expand' || item.type == 'expand') {
                        this.newTableInfo.tableColumns.splice(i, 1)
                    }
                })
            }
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 删除操作列插槽按钮
         */
        e_deleteSlotsButton(index) {
            this.$confirm('确定删除该功能按钮以及包含的事件脚本？').then(() => {
                this.newTableInfo.tableSlotButtons.splice(index, 1)
            })
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 添加新的操作列插槽按钮
         */
        e_addNewSlotsButton() {
            let params = {
                label: '新按钮',
                isHide: false,
                events: ''
            }
            this.newTableInfo.tableSlotButtons.push(params)
        },
        /**
         * @author Coder
         * @date 2023/3/26
         * @des 确定固定字段的添加
         */
        e_confirmFixedAdd(form) {
            if (this.editFor == 'mainForm') {
                this.blockInfo.formList.push(form)
                this.$emit('saveAddForm')
            } else {
                this.bulletBoxInfo.formList.push(form)
                this.$emit('saveAddForm', this.bulletBoxInfo)
            }
        },

        /**
         * @author Coder
         * @date 2023/3/24
         * @des 保存
         */
        e_saveNewTable() {
            if (this.editFor == 'mainForm') {
                if (this.activeName == 'table') {
                    this.$refs.newTableInfo.validate(v => {
                        if (v) {
                            this.blockInfo.formList.push(this.newTableInfo)
                            this.$emit('saveAddForm')
                        }
                    })
                } else if (this.activeName == 'button') {
                    console.log('this.buttonInfo', this.buttonInfo)
                    this.blockInfo.formList.push(this.buttonInfo)
                    this.$emit('saveAddForm')
                }

            } else {
                if (this.activeName == 'bulletBox') {
                    this.$emit('saveAddForm', this.bulletBoxInfo)
                } else if (this.activeName == 'table') {
                    this.bulletBoxInfo.formList.push(this.newTableInfo)
                    this.$emit('saveAddForm', this.bulletBoxInfo)
                } else if (this.activeName == 'button') {
                    this.bulletBoxInfo.formList.push(this.buttonInfo)
                    this.$emit('saveAddForm', this.bulletBoxInfo)
                }

            }

        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 添加新的扩展字段成为新列
         */
        e_addNewColumsByExt(e) {
            let params = {
                ...e,
                valueType: 'ext',
                slotName: `${e.prop}`
            }
            this.newTableInfo.tableColumns.push(params)
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 删除列管理 行
         */
        e_deleteColumnslist(index) {
            this.$confirm('确定删除该行吗').then(() => {
                this.newTableInfo.tableColumns.splice(index, 1)
            })
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 添加行
         */
        e_addNewColumn() {
            this.newTableInfo.tableColumns.push({label: '新列'})
        },
        /**
         * @author Coder
         * @date 2023/3/23
         * @des 确定选择的form
         */
        e_saveAddForm(formInfo) {
            formInfo.anchorPoint = formInfo.prop
            formInfo.rules = []
            if (this.editFor == 'mainForm') {
                this.blockInfo.formList.push(formInfo)
                this.$emit('saveAddForm')
            } else {
                this.bulletBoxInfo.formList.push(formInfo)
                console.log('this.bulletBoxInfo', this.bulletBoxInfo)
                this.$emit('saveAddForm', this.bulletBoxInfo)
            }

        },
        /**
         * @author Coder
         * @date 2023/3/23
         * @des 渲染
         */
        init(blockInfo) {
            this.currentSelFormList = JSON.parse(JSON.stringify(blockInfo.formList))
            this.blockInfo = blockInfo
            if (this.editFor == 'bulletBox') {
                this.bulletBoxInfo = JSON.parse(JSON.stringify(this.blockInfo))
            }
            this.showDrawer = true
            this.e_getExtDataList()
            this.e_getBindSampleAndSubSAample()
        },
        /**
         * @author Coder
         * @date 2023/3/23
         * @des 根据业务类型ID获取扩展字段
         */
        e_getExtDataList() {
            this.$net(`formLayout/getExDataConfig?id=${this.businessConfigId}`, 'get').then(re => {
                re.data.forEach(item => {
                    item.col = 8
                })
                this.extDataList = re.data
            })
        },

        /**
         * @author Coder
         * @date 2023/4/13
         * @des 根据业务类型ID获取绑定改类型上面的委托样品和编码样品的扩展字段
         */
        e_getBindSampleAndSubSAample() {
            this.$net(`formLayout/getEntrustInfoAndCodingExDataConfig?id=${this.businessConfigId}`, 'get').then(re => {
                let entrustSampleExtData = [],
                    codingSampleExtData = []
                entrustSampleExtData = re.data.entrustInfo
                codingSampleExtData = re.data.sampleCoding

                entrustSampleExtData.forEach(item => {
                    item.col = 8
                })
                codingSampleExtData.forEach(item => {
                    item.col = 8
                })
                this.entrustSampleExtData = entrustSampleExtData
                this.codingSampleExtData = codingSampleExtData

            })
        },
        e_close() {
            this.$emit('close')
        }
    }
}
</script>
