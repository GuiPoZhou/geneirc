<template>
    <div>
        <listContainer :businessConfigId="businessConfigId + ''" :runType="2" ref="listContainer"
            @handleSelectionChange="handleSelectionChange" :canEdit="true">
            <template slot="bobutton">
                <!--    按钮-->
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5" v-for="(v, i) in pluginsInfo.mainHomeButtons" :key="i">
                        <el-button :type="v.type" :size="v.size" v-if="checkMainHomebutton(v)"
                            @click="e_slotButtonEvents(v)">{{ v.label }}
                        </el-button>
                    </el-col>
                </el-row>
            </template>
            <!-- 操作列按钮 -->
            <template slot="action" scope="scope">
                <el-button type="text" size="mini"
                    v-show="(!actionInfo.disabled || actionInfo.disabled == '') ? true : checkActionButtonNew(actionInfo.disabled, scope.slotScopt)"
                    v-for="(actionInfo, actionIndex) in pluginsInfo.mainTableButtons" :key="actionIndex + Math.random()"
                    @click="e_actionButtonEventsNew(actionInfo, scope.slotScopt)" :loading="actionInfo.isLoading">{{
                        actionInfo.label }}
                </el-button>
            </template>
        </listContainer>
        <addTemplate ref="addTemplate" v-if="showaddTemplate" @close="showaddTemplate = false" @saveReload="e_saveReload"></addTemplate>
    </div>
</template>

<script>
import listContainer from '@/components/executionTemplate/tableColumnConfig/listContainer.vue';
import addTemplate from './dialog/add.vue';
export default {
    components: {
        listContainer,
        addTemplate
    },
    data() {
        return {
            businessConfigId: '',
            selectTableList: [],
            pluginsInfo: {},
            pluginsKey: 'equipment_check_template_plugins',
            showaddTemplate: false,
        }
    },
    created() {
        this.e_getPluginsForButtons()
    },
    mounted() {
        this.businessConfigId = '1696916239'
    },
    methods: {
        e_saveReload(){
            this.showaddTemplate = false
            this.$refs.listContainer.getList()
            this.$refs.listContainer.reset()
        },
        e_slotButtonEvents(v) {
            new Function('ctx', v.events)(this)
        },
        checkMainHomebutton(v) {
            return new Function('ctx', v.statusEvents)(this)
        },
        e_actionButtonEventsNew(widgetInfo, scope) {
            new Function('ctx', 'scope', 'widgetInfo', widgetInfo.clickEvents)(this, scope, widgetInfo)
        },
        checkActionButtonNew(events, scope) {
            return new Function('ctx', 'scope', events)(this, scope)
        },
        // 获取插件按钮
        e_getPluginsForButtons() {
            this.getPluginsForButtons(this.pluginsKey, (pluginsInfo) => {
                console.log('插件按钮', pluginsInfo)
                this.pluginsInfo = pluginsInfo
            })
        },
        handleSelectionChange(list) {
            this.selectTableList = list
        },
    }
}
</script>

<style></style>