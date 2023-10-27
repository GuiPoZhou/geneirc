
<script>
import diyTable from './table.vue'
import selComponent from './selComponent.vue'
export default {
    components: {
        diyTable,
        selComponent,
    },
    props: {
        direction: String,
        title: String,
        size: {
            typeof: String,
            default: '100%'
        },
        stepList: Array,
        stepIndex: Number,
        inspectTypeId: Number
    },
    data() {
        return {
            showselComponent: false,
            showDrawer: false,
            KevinDrawerBodyHeight: 0,
            treeList: [],
            defaultProps: {
                children: 'childList',
                label: 'nodeName'
            },
            mainTypeId: '',
            selPointId: '',
            detailIds: [],
            editTableDataIndex: -1,
            ruleForm: {
                name: '模板名称',
                isDefault: 0,
                inspectTypeId: this.inspectTypeId,
                content: {
                    components: 'kevin-accept-table',
                    title: "设备验收业务表格",
                    WIDGETID: '',
                    height: 30,
                    colSpan: 24,
                    tableData: [],
                    tableColumns: [
                        {
                            label: '验收要求',
                            prop: 'acceptanceCriteria',
                            slotName: 'acceptanceCriteria',
                            vModelType: 'fixed',
                            vModelActionType: 'input',
                            canEditCellFormType: false,
                            vModelActionOptions: {
                                disabled: false
                            }
                        }, {
                            label: '验收情况',
                            prop: 'acceptanceStatus',
                            slotName: 'acceptanceStatus',
                            vModelType: 'fixed',
                            canEditCellFormType: true,
                            vModelActionType: 'input',
                            vModelActionOptions: {
                                disabled: true
                            }
                        }, {
                            type: 'action',
                            fixed: 'right',
                            prop: 'action',
                            label: '操作',
                            slotName: 'action'
                        }
                    ],
                    tableSelectData: [],
                    tableActions: [
                        {
                            title: '移除',
                            isHide: false,
                            events: "_this.$confirm('确定移除该行?').then(() => { widgetInfo.tableData.splice(scope.$index,1) })"
                        }
                    ]
                }
            },
        }
    },
    mounted() {
        this.getBrowserHeight()
        window.addEventListener('resize', this.getBrowserHeight);
    },
    methods: {
        e_addTableData() {
            let vModelActionType = this.ruleForm.content.tableData
            let params = {
                acceptanceCriteria: '内容',
                acceptanceStatus: '验收情况'
            }
            this.ruleForm.content.tableData.push(params)
        },
        e_inputOver() {
            this.ruleForm = { ...this.ruleForm }
            this.$nextTick(() => {
                this.$refs.diyTable.$forceUpdate()
            })

        },
        e_deleteTableSlotData(childScope, scope) {
            this.$confirm('确定删除该行选项').then(() => {
                scope.row.vModelActionOptions.dataSource.list.splice(childScope.$index, 1)
            })
        },
        e_addTableSlotData(scope) {
            let maxIndex = scope.row.vModelActionOptions.dataSource.list.length
            let params = {
                label: `选项${maxIndex + 1}`,
                value: `选项${maxIndex + 1}`
            }
            scope.row.vModelActionOptions.dataSource.list.push(params)
        },
        getRowClass(row) {
            let res = [];
            if (row.vModelActionType != 'input') {
                res.push('row-expand-has');
                return res;
            } else {
                res.push('row-expand-unhas');
                return res;
            }
        },
        e_selColumsModelType(row) {
            if (row.vModelActionType == 'input') {
                row.vModelActionOptions = {}

            } else if (row.vModelActionType == 'radio') {
                row.vModelActionOptions = {
                    disabled: false,
                    dataSource: {
                        list: [
                            {
                                label: '合格',
                                value: '合格'
                            },
                            {
                                label: '不合格',
                                value: '不合格'
                            },
                            {
                                label: '未知',
                                value: '未知'
                            },
                        ],
                    }
                }
            }
        },
        e_save() {
            this.$refs.ruleForm.validate(v => {
                if (v) {
                    if (this.ruleForm.content.tableData.length == 0) {
                        this.$message.error('至少添加一条模板信息数据')
                        return
                    }
                    let emptyacceptanceCriteriaList = this.ruleForm.content.tableData.filter(item => {
                        return item.acceptanceCriteria == ''
                    })
                    if (emptyacceptanceCriteriaList.length != 0) {
                        this.$message.error(`${this.ruleForm.content.tableColumns[0].label}不能为空`)
                        return
                    }
                    let formLayoutConfigStr = JSON.stringify(this.ruleForm)
                    let resultStr = formLayoutConfigStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    if(this.ruleForm.id){
                  
                        let params = JSON.parse(resultStr)
                        params.inspectTypeId = this.inspectTypeId
                        this.$net('/equipment/v1/inspect/config/detail/edit', 'post', params).then(re => {
                        if (re.code == 200) {
                            this.$message.success('保存成功')
                            this.$emit('editReload', params)
                        } else {
                            this.$message.error(re.msg)
                        }
                    })
                    }else{
                        this.$net('/equipment/v1/inspect/config/detail/save', 'post', JSON.parse(resultStr)).then(re => {
                        if (re.code == 200) {
                            this.$message.success('保存成功')
                            this.$emit('saveReload',  JSON.parse(resultStr))
                        } else {
                            this.$message.error(re.msg)
                        }
                    })
                    }
                   
                }
            })
        },
        handleNodeClick(data) {
            this.selPointId = data.id
        },
        // 查询物料类型树
        getMaterialTypeTree() {
            this.$net('/material/type/selectTree', 'get').then(re => {
                this.treeList = re.data
                this.mainTypeId = this.treeList[0].id
            })
        },
        init() {
            this.showDrawer = true
        },
        editInit(data) {
            let formDataStr = JSON.stringify(data)
            let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            let fromData = JSON.parse(resultDataStr)
            this.ruleForm = fromData
            this.showDrawer = true
        },
        getBrowserHeight() {
            let browserHeight = window.innerHeight;
            // 使用 $refs 来访问 ref 为 "kevin_drawer_head" 的元素
            const drawerHeadElement = this.$refs.kevin_drawer_head;

            // 获取元素的实际高度
            if (drawerHeadElement) {
                const height = drawerHeadElement.clientHeight; // 或者 offsetHeight
                console.log('Drawer Head Height:', height);
                this.KevinDrawerBodyHeight = browserHeight - height
            }
        },
        getDrawerHeadHeight() {

        },
        e_close() {
            this.$emit('close')
        },
        commonTableSlotInputRender(scope, columnInfo) {
            return (
                <el-input className="tableSlotInput" v-model={scope.row[columnInfo['prop']]} disabled={columnInfo.vModelActionOptions.disabled}></el-input>
            )
        },
        commonTableSlotRadioRender(scope, columnInfo) {
            return (
                <el-radio-group
                    v-model={scope.row[columnInfo['prop']]}
                    disabled={true}
                >
                    {
                        scope.row.vModelActionOptions.dataSource.list.map((radioOptions, radioIndex) => {
                            return (
                                <el-radio label={radioOptions.value}>{radioOptions.label}</el-radio>
                            )
                        })
                    }
                </el-radio-group>
            )
        },
        appendCommonTableActionColumn(scopedSlots, columnInfo) {
            scopedSlots['action'] = (scope) => {
                return (
                    <div>
                        {
                            this.ruleForm.content.tableActions.map(slotButtonInfo => {
                                if (!slotButtonInfo.isHide) {
                                    return (
                                        <el-button type="text"
                                            onClick={() => {
                                                this.mainTableActionButtonEvents(slotButtonInfo, scope, columnInfo)
                                            }}
                                        >{slotButtonInfo.title}</el-button>
                                    )
                                }
                            })
                        }
                    </div>
                )
            }

        },
        mainTableActionButtonEvents(slotButtonInfo, scope, columnInfo) {
            this.$confirm('确定删除该行?').then(() => {
                this.ruleForm.content.tableData.splice(scope.$index, 1)
            })
        },
        e_openSelCom(scope) {
            this.editTableDataIndex = scope.$index
            this.showselComponent = true
            this.$nextTick(() => {
                this.$refs.selComponent.init()
            })
        },
        renderModelTable() {
            let scopedSlots = {}
            this.ruleForm.content.tableColumns.forEach((columnInfo) => {
                if (columnInfo.slotName == 'action') {
                    // 操作列
                    this.appendCommonTableActionColumn(scopedSlots, columnInfo)
                } else {
                    scopedSlots[columnInfo['slotName']] = (scope) => {
                        if (columnInfo.canEditCellFormType && scope.row.vModelActionType == '-') {
                            return (
                                <el-button type="text" onClick={() => { this.e_openSelCom(scope) }}>选择组件</el-button>
                            )
                        } else if (!columnInfo.canEditCellFormType && scope.row.vModelActionType == 'input') {
                            return this.commonTableSlotInputRender(scope, columnInfo)
                        } else if (columnInfo.canEditCellFormType) {
                            switch (scope.row.vModelActionType) {
                                case 'input':
                                    return this.commonTableSlotInputRender(scope, columnInfo)
                                case 'radio':
                                    return this.commonTableSlotRadioRender(scope, columnInfo)
                            }
                        } else {
                            return this.commonTableSlotInputRender(scope, columnInfo)
                        }

                    }
                }

            })
            return (
                <diyTable scopedSlots={scopedSlots} ref="diyTable" columns={this.ruleForm.content.tableColumns} data={this.ruleForm.content.tableData} border>

                </diyTable>
            )
        },
        addNewData() {
            let params = {
                acceptanceCriteria: "",
                acceptanceStatus: "",
                vModelActionType: '-',
            }
            this.ruleForm.content.tableData.push(params)
        },
        confirmCom(data) {
            this.showselComponent = false
            if (data.vModelActionType == 'input') {
                this.ruleForm.content.tableData[this.editTableDataIndex].vModelActionType = 'input'
            } else {
                this.ruleForm.content.tableData[this.editTableDataIndex].vModelActionType = data.vModelActionType
                this.ruleForm.content.tableData[this.editTableDataIndex].vModelActionOptions = data.vModelActionOptions
                console.log('this.ruleForm.content.tableData', this.ruleForm.content.tableData)
            }
        },
    },
    render(createElement, context) {
        return (
            <div class="kevin_drawer">
                <el-drawer visible={this.showDrawer} close-on-press-escape destroy-on-close show-close={false} onClose={() => { this.e_close() }}
                    wrapperClosable={false} size="60%" custom-class="customerdraw" direction="rtl">
                    <div slot="title" class="kevin_drawer_head" ref="kevin_drawer_head">
                        <span class="drawertitle">维护验收要求</span>
                        <div class="kevin_top_buttons">
                            <el-button size="small" type="primary" onClick={() => { this.e_save() }}>保存</el-button>
                            <el-button size="small" onClick={() => { this.e_close() }}>取消</el-button>
                        </div>
                    </div>
                    <div class="kevin_drawer_body" ref="kevin_drawer_body" style={{ height: this.KevinDrawerBodyHeight + 'px' }}>
                        <div class="tree_area">
                            <el-form props={{ model: this.ruleForm }} ref="ruleForm" label-width="120px" class="demo-ruleForm">
                                <el-row>
                                    <el-col span={12}>
                                        <el-form-item label="验收模板名称" prop="name"
                                            rules={[{ required: true, message: '请输入模板名称', trigger: 'blur' }]}>
                                            <el-input v-model={this.ruleForm.name}></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-divider content-position="left">配置模板列信息</el-divider>
                                <el-row>
                                    {
                                        this.ruleForm.content.tableColumns.map(tt => {
                                            return (
                                                <el-col span={8}>
                                                    <el-input style="width:90%" v-model={tt.label}></el-input>
                                                </el-col>
                                            )
                                        })
                                    }

                                </el-row>
                                <el-divider content-position="left">配置模板数据信息</el-divider>
                                <el-button size="small" type="primary" onClick={() => { this.addNewData() }}>新增</el-button>
                                {
                                    this.renderModelTable()
                                }

                            </el-form>
                        </div>
                    </div>
                </el-drawer>
                {
                    this.showselComponent ? <selComponent ref="selComponent" onClose={() => { this.showselComponent = false }} onSave={(data) => { this.confirmCom(data) }} /> : ''
                }
            </div >
        )
    }

}
</script>

