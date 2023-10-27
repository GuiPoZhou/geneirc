<template>
	<div style="flex:1">

		<a-row>
			<a-col span="22">
				<div class="selected">
          <span>{{label}}</span>
				</div>
			</a-col>
			<a-col span="2" v-if="extendedProperties.formShowType === 0">
				<el-button type="primary" size="mini"  @click="saveFormShow = true" :disabled="multiple">
					编辑监测信息
				</el-button>
			</a-col>
		</a-row>
		<el-table :data.sync="extendedProperties.particulatesList" @selection-change="handleSelectionChange" ref="multipleTable">
			<el-table-column type="selection" width="55" align="center"/>
			<el-table-column label="序号" align="center" type="index" width="50"/>
			<el-table-column label="样品编码" align="center" prop="sampleCode" :show-overflow-tooltip="true"/>
			<el-table-column label="检测项目" align="center" prop="itemName" :show-overflow-tooltip="true"/>
			<el-table-column label="样品类型" align="center" prop="sampleType" :show-overflow-tooltip="true">
				<template  scope="scope">
					<span>{{parseSampleType(scope.row.sampleType)}}</span>
				</template>
			</el-table-column>
			<el-table-column label="样品数量" align="center" prop="sampleCount" :show-overflow-tooltip="true"/>
      <tableColumn :item="item" :multiple="multiple" @multipleColumnShow="multipleColumnShow" v-for="item in multipleColumnsConfig"/>
		</el-table>

		<!-- -------------------- 编辑采样信息 开始 -------------------- -->

		<el-dialog :title="'颗粒物检测'" :visible.sync="saveFormShow"
							 class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
			<el-form ref="form" :model="saveForm" :disabled="extendedProperties.formShowType !== 0" size="small" label-width="150px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="滤筒/滤膜编号" prop="code">
							<el-input v-model="saveForm.code" placeholder="请输入滤筒/滤膜编号" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="采样时间" prop="sampleTime">
							<el-time-picker v-model="saveForm.sampleTime" value-format="HH:mm" format="HH:mm" placeholder="请输入采样时间" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="采样时长min" prop="samplingDuration">
							<el-input v-model="saveForm.samplingDuration" placeholder="请输入采样时长min" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="采样体积（L）" prop="sampleVolume">
							<el-input v-model="saveForm.sampleVolume" placeholder="请输入采样体积（L）" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="标况体积（L）" prop="standardVolume">
							<el-input v-model="saveForm.standardVolume" placeholder="请输入标况体积（L）" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="烟气流速（m/s）" prop="flueGasFlowRate">
							<el-input v-model="saveForm.flueGasFlowRate" placeholder="请输入烟气流速（m/s）" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="烟气温度（℃）" prop="flueGasTemperature">
							<el-input v-model="saveForm.flueGasTemperature" placeholder="请输入烟气温度（℃）" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="烟气含湿量(%)" prop="smokeMoistureContent">
							<el-input v-model="saveForm.smokeMoistureContent" placeholder="请输入烟气含湿量(%)" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="标干烟气流量m3/h" prop="standardDry">
							<el-input v-model="saveForm.standardDry" placeholder="请输入标干烟气流量m3/h" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="计算方式" prop="calculation">
							<el-select v-model="saveForm.calculation" placeholder="请选择计算方式">
								<el-option :key="'基准氧含量'" :label="'基准氧含量'" :value="'基准氧含量'" />
								<el-option :key="'过量空气系数'" :label="'过量空气系数'" :value="'过量空气系数'" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="含氧量(%)" prop="oxygenContent">
							<el-input v-model="saveForm.oxygenContent" placeholder="请输入含氧量(%)" />
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="saveForm.calculation === '基准氧含量'">
						<el-form-item label="基准氧含量(%)" prop="baselineOxygenContent">
							<el-input v-model="saveForm.baselineOxygenContent" placeholder="请输入基准氧含量(%)" />
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="saveForm.calculation === '过量空气系数'">
						<el-form-item label="过量空气系数" prop="excessAirCoefficient" >
							<el-input v-model="saveForm.excessAirCoefficient" placeholder="请输入过量空气系数"/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="saveForm.remark" placeholder="请输入备注" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm" >确 定</el-button>
				<el-button @click="cancelSaveForm">取 消</el-button>
			</div>
		</el-dialog>
		<!-- -------------------- 编辑采样信息 结束 -------------------- -->

    <multipleEditForm :multipleEditFormShow.sync="multipleEditFormShow" :dataList.sync="selectList" :item="multipleEditItem"/>
	</div>

</template>

