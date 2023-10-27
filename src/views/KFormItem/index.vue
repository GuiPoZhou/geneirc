<!--
 * @Description: 传入record数据，通过判断record.type，来渲染对应的组件
 * @Author: kcz
 * @Date: 2020-01-02 22:41:48
 * @LastEditors: kcz
 * @LastEditTime: 2020-07-09 22:24:34
 -->
<template>
	<a-form-item
		v-if="
      !(record.options.hidden === true) &&
        [
          'input',
          'textarea',
          'date',
          'time',
          'number',
          'radio',
          'checkbox',
          'select',
          'rate',
          'switch',
          'slider',
          'uploadImg',
          'uploadFile',
          'cascader',
          'treeSelect',
          'search'
        ].includes(record.type)
    "
		:label="record.label"
		:label-col="formConfig.layout === 'horizontal' ? formConfig.labelCol : {}"
		:wrapper-col="
      formConfig.layout === 'horizontal' ? formConfig.wrapperCol : {}
    "
	>
		<!-- 单行文本 -->
		<a-input
			:style="`width:${record.options.width}`"
			v-if="record.type === 'input'"
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			:placeholder="record.options.placeholder"
			:type="record.options.type"
			:allowClear="record.options.clearable"
			:maxLength="record.options.maxLength"
			@change="handleChange($event.target.value, record.model)"
			v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.defaultValue, // 默认值
          rules: record.rules // 验证规则
        }
      ]"
		/>
		<!-- 查询框 -->
		<a-input-search
			:style="`width:${record.options.width}`"
			v-if="record.type === 'search'"
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			:placeholder="record.options.placeholder"
			:type="record.options.type"
			:allowClear="record.options.clearable"
			:maxLength="record.options.maxLength"
			:readOnly="false || record.options.readonly"
			unselectable="on"
			@search="dynamicData[record.options.dynamicFun]
          ? dynamicData[record.options.dynamicFun]($event, record.model) : false"
			v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.defaultValue, // 默认值
          rules: record.rules // 验证规则
        }
      ]"
		/>
		<!-- 多行文本 -->
		<a-textarea
			:style="`width:${record.options.width}`"
			v-else-if="record.type === 'textarea'"
			:autoSize="{
        minRows: record.options.minRows,
        maxRows: record.options.maxRows
      }"
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			:placeholder="record.options.placeholder"
			:allowClear="record.options.clearable"
			:maxLength="record.options.maxLength"
			:rows="4"
			@change="handleChange($event.target.value, record.model)"
			v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.defaultValue, // 默认值
          rules: record.rules // 验证规则
        }
      ]"
		/>

		<!-- 日期选择 -->
		<KDatePicker
			v-else-if="record.type === 'date'"
			:record="record"
			:parentDisabled="disabled || extendedProperties.formShowType === 1"
			@change="handleChange($event, record.model)"
			@sharedFormDateChange="sharedFormDateChange"
			v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.range
            ? record.options.rangeDefaultValue
            : record.options.defaultNow ? this.getCurrentData() : record.options.defaultValue, // 默认值
          rules: record.rules // 验证规则
        }
      ]"
		/>
		<!-- 时间选择 -->
		<KTimePicker
			v-else-if="record.type === 'time'"
			:record="record"
			:parentDisabled="disabled || extendedProperties.formShowType === 1"
			@change="handleChange($event, record.model)"
			v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.defaultValue, // 默认值
          rules: record.rules // 验证规则
        }
      ]"
		/>
		<!-- 数字输入框 -->
		<a-input-number
			v-else-if="record.type === 'number'"
			:style="`width:${record.options.width}`"
			:min="
        record.options.min || record.options.min === 0
          ? record.options.min
          : -Infinity
      "
			:max="
        record.options.max || record.options.max === 0
          ? record.options.max
          : Infinity
      "
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			:step="record.options.step"
			:precision="
        record.options.precision > 50 ||
        (!record.options.precision && record.options.precision !== 0)
          ? null
          : record.options.precision
      "
			:placeholder="record.options.placeholder"
			@change="handleChange($event, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
		/>
		<!-- 单选框 -->
		<a-radio-group
			v-else-if="record.type === 'radio'"
			:options="
        !record.options.dynamic
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
          ? dynamicData[record.options.dynamicKey]
          : []
      "
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			:placeholder="record.options.placeholder"
			@change="handleChange($event.target.value, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
		/>
		<!-- 多选框 -->
		<a-checkbox-group
			v-else-if="record.type === 'checkbox'"
			:options="
        !record.options.dynamic || record.options.handle === ''
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
          ? dynamicData[record.options.dynamicKey]
          : []
      "
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			:placeholder="record.options.placeholder"
			@change="handleChange($event, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
		/>
		<!-- 评分 -->
		<a-rate
			v-else-if="record.type === 'rate'"
			:count="record.options.max"
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			:placeholder="record.options.placeholder"
			:allowHalf="record.options.allowHalf"
			@change="handleChange($event, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
		/>
		<!-- 下拉选框 -->
		<a-select
			:style="`width:${record.options.width}`"
			v-else-if="record.type === 'select'"
			:placeholder="record.options.placeholder"
			:showSearch="record.options.showSearch"
			:options="
        !record.options.dynamic || record.options.handle === ''
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
          ? dynamicData[record.options.dynamicKey]
          : []
      "
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			:allowClear="record.options.clearable"
			:mode="record.options.multiple ? 'multiple' : record.options.tags ? 'tags' : ''"
			@change="handleChange($event, record.model)"
      :getPopupContainer="getPopupContainer"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
		/>
		<!-- 开关 -->
		<a-switch
			v-else-if="record.type === 'switch'"
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			@change="handleChange($event, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          valuePropName: 'checked',
          rules: record.rules
        }
      ]"
		/>
		<!-- 滑块 -->
		<div
			v-else-if="record.type === 'slider'"
			:style="`width:${record.options.width}`"
			class="slider-box"
		>
			<div class="slider">
				<a-slider
					:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
					:min="record.options.min"
					:max="record.options.max"
					:step="record.options.step"
					@change="handleChange($event, record.model)"
					v-decorator="[
            record.model,
            {
              initialValue: record.options.defaultValue,
              rules: record.rules
            }
          ]"
				/>
			</div>
			<div class="number" v-if="record.options.showInput">
				<a-input-number
					style="width:100%"
					:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
					:min="record.options.min"
					:max="record.options.max"
					:step="record.options.step"
					@change="handleChange($event, record.model)"
					v-decorator="[
            record.model,
            {
              initialValue: record.options.defaultValue
            }
          ]"
				/>
			</div>
		</div>
		<!-- 上传图片 -->
		<UploadImg
			v-else-if="record.type === 'uploadImg'"
			:style="`width:${record.options.width}`"
			:parentDisabled="disabled || extendedProperties.formShowType === 1"
			:record="record"
			:config="config"
			@change="handleChange($event, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
		/>
		<!-- 上传文件 -->
		<UploadFile
			v-else-if="record.type === 'uploadFile'"
			:style="`width:${record.options.width}`"
			:record="record"
			:config="config"
			:dynamicData="dynamicData"
			:parentDisabled="disabled || extendedProperties.formShowType === 1"
			@change="handleChange($event, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
		/>
		<!-- 树选择器 -->
		<a-tree-select
			v-else-if="record.type === 'treeSelect'"
			:style="`width:${record.options.width}`"
			:placeholder="record.options.placeholder"
			:multiple="record.options.multiple"
			:showSearch="record.options.showSearch"
			:treeCheckable="record.options.treeCheckable"
			:treeData="
        !record.options.dynamic
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
          ? dynamicData[record.options.dynamicKey]
          : []
      "
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			:allowClear="record.options.clearable"
			@change="handleChange($event, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
		/>
		<!-- 级联选择器 -->
		<a-cascader
			v-else-if="record.type === 'cascader'"
			:style="`width:${record.options.width}`"
			:placeholder="record.options.placeholder"
			:showSearch="record.options.showSearch"
			:options="
        !record.options.dynamic
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
          ? dynamicData[record.options.dynamicKey]
          : []
      "
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			:allowClear="record.options.clearable"
			@change="handleChange($event, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
		/>
	</a-form-item>
	<!-- 可隐藏label -->
	<a-form-item
		v-else-if="record.type === 'batch' || record.type === 'editor' || record.type === 'plan'"
		:label="!record.options.showLabel ? '' : record.label"
		:label-col="
      formConfig.layout === 'horizontal' && record.options.showLabel
        ? formConfig.labelCol
        : {}
    "
		:wrapper-col="
      formConfig.layout === 'horizontal' && record.options.showLabel
        ? formConfig.wrapperCol
        : {}
    "
	>
		<!-- 动态表格 -->
		<KBatch
			v-if="record.type === 'batch' || record.type === 'plan'"
			ref="KBatch"
			:style="`width:${record.options.width}`"
			:record="record"
			:config="config"
			:parentDisabled="disabled"
			:dynamicData="dynamicData"
			:extendedProperties="extendedProperties"
			:envDetectInfoPick="envDetectInfoPick"
			@change="handleChange($event, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
		/>
		<!-- 富文本编辑器 -->
		<KEditor
			v-else
			ref="KEditor"
			:style="`width:${record.options.width}`"
			:record="record"
			:parentDisabled="disabled || extendedProperties.formShowType === 1"
			:dynamicData="dynamicData"
			@change="handleChange($event, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
		/>
	</a-form-item>
	<!-- button按钮 -->
	<a-form-item
		v-else-if="record.type === 'button'"
		:wrapper-col="
      formConfig.layout === 'horizontal'
        ? { ...formConfig.wrapperCol, offset: formConfig.labelCol.span }
        : {}
    "
	>
		<a-button
			:disabled="disabled || record.options.disabled || extendedProperties.formShowType === 1"
			@click="
        record.options.handle === 'submit'
          ? false
          : record.options.handle === 'reset'
          ? $emit('handleReset')
          : dynamicData[record.options.dynamicFun]
          ? dynamicData[record.options.dynamicFun]()
          : false
      "
			:type="record.options.type"
			:html-type="record.options.handle === 'submit' ? 'submit' : undefined"
			v-text="record.label"
		></a-button>
	</a-form-item>
	<!-- alert提示 -->
	<a-form-item v-else-if="record.type === 'alert'">
		<a-alert
			:message="record.label"
			:description="record.options.description"
			:type="record.options.type"
			:showIcon="record.options.showIcon"
			:closable="record.options.closable"
			:banner="record.options.banner"
		/>
	</a-form-item>
	<!-- 文本 -->
	<a-form-item v-else-if="record.type === 'text'">
		<div :style="{ textAlign: record.options.textAlign }">
			<label
				:class="{ 'ant-form-item-required': record.options.showRequiredMark }"
				v-text="record.label"
			></label>
		</div>
	</a-form-item>
	<!-- html -->
	<div
		v-else-if="record.type === 'html'"
		v-html="record.options.defaultValue"
	></div>

	<!--  委托协议分包组件-->
	<selectEntrustPackage v-else-if="record.type === 'selectEntrustPackage'" :envDetectInfoPick="envDetectInfoPick"
						  :extendedProperties="extendedProperties"
						  :entrustPackageSelectedList="entrustPackageSelectedList"
						  @getEntrustPackageSelectedList="getEntrustPackageSelectedList"></selectEntrustPackage>

	<!-- 分包委托 -->
	<subcontractCommissioned v-else-if="record.type === 'subcontractCommissioned'"
							 :extendedProperties="extendedProperties"/>

	<!-- 仪器使用记录 -->
	<instrumentUseRecord v-else-if="record.type === 'instrumentUseRecord'"
						 :extendedProperties="extendedProperties"/>

	<!-- 标准物质使用记录 -->
	<referenceMaterialRecord v-else-if="record.type === 'referenceMaterialRecord'"
							 :extendedProperties="extendedProperties"/>

	<!-- 色谱文件 -->
	<chromatographicFile v-else-if="record.type === 'chromatographicFile'"
						 :extendedProperties="extendedProperties"/>

	<!-- 公式Start-->
	<dynamic-formula-container v-else-if="record.type === 'dynamicFormula'" :record="record"/>
	<a-form-item v-else-if="record.type === 'variable'">
		<div :style="{ textAlign: record.options.textAlign }">
			<label
				:class="{ 'ant-form-item-required': record.options.showRequiredMark }"
				v-text="record.selected.label"
			></label>
		</div>
	</a-form-item>
	<a-form-item v-else-if="record.type === 'symbol'">
		<div :style="{ textAlign: record.options.textAlign }">
			<label
				:class="{ 'ant-form-item-required': record.options.showRequiredMark }"
				v-text="record.selected.label"
			></label>
		</div>
	</a-form-item>
	<a-form-item v-else-if="record.type === 'function'">
		<div :style="{ textAlign: record.options.textAlign }">
			<label
				:class="{ 'ant-form-item-required': record.options.showRequiredMark }"
				v-text="record.selected.label"
			></label>
		</div>
	</a-form-item>
	<a-form-item v-else-if="record.type === 'constant'">
		<div :style="{ textAlign: record.options.textAlign }">
			<label
				:class="{ 'ant-form-item-required': record.options.showRequiredMark }"
				v-text="record.value"
			></label>
		</div>
	</a-form-item>
	<!-- 公式End-->


	<!-- 记录单Start-->

