<template>
  <div class="properties-centent kk-checkbox">
    <div class="head-title">
      控件属性设置
    </div>
    <div class="properties-body">
      <p class="hint-box" v-show="selectItem.key === ''">未选择控件</p>
      <a-form v-show="selectItem.key !== '' && selectItem.formType != 2">
        <a-form-item
          v-if="typeof selectItem.label !== 'undefined'"
          label="标签"
        >
          <a-input v-model="selectItem.label" placeholder="请输入" />
        </a-form-item>

        <a-form-item
          v-if="!hideModel && typeof selectItem.model !== 'undefined'"
          label="数据字段"
        >
<!--          v-if="!hideModel && typeof selectItem.model !== 'undefined' && !options.tableColumn"-->
          <a-input v-model="selectItem.model" placeholder="请输入" />
        </a-form-item>
        <!-- input type start -->
        <a-form-item v-if="selectItem.type === 'input'" label="输入框type">
          <a-input v-model="options.type" placeholder="请输入" />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'input'" label="接口Url">
          <a-input v-model="options.dynamicUrl" placeholder="接口Url" />
        </a-form-item>
        <a-radio-group buttonStyle="solid" v-model="options.handle" v-if="selectItem.type === 'input'">
          <a-radio-button value="">空函数</a-radio-button>
          <a-radio-button value="dynamic">动态</a-radio-button>
