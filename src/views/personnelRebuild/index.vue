<template>
  <div>
    <listContainer :businessConfigId="businessConfigId + ''" ref="listContainer"
                   :canEdit="$checkPermi(['micFoundation:entrustCommon:formlayout'])"
                   @handleSelectionChange="handleSelectionChange">
      <template slot="botabs">
        <el-tabs v-model="activeIndex" @tab-click="handleSelect">
          <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.configName"
                       :name="String(index)" />
        </el-tabs>
      </template>
      <template slot="bobutton">
        <!--    按钮-->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5" v-for="(v, i) in pluginsInfo.mainHomeButtons" :key="i">
            <el-button :type="v.type" :size="v.size" @click="e_slotButtonEvents(v)">{{ v.label }}
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
    <addPerson
      ref="personRef"
      v-if="personShow"
      @close="personShow = false"
      @reload="reload"
    />
  </div>
</template>

<script>
import listContainer from '@/components/executionTemplate/tableColumnConfig/listContainer';
import addPerson from './dialog/addPerson.vue'
import Vue from 'vue'
export default {
  name: "index",
  components: {
    listContainer,
    addPerson,
  },
  async created() {
    this.getPluginsForButtons('personalBtN', (pluginsInfo) => {
      console.log('插件按钮', pluginsInfo)
      this.pluginsInfo = pluginsInfo
    })
    await this.doLoadMicroApp('microProject', this.microProjectEntry)
  },
  mounted() {
    this.getBusinessConfigInfo()
  },
  data() {
    return {
      pluginsInfo: {}, //插件按钮
      businessConfigId: null,
      activeIndex: '0',
      tabList: [],
      projectSlotButtonList: {},
      personShow: false,
    }
  },
  methods: {
    reload() {
      this.personShow = false
      this.$refs.listContainer.getList()
      this.$refs.listContainer.reset()
    },
    // 获取人员管理id
    getBusinessConfigInfo() {
      this.$net('/template/execution/run/getBusinessConfig/PERSON_BASE_INFO', 'get').then(re => {
        this.tabList = re.data
        this.businessConfigId = re.data[0].id
      })
    },
    /**
     * @author Coder
     * @date 2023/4/4
     * @des 切换业务类型
     */
    handleSelect() {
      let tabInfo = this.tabList[this.activeIndex]
      this.businessConfigId = tabInfo.id
    },
    /**
     * @author Coder
     * @date 2023/3/29
     * @des 列表多选回馈
     */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.selectionList = selection
    },
    /**
     * @author Coder
     * @date 2023/4/20
     * @des 处理table action表格按钮
     */
    checkActionButton(events, scope) {
      return eval(events)
    },
    checkActionButtonNew(events, scope) {
      return new Function('ctx', 'scope', events)(this, scope)
    },
    // 新版 table 行内按钮事件
    e_actionButtonEventsNew(widgetInfo, scope) {
      new Function('ctx', 'scope', 'widgetInfo', widgetInfo.clickEvents)(this, scope, widgetInfo)
    },
    /**
     * @author Coder
     * @date 2023/4/20
     * @des 插槽按钮事件
     */
    e_slotButtonEvents(v) {
      var that = this
      new Function('that', v.events)(that)
    },
    /**
     * @author Coder
     * @date 2023/4/20
     * @des table 自定义操作按钮事件
     */
    e_actionButtonEvents(v, scope) {
      var that = this
      new Function('that', 'scope', v.clickEvents)(that, scope)
    },
  }
}
</script>

<style scoped>

</style>
