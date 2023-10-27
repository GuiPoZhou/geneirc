<template>
    <div class="kevin_main_page">
        <el-form :model="form" ref="form" label-width="130px" :form="form" class="demo-ruleForm"
            :label-position="KevinJson.KevinWidget.formlabelPosition || 'top'">
            <el-row v-if="!nullKevinJson">
                <KevinRender ref="KevinRender" :context="context" :Widget="renderWidget" :form="form" />
            </el-row>
            <el-empty v-else :description="`请配置【${widgetId}】低码唯一键`"></el-empty>
        </el-form>
        <!-- 选择设备 -->
        <commonEquipmentSelect ref="commonEquipmentSelect" v-if="shwoCommonEquipmentSelect"
            @close="shwoCommonEquipmentSelect = false" @save="e_confirmSelectEquipment" />
        <!-- 选择模板 -->
        <checkTemplate ref="checkTemplate" v-if="showcheckTemplate" @close="showcheckTemplate = false"
            @save="e_confirmBind" />
        <!-- 选择人员 -->
        <selectUser ref="selectUser" v-if="showSelectUser" @close="showSelectUser = false" @save="e_confirmUser" />
        <!-- 设置点检日期 -->
        <beginCheckDate ref="beginCheckDate" v-if="showbeginCheckDate" @close="showbeginCheckDate = false"
            @save="e_confirmBeginCheckDate" />
    </div>
</template>

<script>
import checkTemplate from './dialog/checkTemplate.vue'
import commonEquipmentSelect from './dialog/selectEquipment.vue'
import selectUser from "@/components/lowcode/common/selectUser";
import beginCheckDate from './dialog/beginCheckDate.vue';
export default {
    components: {
        commonEquipmentSelect,
        checkTemplate,
        selectUser,
        beginCheckDate
    },
    data() {
        return {
            showbeginCheckDate: false,
            showSelectUser: false,
            showcheckTemplate: false,
            shwoCommonEquipmentSelect: false,
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
            widgetId: 'equipment_check_config_index',
            businessEnv: 'add',
            container: {},
            nullKevinJson: false
        }
    },
    mounted() {
        this.e_getWidgetInfo()
    },
    methods: {
        e_confirmBeginCheckDate(date) {
            this.showbeginCheckDate = false
            new Function('ctx', '_this', 'date', this.KevinJson.KevinWidget.manuallyEvents.beginCheckDate)(this, this.$refs.KevinRender, date)
        },
        e_confirmUser(userInfo) {
            this.showSelectUser = false
            new Function('ctx', '_this', 'userInfo', this.KevinJson.KevinWidget.manuallyEvents.confirmUser)(this, this.$refs.KevinRender, userInfo)
        },
        e_confirmBind(templateId) {
            this.showcheckTemplate = false
            new Function('ctx', '_this', 'templateId', this.KevinJson.KevinWidget.manuallyEvents.bindTemplate)(this, this.$refs.KevinRender, templateId)

        },
        e_confirmSelectEquipment(ids) {
            this.shwoCommonEquipmentSelect = false
            new Function('ctx', '_this', 'ids', this.KevinJson.KevinWidget.manuallyEvents.saveSelctEquipment)(this, this.$refs.KevinRender, ids)
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