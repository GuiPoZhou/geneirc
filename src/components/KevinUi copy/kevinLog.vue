<script>
import formRender from "./formRender.vue"
import AddWidget from "./addWidget.vue";
import kevinCodeEditor from "./kevinCodeEditor.vue";
// import DetectType from '@/components/project/detectType.vue'
// import selectItem from '@/components/DetectItemManage/selectItem.vue'

export default {
    name: 'kevin-log',
    data() {
        return {
            showLog: false,
            form: {
                extData: {}
            },
            showAddWidget: false,
            editIndex: undefined,
            showKevinEditor: false,
            showDetectType: false,
            showselectItem: false,
            editDataIndex:undefined,
        }
    },
    components: {
        formRender,
        AddWidget,
        kevinCodeEditor,
        // DetectType,
        // selectItem
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
        itemBindType: Number
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
         * @date 2023/4/25
         * @des 查看详情打开
         */
        detailInfoInit(data){
            this.showLog = true
            eval(this.widgetForm.events.detailInfoInitEvents)
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
        editDataInit(editIndex,data){
            this.showLog = true
            eval(this.widgetForm.events.editDataInitEvents)
        },
        /**
         * @author Coder
         * @date 2023/3/27
         * @des 自动执行弹框组件绑定的全局事件
         */
        doEvents() {
            console.log('this.widgetForm.events', this.widgetForm.events)
            if (this.widgetForm.events) {
                for (let key in this.widgetForm.events) {
                    console.log('this.widgetForm.events[key]', this.widgetForm.events[key])
                    eval(this.widgetForm.events[key])
                }
            }
        },
        editInit(index) {
            this.showLog = true
            this.editIndex = index
        },
        e_close() {
            this.$emit('close')
        },
        e_bottomBtnEvents(events) {
            let that = this
            let doEvents = new Function('that', events)
            doEvents(that)
        },
        e_saveEdit(params) {
            this.showAddWidget = false
            this.$emit('saveAddForm', {params: params, index: this.editIndex})
        },
        e_showEditor() {
            this.showKevinEditor = true
            this.$nextTick(() => {
                this.$refs.kevinCodeEditor.init({codeJson: this.widgetForm})
            })
        },
        e_saveFormEditor(params) {
            this.showKevinEditor = false
            console.log('params', params)
            this.$emit('saveAddForm', {params: params.codeJson, index: this.editIndex})
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
    },
    render(createElement, context) {
        return (
            <div>
                <ml-dialog ref="KevinLogMlDialog"  dia-log-show={this.showLog} dia-log-title={this.widgetForm.title} dia-log-width="60%"
                           show-edit-drag={false} onConfirmFormDesgin={() => {
                    this.$emit('confirmFormDesgin')
                }} has-permi={true} onClose={() => {
                    this.e_close()
                }}>
                    <template slot="bologbody">
                        <el-form ref="kevinLogForm" model={this.form} label-width="120px">
                            {this.microStore.state.system.closeDrag ? '' : <el-row style="margin-bottom:10px">
                                <el-col span={24}>
                                    <el-button type="success" size="mini" onClick={() => {
                                        this.e_editBulletBox()
                                    }}>管理弹框内容
                                    </el-button>
                                    <el-button type="warning" size="mini" onClick={() => {
                                        this.e_showEditor()
                                    }}>内容Code
                                    </el-button>
                                </el-col>
                            </el-row>}

                            <formRender ref="formRender" formJSON={this.widgetForm.formList} form={this.form} group={Math.random()}/>
                        </el-form>
                    </template>
                    <template slot="bologfooter">
                        {
                            this.widgetForm.bodyButtons.map(buttonInfo => {
                                if(!buttonInfo.isHide){
                                    return (
                                        <el-button
                                            type={buttonInfo.type ? buttonInfo.type : '-'} size={buttonInfo.size?buttonInfo.size:'small'} onClick={() => {
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
                        <AddWidget ref="AddWidget" editFor="bulletBox" businessConfigId={this.businessConfigId}
                                   onClose={() => {
                                       this.showAddWidget = false
                                   }}
                                   onSaveAddForm={(params) => {
                                       this.e_saveEdit(params)
                                   }}/> : ''
                }
                {
                    this.showKevinEditor ? <kevinCodeEditor ref="kevinCodeEditor" onSave={(params) => {
                        this.e_saveFormEditor(params)
                    }} onClose={() => {
                        this.showKevinEditor = false
                    }}/> : ''
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
                    }}/> : ''
                }
            </div>
        )
    }
}
</script>
