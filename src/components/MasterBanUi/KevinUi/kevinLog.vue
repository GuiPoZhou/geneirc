<script>
import formRender from "./formRender.vue"
import AddWidget from "./addWidget.vue";
import kevinCodeEditor from "./kevinCodeEditor.vue";
import DetectType from '@/components/project/detectType.vue'
import selectItem from '@/components/DetectSubItemManage/selectItem.vue'
import AddTestItems from '@/components/project_items/addTestItems'
import judgmentCriteria from "./components/judgmentCriteria.vue";
import bulletBoxScriptEditor from "./bulletBoxScriptEditor.vue";
import SelectUserPage from '@/components/customerService/selectUserPage.vue'

import signleEdit from './signleEdit/index.vue'
export default {
    name: 'kevin-log',
    data() {
        return {
            showbulletBoxScriptEditor: false,
            showLog: false,
            form: {
                extData: {}
            },
            showAddWidget: false,
            editIndex: undefined,
            showKevinEditor: false,
            showDetectType: false,
            showselectItem: false,
            editDataIndex: undefined,
            showAddTestItems: false,
            showjudgmentCriteria: false,
            showsignleEdit: false,
            openLogType: '',
            showSelectUserPage: false

        }
    },
    components: {
        formRender,
        AddWidget,
        kevinCodeEditor,
        DetectType,
        selectItem,
        AddTestItems,
        judgmentCriteria,
        bulletBoxScriptEditor,
        signleEdit,
        SelectUserPage
    },
    props: {
        widgetForm: {
            typeof: Object,
            default: () => {
            }
        },
        businessConfigId: {
            typeof: String,
            default: ''
        },
        itemBindType: Number,
        openEnv: {
            typeof: 'String',
            default: 'add'
        }
    },
    created() {
        window.KevinLogThis = this
    },
    methods: {
        /**
         * @author Coder
         * @date 2023/4/7
         * @des 回填
         */
        e_saveItem(itemParams) {
            console.log('itemParams', itemParams);
            this.showselectItem = false;
            eval(this.widgetForm.events.appendItemTable)
        },
        /**
         * @author Coder
         * @date 2023/4/6
         * @des 确定选择的检测类别
         */
        backfillCategory(params) {
            this.showDetectType = false
            eval(this.widgetForm.events.openSelectItem)
        },
        /**
         * @author Coder
         * @date 2023/4/6
         * @des
         */
        e_openDetectType() {
            this.showDetectType = true
        },
        /**
         * @author Coder
         * @date 2023/3/24
         * @des 管理弹框内的区域
         */
        e_editBulletBox() {
            this.showAddWidget = true
            this.$nextTick(() => {
                this.$refs.AddWidget.init(this.widgetForm)
            })
        },
        /**
        * @author Coder
        * @date 2023/4/19
        * @des 初次渲染打开
        */
        init() {
            this.showLog = true
            this.doEvents()
        },
        /**
        * @author Coder
        * @date 2023/4/19
        * @des 编辑修改打开
        */
        editDataInit(editIndex, data) {
            console.log('编辑回填', data)
            this.showLog = true
            eval(this.widgetForm.events.editDataInitEvents)
            this.$forceUpdate()
        },
        /**
        * @author Coder
        * @date 2023/4/25
        * @des 查看详情打开
        */
        detailInfoInit(data) {
            this.showLog = true
            eval(this.widgetForm.events.detailInfoInitEvents)
        },
        /**
         * @author Coder
         * @date 2023/3/27
         * @des 自动执行弹框组件绑定的全局事件
         */
        doEvents() {
            if (this.widgetForm.openEvents) {
                for (let key in this.widgetForm.openEvents) {
                    eval(this.widgetForm.openEvents[key])
                }
            }
        },
        editInit(index, type = 'customer') {
            this.openLogType = type
            this.showLog = true
            this.editIndex = index
        },
        e_close() {
            // this.$emit('close')
            let bottomBtn = this.widgetForm.bodyButtons.filter(item => {
                return item.anchorPoint == 'bottomCloseBtn'
            })[0]
            eval(bottomBtn.events)
        },
        e_bottomBtnEvents(events) {
            let that = this
            let doEvents = new Function('that', events)
            doEvents(that)
        },
        e_saveEdit(params) {
            this.showAddWidget = false
            this.$emit('saveAddForm', { params: params, index: this.editIndex })
        },
        e_showEditor() {
            this.showKevinEditor = true
            this.$nextTick(() => {
                this.$refs.kevinCodeEditor.init({ codeJson: this.widgetForm })
            })
        },
        e_saveFormEditor(params) {
            this.showKevinEditor = false
            this.$emit('saveAddForm', { params: params.codeJson, index: this.editIndex })
        },
        /**
         * @author Coder
         * @date 2023/3/28
         * @des 快速查询目标节点
         */
        getNode(tree, treeChildrenName, sourceAttributeName, sourceAttributeValue) {
            let targetAttribute = {}
            if (Array.isArray(tree) && tree.length > 0) {
                tree.some(node => {
                    if (node[sourceAttributeName] === sourceAttributeValue) {
                        targetAttribute = node
                        return true;
                    } else if (node[treeChildrenName] !== undefined) {
                        let temp = EntrustThis.getNode(node[treeChildrenName], treeChildrenName, sourceAttributeName, sourceAttributeValue, targetAttribute)
                        if (Object.keys(temp).length > 0) {
                            targetAttribute = temp
                            return true
                        }
                    }
                })
            }
            return targetAttribute
        },
        //关闭
        confirmCriteria(list, events) {
            console.log('指定回调', list)
            console.log('指定回调', events)
            this.showjudgmentCriteria = false
            var that = this
            new Function('that', 'list', events)(that, list)
        },
        // 管理弹框脚本
        e_editBulletboxScript() {
            console.log(this.widgetForm)
            this.showbulletBoxScriptEditor = true
            this.$nextTick(() => {
                this.$refs.bulletBoxScriptEditor.init(this.widgetForm)
            })
        },
        // 保存弹框的脚本编辑
        saveBulletBoxScript(params) {
            this.showbulletBoxScriptEditor = false
            this.$emit('saveBulletBoxScript', params)
        },
        // 开启单项编辑
        e_dosignleEdit(params) {
            this.showsignleEdit = true
            this.$nextTick(() => {
                this.$refs.signleEdit.init(params, 'bulletBox')
            })
        },
        // 保存单项编辑
        e_saveSignleEdit(info) {
            this.showsignleEdit = false
            this.$emit('saveSignleEdit', info)
        },
        //确定选择的人员
        e_confirmSelectUser(userInfo) {
            console.log('选择的人员信息', userInfo)
            this.showSelectUserPage = false
            var that = this
            if (sessionStorage.getItem('callBackUserInfo')) {
                let events = sessionStorage.getItem('callBackUserInfo')
                eval(events)
                this.form = { ...this.form }
            }
        }
    },
    render(createElement, context) {
        return (
            <div>
                <ml-dialog ref="KevinLogMlDialog" dia-log-show={this.showLog} dia-log-title={this.widgetForm.title} dia-log-width="60%"
                    show-edit-drag={this.$checkPermi(['micFoundation:entrustCommon:formlayout']) && this.openLogType == 'editBullet'} onConfirmFormDesgin={() => {
                        this.$emit('confirmFormDesgin')
                    }} has-permi={true} onClose={() => {
                        this.e_close()
                    }}>
                    <template slot="bologbody">
                        <el-form ref="kevinLogForm" props={{ model: this.form }} label-width="120px" label-position={this.widgetForm.formLabelPosition ? this.widgetForm.formLabelPosition : 'top'}>
                            {this.microStore.state.system.closeDrag ? '' : <el-row style="margin-bottom:10px">
                                <el-col span={24}>
                                    <el-button type="primary" size="mini" onClick={() => {
                                        this.e_editBulletBox()
                                    }}>管理弹框内容
                                    </el-button>
                                    <el-button type="success" size="mini" onClick={() => {
                                        this.e_editBulletboxScript()
                                    }}>弹框内容脚本
                                    </el-button>
                                    <el-button type="warning" size="mini" onClick={() => {
                                        this.e_showEditor()
                                    }}>弹框内容JSON
                                    </el-button>
                                </el-col>
                            </el-row>}
                            <formRender ref="formRender" formJSON={this.widgetForm.formList} form={this.form} group={Math.random()} onSignleEdit={(params) => {
                                this.e_dosignleEdit(params)
                            }} />
                        </el-form>
                    </template>
                    <template slot="bologfooter">
                        {
                            this.widgetForm.bodyButtons.map(buttonInfo => {
                                if (!buttonInfo.isHide) {
                                    return (
                                        <el-button
                                            type={buttonInfo.type ? buttonInfo.type : '-'} size={buttonInfo.size ? buttonInfo.size : 'small'} onClick={() => {
                                                eval(buttonInfo.events)
                                            }
                                            }>{buttonInfo.label}</el-button>
                                    )
                                }

                            })
                        }
                    </template>
                </ml-dialog>
                {
                    this.showAddWidget ?
                        <AddWidget ref="AddWidget" editFor="bulletBox" businessConfigId={this.businessConfigId} mainTableTags="ENTRUST_INFO_GIVE"
                            onClose={() => {
                                this.showAddWidget = false
                            }}
                            onSaveAddForm={(params) => {
                                this.e_saveEdit(params)
                            }} /> : ''
                }
                {
                    this.showKevinEditor ? <kevinCodeEditor ref="kevinCodeEditor" onSave={(params) => {
                        this.e_saveFormEditor(params)
                    }} onClose={() => {
                        this.showKevinEditor = false
                    }} /> : ''
                }
                {
                    this.showDetectType ? <DetectType
                        ref="DetectType"
                        visible={this.showDetectType}
                        onCancel={() => {
                            this.showDetectType = false
                        }}
                        onHandleClick={(params) => {
                            this.backfillCategory(params)
                        }}
                    /> : ''
                }
                {
                    this.showselectItem ? <selectItem ref="selectItem" onCancel={() => {
                        this.showselectItem = false
                    }} onSaveItem={(params) => {
                        this.e_saveItem(params)
                    }} /> : ''
                }
                {
                    this.showAddTestItems ? <AddTestItems ref="AddTestItems" onCancel={() => {
                        this.showselectItem = false
                    }} onReload={(params) => {
                        this.e_saveItem(params)
                    }} /> : ''
                }
                {
                    this.showjudgmentCriteria ? <judgmentCriteria ref="judgmentCriteria" onClose={(list, events) => { this.confirmCriteria(list, events) }} /> : ''
                }
                {
                    this.showbulletBoxScriptEditor ? <bulletBoxScriptEditor ref="bulletBoxScriptEditor" onClose={() => { this.showbulletBoxScriptEditor = false }} onSaveBulletBoxScript={(params) => { this.saveBulletBoxScript(params) }} /> : ''
                }
                {
                    this.showsignleEdit ? <signleEdit ref="signleEdit" onClose={() => { this.showsignleEdit = false }} onSaveSignleEdit={(info) => { this.e_saveSignleEdit(info) }} /> : ''
                }
                {
                    this.showSelectUserPage ? <SelectUserPage ref="SelectUserPage" onCancel={() => { this.showSelectUserPage=false }} onConfirm={(userInfo) => {
                        this.e_confirmSelectUser(userInfo)
                    }}/>:''
                }
            </div>
        )
    }
}
</script>
