<template>
    <div class="kevin_main_page">
        <el-form :model="form" ref="form" label-width="130px" :form="form" class="demo-ruleForm"
            :label-position="KevinJson.KevinWidget.formlabelPosition || 'top'">
            <el-row v-if="!nullKevinJson">
                <KevinRender ref="KevinRender" :context="context" :Widget="renderWidget" :form="form" />
            </el-row>
            <el-empty v-else :description="`请配置【${widgetId}】低码唯一键`"></el-empty>
        </el-form>
        <add ref="add" v-if="showAdd" @close="showAdd = false" @save="e_saveReload"/>
    </div>
</template>

<script>
import add from './dialog/add.vue'
export default {
    components: {
        add
    },
    data() {
        return {
            showAdd: false,
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
            widgetId: 'satisfactionSurvey_list',
            businessEnv: 'add',
            container: {},
            nullKevinJson: false
        }
    },
    mounted() {
        this.e_getWidgetInfo()

    },
    methods: {
        e_saveReload(){
            this.showAdd = false
            this.form = {
                pageSize: 10,
                pageNum: 1,
                extData: {}
            }
            this.getList()            
        },
        getList() {
            if (this.KevinJson.KevinWidget.manuallyEvents.getList) {
                new Function('ctx', '_this', this.KevinJson.KevinWidget.manuallyEvents.getList)(this, this.$refs.KevinRender)
            } else {
                console.log('请配置表单手动执行脚本，并命名为 getList')
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