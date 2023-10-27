<template>
    <div class="kevin_main_page">
        <el-form :model="form" ref="form" label-width="130px" :form="form" class="demo-ruleForm"
            :label-position="KevinJson.KevinWidget.formlabelPosition || 'top'">
            <el-row v-if="!nullKevinJson">
                <KevinRender ref="KevinRender" :context="context" :Widget="renderWidget" :form="form" />
            </el-row>
            <el-empty v-else :description="`请配置【${widgetId}】低码唯一键`"></el-empty>
        </el-form>
        <!-- 执行点检 -->
        <doCheck ref="doCheck" v-if="showdoCheck" @close="showdoCheck = false" @save="e_saveDoCheck" />
        <!-- 点检记录 -->
        <checkHis ref="checkHis" v-if="showcheckHis" @close="showcheckHis = false" />
    </div>
</template>

<script>
import doCheck from './dialog/doCheck.vue'
import checkHis from './dialog/checkHis.vue'
export default {
    components: {
        doCheck,
        checkHis
    },
    data() {
        return {
            showcheckHis: false,
            showdoCheck: false,
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
            widgetId: 'equipment_check_do_list',
            businessEnv: 'add',
            container: {},
            nullKevinJson: false
        }
    },
    mounted() {
        this.e_getWidgetInfo()
    },
    methods: {
        e_saveDoCheck(params) {
            this.showdoCheck = false
            new Function('ctx', '_this', 'params', this.KevinJson.KevinWidget.manuallyEvents.doCheck)(this, this.$refs.KevinRender, params)
        },
        getList() {
            if (this.KevinJson.KevinWidget.manuallyEvents.getList) {
                new Function('ctx', '_this', this.KevinJson.KevinWidget.manuallyEvents.getList)(this, this.$refs.KevinRender)
            } else {
                console.error('请配置表单手动执行脚本，并命名为 getList')
            }

        },
        async e_getWidgetInfo() {
            let re = await this.$net('/formLayout/v2/getFormLayoutConfig', 'get', { id: this.widgetId })
            try {
                let formDataStr = re.data.configStr
                let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                let info = JSON.parse(resultDataStr)
                let KevinJson = info.KevinJson
                this.KevinJson = KevinJson
                this.showKevinLog = true
                this.dialogTitle = KevinJson.KevinWidget.title
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