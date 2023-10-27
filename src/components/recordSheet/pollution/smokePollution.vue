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
		<el-table :data.sync="extendedProperties.smokePollutionList" @selection-change="handleSelectionChange" ref="multipleTable">
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
			<el-table-column label="开始时间" align="center" prop="startTime" :show-overflow-tooltip="true"/>
			<el-table-column label="结束时间" align="center" prop="endTime" :show-overflow-tooltip="true"/>
			<el-table-column label="含氧量(%)" align="center" prop="oxygenContent" :show-overflow-tooltip="true"/>
			<el-table-column label="实测浓度（mg/m3）" align="center" prop="measuredConcentration" :show-overflow-tooltip="true"/>
			<el-table-column label="基准氧含量(%)" align="center" prop="baselineOxygenContent" :show-overflow-tooltip="true"/>
			<el-table-column label="过量空气系数" align="center" prop="excessAirCoefficient" :show-overflow-tooltip="true"/>
			<el-table-column label="烟气流速（m/s）" align="center" prop="flueGasFlowRate" :show-overflow-tooltip="true"/>
			<el-table-column label="烟气温度（℃）" align="center" prop="flueGasTemperature" :show-overflow-tooltip="true"/>
			<el-table-column label="烟气含湿量(%)" align="center" prop="smokeMoistureContent" :show-overflow-tooltip="true"/>
			<el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
		</el-table>

		<!-- -------------------- 编辑采样信息 开始 -------------------- -->

		<el-dialog :title="'噪声监测'" :visible.sync="saveFormShow"
							 class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
			<el-form ref="form" :model="saveForm" :disabled="extendedProperties.formShowType !== 0" size="small" label-width="150px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="开始时间" prop="startTime">
							<el-time-picker v-model="saveForm.startTime" value-format="HH:mm" format="HH:mm" placeholder="请输入开始时间" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="结束时间" prop="endTime">
							<el-time-picker v-model="saveForm.endTime" value-format="HH:mm" format="HH:mm" placeholder="请输入结束时间" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="含氧量(%)" prop="oxygenContent">
							<el-input v-model="saveForm.oxygenContent" placeholder="请输入含氧量(%)" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="实测浓度（mg/m3）" prop="measuredConcentration">
							<el-input v-model="saveForm.measuredConcentration" placeholder="请输入实测浓度（mg/m3）" />
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
					<el-col :span="24" v-if="saveForm.calculation === '基准氧含量'">
						<el-form-item label="基准氧含量(%)" prop="baselineOxygenContent">
							<el-input v-model="saveForm.baselineOxygenContent" placeholder="请输入基准氧含量(%)" />
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="saveForm.calculation === '过量空气系数'">
						<el-form-item label="过量空气系数" prop="excessAirCoefficient">
							<el-input v-model="saveForm.excessAirCoefficient" placeholder="请输入过量空气系数" />
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
	</div>

</template>

<script>
	export default {
		name: 'smokePollution',
		watch: {
			chooseVisible(val) {
				console.log(val);
				if (val) {
					this.init();
				}
			}
		},
		components: {},
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
					startTime: null,
					endTime: null,
					oxygenContent: null,
					measuredConcentration: null,
					baselineOxygenContent: null,
					excessAirCoefficient: null,
					flueGasFlowRate: null,
					flueGasTemperature: null,
					smokeMoistureContent: null,
					remark: null,
				},
				options: [],
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据列表
				smokePollutionList: []
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
				if (this.extendedProperties.itemInfoList) {
					let list = JSON.parse(JSON.stringify(this.extendedProperties.itemInfoList.filter(item => item.sceneDetect === '是')));
					this.$set(this.extendedProperties, 'smokePollutionList', list);
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
						this.extendedProperties.smokePollutionList[data][this.enterBatchColumn] = this.enterBatchContent;
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
						oxygenContent: this.selectList[0].oxygenContent,
						measuredConcentration: this.selectList[0].measuredConcentration,
						baselineOxygenContent: this.selectList[0].baselineOxygenContent,
						excessAirCoefficient: this.selectList[0].excessAirCoefficient,
						flueGasFlowRate: this.selectList[0].flueGasFlowRate,
						flueGasTemperature: this.selectList[0].flueGasTemperature,
						smokeMoistureContent: this.selectList[0].smokeMoistureContent,
						remark: this.selectList[0].remark,
					}
				}else{
					this.saveForm = {
						startTime: null,
						endTime: null,
						oxygenContent: null,
						measuredConcentration: null,
						baselineOxygenContent: null,
						excessAirCoefficient: null,
						flueGasFlowRate: null,
						flueGasTemperature: null,
						smokeMoistureContent: null,
						remark: null,
					}
				}
			},
			submitForm(){
				this.selectList.forEach(item => {
					this.$set(item, 'startTime', this.saveForm.startTime);
					this.$set(item, 'endTime', this.saveForm.endTime);
					this.$set(item, 'oxygenContent', this.saveForm.oxygenContent);
					this.$set(item, 'measuredConcentration', this.saveForm.measuredConcentration);
					this.$set(item, 'baselineOxygenContent', this.saveForm.baselineOxygenContent);
					this.$set(item, 'excessAirCoefficient', this.saveForm.excessAirCoefficient);
					this.$set(item, 'flueGasFlowRate', this.saveForm.flueGasFlowRate);
					this.$set(item, 'flueGasTemperature', this.saveForm.flueGasTemperature);
					this.$set(item, 'smokeMoistureContent', this.saveForm.smokeMoistureContent);
					this.$set(item, 'remark', this.saveForm.remark);
				});
				this.saveFormShow = false;
			},
			cancelSaveForm(){
				this.saveFormShow = false;
			},
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
