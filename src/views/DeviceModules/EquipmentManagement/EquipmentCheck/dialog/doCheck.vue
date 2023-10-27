<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="dialogWidth" :close-on-click-modal="false"
            :close-on-press-escape="false" @close="e_close" :append-to-body="true">
            <el-form :model="form" ref="form"
                :label-width="KevinJson.KevinWidget.labelWidth ? KevinJson.KevinWidget.labelWidth + 'px' : '100px'"
                @submit.native.prevent :form="form" class="demo-ruleForm"
                :label-position="KevinJson.KevinWidget.formlabelPosition || 'top'">
                <el-row v-if="!nullKevinJson">
                    <KevinRender ref="KevinRender" :context="context" :Widget="renderWidget" :form="form" />
                </el-row>
                <el-empty v-else :description="`请配置【${widgetId}】低码唯一键`"></el-empty>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :type="buttonInfo.type" :size="buttonInfo.size"
                    v-for="(buttonInfo, buttonIndex) in dialogFooterButtons" :key="buttonIndex"
                    :loading="buttonInfo.isLoading" @click="e_dialogButtonEvents(buttonInfo)">
                    {{ buttonInfo.title }}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogTitle: '',
            dialogVisible: false,
            renderWidget: [],
            dialogFooterButtons: [],
            dialogWidth: '50%',
            KevinJson: {
                KevinWidget: {}
            },
            nullKevinJson: false,
            context: this,
            form: {
                extData: {}
            },
            widgetId: "equipment_check_doCheck",
            businessEnv: 'add', //add 新增  edit 编辑   detail 详情
            mainRowInfo: {},
        }
    },
    methods: {
        async init(mainRowInfo) {
            this.mainRowInfo = mainRowInfo
            this.dialogVisible = true
            this.e_getWidgetInfo()
        },
        async editInit(data, type = 'edit') {
            this.dialogVisible = true
            this.businessEnv = type
            this.form = JSON.parse(JSON.stringify(data))
            await this.e_getWidgetInfo()
        },
        async e_getWidgetInfo() {
            let re = await this.$net('/formLayout/v2/getFormLayoutConfig', 'get', { id: this.widgetId })
            this.dialogFooterButtons = []
            try {
                let formDataStr = re.data.configStr
                let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                let info = JSON.parse(resultDataStr)
                let KevinJson = info.KevinJson
                this.KevinJson = KevinJson
                this.showKevinLog = true
                this.dialogTitle = KevinJson.KevinWidget.title
                this.dialogWidth = `${KevinJson.KevinWidget.width}%`
                this.renderWidget = KevinJson.KevinWidget.children
                KevinJson.KevinWidget.diaLogFooterButton.forEach(dfb => {
                    if (!dfb.statusEvents || new Function('ctx', '_this', dfb.statusEvents)(this, this.$refs.KevinRender)) {
                        this.dialogFooterButtons.push(dfb)
                    }
                })
                this.$nextTick(() => {
                    this.runWidgetAutoEvents(KevinJson.KevinWidget.autoEvents)
                    this.$refs.KevinRender.getWidgetServerData(this.renderWidget)
                    this.container = this.$refs.KevinRender
                })
            } catch {
                this.nullKevinJson = true
            }
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