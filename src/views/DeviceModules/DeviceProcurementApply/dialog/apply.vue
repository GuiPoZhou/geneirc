<template>
    <div>
        <BoDialog :diaLogShow="showKevinLog" :fullScreen="fullScreen" :diaLogTitle="dialogTitle" @close="e_close">
            <template slot="bologbody">
                <el-form :model="form" ref="form" label-width="100px" :form="form" class="demo-ruleForm"
                    :label-position="KevinJson.KevinWidget.formlabelPosition || 'top'">
                    <el-row>
                        <KevinRender ref="KevinRender" :context="context" :Widget="renderWidget" :form="form" />
                    </el-row>
                </el-form>
            </template>
            <template slot="bologfooter">
                <el-button :type="buttonInfo.type" :size="buttonInfo.size"
                    v-for="(buttonInfo, buttonIndex) in dialogFooterButtons" :key="buttonIndex"
                    :loading="buttonInfo.isLoading" @click="e_dialogButtonEvents(buttonInfo)">
                    {{ buttonInfo.title }}
                </el-button>
            </template>
        </BoDialog>
        <applyDeviceBase ref="applyDeviceBase" v-if="showapplyDeviceBase" @close="showapplyDeviceBase = false"
            @confirm="e_confirm" />
    </div>
</template>

<script>
import applyDeviceBase from './applyDeviceBase.vue'
export default {
    components: {
        applyDeviceBase
    },
    data() {
        return {
            showKevinLog: false,
            fullScreen: false,
            dialogTitle: '',
            renderWidget: [],
            dialogFooterButtons: [],
            KevinJson: {
                KevinWidget: {}
            },
            context: this,
            form: {
                extData: {}
            },
            runKevinRender: false,
            widgetId: 'device_procurement',
            container: null,
            businessEnv: 'add',//add 新增  edit 编辑   detail 详情
            mainTableRowStatus: undefined,//主数据状态
            showapplyDeviceBase: false
        }
    },
    methods: {
        e_confirm(data) {
            this.showapplyDeviceBase = false
            new Function('ctx', "_this", 'callbackData', this.KevinJson.KevinWidget.manuallyEvents.saveDeviceInfo)(this, this.$refs.KevinRender, data)
        },
        init() {
            this.showKevinLog = true
            this.e_getWidgetInfo()

        },
        async editInit(row, businessEnv = 'edit') {
            this.businessEnv = businessEnv
            this.showKevinLog = true
            await this.e_getWidgetInfo()
            new Function('ctx', "_this", 'mainTableData', this.KevinJson.KevinWidget.manuallyEvents.getDeviceApplyInfo)(this, this.$refs.KevinRender, row)
        },
        async e_getWidgetInfo() {
            let re = await this.$net('/formLayout/v2/getFormLayoutConfig', 'get', { id: this.widgetId })
            let formDataStr = re.data.configStr
            let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            let info = JSON.parse(resultDataStr)
            let KevinJson = info.KevinJson
            this.KevinJson = KevinJson
            this.showKevinLog = true
            this.dialogTitle = KevinJson.KevinWidget.title
            this.renderWidget = KevinJson.KevinWidget.children
            KevinJson.KevinWidget.diaLogFooterButton.forEach(dfb => {
                if (!dfb.statusEvents || new Function('ctx', '_this', dfb.statusEvents)(this,this.$refs.KevinRender)) {
                    this.dialogFooterButtons.push(dfb)
                }
            })
            // this.dialogFooterButtons = KevinJson.KevinWidget.diaLogFooterButton
            this.fullScreen = true

            this.$nextTick(() => {
                this.runWidgetAutoEvents(KevinJson.KevinWidget.autoEvents)
                this.$refs.KevinRender.getWidgetServerData(this.renderWidget)
                this.container = this.$refs.KevinRender
            })

        },
        // 弹框底部动态按钮事件执行
        e_dialogButtonEvents(widgetInfo) {
            new Function('ctx', '_this', 'widgetInfo', widgetInfo.events)(this, this.$refs.KevinRender, widgetInfo)
            this.$forceUpdate()
        },
        // 执行动态表单自动执行脚本
        runWidgetAutoEvents(autoEvents) {
            if (autoEvents) {
                for (let key in autoEvents) {
                    new Function('ctx', '_this', autoEvents[key])(this, this.$refs.KevinRender)
                }
            }
            this.form = { ...this.form }
        },
        e_close() {
            this.$emit('close')
        }
    }

}
</script>

<style></style>