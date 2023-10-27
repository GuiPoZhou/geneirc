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
		<el-table :data="extendedProperties.sampleAirList" @selection-change="handleSelectionChange" ref="multipleTable">
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

		<el-dialog :title="'使用记录'" :visible.sync="saveFormShow"
							 class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
			<el-form ref="form" :model="saveForm" :disabled="extendedProperties.formShowType !== 0" size="small" label-width="150px">
				<el-row>
					<el-col :span="22">
						<el-form-item label="开始时间" prop="startTime">
							<el-time-picker v-model="saveForm.startTime" value-format="HH:mm" format="HH:mm" placeholder="请输入开始时间"  @change="diffTime"/>
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="结束时间" prop="endTime">
							<el-time-picker v-model="saveForm.endTime" value-format="HH:mm" format="HH:mm" placeholder="请输入结束时间"  @change="diffTime"/>
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="累积采时（min）" prop="totalTime">
							<el-input v-model="saveForm.totalTime" placeholder="请输入累积采时（min）" :disabled="true"/>
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
						<el-form-item label="参比体积（L）" prop="referenceVolume">
							<el-input v-model="saveForm.referenceVolume" placeholder="请输入参比体积（L）" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="气压(kPa)" prop="atmosphericPressure">
							<el-input v-model="saveForm.atmosphericPressure" placeholder="请输入气压(kPa)" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="气温(℃)" prop="temperature">
							<el-input v-model="saveForm.temperature" placeholder="请输入气温(℃)" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="湿度(%)" prop="humidity">
							<el-input v-model="saveForm.humidity" placeholder="请输入湿度(%)" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="风向" prop="windDirection">
							<el-input v-model="saveForm.windDirection" placeholder="请输入风向" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="风速(m/s)" prop="windVelocity">
							<el-input v-model="saveForm.windVelocity" placeholder="请输入风速(m/s)" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="天气状况" prop="weatherConditions">
							<el-input v-model="saveForm.weatherConditions" placeholder="请输入天气状况" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="采样介质" prop="sampleMedium">
              <el-input v-model="saveForm.sampleMedium" placeholder="请输入采样介质" />
<!--							<el-select v-model="saveForm.sampleMedium" placeholder="请选择">-->
<!--								<el-option :key="item.dictValue" :label="item.dictValue" :value="item.dictValue" v-for="item in options"/>-->
<!--							</el-select>-->
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
    <multipleEditForm :multipleEditFormShow.sync="multipleEditFormShow" :dataList.sync="selectList" :item="multipleEditItem" @editSubmitForm="editSubmitForm"/>
	</div>

</template>

