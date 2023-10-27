<template>
  <!-- 栅格布局 -->
  <a-row
    v-if="record.type === 'grid' || record.vType === 'grid'"
    class="grid-row"
    :gutter="record.options.gutter"
  >
    <a-col
      class="grid-col"
      v-for="(colItem, idnex) in record.columns"
      :key="idnex"
      :span="colItem.span || 0"
    >
      <buildBlocks
        ref="nestedComponents"
        @handleReset="$emit('handleReset')"
        @change="handleChange"
        v-for="item in colItem.list"
        :disabled="disabled"
        :dynamicData="dynamicData"
        :key="item.key"
        :record="item"
        :formConfig="formConfig"
        :extendedProperties="extendedProperties"
        :envDetectInfoPick.sync="envDetectInfoPick"
        :entrustPackageSelectedList="entrustPackageSelectedList"
        @getEntrustPackageSelectedList="getEntrustPackageSelectedList"
        :config="config"
				@sharedFormDateChange="sharedFormDateChange"
      />
    </a-col>
  </a-row>
  <!-- 卡片布局 -->
  <a-card
    v-else-if="record.type === 'card'"
    class="grid-row"
    :title="record.label"
  >
    <buildBlocks
      ref="nestedComponents"
      @handleReset="$emit('handleReset')"
      @change="handleChange"
      v-for="item in record.list"
      :disabled="disabled"
      :dynamicData="dynamicData"
      :key="item.key"
      :record="item"
      :formConfig="formConfig"
      :extendedProperties="extendedProperties"
      :envDetectInfoPick.sync="envDetectInfoPick"
      :entrustPackageSelectedList="entrustPackageSelectedList"
      @getEntrustPackageSelectedList="getEntrustPackageSelectedList"
      :config="config"
			@sharedFormDateChange="sharedFormDateChange"
    />
  </a-card>
  <!-- 表格布局 -->
  <table
    v-else-if="record.type === 'table'"
    class="kk-table-9136076486841527"
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
      >
        <buildBlocks
          ref="nestedComponents"
          @handleReset="$emit('handleReset')"
          @change="handleChange"
          v-for="item in tdItem.list"
          :disabled="disabled"
          :dynamicData="dynamicData"
          :extendedProperties="extendedProperties"
          :envDetectInfoPick.sync="envDetectInfoPick"
          :entrustPackageSelectedList="entrustPackageSelectedList"
          @getEntrustPackageSelectedList="getEntrustPackageSelectedList"
          :key="item.key"
          :record="item"
          :formConfig="formConfig"
          :config="config"
					@sharedFormDateChange="sharedFormDateChange"
        />
      </td>
    </tr>
  </table>
  <!-- Tabs布局 -->
  <a-tabs v-else-if="record.type === 'tabs'" default-active-key="1" class="grid-row"
          @tabClick="dynamicData[record.options.dynamicFun]
          ? dynamicData[record.options.dynamicFun]($event, record.model, $event.target) : false"
  >
    <a-tab-pane :key="colItem.key" :tab="colItem.tabName" v-for="(colItem, idnex) in record.columns" :forceRender="true"

	>
<!--		:disabled="dynamicData['disabled' + colItem.key] ? dynamicData['disabled' + colItem.key] : false"-->
      <buildBlocks
        ref="nestedComponents"
        @handleReset="$emit('handleReset')"
        @change="handleChange"
        v-for="item in colItem.list"
        :disabled="disabled"
        :dynamicData="dynamicData"
        :extendedProperties="extendedProperties"
        :envDetectInfoPick.sync="envDetectInfoPick"
        :entrustPackageSelectedList="entrustPackageSelectedList"
        @getEntrustPackageSelectedList="getEntrustPackageSelectedList"
        :key="item.key"
        :record="item"
        :formConfig="formConfig"
        :config="config"
				@sharedFormDateChange="sharedFormDateChange"
      />
    </a-tab-pane>
  </a-tabs>

	<!-- 公共表单 -->
	<a-row
		v-else-if="record.type === 'sharedForm'"
		class="grid-row"
		:gutter="record.options.gutter"
	>
		<a-col
			class="grid-col"
			v-for="(colItem, idnex) in record.columns"
			:key="idnex"
			:span="colItem.span || 0"
		>
			<buildBlocks
				ref="nestedComponents"
				@handleReset="$emit('handleReset')"
				@change="handleChange"
				v-for="item in colItem.list"
				:disabled="disabled"
				:dynamicData="dynamicData"
				:key="item.key"
				:record="item"
				:formConfig="formConfig"
				:extendedProperties="extendedProperties"
				:envDetectInfoPick.sync="envDetectInfoPick"
				:entrustPackageSelectedList="entrustPackageSelectedList"
				@getEntrustPackageSelectedList="getEntrustPackageSelectedList"
				@sharedFormDateChange="sharedFormDateChange"
				:config="config"
			/>
		</a-col>
	</a-row>
  <KFormItem
    v-else
    ref="nestedComponents"
    @handleReset="$emit('handleReset')"
    @change="handleChange"
    :disabled="disabled"
    :dynamicData="dynamicData"
    :key="record.key"
    :record="record"
    :formConfig="formConfig"
    :config="config"
    :extendedProperties="extendedProperties"
    :envDetectInfoPick="envDetectInfoPick"
    :entrustPackageSelectedList="entrustPackageSelectedList"
		@sharedFormDateChange="sharedFormDateChange"
    @getEntrustPackageSelectedList="getEntrustPackageSelectedList"
  />
</template>
<script>
  /*
   * author kcz
   * date 2019-11-20
   */
  import KFormItem from "../KFormItem/index";
  export default {
    name: "buildBlocks",
    props: {
      record: {
        type: Object,
        required: true
      },
      formConfig: {
        type: Object,
        required: true
      },
      config: {
        type: Object,
        default: () => ({})
      },
      dynamicData: {
        type: Object,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      envDetectInfoPick:{
        type: Array,
        default: () => ([])
      },
      entrustPackageSelectedList:{
        type: Array,
        default: () => ([])
      },
      extendedProperties:{
        type: Object,
        default: () => ({})
      }
    },
    components: {
      KFormItem
    },
    methods: {
      validationSubform() {
        // 验证动态表格
        let nestedComponents = this.$refs.nestedComponents;
        if (
          typeof nestedComponents === "object" &&
          nestedComponents instanceof Array
        ) {
          for (let i = 0; nestedComponents.length > i; i++) {
            if (!nestedComponents[i].validationSubform()) {
              return false;
            }
          }
          return true;
        } else if (typeof nestedComponents !== "undefined") {
          return nestedComponents.validationSubform();
        } else {
          return true;
        }
      },
      handleChange(value, key) {
        this.$emit("change", value, key);
      },
      getEntrustPackageSelectedList(data) {
        this.$emit('getEntrustPackageSelectedList', data);
      },
			sharedFormDateChange(data){
				console.log('blocks.sharedFormDateChange', data);
				this.$emit("sharedFormDateChange", data);
			}

    }
  };
</script>