<style scoped lang="scss">
.kevin_drawer {
    width: 100%;
    height: 100%;
    overflow: hidden;

    /deep/.el-tree-node.is-current>.el-tree-node__content {

        background-color: #4468EE !important;
        color: #FFD55E;
        font-size: 1.2rem;
        font-weight: bold;
        border-radius: 0.2rem;

    }

    /deep/.el-drawer {
        padding: 0 !important;
        overflow: hidden;
    }

    /deep/.el-drawer__body {
        overflow: hidden !important;
    }

    /deep/.el-form-item__content>div {
        width: 98.5%;
    }

    /deep/.el-drawer__header {
        padding: 0 !important;
        margin: 0 !important;
    }

    .kevin_drawer_head {
        width: 100%;
        height: 3.5rem;
        background-color: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .kevin_top_buttons {
            width: 20%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            margin-right: 1rem;
        }
    }

    .kevin_drawer_body {
        width: 100%;
        height: 100%;
        background-color: #fff;
        overflow: hidden;
        padding: 0.5rem;

        .tree_area {
            width: 100%;
            height: 100%;
            overflow: auto;
            scrollbar-width: none;
            /* 隐藏标准滚动条（适用于Firefox） */
            -ms-overflow-style: none;

            /* 隐藏IE和Edge浏览器的滚动条 */
            &::-webkit-scrollbar {
                width: 0;
                /* 隐藏滚动条（适用于WebKit引擎，如Chrome和Safari） */
            }

            /deep/thead .el-input__inner {
                text-align: center !important;
                width: 200px;
            }
        }
    }

    .drawertitle {
        font-size: 1.4rem;
        margin-left: 1rem;
        // background: linear-gradient(to right, #1267CE 33%, #D4D4D4 33%, #D4D4D4 66%, #EB8918 66%);
        // background-clip: text;
        // -webkit-background-clip: text;
        // color: transparent;
        // user-select: none;
        // -webkit-user-select: none;
        // -moz-user-select: none;
        // -ms-user-select: none;
    }
}

/deep/.row-expand-unhas .el-table__expand-column {
    pointer-events: none;
}

/deep/.row-expand-unhas .el-table__expand-column .el-icon {
    visibility: hidden;
}

.expandArea {
    width: 100%;
    padding: 0.6rem;
    background-color: #F5F7FA;
}
</style> 