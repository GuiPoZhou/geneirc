<template>
    <div>
        <listContainer :businessConfigId="businessConfigId + ''" :runType="2" ref="listContainer"
            @handleSelectionChange="handleSelectionChange" :canEdit="true">
            <template slot="botabs">
                <el-tabs v-model="businessConfigId">
                    <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label"
                        :name="String(item.value)" />
                </el-tabs>
            </template>
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
            <template slot="action" scope="scope">
                <el-button type="text" size="mini"
                    v-show="(!actionInfo.disabled || actionInfo.disabled == '') ? true : checkActionButtonNew(actionInfo.disabled, scope.slotScopt)"
                    v-for="(actionInfo, actionIndex) in pluginsInfo.mainTableButtons" :key="actionIndex + Math.random()"
                    @click="e_actionButtonEventsNew(actionInfo, scope.slotScopt)" :loading="actionInfo.isLoading">{{
                        actionInfo.label }}
                </el-button>
            </template>
        </listContainer>
        <!-- 新增采购申请 -->
        <apply ref="apply" v-if="showapply" @close="showapply = false" @saveReload="e_saveReload" />
    </div>
</template>

<script>
import listContainer from '../../../components/executionTemplate/tableColumnConfig/listContainer.vue';
import apply from './dialog/apply.vue'
export default {
    components: {
        listContainer,
        apply
    },
    data() {
        return {
            showapply: false,
            businessConfigId: '',//device_procurement_wait 待提交 device_procurement_already //已提交
            tabList: [
                {
                    label: '待提交',
                    value: '1695105424'
                }, {
                    label: '已提交',
                    value: '1695105425'
                }
            ],
            pluginsInfo: {},
            selectTableList:[]
        }
    },
    mounted() {
        this.businessConfigId = '1695105424'
    },
    created() {
        this.e_getPluginsForButtons()
    },
    methods: {
        checkMainHomebutton(v) {
            return new Function('ctx', v.statusEvents)(this)
        },
        e_slotButtonEvents(v) {
            new Function('ctx', v.events)(this)
        },
        e_saveReload() {
            this.showapply = false
            this.$refs.listContainer.getList()
            this.$refs.listContainer.reset()
        },
        handleSelectionChange(e) {
            this.selectTableList = e
        },
        e_addApplay() {
            this.showapply = true
            this.$nextTick(() => {
                this.$refs.apply.init()
            })
        },
        // 获取插件按钮
        e_getPluginsForButtons() {
            this.getPluginsForButtons('device_procurement_plugns', (pluginsInfo) => {
                console.log('插件按钮', pluginsInfo)
                this.pluginsInfo = pluginsInfo
            })
        },
        e_actionButtonEventsNew(widgetInfo, scope) {
            new Function('ctx', 'scope', 'widgetInfo', widgetInfo.clickEvents)(this, scope, widgetInfo)
        },
        checkActionButtonNew(events, scope) {
            return new Function('ctx', 'scope', events)(this, scope)
        },
    }
}
</script>

<style></style>