<!--	&lt;!&ndash; 气象信息1 &ndash;&gt;-->
<!--	<meteorologicalGas v-else-if="record.type === 'meteorologicalGas'"-->
<!--					   :extendedProperties="extendedProperties"/>-->

<!--	&lt;!&ndash; 气象信息2 &ndash;&gt;-->
<!--	<meteorologicalSound v-else-if="record.type === 'meteorologicalSound'"-->
<!--						 :extendedProperties="extendedProperties"/>-->

	<!-- 仪器信息 -->
	<instrumentInfo v-else-if="record.type === 'instrumentInfo'" :label="record.label"
					:extendedProperties="extendedProperties"/>

	<!-- 环境空气采样信息 -->
	<sampleAirInfo v-else-if="record.type === 'sampleAirInfo'" :label="record.label"
				   :extendedProperties="extendedProperties"/>

	<!-- 地表水采样信息 -->
	<sampleWaterSurfaceInfo v-else-if="record.type === 'sampleWaterSurfaceInfo'" :label="record.label"
							:extendedProperties="extendedProperties"/>

	<!-- 地下水采样信息 -->
	<sampleWaterGround v-else-if="record.type === 'sampleWaterGround'" :label="record.label"
					   :extendedProperties="extendedProperties"/>

	<!-- 废水采样信息 -->
	<sampleWaterWaste v-else-if="record.type === 'sampleWaterWaste'" :label="record.label"
					  :extendedProperties="extendedProperties"/>

	<!-- 土壤采样信息 -->
	<sampleTerra v-else-if="record.type === 'sampleTerra'" :label="record.label"
				 :extendedProperties="extendedProperties"/>

	<!-- 现场检测结果 -->
	<sceneDetect v-else-if="record.type === 'sceneDetect'" :label="record.label"
				 :extendedProperties="extendedProperties"/>

	<!-- 噪声采样&现场-校准 -->
	<sceneNoiseCalibration v-else-if="record.type === 'sceneNoiseCalibration'" :label="record.label"
						   :extendedProperties="extendedProperties"/>

	<!-- 噪声采样&现场-检测信息 -->
	<sceneNoiseDetect v-else-if="record.type === 'sceneNoiseDetect'" :label="record.label"
					  :extendedProperties="extendedProperties"/>

	<!-- 废气颗粒物检测信息 -->
	<sceneExhaustDetect v-else-if="record.type === 'sceneExhaustDetect'" :label="record.label"
						:extendedProperties="extendedProperties"/>

	<!-- 颗粒物采样&现场-称量环境 -->
	<sceneWeighingEnvironment v-else-if="record.type === 'sceneWeighingEnvironment'" :label="record.label"
							  :extendedProperties="extendedProperties"/>


	<!-- 2021年8月19日 -->
	<!-- 气态污染物 -->
	<gaseousPollutants v-else-if="record.type === 'gaseousPollutants'" :label="record.label"
														:extendedProperties="extendedProperties"/>
	<!-- 恶臭采样 -->
	<stench v-else-if="record.type === 'stench'" :label="record.label"
										 :extendedProperties="extendedProperties"/>
	<!-- 水质采样 -->
	<waterQuality v-else-if="record.type === 'waterQuality'" :label="record.label"
					:extendedProperties="extendedProperties"/>
	<!-- 土壤采样 -->
	<soil v-else-if="record.type === 'soil'" :label="record.label"
								:extendedProperties="extendedProperties"/>
	<!-- 固废采样 -->
	<solidWaste v-else-if="record.type === 'solidWaste'" :label="record.label"
								:extendedProperties="extendedProperties"/>

	<!-- 2021年11月29日 -->
	<!-- 噪声现场监测 -->
	<noiseScene v-else-if="record.type === 'noiseScene'" :label="record.label"
								 :extendedProperties="extendedProperties"/>
	<smokePollution v-else-if="record.type === 'smokePollution'" :label="record.label"
							:extendedProperties="extendedProperties"/>
	<particulates v-else-if="record.type === 'particulates'" :label="record.label"
									:extendedProperties="extendedProperties"/>
	<lampblack v-else-if="record.type === 'lampblack'" :label="record.label"
								:extendedProperties="extendedProperties"/>
	<smokeBlackness v-else-if="record.type === 'smokeBlackness'" :label="record.label"
						 :extendedProperties="extendedProperties"/>
	<soundLevelMeter v-else-if="record.type === 'soundLevelMeter'" :label="record.label"
									 :extendedProperties="extendedProperties"/>
	<calibrationGas v-else-if="record.type === 'calibrationGas'" :label="record.label"
									 :extendedProperties="extendedProperties"/>
	<calibrationGasInfrared v-else-if="record.type === 'calibrationGasInfrared'" :label="record.label"
					:extendedProperties="extendedProperties"/>
	<calibrationPh v-else-if="record.type === 'calibrationPh'" :label="record.label"
							:extendedProperties="extendedProperties"/>
	<calibrationTurbidity v-else-if="record.type === 'calibrationTurbidity'" :label="record.label"
				   :extendedProperties="extendedProperties"/>
	<calibrationConductivity v-else-if="record.type === 'calibrationConductivity'" :label="record.label"
						  :extendedProperties="extendedProperties"/>
	<calibrationOxidation v-else-if="record.type === 'calibrationOxidation'" :label="record.label"
							 :extendedProperties="extendedProperties"/>
	<calibrationDissolvedOxygen v-else-if="record.type === 'calibrationDissolvedOxygen'" :label="record.label"
						  :extendedProperties="extendedProperties"/>

	<a-form-item v-else-if="record.type === 'sceneBlackness'">
		<sceneBlackness :extendedProperties="extendedProperties" :label="record.label"/>
	</a-form-item>

	<!-- 记录单End-->


	<!-- 自定义组件 -->
	<customComponent
		v-else-if="customList.includes(record.type)"
		:record="record"
		:disabled="disabled"
		:dynamicData="dynamicData"
		@change="handleChange($event, record.model)"
		:formConfig="formConfig"
	/>

	<div v-else>
		<!-- 分割线 -->
		<a-divider
			v-if="
        record.type === 'divider' &&
          record.label !== '' &&
          record.options.orientation
      "
			:orientation="record.options.orientation"
		>{{ record.label }}
		</a-divider
		>
		<a-divider v-else-if="record.type === 'divider' && record.label !== ''">{{
			record.label
			}}
		</a-divider>
		<a-divider v-else-if="record.type === 'divider' && record.label === ''"/>
	</div>


