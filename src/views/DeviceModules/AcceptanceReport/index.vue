<template>
    <div class="kevin_main_page" :style="{ height: innerHeight + 'px' }">
        <el-form :model="form" ref="form" label-width="100px" :form="form" class="demo-ruleForm"
            :label-position="KevinJson.KevinWidget.formlabelPosition || 'top'">
            <el-row v-if="!nullKevinJson">
                <KevinRender ref="KevinRender" :context="context" :Widget="renderWidget" :form="form" />
            </el-row>
            <el-empty v-else :description="`请配置【${widgetId}】低码唯一键`"></el-empty>

        </el-form>
        <showPdf ref="showPdf" v-if="openshowPdf" @close="openshowPdf = false" />
    </div>
</template>

<script>
import showPdf from './showPdf.vue'
export default {
    components: {
        showPdf,
    },
    data() {
        return {
            openshowPdf: false,
            form: {
                pageSize: 10,
                pageNum: 1,
                extData: {}
            },
            renderWidget: [],
            KevinJson: {
                KevinWidget: {}
            },
            context: this,
            widgetId: 'accpetance_report_main_page', // 记得对应好低码唯一键
            businessEnv: 'add', //add 新增  edit 编辑   detail 详情
            container: {},
            innerHeight: 0,
            nullKevinJson: false
        }
    },
    created() {
        this.getInnerHeight()
        document.addEventListener('resize', this.getInnerHeight)
    },
    mounted() {

        this.e_getWidgetInfo()
    },
    methods: {
        getInnerHeight() {
            this.innerHeight = window.innerHeight - 65
        },
        async e_getWidgetInfo() {
            let re = await this.$net('/formLayout/v2/getFormLayoutConfig', 'get', { id: this.widgetId })
            try {
                let formDataStr = re.data.configStr
                let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                let info = JSON.parse(resultDataStr)
                let KevinJson = info.KevinJson
                this.KevinJson = KevinJson
                this.renderWidget = KevinJson.KevinWidget.children
                this.$nextTick(() => {
                    this.runWidgetAutoEvents(KevinJson.KevinWidget.autoEvents)
                    this.$refs.KevinRender.getWidgetServerData(this.renderWidget)
                    this.container = this.$refs.KevinRender
                })
            } catch {
                this.nullKevinJson = true
            }

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
    }
}
</script>

<style lang="scss">
.kevin_main_page {
    margin: 0.7rem;
    padding: 8px;
    background-color: #fff;
    border-radius: 8px;
    overflow: auto;
}

.kevin_main_page .el-form--inline .el-form-item {
    width: 100%;
}

.kevin_main_page .el-select {
    width: 100%;
}
</style>