<script>
	import {getDicts} from '@/api/system/dict/data';
  import tableColumn from '@/components/recordSheet/multipleColumn/tableColumn';
  import multipleEditForm from '@/components/recordSheet/multipleColumn/editForm';
	export default {
		name: 'samplingInfo',
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
          key: 'totalTime',
          label: '累积采时（min）',
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
          key: 'referenceVolume',
          label: '参比体积（L）',
          type: 'input',
          options: [],
        },{
          key: 'atmosphericPressure',
          label: '气压(kPa)',
          type: 'input',
          options: [],
        },{
          key: 'temperature',
          label: '气温(℃)',
          type: 'input',
          options: [],
        },{
          key: 'humidity',
          label: '湿度(%)',
          type: 'input',
          options: [],
        },{
          key: 'windDirection',
          label: '风向',
          type: 'input',
          options: [],
        },{
          key: 'windVelocity',
          label: '风速(m/s)',
          type: 'input',
          options: [],
        },{
          key: 'weatherConditions',
          label: '天气状况',
          type: 'input',
          options: [],
        },{
          key: 'sampleMedium',
          label: '采样介质',
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
					startTime: null,
					endTime: null,
					totalTime: null,
					sampleFlow: null,
					sampleVolume: null,
					standardVolume: null,
					referenceVolume: null,
					sampleMedium: null,
					atmosphericPressure: null,
					temperature: null,
					humidity: null,
					windDirection: null,
					windVelocity: null,
					weatherConditions: null,
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
				sampleAirList: []
			},
      label: {
        type: String,
        default: ''
      }
		},
		mounted() {
			console.log('samplingInfo');
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
					if(list && list.length > 0){
					  list.forEach(item =>{
					    // sampleFlow = sampleNum;
              // sampleMedium = container;
              item.sampleFlow = item.sampleNum;
              item.sampleMedium = item.container;
            })
          }
					this.$set(this.extendedProperties, 'sampleAirList', list);
				}
				// getDicts("record_sheet_sample_medium").then(response => {
				// 	if (response.code == 200 && response.data) {
				// 		this.options = response.data;
				// 	}
				// })
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
						this.extendedProperties.sampleAirList[data][this.enterBatchColumn] = this.enterBatchContent;
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
						totalTime: this.selectList[0].totalTime,
						sampleFlow: this.selectList[0].sampleFlow,
						sampleVolume: this.selectList[0].sampleVolume,
						standardVolume: this.selectList[0].standardVolume,
						referenceVolume: this.selectList[0].referenceVolume,
						sampleMedium: this.selectList[0].sampleMedium,
						atmosphericPressure: this.selectList[0].atmosphericPressure,
						temperature: this.selectList[0].temperature,
						humidity: this.selectList[0].humidity,
						windDirection: this.selectList[0].windDirection,
						windVelocity: this.selectList[0].windVelocity,
						weatherConditions: this.selectList[0].weatherConditions,
						remark: this.selectList[0].remark,
					}
				}else{
					this.saveForm = {
						startTime: null,
						endTime: null,
						totalTime: null,
						sampleFlow: null,
						sampleVolume: null,
						standardVolume: null,
						referenceVolume: null,
						sampleMedium: null,
						atmosphericPressure: null,
						temperature: null,
						humidity: null,
						windDirection: null,
						windVelocity: null,
						weatherConditions: null,
						remark: null,
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
					this.$set(item, 'totalTime', this.saveForm.totalTime);
					this.$set(item, 'sampleFlow', this.saveForm.sampleFlow);
					this.$set(item, 'sampleVolume', this.saveForm.sampleVolume);
					this.$set(item, 'standardVolume', this.saveForm.standardVolume);
					this.$set(item, 'referenceVolume', this.saveForm.referenceVolume);
					this.$set(item, 'sampleMedium', this.saveForm.sampleMedium);
					this.$set(item, 'atmosphericPressure', this.saveForm.atmosphericPressure);
					this.$set(item, 'temperature', this.saveForm.temperature);
					this.$set(item, 'humidity', this.saveForm.humidity);
					this.$set(item, 'windDirection', this.saveForm.windDirection);
					this.$set(item, 'windVelocity', this.saveForm.windVelocity);
					this.$set(item, 'weatherConditions', this.saveForm.weatherConditions);
					this.$set(item, 'remark', this.saveForm.remark);
				});
				this.saveFormShow = false;
			},
			cancelSaveForm(){
				this.saveFormShow = false;
			},
			diffTime(){
				// console.log('diffTime', this.saveForm.startTime, this.saveForm.endTime);
				let start = new Date('1970-01-01 ' + this.saveForm.startTime);
				let end = new Date('1970-01-01 ' + this.saveForm.endTime);
				// console.log(start.getTime(), end.getTime(), start, end);
				let ms = end.getTime() - start.getTime();
				if(!isNaN(ms)){
					// console.log('分钟差', ms, Math.ceil(ms/(60*1000)));
					this.saveForm.totalTime = Math.ceil(ms/(60*1000));
				}
			},
      multipleColumnShow(item){
        this.multipleEditFormShow = true;
        this.multipleEditItem = item;
      },
      editSubmitForm(data){
        console.log('editSubmitForm', data);
        data.forEach(item => {
          let start = new Date('1970-01-01 ' + item.startTime);
          let end = new Date('1970-01-01 ' + item.endTime);
          let ms = end.getTime() - start.getTime();
          if(!isNaN(ms)){
            this.$set(item, 'totalTime', Math.ceil(ms/(60*1000)));
          }
        })
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