</template>
<script>
	/*
	 * author kcz
	 * date 2019-11-20
	 */
	import moment from "moment";
	import customComponent from "./customComponent";
	import selectEntrustPackage from "@/components/project/selectEntrustPackage";
	import subcontractCommissioned from "@/components/subcontract/subcontractCommissioned";
	import instrumentUseRecord from "@/components/instrumentUseRecord/instrumentUseRecord";
	import referenceMaterialRecord from "@/components/referenceMaterialRecord/referenceMaterialRecord";
	import chromatographicFile from "@/components/chromatographicFile/chromatographicFile";
	import meteorologicalGas from "@/components/recordSheet/meteorological/meteorologicalGas";
	import meteorologicalSound from "@/components/recordSheet/meteorological/meteorologicalSound";
	import instrumentInfo from "@/components/recordSheet/instrumentInfo/instrumentInfo";
	import sampleAirInfo from "@/components/recordSheet/sampleAirInfo/sampleAirInfo";
	import sampleWaterSurfaceInfo from "@/components/recordSheet/sampleWaterSurfaceInfo/sampleWaterSurfaceInfo";
	import sampleWaterGround from "@/components/recordSheet/sampleWaterGround/sampleWaterGround";
	import sampleWaterWaste from "@/components/recordSheet/sampleWaterWaste/sampleWaterWaste";
	import sampleTerra from "@/components/recordSheet/sampleTerra/sampleTerra";
	import sceneDetect from "@/components/recordSheet/sceneDetect/sceneDetect";
	import sceneNoiseCalibration from "@/components/recordSheet/sceneNoiseCalibration/sceneNoiseCalibration";
	import sceneNoiseDetect from "@/components/recordSheet/sceneNoiseDetect/sceneNoiseDetect";
	import sceneExhaustDetect from "@/components/recordSheet/sceneExhaustDetect/sceneExhaustDetect";
	import sceneWeighingEnvironment from "@/components/recordSheet/sceneWeighingEnvironment/sceneWeighingEnvironment";
	import KBatch from "../KBatch";
	import KEditor from "../KEditor";
	import UploadFile from "../UploadFile";
	import UploadImg from "../UploadImg";
	import KDatePicker from "../KDatePicker";
	import KTimePicker from "../KTimePicker";
	import dynamicFormulaContainer from "@/components/dynamicFormula/container/index";

	//记录单控件start
	import sceneBlackness from "@/components/recordSheet/sceneBlackness/sceneBlackness";
	//2021年8月19日
	import gaseousPollutants from "@/components/recordSheet/gaseousPollutants/gaseousPollutants";
	import stench from "@/components/recordSheet/stench/stench";
	import waterQuality from "@/components/recordSheet/waterQuality/waterQuality";
	import soil from "@/components/recordSheet/soil/soil";
	import solidWaste from "@/components/recordSheet/solidWaste/solidWaste";
	import noiseScene from "@/components/recordSheet/noiseScene/noiseScene";
	import smokePollution from "@/components/recordSheet/smokePollution/smokePollution";
	import particulates from "@/components/recordSheet/particulates/particulates";
	import lampblack from "@/components/recordSheet/lampblack/lampblack";
	import smokeBlackness from "@/components/recordSheet/smokeBlackness/smokeBlackness";
	import soundLevelMeter from "@/components/recordSheet/soundLevelMeter/soundLevelMeter";
	import calibrationGas from "@/components/recordSheet/calibrationGas/calibrationGas";
	import calibrationGasInfrared from "@/components/recordSheet/calibrationGasInfrared/calibrationGasInfrared";
	import calibrationPh from "@/components/recordSheet/calibrationPh/calibrationPh";
	import calibrationTurbidity from "@/components/recordSheet/calibrationTurbidity/calibrationTurbidity";
	import calibrationConductivity from "@/components/recordSheet/calibrationConductivity/calibrationConductivity";
	import calibrationOxidation from "@/components/recordSheet/calibrationOxidation/calibrationOxidation";
	import calibrationDissolvedOxygen from "@/components/recordSheet/calibrationDissolvedOxygen/calibrationDissolvedOxygen";
	//记录单控件end

	export default {
		name: "KFormItem",
		props: {
			// 表单数组
			record: {
				type: Object,
				required: true
			},
			// form-item 宽度配置
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
				default: () => ({})
			},
			disabled: {
				type: Boolean,
				default: false
			},
			envDetectInfoPick: {
				type: Array,
				default: () => ([])
			},
			entrustPackageSelectedList: {
				type: Array,
				default: () => ([])
			},
			extendedProperties: {
				type: Object,
				default: () => ({})
			}
		},
		components: {
      moment,
			KBatch,
			KEditor,
			UploadImg,
			UploadFile,
			KDatePicker,
			KTimePicker,
			customComponent,
			selectEntrustPackage,
			subcontractCommissioned,
			instrumentUseRecord,
			referenceMaterialRecord,
			chromatographicFile,
			dynamicFormulaContainer,

			//记录单控件start
			meteorologicalGas,
			meteorologicalSound,
			instrumentInfo,
			sampleAirInfo,
			sampleWaterSurfaceInfo,
			sampleWaterGround,
			sampleWaterWaste,
			sampleTerra,
			sceneDetect,
			sceneNoiseCalibration,
			sceneNoiseDetect,
			sceneExhaustDetect,
			sceneWeighingEnvironment,
			sceneBlackness,
			//2021年8月19日
			gaseousPollutants,
			stench,
			waterQuality,
			soil,
			solidWaste,
			//2021年11月29日
			noiseScene,
			smokePollution,
			particulates,
			lampblack,
			smokeBlackness,
			soundLevelMeter,
			calibrationGas,
			calibrationGasInfrared,
			calibrationPh,
			calibrationTurbidity,
			calibrationConductivity,
			calibrationOxidation,
			calibrationDissolvedOxygen,
			//记录单控件end
		},
		computed: {
			customList() {
				if (window.$customComponentList) {
					return window.$customComponentList.map(item => item.type);
				} else {
					return [];
				}
			}
		},
		methods: {
      getPopupContainer(triggerNode) {
        return triggerNode.parentNode
      },
      getCurrentData(){
        return dateFormat('yyyy-MM-dd',new Date());
      },
			validationSubform() {
				// 验证动态表格
				if (!this.$refs.KBatch) return true;
				return this.$refs.KBatch.validationSubform();
			},
			handleChange(value, key) {
				// console.log('KFormItem.handleChange');
				// change事件
				this.$emit("change", value, key);
			},
			handleInputSearch(value, key) {
				// change事件
				this.$emit("search", value, key);
			},
			getEntrustPackageSelectedList(data) {
				this.$emit('getEntrustPackageSelectedList', data);
			},
			sharedFormDateChange(data){
      	console.log('KFormItem.sharedFormDateChange', data);
				this.$emit("sharedFormDateChange", data);
			}
		}
	};
</script>
<style lang="less" scoped>
	.slider-box {
		display: flex;

		> .slider {
			flex: 1;
			margin-right: 16px;
		}

		> .number {
			width: 70px;
		}
	}
</style>
