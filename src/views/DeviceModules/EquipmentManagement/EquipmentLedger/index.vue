<template>
    <div class="kevin_main_page">
        <el-form :model="form" ref="form" label-width="130px" :form="form" class="demo-ruleForm"
            :label-position="KevinJson.KevinWidget.formlabelPosition || 'top'">
            <el-row v-if="!nullKevinJson">
                <KevinRender ref="KevinRender" :context="context" :Widget="renderWidget" :form="form" />
            </el-row>
            <el-empty v-else :description="`请配置【widgetId】低码唯一键`"></el-empty>
        </el-form>
        <!-- 设备台账表单 -->
        <equipmentInfo ref="equipmentInfo" v-if="showequipmentInfo" @close="showequipmentInfo = false"
            @save="e_saveEquipment" />
    </div>
</template>

<script>
import equipmentInfo from './dialog/equipmentInfo.vue'
export default {
    components: {
        equipmentInfo
    },
    data() {
        return {
            showequipmentInfo: false,
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
            widgetId: 'equipment_ledger_list',
            businessEnv: 'add',
            container: {},
            nullKevinJson: false
        }
    },
    mounted() {
        this.e_getWidgetInfo()
    },
    methods: {
        e_saveEquipment(params) {
            this.showequipmentInfo = false
            if (this.KevinJson.KevinWidget.manuallyEvents.saveEquipment) {
                new Function("ctx", '_this', 'params', this.KevinJson.KevinWidget.manuallyEvents.saveEquipment)(this, this.$refs.KevinRender, params)
            } else {
                console.error('请维护保存设备脚本 key:saveEquipment')
            }
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

<style scoped>
.kevin_main_page {
    padding: 0.7rem;
}
</style>