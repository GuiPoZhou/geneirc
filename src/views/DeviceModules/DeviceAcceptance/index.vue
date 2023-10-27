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
        <!-- 设备验收 -->
        <acceptance ref="acceptance" v-if="showacceptance" @close="showacceptance = false" @saveReload="e_saveReload" />
    </div>
</template>

<script>
import listContainer from '../../../components/executionTemplate/tableColumnConfig/listContainer.vue';
import acceptance from './dialog/acceptance.vue';
export default {
    components: {
        listContainer,
        acceptance,
    },
    data() {
        return {
            businessConfigId: '',// 1695196349
            accepttanceType: '', //ARRIVAL_ACCEPTANCE 到货验收   SAFETY_ACCEPTANCE  安全验收 FUNCTIONAL_ACCEPTANCE 功能验收  METROLOGY_ACCEPTANCE 计量验收
            selectTableList: [],
            pluginsInfo: {},
            pluginsKey: 'device_asseptance_plugins',
            paramsRouter: false,
            tabList: [],
            tabListARRIVAL_ACCEPTANCE: [
                {
                    label: '待验收',
                    value: '1695196349'
                }, {
                    label: '已验收',
                    value: '1695196350'
                }
            ],
            tabListSAFETY_ACCEPTANCE: [
                {
                    label: '待验收',
                    value: '1695196351'
                }, {
                    label: '已验收',
                    value: '1695196352'
                }
            ],
            tabListFUNCTIONAL_ACCEPTANCE: [
                {
                    label: '待验收',
                    value: '1695196353'
                }, {
                    label: '已验收',
                    value: '1695196354'
                }
            ],
            tabListMETROLOGY_ACCEPTANCE: [
                {
                    label: '待验收',
                    value: '1695196355'
                }, {
                    label: '已验收',
                    value: '1695196356'
                }
            ],
            showacceptance: false,
        }
    },
    watch: {
        '$route.path': function (newVal, oldVal) {
            if (newVal != oldVal) {
                this.accepttanceType = this.$route.params.accepttanceType
            }
        },
        accepttanceType(val) {
            if (val == 'ARRIVAL_ACCEPTANCE') {
                this.tabList = this.tabListARRIVAL_ACCEPTANCE
            } else if (val == 'SAFETY_ACCEPTANCE') {
                this.tabList = this.tabListSAFETY_ACCEPTANCE
            } else if (val == 'FUNCTIONAL_ACCEPTANCE') {
                this.tabList = this.tabListFUNCTIONAL_ACCEPTANCE
            } else if (val == 'METROLOGY_ACCEPTANCE') {
                this.tabList = this.tabListMETROLOGY_ACCEPTANCE
            }
            this.businessConfigId = this.tabList[0].value
        }
    },
    created() {
        this.accepttanceType = this.$route.params.accepttanceType
        this.e_getPluginsForButtons()
    },
    methods: {
        e_saveReload() {
            this.showacceptance = false
            this.$refs.listContainer.getList()
            this.$refs.listContainer.reset()
        },
        // 获取插件按钮
        e_getPluginsForButtons() {
            this.getPluginsForButtons(this.pluginsKey, (pluginsInfo) => {
                console.log('插件按钮', pluginsInfo)
                this.pluginsInfo = pluginsInfo
            })
        },
        checkMainHomebutton(v) {
            return new Function('ctx', v.statusEvents)(this)
        },
        handleSelectionChange(e) {
            this.selectTableList = e
        },
        e_actionButtonEventsNew(widgetInfo, scope) {
            new Function('ctx', 'scope', 'widgetInfo', widgetInfo.clickEvents)(this, scope, widgetInfo)
        },
        checkActionButtonNew(events, scope) {
            return new Function('ctx', 'scope', events)(this, scope)
        },
    },
}
</script>

<style></style>