<!--          <a-radio-button value="pdfValue">PDF</a-radio-button>-->
        </a-radio-group>
        <!-- 查询框绑定选中方法 -->
        <a-input
          v-show="options.handle === 'dynamic'"
          v-model="options.dynamicFun"
          placeholder="动态函数名"
        ></a-input>


        <a-form-item v-if="options.handle === 'pdfValue'" label="表">
          <a-select :options="pdfTable" v-model="options.pdfTable"  :allowClear="true"/>
        </a-form-item>

        <a-form-item v-if="options.handle === 'pdfValue'" label="属性">
          <a-select :options="pdfColumns[options.pdfTable]" v-model="options.pdfColumn" :allowClear="true" />
        </a-form-item>


        <!-- input type end -->
        <a-form-item
          v-if="
            typeof options.rangePlaceholder !== 'undefined' && options.range
          "
          label="占位内容"
        >
          <a-input placeholder="请输入" v-model="options.rangePlaceholder[0]" />
          <a-input placeholder="请输入" v-model="options.rangePlaceholder[1]" />
        </a-form-item>

        <a-form-item
          v-else-if="typeof options.placeholder !== 'undefined'"
          label="占位内容"
        >
          <a-input placeholder="请输入" v-model="options.placeholder" />
        </a-form-item>
        <a-form-item
          v-if="selectItem.type === 'textarea'"
          label="自适应内容高度"
        >
          <a-input-number
            style="width:100%"
            v-model="options.minRows"
            placeholder="最小高度"
          />
          <a-input-number
            style="width:100%"
            v-model="options.maxRows"
            placeholder="最大高度"
          />
        </a-form-item>
        <a-form-item v-if="typeof options.width !== 'undefined'" label="宽度">
          <a-input placeholder="请输入" v-model="options.width" />
        </a-form-item>
        <a-form-item v-if="typeof options.height !== 'undefined'" label="高度">
          <a-input-number v-model="options.height" />
        </a-form-item>
        <a-form-item v-if="typeof options.step !== 'undefined'" label="步长">
          <a-input-number v-model="options.step" placeholder="请输入" />
        </a-form-item>
        <a-form-item v-if="typeof options.min !== 'undefined'" label="最小值">
          <a-input-number v-model="options.min" placeholder="请输入" />
        </a-form-item>
        <a-form-item v-if="typeof options.max !== 'undefined'" label="最大值">
          <a-input-number v-model="options.max" placeholder="请输入" />
        </a-form-item>
        <a-form-item
          v-if="typeof options.precision !== 'undefined'"
          label="数值精度"
        >
          <a-input-number
            :min="0"
            :max="50"
            v-model="options.precision"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          v-if="typeof options.dictCode !== 'undefined'"
          label="dictCode"
        >
          <a-input v-model="options.dictCode"></a-input>
        </a-form-item>
        <!-- 选项配置及动态数据配置 start -->
        <a-form-item
          v-if="typeof options.options !== 'undefined'"
          label="选项配置"
        >
          <a-radio-group buttonStyle="solid" v-model="options.dynamic">
            <a-radio-button :value="false">静态数据</a-radio-button>
            <a-radio-button :value="true">动态数据</a-radio-button>
            (/system/dict/data/type/)
          </a-radio-group>


          <a-input
                  v-show="options.dynamic"
                  v-model="options.dynamicGetUrl"
                  placeholder="url" label="url"
          ></a-input>
          <a-input
            v-show="options.dynamic"
            v-model="options.dynamicGetKey"
            placeholder="key" label="key"
          ></a-input>

          <a-input
                  v-show="options.dynamic"
                  v-model="options.dynamicGetValue"
                  placeholder="val" label="val"
          ></a-input>

          <KChangeOption v-show="!options.dynamic" v-model="options.options" />
          <a-radio-group buttonStyle="solid" v-model="options.handle" v-if="selectItem.type === 'select'">
            <a-radio-button value="">空函数</a-radio-button>
            <a-radio-button value="pdfValue">PDF</a-radio-button>
            <a-form-item v-if="options.handle === 'pdfValue'" label="表">
              <a-select :options="pdfTable" v-model="options.pdfTable"  :allowClear="true"/>
            </a-form-item>

            <a-form-item v-if="options.handle === 'pdfValue'" label="属性">
              <a-select :options="pdfColumns[options.pdfTable]" v-model="options.pdfColumn" :allowClear="true" />
            </a-form-item>
          </a-radio-group>
        </a-form-item>
        <!-- 选项配置及动态数据配置 end -->
        <a-form-item v-if="selectItem.type === 'grid'" label="栅格间距">
          <a-input-number
            v-model="selectItem.options.gutter"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'grid'" label="列配置项">
          <KChangeOption v-model="selectItem.columns" type="colspan" />
        </a-form-item>

        <a-form-item v-if="selectItem.type === 'switch'" label="默认值">
          <a-switch v-model="options.defaultValue" />
        </a-form-item>
        <a-form-item
          v-if="['number', 'slider'].indexOf(selectItem.type) >= 0"
          label="默认值"
        >
          <a-input-number
            :step="options.step"
            :min="options.min || -Infinity"
            :max="options.max || Infinity"
            v-model="options.defaultValue"
          />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'rate'" label="默认值">
          <a-rate
            v-model="options.defaultValue"
            :allowHalf="options.allowHalf"
            :count="options.max"
          />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'select'" label="默认值">
          <a-select :options="options.options" v-model="options.defaultValue" :allowClear="true"/>
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'radio'" label="默认值">
          <a-radio-group
            :options="options.options"
            v-model="options.defaultValue"
          />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'checkbox'" label="默认值">
          <a-checkbox-group
            :options="options.options"
            v-model="options.defaultValue"
          />
        </a-form-item>
        <!-- 日期选择器默认值 start -->
        <a-form-item v-if="selectItem.type === 'date'" label="默认值">
          <a-input
            v-if="!options.range"
            v-model="options.defaultValue"
            :placeholder="
              typeof options.format === 'undefined' ? '' : options.format
            "
          />
          <kCheckbox v-model="selectItem.options.defaultNow" label="当前时间" v-if="!options.range"/>
          <a-input
            v-if="options.range"
            v-model="options.rangeDefaultValue[0]"
            :placeholder="
              typeof options.format === 'undefined' ? '' : options.format
            "
          />
          <a-input
            v-if="options.range"
            v-model="options.rangeDefaultValue[1]"
            :placeholder="
              typeof options.format === 'undefined' ? '' : options.format
            "
          />
        </a-form-item>
        <!-- 日期选择器默认值 start -->
        <a-form-item
          v-if="
            ![
              'number',
              'radio',
              'checkbox',
              'date',
              'rate',
              'select',
              'switch',
              'slider',
              'html'
            ].includes(selectItem.type) &&
              typeof options.defaultValue !== 'undefined'
          "
          label="默认值"
        >
          <a-input
            v-model="options.defaultValue"
            :placeholder="
              typeof options.format === 'undefined' ? '请输入' : options.format
            "
          />
        </a-form-item>
        <!-- 修改html -->
        <a-form-item v-if="selectItem.type === 'html'" label="默认值">
          <a-textarea
            v-model="options.defaultValue"
            :autoSize="{ minRows: 4, maxRows: 8 }"
          />
        </a-form-item>
        <a-form-item
          v-if="typeof options.format !== 'undefined'"
          label="时间格式"
        >
          <a-input
            v-model="options.format"
            placeholder="时间格式如：YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>

        <a-form-item
          v-if="typeof options.orientation !== 'undefined'"
          label="标签位置"
        >
          <a-radio-group buttonStyle="solid" v-model="options.orientation">
            <a-radio-button value="left">左</a-radio-button>
            <a-radio-button value="">居中</a-radio-button>
            <a-radio-button value="right">右</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'button'" label="类型">
          <a-radio-group buttonStyle="solid" v-model="options.type">
            <a-radio value="primary">Primary</a-radio>
            <a-radio value="default">Default</a-radio>
            <a-radio value="dashed">Dashed</a-radio>
            <a-radio value="danger">Danger</a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- 下载方式 start -->
        <a-form-item
          v-if="typeof options.downloadWay !== 'undefined'"
          label="下载方式"
        >
          <a-radio-group buttonStyle="solid" v-model="options.downloadWay">
            <a-radio-button value="a">a标签</a-radio-button>
            <a-radio-button value="ajax">ajax</a-radio-button>
            <a-radio-button value="dynamic">动态函数</a-radio-button>
          </a-radio-group>
          <a-input
            v-show="options.downloadWay === 'dynamic'"
            v-model="options.dynamicFun"
            placeholder="动态函数名"
          ></a-input>
        </a-form-item>
        <!-- 下载方式 end -->
        <a-form-item v-if="selectItem.type === 'button'" label="按钮操作">
          <a-radio-group buttonStyle="solid" v-model="options.handle">
            <a-radio-button value="submit">提交</a-radio-button>
            <a-radio-button value="reset">重置</a-radio-button>
            <a-radio-button value="dynamic">动态函数</a-radio-button>
          </a-radio-group>
          <a-input
            v-show="options.handle === 'dynamic'"
            v-model="options.dynamicFun"
            placeholder="动态函数名"
          ></a-input>
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'alert'" label="辅助描述">
          <a-input v-model="options.description"></a-input>
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'alert'" label="类型">
          <a-radio-group buttonStyle="solid" v-model="options.type">
            <a-radio value="success">success</a-radio>
            <a-radio value="info">info</a-radio>
            <a-radio value="warning">warning</a-radio>
            <a-radio value="error">error</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'alert'" label="操作属性">
          <kCheckbox v-model="options.showIcon" label="显示图标" />
          <kCheckbox v-model="options.banner" label="无边框" />
          <kCheckbox v-model="options.closable" label="可关闭" />
        </a-form-item>
        <!-- 上传图片 -->
        <a-form-item v-if="selectItem.type === 'uploadImg'" label="样式">
          <a-radio-group buttonStyle="solid" v-model="options.listType">
            <a-radio-button value="text">text</a-radio-button>
            <a-radio-button value="picture">picture</a-radio-button>
            <a-radio-button value="picture-card">card</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 上传数量 -->
        <a-form-item
          v-if="typeof options.limit !== 'undefined'"
          label="最大上传数量"
        >
          <a-input-number :min="1" v-model="options.limit" />
        </a-form-item>

        <!-- scrollY -->
        <a-form-item
          v-if="typeof options.scrollY !== 'undefined'"
          label="scrollY"
        >
          <a-input-number :min="0" v-model="options.scrollY" />
        </a-form-item>

        <!-- 上传地址 -->
        <a-form-item
          v-if="typeof options.action !== 'undefined'"
          label="上传地址"
        >
          <a-input v-model="options.action" placeholder="请输入"></a-input>
        </a-form-item>

        <!-- 文件name -->
        <a-form-item
          v-if="typeof options.fileName !== 'undefined'"
          label="文件name"
        >
          <a-input v-model="options.fileName" placeholder="请输入"></a-input>
        </a-form-item>
        <!-- 上传额外参数 -->
        <a-form-item
          v-if="typeof options.data !== 'undefined'"
          label="额外参数（JSON格式）"
        >
          <a-input v-model="options.data" placeholder="严格JSON格式"></a-input>
        </a-form-item>
        <!-- 文字对齐方式 -->
        <a-form-item v-if="selectItem.type === 'text'" label="文字对齐方式">
          <a-radio-group buttonStyle="solid" v-model="options.textAlign">
            <a-radio-button value="left">左</a-radio-button>
            <a-radio-button value="center">居中</a-radio-button>
            <a-radio-button value="right">右</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'text'" label="操作属性">
          <kCheckbox v-model="options.showRequiredMark" label="显示必选标记" />
        </a-form-item>
        <a-form-item label="其他配置">
          <kCheckbox v-model="options.showOnList" label="列表显示" />
          <kCheckbox v-model="options.showOnQuery" label="作为查询条件" />
          <kCheckbox v-model="options.tableColumn" label="默认表单属性" />
        </a-form-item>

        <a-form-item
          v-if="
            typeof options.hidden !== 'undefined' ||
              typeof options.disabled !== 'undefined' ||
              typeof options.readonly !== 'undefined' ||
              typeof options.clearable !== 'undefined' ||
              typeof options.multiple !== 'undefined' ||
              typeof options.range !== 'undefined' ||
              typeof options.showTime !== 'undefined' ||
              typeof options.allowHalf !== 'undefined' ||
              typeof options.showInput !== 'undefined'
          "
          label="操作属性"
        >
          <kCheckbox
            v-if="typeof options.hidden !== 'undefined'"
            v-model="options.hidden"
            label="隐藏"
          />
          <kCheckbox
            v-if="typeof options.disabled !== 'undefined'"
            v-model="options.disabled"
            label="禁用"
          />
          <kCheckbox
            v-if="typeof options.readonly !== 'undefined'"
            v-model="options.readonly"
            label="只读"
          />
          <kCheckbox
            v-if="typeof options.clearable !== 'undefined'"
            v-model="options.clearable"
            label="可清除"
          />
          <kCheckbox
            v-if="typeof options.multiple !== 'undefined'"
            v-model="options.multiple"
            label="多选"
          />
          <kCheckbox
            v-if="typeof options.range !== 'undefined'"
            v-model="options.range"
            label="范围选择"
          />
          <kCheckbox
            v-if="typeof options.showTime !== 'undefined'"
            v-model="options.showTime"
            label="时间选择器"
          />
          <kCheckbox
            v-if="typeof options.allowHalf !== 'undefined'"
            v-model="options.allowHalf"
            label="允许半选"
          />
          <kCheckbox
            v-if="typeof options.showInput !== 'undefined'"
            v-model="options.showInput"
            label="显示输入框"
          />
          <kCheckbox
            v-if="typeof options.showLabel !== 'undefined'"
            v-model="options.showLabel"
            label="显示Label"
          />
          <kCheckbox
            v-if="typeof options.chinesization !== 'undefined'"
            v-model="options.chinesization"
            label="汉化"
          />
          <kCheckbox
            v-if="typeof options.hideSequence !== 'undefined'"
            v-model="options.hideSequence"
            label="隐藏序号"
          />
          <kCheckbox
            v-if="typeof options.drag !== 'undefined'"
            v-model="options.drag"
            label="允许拖拽"
          />
          <kCheckbox
            v-if="typeof options.showSearch !== 'undefined'"
            v-model="options.showSearch"
            label="可搜索"
          />
          <kCheckbox
            v-if="typeof options.showSearch !== 'undefined'"
            v-model="options.tags"
            label="可录入"
          />
          <kCheckbox
            v-if="typeof options.allowCreate !== 'undefined'"
            v-model="options.allowCreate"
            label="可输入选择"
          />
          <kCheckbox
            v-if="typeof options.treeCheckable !== 'undefined'"
            v-model="options.treeCheckable"
            label="可勾选"
          />
        </a-form-item>

        <a-form-item
          v-if="
            typeof selectItem.rules !== 'undefined' &&
              selectItem.rules.length > 0
          "
          label="校验"
        >
          <kCheckbox v-model="selectItem.rules[0].required" label="必填" />
          <kCheckbox v-model="selectItem.unique" label="唯一" v-if="options.tableColumn"/>
          <a-input
            v-model="selectItem.rules[0].message"
            placeholder="必填校验提示信息"
          />
          <KChangeOption v-model="selectItem.rules" type="rules" />
        </a-form-item>

        <!-- 表格选项 -->
        <a-form-item v-if="selectItem.type === 'table'" label="表格样式CSS">
          <a-input v-model="selectItem.options.customStyle" />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'table'" label="属性">
          <kCheckbox v-model="selectItem.options.bordered" label="显示边框" />
          <kCheckbox v-model="selectItem.options.bright" label="鼠标经过点亮" />
          <kCheckbox v-model="selectItem.options.small" label="紧凑型" />
        </a-form-item>

        <a-form-item v-if="selectItem.type === 'table'" label="提示">
          <p style="line-height: 26px;">
            请点击右键增加行列，或者合并单元格
          </p>
        </a-form-item>
        <!-- Tab布局选项 -->
        <a-form-item v-if="selectItem.type === 'tabs'" label="Tabs配置">
          <KChangeOption v-model="selectItem.columns" type="tabs" />
        </a-form-item>

      </a-form>

      <a-form v-show="selectItem.key !== '' && selectItem.formType === 2">
        <a-form-item label="公式配置" v-if="selectItem.type === 'dynamicFormula'">
          <a-select :options="formColumnOptions" v-model="selectItem.selected" :labelInValue="true" :showSearch="true" optionFilterProp="children"/>
        </a-form-item>
        <a-form-item label="变量配置" v-if="selectItem.type === 'variable'">
          <a-select :options="formColumnOptions" v-model="selectItem.selected" :labelInValue="true"/>
        </a-form-item>
        <a-form-item label="常量配置" v-if="selectItem.type === 'constant'">
          <a-input-number :step="1" v-model="selectItem.value"></a-input-number>
        </a-form-item>
        <a-form-item label="符号配置" v-if="selectItem.type === 'symbol'">
          <a-select :options="selectItem.options.options" v-model="selectItem.selected" :labelInValue="true"/>
        </a-form-item>
        <a-form-item label="函数配置" v-if="selectItem.type === 'function'">
          <a-select :options="selectItem.options.options" v-model="selectItem.selected" :labelInValue="true" @change="selectFunction" :allowClear="true"/>
        </a-form-item>
