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
    </div>
</template>

<script>
export default {
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
            widgetId: 'device_procurement_info',
            container: null,
        }
    },
    methods: {
        init() {
            this.showKevinLog = true
            this.e_getWidgetInfo()
        },
        async editInit(row, businessEnv = 'edit') {
            this.businessEnv = businessEnv
            this.showKevinLog = true
            await this.e_getWidgetInfo()
            new Function('ctx', '_this', 'mainTableData', this.KevinJson.KevinWidget.manuallyEvents.pushDeviceInfo)(this, this.$refs.KevinRender, row)
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
        },
        e_close() {
            this.$emit('close')
        }
    }

}
</script>

<style></style>