<script>
  import tableColumn from '@/components/recordSheet/multipleColumn/tableColumn';
  import multipleEditForm from '@/components/recordSheet/multipleColumn/editForm';
	export default {
		name: 'particulates',
		watch: {
			chooseVisible(val) {
				console.log(val);
				if (val) {
					this.init();
				}
			}
		},
    components: {
      tableColumn,
      multipleEditForm
    },
    computed: {
      multipleColumnsConfig() {
        return [{
          key: 'code',
          label: '滤筒/滤膜编号',
          type: 'input',
          options: [],
        },{
			key: 'sampleTime',
			label: '采样时间',
			type: 'time',
			options: [],
		},{
          key: 'samplingDuration',
          label: '采样时长min',
          type: 'input',
          options: [],
        },{
          key: 'sampleVolume',
          label: '采样体积（L）',
          type: 'input',
          options: [],
        },{
          key: 'standardVolume',
          label: '标况体积（L）',
          type: 'input',
          options: [],
        },{
          key: 'flueGasFlowRate',
          label: '烟气流速（m/s）',
          type: 'input',
          options: [],
        },{
          key: 'flueGasTemperature',
          label: '烟气温度（℃）',
          type: 'input',
          options: [],
        },{
          key: 'smokeMoistureContent',
          label: '烟气含湿量(%)',
          type: 'input',
          options: [],
        },{
          key: 'standardDry',
          label: '标干烟气流量m3/h',
          type: 'input',
          options: [],
        },{
          key: 'calculation',
          label: '计算方式',
          type: 'select',
          options: [{
            dictValue: '基准氧含量'
          },{
            dictValue: '过量空气系数'
          }],
        },{
          key: 'oxygenContent',
          label: '含氧量(%)',
          type: 'input',
          options: [],
        },{
          key: 'baselineOxygenContent',
          label: '基准氧含量(%)',
          type: 'input',
          options: [],
        },{
          key: 'excessAirCoefficient',
          label: '过量空气系数',
          type: 'input',
          options: [],
        },{
          key: 'remark',
          label: '备注',
          type: 'textarea',
          options: [],
        },];
      },
    },
		data() {
			return {
				// 添加仪器数据显示
				visible: false,
				// 记录批量修改的列
				enterBatchColumn: '',
				// 批量修改的列内容
				enterBatchContent: '',
				// 选中的记录行
				selectedRowKeys: [],
				// 输入长度限制
				maxLength: 50,

				// 环境空气采样
				saveFormShow: false,
				multiple: true,
				selectList: [],
				saveForm:{
					code: null,
					samplingDuration: null,
					sampleVolume: null,
					standardVolume: null,
					flueGasFlowRate: null,
					flueGasTemperature: null,
					smokeMoistureContent: null,
					standardDry: null,
					calculation: null,
					oxygenContent: null,
					baselineOxygenContent: null,
					excessAirCoefficient: null,
					remark: null,
				},
				options: [],
        multipleEditFormShow: false,
        multipleEditItem: null,
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据列表
				particulatesList: []
			},
      label: {
        type: String,
        default: ''
      }
		},
		mounted() {
			this.init();
			this.refill();
		},
		methods: {
			getContainer() {
				return this.$parent.$el;
			},
			init() {
				if (this.extendedProperties.itemGroupInfoList) {
					let list = JSON.parse(JSON.stringify(this.extendedProperties.itemGroupInfoList.filter(item => item.sceneDetect === '否')));
					list.forEach(item => {
						if(!item.calculation){
							this.$set(item, 'calculation', '基准氧含量');
						}
					});
					this.$set(this.extendedProperties, 'particulatesList', list);
				}
			},
			refill() {
			},
			// 批量录入
			showAdd(column) {
				if (this.selectedRowKeys.length != 0) {
					this.enterBatchColumn = column;
					this.enterBatchContent = "";
					this.visible = true;
				} else {
					this.$message.warning('请选择需要批量修改行数据');
				}
			},
			onSelectChange(selectedRowKeys, selectedRow) {
				this.selectedRowKeys = selectedRowKeys;
			},
			// 确定选择
			submit() {
				if (this.enterBatchContent != '') {
					this.selectedRowKeys.forEach((data) => {
						this.extendedProperties.particulatesList[data][this.enterBatchColumn] = this.enterBatchContent;
					});
				}
				this.cancel();
			},
			// 取消选择
			cancel() {
				this.visible = false;
			},

			getContainer() {
				return this.$parent.$el;
			},
			handleSelectionChange(row){
				console.log('handleSelectionChange', row);
				this.selectList = row;
				this.multiple = !row.length;
			},
			beforeClose(){

			},
			openEvent(){
				console.log('saveFormOpenEvent...');

				if(this.selectList.length === 1){
					this.saveForm = {
						code: this.selectList[0].code,
						samplingDuration: this.selectList[0].samplingDuration,
						sampleVolume: this.selectList[0].sampleVolume,
						standardVolume: this.selectList[0].standardVolume,
						flueGasFlowRate: this.selectList[0].flueGasFlowRate,
						flueGasTemperature: this.selectList[0].flueGasTemperature,
						smokeMoistureContent: this.selectList[0].smokeMoistureContent,
						standardDry: this.selectList[0].standardDry,
						remark: this.selectList[0].remark,
						calculation: this.selectList[0].calculation,
						oxygenContent: this.selectList[0].oxygenContent,
						baselineOxygenContent: this.selectList[0].baselineOxygenContent,
						excessAirCoefficient: this.selectList[0].excessAirCoefficient,
					}
				}else{
					this.saveForm = {
						code: null,
						samplingDuration: null,
						sampleVolume: null,
						standardVolume: null,
						flueGasFlowRate: null,
						flueGasTemperature: null,
						smokeMoistureContent: null,
						standardDry: null,
						remark: null,
						calculation: null,
						oxygenContent: null,
						baselineOxygenContent: null,
						excessAirCoefficient: null,
					}
          for(let key in this.saveForm){
            let lastValue = this.selectList[0][key];
            let diff = false;
            this.selectList.forEach(async item => {
              if(lastValue !== item[key]){
                diff = true;
              }
            })
            if(!diff){
              this.$set(this.saveForm, key, lastValue);
            }

          }
				}
			},
			submitForm(){
				this.selectList.forEach(item => {
					this.$set(item, 'code', this.saveForm.code);
					this.$set(item, 'samplingDuration', this.saveForm.samplingDuration);
					this.$set(item, 'sampleVolume', this.saveForm.sampleVolume);
					this.$set(item, 'standardVolume', this.saveForm.standardVolume);
					this.$set(item, 'flueGasFlowRate', this.saveForm.flueGasFlowRate);
					this.$set(item, 'flueGasTemperature', this.saveForm.flueGasTemperature);
					this.$set(item, 'smokeMoistureContent', this.saveForm.smokeMoistureContent);
					this.$set(item, 'standardDry', this.saveForm.standardDry);
					this.$set(item, 'remark', this.saveForm.remark);
					if(this.saveForm.calculation === '基准氧含量'){
						this.$set(item, 'calculation', this.saveForm.calculation);
						this.$set(item, 'baselineOxygenContent', this.saveForm.baselineOxygenContent);
						this.$set(item, 'excessAirCoefficient', null);
					}else{
						this.$set(item, 'calculation', this.saveForm.calculation);
						this.$set(item, 'excessAirCoefficient', this.saveForm.excessAirCoefficient);
						this.$set(item, 'baselineOxygenContent', null);
					}
					this.$set(item, 'oxygenContent', this.saveForm.oxygenContent);
				});
				this.saveFormShow = false;
			},
			cancelSaveForm(){
				this.saveFormShow = false;
			},
      multipleColumnShow(item){
        this.multipleEditFormShow = true;
        this.multipleEditItem = item;
      }
		}
	}
</script>

<style lang="less" scoped>
	/deep/ .ant-form {
		display: flex;
		align-items: center;

		.ant-form-item {
			margin-bottom: 0;
		}
	}

	/deep/ .ant-table-header {
		margin-bottom: 0 !important;
		min-width: 100% !important;
		overflow: hidden !important;
	}

	/deep/ .ant-form-inline {
		height: 50px;
	}

	/deep/ .ant-form-item-label {
		padding: 0;
	}

	/deep/ .ant-form-item {
		padding-bottom: 0 !important;
		display: flex;
		align-items: center;
	}

	.selected {
		span {
			font-weight: bolder;
			font-size: 24px;
		}
	}

	/deep/ .ant-table-row-cell-break-word {
		height: 57px;
	}

	/deep/ .ant-modal-title {
		margin: 0;
		color: rgba(0, 0, 0, 0.85);
		font-weight: 500;
		font-size: 16px;
		line-height: 22px;
		word-wrap: break-word;
		text-align: center;
		font-weight: bold !important;
	}

	/deep/ .ant-modal-footer {
		padding: 10px 16px;
		text-align: right;
		background: transparent;
		border-top: 1px solid #e8e8e8;
		border-radius: 0 0 4px 4px;
		text-align: center;
	}
</style>
