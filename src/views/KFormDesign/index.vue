<template>
    <a-config-provider :locale="locale">
        <div class="form-designer-container-9136076486841527">
            <k-header v-if="showHead" :title="title"/>
            <!-- 操作区域 start -->
            <operatingArea
                v-if="toolbarsTop"
                :showToolbarsText="showToolbarsText"
                :toolbars="toolbars"
                @handleSave="handleSave"
                @handlePreview="handlePreview"
                @handleOpenImportJsonModal="handleOpenImportJsonModal"
                @handleOpenCodeModal="handleOpenCodeModal"
                @handleOpenJsonModal="handleOpenJsonModal"
                @handleReset="handleReset"
                @handleClose="handleClose"
            >
                <template slot="left-action">
                    <slot name="left-action"></slot>
                </template>

                <template slot="right-action">
                    <slot name="right-action"></slot>
                </template>
            </operatingArea>
            <!-- 操作区域 end -->
            <div
                class="content"
                :class="{
          'show-head': showHead,
          'toolbars-top': toolbarsTop,
          'show-head-and-toolbars-top': toolbarsTop && showHead
        }"
            >
                <!-- 左侧控件区域 start -->
                <aside class="left">
                    <a-collapse
                        @change="collapseChange"
                        :defaultActiveKey="collapseDefaultActiveKey"
                    >
                        <!-- 基础控件 start -->
                        <a-collapse-panel
                            v-if="basicsComponentList.length > 0"
                            header="基础控件"
                            key="1"
                        >
                            <collapseItem
                                :list="basicsArray"
                                @generateKey="generateKey"
                                @handleListPush="handleListPush"
                                @start="handleStart"
                            />
                        </a-collapse-panel>
                        <!-- 基础控件 end -->
                        <!-- 自定义控件 start -->
                        <a-collapse-panel
                            v-if="classificationComponent[componentShowType].length > 0"
                            :header="customComponents.title"
                            key="3"
                        >
                            <collapseItem
                                :list="customizeArray"
                                @generateKey="generateKey"
                                @handleListPush="handleListPush"
                                @start="handleStart"
                            />
                        </a-collapse-panel>
                        <!-- 自定义控件 end -->

                        <!-- 布局控件 start -->
                        <a-collapse-panel
                            v-if="layoutArray.length > 0"
                            header="布局控件"
                            key="4"
                        >
                            <collapseItem
                                :list="layoutArray"
                                @generateKey="generateKey"
                                @handleListPush="handleListPush"
                                @start="handleStart"
                            />
                        </a-collapse-panel>
                        <!-- 布局控件 end -->
                    </a-collapse>
                </aside>
                <!-- 左侧控件区域 end -->

                <!-- 中间面板区域 start -->
                <section>
                    <!-- 操作区域 start -->
                    <operatingArea
                        v-if="!toolbarsTop"
                        :showToolbarsText="showToolbarsText"
                        :toolbars="toolbars"
                        @handleSave="handleSave"
                        @handlePreview="handlePreview"
                        @handleOpenImportJsonModal="handleOpenImportJsonModal"
                        @handleOpenCodeModal="handleOpenCodeModal"
                        @handleOpenJsonModal="handleOpenJsonModal"
                        @handleReset="handleReset"
                        @handleClose="handleClose"
                    >
                        <template slot="left-action">
                            <slot name="left-action"></slot>
                        </template>

                        <template slot="right-action">
                            <slot name="right-action"></slot>
                        </template>
                    </operatingArea>
                    <!-- 操作区域 end -->
                    <k-form-component-panel
                        :class="{ 'no-toolbars-top': !toolbarsTop }"
                        :data="data"
                        :selectItem="selectItem"
                        :noModel="noModel"
                        :hideModel="hideModel"
                        :startType="startType"
                        ref="KFCP"
                        @handleSetSelectItem="handleSetSelectItem"
                    />
                    <!-- 操作区域 start -->
                    <k-json-modal ref="jsonModal"/>
                    <k-code-modal ref="codeModal"/>
                    <importJsonModal ref="importJsonModal"/>
                    <previewModal ref="previewModal"/>
                </section>
                <!-- 中间面板区域 end -->

                <!-- 右侧控件属性区域 start -->
                <aside class="right">
                    <formProperties
                        :config="data.config"
                        :previewOptions="previewOptions"
                        :list="data.list"
                        @setList="setList"
                        :allList="allList"
                    />
                    <formItemProperties
                        :class="{ 'show-properties': showPropertie }"
                        class="form-item-properties"
                        :selectItem="selectItem"
                        :formColumnList="data.list"
                        :hideModel="hideModel"
                        @handleHide="showPropertie = false"
                    />
                </aside>
                <!-- 右侧控件属性区域 end -->
            </div>
            <!-- <k-footer /> -->
        </div>
    </a-config-provider>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 表单设计器
 */