<!--        <a-form-item label="函数配置" v-if="selectItem.type === 'function'">-->
<!--          <KChangeOption v-model="selectItem.columns" type="colspan" />-->
<!--        </a-form-item>-->
      </a-form>
      <a-form-item label="函数说明" v-if="selectItem.type === 'function'">
        <label v-if="selectItem.selected.key === 'getLogValue'">对数(X, Y) , X=需要计算对数的数值, Y=底数(可为空, 默认E)</label>
        <label v-if="selectItem.selected.key === 'getPowValue'">幂运算(X, Y), X=底数, Y=指数(可为空,默认2), 即X的Y次方</label>
        <label v-if="selectItem.selected.key === 'getRadicalValue'">开方(X, Y) ,X=被开方数, Y=开方数, 即开X的Y次根</label>
        <label v-if="selectItem.selected.key === 'getAvgValue'">平均值(X...), X为可变长参数, 即(X1+X2+Xn...)/n[参数个数].</label>
        <label v-if="selectItem.selected.key === 'getAbsValue'">绝对值(X).</label>
      </a-form-item>


			<a-form-item label="选择公共表单" v-if="selectItem.type === 'sharedForm'">
				<a-select v-model="selectItem.options.sharedFormId"  style="width: 100%" @change="handleSharedFormChange" @focus="initSharedFormOptions" :filter-option="filterOption" option-filter-prop="children" show-search>
					<a-select-option :value="item.value" v-for="item in sharedFormOptions">{{item.label}}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="公共范围" v-if="selectItem.type === 'sharedForm'">
				<a-select v-model="selectItem.options.sharedFormScope"  style="width: 100%" >
					<a-select-option :value="item.value" v-for="item in sharedFormScopeOptions">{{item.label}}</a-select-option>
				</a-select>
			</a-form-item>
    </div>
    <div class="close-box" @click="$emit('handleHide')">
      <a-icon type="double-right" />
    </div>
  </div>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 表单控件属性设置组件,因为配置数据是引用关系，所以可以直接修改
 */
