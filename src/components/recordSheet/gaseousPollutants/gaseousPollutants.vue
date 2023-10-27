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
					编辑采样信息
				</el-button>
			</a-col>
		</a-row>
		<el-table :data.sync="extendedProperties.gaseousPollutantsList" @selection-change="handleSelectionChange" ref="multipleTable">
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

		<el-dialog :title="'编辑采样信息'" :visible.sync="saveFormShow"
							 class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
			<el-form ref="form" :model="saveForm" :disabled="extendedProperties.formShowType !== 0" size="small" label-width="150px">
				<el-row>
					<el-col :span="22">
						<el-form-item label="检测口规格(cm)" prop="specification">
							<el-input v-model="saveForm.specification" placeholder="请输入检测口规格(cm)"/>
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="开始时间" prop="startTime">
							<el-time-picker v-model="saveForm.startTime" value-format="HH:mm" format="HH:mm" placeholder="请输入开始时间" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="结束时间" prop="endTime">
							<el-time-picker v-model="saveForm.endTime" value-format="HH:mm" format="HH:mm" placeholder="请输入结束时间" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="计前压力（kpa）" prop="frontPressure">
							<el-input v-model="saveForm.frontPressure" placeholder="请输入计前压力（kpa）"/>
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="计前温度（℃）" prop="frontTemperature">
							<el-input v-model="saveForm.frontTemperature" placeholder="请输入计前温度（℃）"/>
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="采样流量（L/min）" prop="sampleFlow">
							<el-input v-model="saveForm.sampleFlow" placeholder="请输入采样流量（L/min）"/>
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="采样体积（L）" prop="sampleVolume">
							<el-input v-model="saveForm.sampleVolume" placeholder="请输入采样体积（L）" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="标况体积（L）" prop="standardVolume">
							<el-input v-model="saveForm.standardVolume" placeholder="请输入标况体积（L）" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="烟气流速（m/s）" prop="gasFlowSpeed">
							<el-input v-model="saveForm.gasFlowSpeed" placeholder="请输入烟气流速（m/s）" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="标杆流量(m³/h)" prop="benchmarkFlow">
							<el-input v-model="saveForm.benchmarkFlow" placeholder="请输入标杆流量(m³/h)" />
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
					<el-col :span="22">
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" v-model="saveForm.remark" placeholder="请输入备注" :rows="2"/>
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
		name: 'gaseousPollutants',
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
          key: 'specification',
          label: '检测口规格(cm)',
          type: 'date',
          options: [],
        },{
          key: 'startTime',
          label: '开始时间',
          type: 'time',
          options: [],
        },{
          key: 'endTime',
          label: '结束时间',
          type: 'time',
          options: [],
        },{
          key: 'frontPressure',
          label: '计前压力（kpa）',
          type: 'input',
          options: [],
        },{
          key: 'frontTemperature',
          label: '计前温度（℃）',
          type: 'input',
          options: [],
        },{
          key: 'sampleFlow',
          label: '采样流量（L/min）',
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
          key: 'gasFlowSpeed',
          label: '烟气流速（m/s）',
          type: 'input',
          options: [],
        },{
          key: 'benchmarkFlow',
          label: '标杆流量(m³/h)',
          type: 'input',
          options: [],
        },{
          key: 'oxygenContent',
          label: '含氧量(%)',
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
        }];
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
					specification: null,
					frontPressure: null,
					frontTemperature: null,
					startTime: null,
					endTime: null,
					sampleFlow: null,
					sampleVolume: null,
					standardVolume: null,
					gasFlowSpeed: null,
					benchmarkFlow: null,
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
				gaseousPollutantsList: []
			},
      label: {
        type: String,
        default: ''
      }
		},
		mounted() {
			this.init();
			this.refill();
			console.log("isMobile", this._isMobile());
		},
		methods: {
			_isMobile() {
				let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
				return flag;
			},
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
					this.$set(this.extendedProperties, 'gaseousPollutantsList', list);
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
						this.extendedProperties.gaseousPollutantsList[data][this.enterBatchColumn] = this.enterBatchContent;
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
						startTime: this.selectList[0].startTime,
						endTime: this.selectList[0].endTime,
						specification: this.selectList[0].specification,
						frontPressure: this.selectList[0].frontPressure,
						frontTemperature: this.selectList[0].frontTemperature,
						sampleFlow: this.selectList[0].sampleFlow,
						sampleVolume: this.selectList[0].sampleVolume,
						standardVolume: this.selectList[0].standardVolume,
						gasFlowSpeed: this.selectList[0].gasFlowSpeed,
						benchmarkFlow: this.selectList[0].benchmarkFlow,
						remark: this.selectList[0].remark,
						calculation: this.selectList[0].calculation,
						oxygenContent: this.selectList[0].oxygenContent,
						baselineOxygenContent: this.selectList[0].baselineOxygenContent,
						excessAirCoefficient: this.selectList[0].excessAirCoefficient,
					}
				}else{
					this.saveForm = {
						startTime: null,
						endTime: null,
						specification: null,
						frontPressure: null,
						frontTemperature: null,
						sampleFlow: null,
						sampleVolume: null,
						standardVolume: null,
						gasFlowSpeed: null,
						benchmarkFlow: null,
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
					this.$set(item, 'startTime', this.saveForm.startTime);
					this.$set(item, 'endTime', this.saveForm.endTime);
					this.$set(item, 'specification', this.saveForm.specification);
					this.$set(item, 'frontPressure', this.saveForm.frontPressure);
					this.$set(item, 'frontTemperature', this.saveForm.frontTemperature);
					this.$set(item, 'sampleFlow', this.saveForm.sampleFlow);
					this.$set(item, 'sampleVolume', this.saveForm.sampleVolume);
					this.$set(item, 'standardVolume', this.saveForm.standardVolume);
					this.$set(item, 'gasFlowSpeed', this.saveForm.gasFlowSpeed);
					this.$set(item, 'benchmarkFlow', this.saveForm.benchmarkFlow);
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
