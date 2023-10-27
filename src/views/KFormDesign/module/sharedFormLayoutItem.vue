<template>
  <div
    :class="{
      'layout-width': ['grid', 'table', 'card', 'divider', 'html'].includes(
        record.type
      )
    }"
  >



    <!-- 栅格布局 start -->
    <template v-if="record.type === 'grid'">
      <div
        class="grid-box"
        :class="{ active: record.key === selectItem.key }"
        @click.stop="handleSelectItem(record)"
      >
        <a-row class="grid-row" :gutter="record.options.gutter">
          <a-col
            class="grid-col"
            v-for="(colItem, idnex) in record.columns"
            :key="idnex"
            :span="colItem.span || 0"
          >
              <transition-group tag="div" name="list" class="list-main">
                <sharedFormLayoutItem
                  class="drag-move"
                  v-for="item in colItem.list"
                  :key="item.key"
                  :selectItem.sync="selectItem"
                  :startType="startType"
                  :insertAllowedType="insertAllowedType"
                  :insertFormulaAllowedType="insertFormulaAllowedType"
                  :record="item"
                  :hideModel="hideModel"
                  :config="config"
                  @handleSelectItem="handleSelectItem"
                  @handleColAdd="handleColAdd"
                  @handleCopy="$emit('handleCopy')"
                  @handleShowRightMenu="handleShowRightMenu"
                  @handleDetele="$emit('handleDetele')"
                />
              </transition-group>
          </a-col>
        </a-row>
      </div>
    </template>
    <!-- 栅格布局 end -->
    <!-- 卡片布局 start -->
    <template v-else-if="record.type === 'card'">
      <div
        class="grid-box"
        :class="{ active: record.key === selectItem.key }"
        @click.stop="handleSelectItem(record)"
      >
        <a-card class="grid-row" :title="record.label">
          <div class="grid-col">
              <transition-group tag="div" name="list" class="list-main">
                <sharedFormLayoutItem
                  class="drag-move"
                  v-for="item in record.list"
                  :key="item.key"
                  :selectItem.sync="selectItem"
                  :startType="startType"
                  :insertAllowedType="insertAllowedType"
                  :insertFormulaAllowedType="insertFormulaAllowedType"
                  :record="item"
                  :hideModel="hideModel"
                  :config="config"
                  @handleSelectItem="handleSelectItem"
                  @handleColAdd="handleColAdd"
                  @handleCopy="$emit('handleCopy')"
                  @handleShowRightMenu="handleShowRightMenu"
                  @handleDetele="$emit('handleDetele')"
                />
              </transition-group>
          </div>
        </a-card>
      </div>
    </template>
    <!-- 卡片布局 end -->
    <!-- 表格布局 start -->
    <template v-else-if="record.type === 'table'">
      <div
        class="table-box"
        :class="{ active: record.key === selectItem.key }"
        @click.stop="handleSelectItem(record)"
      >
        <table
          class="table-layout kk-table-9136076486841527"
          :class="{
            bright: record.options.bright,
            small: record.options.small,
            bordered: record.options.bordered
          }"
          :style="record.options.customStyle"
        >
          <tr v-for="(trItem, trIndex) in record.trs" :key="trIndex">
            <td
              class="table-td"
              v-for="(tdItem, tdIndex) in trItem.tds"
              :key="tdIndex"
              :colspan="tdItem.colspan"
              :rowspan="tdItem.rowspan"
              @contextmenu.prevent="
                $emit('handleShowRightMenu', $event, record, trIndex, tdIndex)
              "
            >
                <transition-group tag="div" name="list" class="list-main">
                  <sharedFormLayoutItem
                    class="drag-move"
                    v-for="item in tdItem.list"
                    :key="item.key"
                    :selectItem.sync="selectItem"
                    :startType="startType"
                    :insertAllowedType="insertAllowedType"
                    :insertFormulaAllowedType="insertFormulaAllowedType"
                    :record="item"
                    :hideModel="hideModel"
                    :config="config"
                    @handleSelectItem="handleSelectItem"
                    @handleColAdd="handleColAdd"
                    @handleCopy="$emit('handleCopy')"
                    @handleShowRightMenu="handleShowRightMenu"
                    @handleDetele="$emit('handleDetele')"
                  />
                </transition-group>
            </td>
          </tr>
        </table>
      </div>
    </template>
    <!-- 表格布局 end -->

    <!-- tabs布局 start -->
    <template v-else-if="record.type === 'tabs'">
      <div
        class="grid-box"
        :class="{ active: record.key === selectItem.key }"
        @click.stop="handleSelectItem(record)"
      >
        <a-tabs default-active-key="1" class="grid-row" >
          <a-tab-pane :key="colItem.key" :tab="colItem.tabName" v-for="(colItem, idnex) in record.columns" :forceRender="true">
              <transition-group tag="div" name="list" class="list-main">
                <sharedFormLayoutItem
                  class="drag-move"
                  v-for="item in colItem.list"
                  :key="item.key"
                  :selectItem.sync="selectItem"
                  :startType="startType"
                  :insertAllowedType="insertAllowedType"
                  :record="item"
                  :hideModel="hideModel"
                  :config="config"
                  @handleSelectItem="handleSelectItem"
                  @handleColAdd="handleColAdd"
                  @handleCopy="$emit('handleCopy')"
                  @handleShowRightMenu="handleShowRightMenu"
                  @handleDetele="$emit('handleDetele')"
                />
              </transition-group>
          </a-tab-pane>
        </a-tabs>
      </div>

    </template>
    <!-- tabs布局 end -->



    <!-- 动态公式容器 Start -->

    <template v-else-if="record.type === 'dynamicFormula'">
      <formNode
        :key="record.key"
        :selectItem.sync="selectItem"
        :record="record"
        :config="config"
        :hideModel="hideModel"
        @handleSelectItem="handleSelectItem"
        @handleCopy="$emit('handleCopy')"
        @handleDetele="$emit('handleDetele')"
        @handleShowRightMenu="$emit('handleShowRightMenu')"
      />
    </template>



    <!-- 公共表单 -->
    <template v-else-if="record.type === 'sharedForm'">
      <div
        class="grid-box"
        :class="{ active: record.key === selectItem.key }"
        @click.stop="handleSelectItem(record)"
      >
        <div class="batch-label">公共表单</div>
        <a-row class="grid-row" :gutter="record.options.gutter">
          <a-col
            class="grid-col"
            v-for="(colItem, idnex) in record.columns"
            :key="idnex"
            :span="colItem.span || 0"
          >
            <transition-group tag="div" name="list" class="list-main">
              <sharedFormLayoutItem
                class="drag-move"
                v-for="item in colItem.list"
                :key="item.key"
                :selectItem.sync="selectItem"
                :startType="startType"
                :insertAllowedType="insertAllowedType"
                :insertFormulaAllowedType="insertFormulaAllowedType"
                :record="item"
                :hideModel="hideModel"
                :config="config"
                @handleSelectItem="handleSelectItem"
                @handleColAdd="handleColAdd"
                @handleCopy="$emit('handleCopy')"
                @handleShowRightMenu="handleShowRightMenu"
                @handleDetele="$emit('handleDetele')"
              />
            </transition-group>
          </a-col>
        </a-row>
      </div>
    </template>
    <template v-else>
      <formNode
        :key="record.key"
        :selectItem.sync="selectItem"
        :record="record"
        :config="config"
        :hideModel="hideModel"
        @handleSelectItem="handleSelectItem"
        @handleCopy="$emit('handleCopy')"
        @handleDetele="$emit('handleDetele')"
        @handleShowRightMenu="$emit('handleShowRightMenu')"
      />
    </template>

  </div>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 使用递归组件调用自己，生成布局结构及表单
 */
import draggable from "vuedraggable";
import formNode from "./formNode";
export default {
  name: "sharedFormLayoutItem",
  props: {
    record: {
      type: Object,
      required: true
    },
    selectItem: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    startType: {
      type: String,
      required: true
    },
    insertAllowedType: {
      type: Array,
      required: true
    },
    insertFormulaAllowedType: {
      type: Array,
      // required: true
    },
    insertSharedFormAllowedType: {
      type: Array,
    },
    hideModel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    insertAllowed() {
      return this.insertAllowedType.includes(this.startType);
    },
    insertAllowedFormula() {
      return this.insertFormulaAllowedType.includes(this.startType);
    },
    insertAllowedSharedForm() {
      return this.insertSharedFormAllowedType.includes(this.startType);
    }
  },
  components: {
    formNode,
    draggable
  },
  methods: {
    handleShowRightMenu(e, record, trIndex, tdIndex) {
      console.log('handleShowRightMenu');
      this.$emit("handleShowRightMenu", e, record, trIndex, tdIndex);
    },
    handleSelectItem(record) {
      this.$emit("handleSelectItem", record);
    },
    handleColAdd(e, list) {
      console.log('handleColAdd');
      this.$emit("handleColAdd", e, list);
    }
  }
};
</script>