import KChangeOption from "../../KChangeOption/index.vue";
import kCheckbox from "../../KCheckbox/index.vue";

import {
	listAllExecutionTemplate,
	parseELNConfig,
	getItemMethodOptionList,
} from "@/api/system/executionTemplate";
import {
	getPageConfig,
} from "@/api/desgin/config";
export default {
  name: "formItemProperties",
  data() {
    return {
      options: {},
      formColumnOptions:[],
      pdfTable:[{
        label: '仪器报告1',
        value: 'iot_data_reading_instrument1'
      }, {
        label: '仪器报告2',
        value: 'iot_data_reading_instrument2',
      }],
      pdfColumns:{
          'iot_data_reading_instrument1':[{
            label: '样品编号',
            value: 'sample_code',
          },{
            label: '检测项目名称',
            value: 'item_name',
          },{
            label: '面积',
            value: 'area',
          },{
            label: '保留时间',
            value: 'keep_time',
          },{
            label: '高度',
            value: 'height',
          },{
            label: '浓度',
            value: 'concentration',
          },{
            label: '浓度单位',
            value: 'concentration_unit',
          }],
        "iot_data_reading_instrument2":[{
          label: '样品编号',
          value: 'sample_code',
        },{
          label: '检测项目名称',
          value: 'item_name',
        },{
          label: '保留时间',
          value: 'keep_time',
        },{
          label: '半峰宽',
          value: 'half_peak_width',
        },{
          label: '峰高',
          value: 'peak_height',
        },{
          label: '峰面积1',
          value: 'peak_area1',
        },{
          label: '峰面积2',
          value: 'peak_area2',
        },{
          label: '含量',
          value: 'ppm_content',
        },{
          label: '峰类型',
          value: 'peak_type',
        }]
      },
			sharedFormOptions:[],
			sharedFormScopeOptions:[],
    };
  },
  watch: {
    selectItem(val) {
      this.options = val.options || {};
      // this.formColumnList = [];
      let tempList = [];
      const traverse = array => {
        if(array){
          array.forEach((element, index) => {
						if (element.type === "grid" || element.type === "sharedForm") {
              // 栅格布局
							if(element.columns){
								element.columns.forEach(item => {
									traverse(item.list);
								});
							}

            } else if (element.type === "card") {
              // 卡片布局
              traverse(element.list);
            } else if (element.type === "batch" || element.type === "plan") {
              traverse(element.list);
            } else if (element.type === "dynamicFormula" || element.type === "brackets" || element.type === "brackets") {
              traverse(element.list);
            } else if (element.type === 'function'){
              element.columns.forEach(item => {
                traverse(item.list);
              });
            } else if (element.type === "tabs") {
              // 卡片布局
              traverse(element.list);
            }
            if (element.type === "table") {
              // 表格布局
              element.trs.forEach(item => {
                item.tds.forEach(val => {
                  traverse(val.list);
                });
              });
            }
            if(element.type === 'input' || element.type === 'select'){
              tempList.push({
                value: element.model,
                label: element.label
              })
            }
          })
        }
      }
      traverse(this.formColumnList);
      this.formColumnOptions = tempList;
    }
  },
	mounted() {
		this.initSharedFormOptions();
	},
  props: {
    selectItem: {
      type: Object,
      required: true
    },
    hideModel: {
      type: Boolean,
      default: false
    },
    formColumnList:{
      type: Array,
      default: ()=>([]),
    },
    list:{
      type: Array,
      default: ()=>([]),
    }
  },
  components: {
    KChangeOption,
    kCheckbox
  },
  methods: {
    selectFunction(value, options) {
      let tempList = [{ span: 12, list: [] }, { span: 12, list: [] }];
      switch (value.key) {
        case 'getLogValue':
        //对数,两个参数
        case 'getPowValue':
        //幂函数,两个参数
        case 'getRadicalValue':
          //开根,两个参数
          tempList = [{ span: 12, list: [] }, { span: 12, list: [] }];
          break;
        case 'getAvgValue':
          //平均数,N个参数
          tempList = [{ span: 24, list: [] }];
          break;
        case 'getAbsValue':
          //绝对值,一个参数
          tempList = [{ span: 24, list: [] }];
          break;
        default:
          tempList = [{ span: 8, list: [] }, { span: 8, list: [] }, { span: 8, list: [] }]
          break;
      }
      this.selectItem.columns = tempList;
    },
		filterOption(input, option) {
			return (
				option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
			);
		},
		initSharedFormOptions(){
			let tempSharedFormScopeOptions = [];
			tempSharedFormScopeOptions.push({
				value: 0,
				label: '相同委托/类别/日期',
			});
			tempSharedFormScopeOptions.push({
				value: 1,
				label: '相同委托/类别/点位',
			});
			tempSharedFormScopeOptions.push({
				value: 2,
				label: '相同委托/类别/点位/日期',
			});
			this.sharedFormScopeOptions = tempSharedFormScopeOptions;
			listAllExecutionTemplate({businessCategory: 'SHAREDFORM'}).then(res => {
				console.log('initSharedFormOptions', res);
				if(res.data){
					this.sharedFormOptions.splice(0);
					res.data.forEach(item => {
						this.sharedFormOptions.push({
							value: item.id,
							label: item.subBusinessName + '( ' + item.subBusinessCode + ' )'
						})
					})
				}
			})
		},
		handleSharedFormChange(value) {
			getPageConfig(value).then(response => {
				const editorJsonData = JSON.parse(response.data.metaJson);
				console.log('editorJsonData', editorJsonData, this.selectItem);
				if(editorJsonData){
					console.log('set editorJsonData');
					let columns = [];
					columns.push({
						span: 24,
						list: editorJsonData.list,
						options: {
							gutter: 0
						}
					});
					this.$set(this.selectItem, 'columns', columns);
					// this.$set(this.selectItem, 'options', {
					//   gutter: 0
					// });
				}
				// this.data.list = editorJsonData.list;
				// this.list = editorJsonData.list;
				// this.data.config = editorJsonData.config;
			});
		},
  }
}
</script>