import kHeader from "./module/header";
import operatingArea from "./module/operatingArea";

// import kFooter from "./module/footer";
import kFormComponentPanel from "./module/formComponentPanel";
import kJsonModal from "./module/jsonModal";
import kCodeModal from "./module/codeModal";
import collapseItem from "./module/collapseItem";
import importJsonModal from "./module/importJsonModal";
import previewModal from "../KFormPreview/index.vue";
// import draggable from "vuedraggable";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import 'ant-design-vue/dist/antd.css';
// 导入样式
import "../styles/form-design.less";
import "../core/components_use";
import "../static/icons/iconfont";

import {
    basicsList,
    // highList,
    layoutList,
    customComponents
} from "./config/formItemsConfig";
import formItemProperties from "./module/formItemProperties";
import formProperties from "./module/formProperties";


import {
    getPageConfig,
    updatePageConfig
} from "@/api/desgin/config";


export default {
    name: "KFormDesign",
    props: {
        title: {
            type: String,
            default: "表单设计器 --by kcz"
        },
        showHead: {
            type: Boolean,
            default: false
        },
        toolbarsTop: {
            type: Boolean,
            default: false
        },
        toolbars: {
            type: Array,
            default: () => [
                "save",
                "preview",
                "importJson",
                "exportJson",
                "exportCode",
                "reset",
                "close"
            ]
        },
        showToolbarsText: {
            type: Boolean,
            default: false
        },
        fields: {
            type: Array,
            default: () => [
                "input",
                "textarea",
                "number",
                "select",
                "checkbox",
                "radio",
                "date",
                "time",
                "rate",
                "slider",
                "uploadFile",
                "uploadImg",
                // "cascader",
                // "treeSelect",
                "batch",
                "editor",
                "switch",
                "button",
                // "alert",
                "text",
                "html",
                "divider",
                "card",
                "grid",
                "table",
                "search",
                'tabs',
                "plan",
                "selectEntrustPackage",
                "subcontractCommissioned",
                // "instrumentUseRecord",
                // "referenceMaterialRecord",
                // "chromatographicFile",
                // "meteorologicalGas",

                //记录单控件 start
                "meteorologicalGas",
                "meteorologicalSound",
                "instrumentInfo",
                "sampleAirInfo",
                "sampleWaterSurfaceInfo",
                "sampleWaterGround",
                "sampleWaterWaste",
                "sampleTerra",
                "sceneDetect",
                "sceneNoiseCalibration",
                "sceneNoiseDetect",
                "sceneExhaustDetect",
                "sceneWeighingEnvironment",
                "sceneBlackness",
                // 2021年8月18日
                'waterQuality',
                'carInfo',
                'boilerInformation',
                'fumeInformation',
                'gaseousPollutants',
                'stench',
                'waterQuality',
                'soil',
                'solidWaste',
                // 2021年11月29日
                'noiseScene',
                'smokePollution',
                'particulates',
                'lampblack',
                'smokeBlackness',
                'soundLevelMeter',
                'calibrationGas',
                'calibrationGasInfrared',
                'calibrationPh',
                'calibrationTurbidity',
                'calibrationConductivity',
                'calibrationOxidation',
                'calibrationDissolvedOxygen',
                //记录单控件 end
                'sharedForm',

            ]
        },
        hideModel: {
            // 隐藏数据字段
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            executionTemplateId: 0,
            locale: zhCN,
            customComponents,
            updateTime: 0,
            updateRecordTime: 0,
            showPropertie: false,
            startType: "",
            list: [],
            noModel: [
                "button",
                "divider",
                "card",
                "grid",
                "table",
                "alert",
                "text",
                "html"
            ],
            data: {
                list: [],
                config: {
                    layout: "horizontal",
                    labelCol: {span: 4},
                    wrapperCol: {span: 18},
                    hideRequiredMark: false,
                    customStyle: "",
                    tableCode: "",
                    businessCode: "",
                    pageId: 0,
                }
            },
            previewOptions: {
                width: 1200
            },
            selectItem: {
                key: ""
            },
            //显示的控件类型
            componentShowType: 2, //[1-(方案/委托/分包),2-(设备/客户),3-(记录单)]
            componentShowTypeConfig: {
                'DETECT_SCHEME': 1,
                'ENTRUSTMENT_AGREEMENT': 1,
                'SUBCONTRACT_AGREEMENT': 1,
                'envCustomer': 2,
                'envEquipmentInstrument': 2,
                'RECORD_SHEET': 3,
                'SHARED_FORM': 4,
            },
            basicsComponentList: [
                "input",
                "textarea",
                "number",
                "select",
                "checkbox",
                "radio",
                "date",
                "time",
                "uploadFile",
                "uploadImg",
                "text",
                //布局
                'tabs',
                "card",
                "grid",
                "divider",
                "table",
            ],
            classificationComponent: {
                1: [
                    "plan",
                    "selectEntrustPackage",
                    "subcontractCommissioned",
                ],
                2: [],
                3: [
                    //记录单控件 start
                    "meteorologicalGas",
                    "meteorologicalSound",
                    "instrumentInfo",
                    "sampleAirInfo",
                    "sampleWaterSurfaceInfo",
                    "sampleWaterGround",
                    "sampleWaterWaste",
                    "sampleTerra",
                    "sceneDetect",
                    "sceneNoiseCalibration",
                    "sceneNoiseDetect",
                    "sceneExhaustDetect",
                    "sceneWeighingEnvironment",
                    "sceneBlackness",

                    // 2021年8月18日
                    'waterQuality',
                    'carInfo',
                    'boilerInformation',
                    'fumeInformation',
                    'gaseousPollutants',
                    'stench',
                    'waterQuality',
                    'soil',
                    'solidWaste',
                    // 2021年11月29日
                    'noiseScene',
                    'smokePollution',
                    'particulates',
                    'lampblack',
                    'smokeBlackness',
                    'soundLevelMeter',
                    'calibrationGas',
                    'calibrationGasInfrared',
                    'calibrationPh',
                    'calibrationTurbidity',
                    'calibrationConductivity',
                    'calibrationOxidation',
                    'calibrationDissolvedOxygen',
                    //记录单控件 end
                    'sharedForm',
                ],
                4: [
                    'meteorologicalGas',
                    'waterQuality',
                    'carInfo',
                    'boilerInformation',
                    'fumeInformation',
                    'sharedForm',
                ],
            }
        };
    },
    components: {
        kHeader,
        // kFooter,
        operatingArea,
        collapseItem,
        kJsonModal,
        kCodeModal,
        importJsonModal,
        previewModal,
        kFormComponentPanel,
        formItemProperties,
        formProperties
        // draggable
    },
    computed: {
        //[1-(方案/委托/分包),2-(设备/客户),3-(记录单)]
        allList() {
            console.log('allList', this.classificationComponent[this.componentShowType].filter(item => item === 'plan'));
            if (this.classificationComponent[this.componentShowType].filter(item => item === 'plan').length > 0) {
                return basicsList.filter(item => item.type === 'plan')[0].list
            }
            return [];
        },
        basicsArray() {
            // 计算需要显示的基础字段
            return basicsList.filter(item => this.basicsComponentList.includes(item.type) && !item.vType);
        },
        customizeArray() {
            // 计算需要显示的基础字段
            console.log('customizeArray', basicsList);
            if (this.componentShowType === 4) {
                return basicsList.filter(item => this.classificationComponent[this.componentShowType].includes(item.vType));
            }
            return basicsList.filter(item => this.classificationComponent[this.componentShowType].includes(item.type) || this.classificationComponent[this.componentShowType].includes(item.vType));
        },
        layoutArray() {
            // 计算需要显示的布局字段
            return layoutList.filter(item => this.basicsComponentList.includes(item.type));
        },
        collapseDefaultActiveKey() {
            // 计算当前展开的控件列表
            let defaultActiveKey = window.localStorage.getItem(
                "collapseDefaultActiveKey"
            );
            if (defaultActiveKey) {
                return defaultActiveKey.split(",");
            } else {
                return ["1"];
            }
        }
    },
    methods: {
        generateKey(list, index) {
            // 生成key值
            const key = list[index].type + "_" + new Date().getTime();
            this.$set(list, index, {
                ...list[index],
                key,
                model: key
            });
            if (this.noModel.includes(list[index].type)) {
                // 删除不需要的model属性
                delete list[index].model;
            }
        },
        setList(list) {
            this.data.list = list;
        },
        handleListPush(item) {
            // 双击控件按钮push到list
            // 生成key值
            if (!this.selectItem.key) {
                // 在没有选择表单时，将数据push到this.data.list
                const key = item.type + "_" + new Date().getTime();
                item = {
                    ...item,
                    key,
                    model: key
                };
                if (this.noModel.includes(item.type)) {
                    // 删除不需要的model属性
                    delete item.model;
                }
                const itemString = JSON.stringify(item);
                const record = JSON.parse(itemString);
                // 删除icon及compoent属性
                delete record.icon;
                delete record.component;
                this.data.list.push(record);
                this.handleSetSelectItem(record);
                this.changeType()
                return false;
            }
            this.$refs.KFCP.handleCopy(false, item);
        },
        handleOpenJsonModal() {
            // 打开json预览模态框
            this.$refs.jsonModal.jsonData = this.data;
            this.$refs.jsonModal.visible = true;
        },
        handleOpenCodeModal() {
            // 打开代码预览模态框
            this.$refs.codeModal.jsonData = this.data;
            this.$refs.codeModal.visible = true;
        },
        handleOpenImportJsonModal() {
            console.log('handleOpenImportJsonModal');

            // 打开json预览模态框
            this.$refs.importJsonModal.jsonData = this.data;
            this.$refs.importJsonModal.handleSetSelectItem = this.handleSetSelectItem;
            this.$refs.importJsonModal.visible = true;
        },
        handlePreview() {
            // 打开预览模态框
            this.$refs.previewModal.jsonData = this.data;
            this.$refs.previewModal.previewWidth = this.previewOptions.width;
            this.$refs.previewModal.visible = true;
        },
        handleReset() {
            // 清空
            this.$confirm({
                title: "警告",
                content: "是否确认清空内容?",
                okText: "是",
                okType: "danger",
                cancelText: "否",
                onOk: () => {
                    this.data.list = [];
                    this.handleSetSelectItem({key: ""});
                    this.$message.success("已清空");
                }
            });
        },
        changeType() {
            const type = this.data.config.planType
            let list = JSON.parse(JSON.stringify(this.data.list))
            list.map(item => {
                if (item.type === 'plan') {
                    item.list = item.list.filter(item => item.planType === type)
                }
            })
            this.data.list = list
            // console.log(this.data.list)
        },
        handleSetSelectItem(record) {
            console.log('handleSetSelectItem');
            // console.log(record);
            // 操作间隔不能低于100毫秒
            let newTime = new Date().getTime();
            if (newTime - this.updateTime < 100) {
                return false;
            }

            this.updateTime = newTime;

            // 设置selectItem的值
            this.selectItem = record;

            // 判断是否选中控件，如果选中则弹出属性面板，否则关闭属性面板
            if (record.key) {
                this.startType = record.type;
                this.showPropertie = true;
            } else {
                this.showPropertie = false;
            }
        },
        handleSetData(data) {
            // 用于父组件赋值
            try {
                if (typeof data !== "object") {
                    return false;
                } else {
                    this.data = data;
                    // 导入json数据后，需要清除已选择key
                    this.handleSetSelectItem({key: ""});
                }
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        collapseChange(val) {
            // 点击collapse时，保存当前collapse状态
            window.localStorage.setItem("collapseDefaultActiveKey", val);
        },
        handleStart(type) {
            this.startType = type;
        },
        handleSave() {
            let that = this;
            // 保存函数
            // this.$emit("save", JSON.stringify(this.data));
            // console.log(JSON.stringify(this.data));
            let postData = {
                metaJson: JSON.stringify(this.data),
                fieldJson: JSON.stringify(this.data.list),
                configJson: JSON.stringify(this.data.config),
                id: this.executionTemplateId
            };
            this.$prompt('密码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({value}) => {
                if (value === 'form') {
                    updatePageConfig(postData).then(response => {
                        that.$message.success(response.msg);
                    });
                } else {
                    this.$message({
                        type: 'info',
                        message: '密码错误'
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        handleClose() {
            this.$emit("close");
        },
        testInit() {
            this.executionTemplateId = this.$route.query.executionTemplateId;
            if (this.$route.query && this.$route.query.businessCode) {
                if (this.componentShowTypeConfig[this.$route.query.businessCode]) {
                    this.componentShowType = this.componentShowTypeConfig[this.$route.query.businessCode];
                }
            }
            getPageConfig(this.executionTemplateId).then(response => {
                const editorJsonData = JSON.parse(response.data.metaJson);
                this.data.list = editorJsonData.list;
                this.list = editorJsonData.list;
                this.data.config = editorJsonData.config;
            });
        },

        //公式
        calculationFormula() {
            console.log(this.list);
        }
    },
    mounted() {
        this.testInit();
    }
};
let dev = true;
let prefix = dev ? "http://127.0.0.1" : window.location.protocol + "//" + window.location.host;
let actionUrl = {
    addUrl: '/template/execution/updatePage',
    detailUrl: '/template/execution/edit/'
}
console.log('dev : ' + dev);
console.log('prefix : ' + prefix);
</script>
<style scoped>
/deep/ aside {
    background: #eef1f6;
    padding: 0px 0px;
    margin-bottom: 20px;
    border-radius: 2px;
    display: block;
    line-height: 32px;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
