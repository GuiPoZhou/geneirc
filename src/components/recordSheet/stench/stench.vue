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
		<el-table :data.sync="extendedProperties.stenchList" @selection-change="handleSelectionChange" ref="multipleTable">
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
						<el-form-item label="采样时间" prop="time">
							<el-time-picker v-model="saveForm.time" value-format="HH:mm" format="HH:mm" placeholder="请输入采样时间" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="现场臭气描述" prop="odorDescription">
							<el-input v-model="saveForm.odorDescription" placeholder="请输入现场臭气描述" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="异味特征描述" prop="featureDescription">
							<el-input v-model="saveForm.featureDescription" placeholder="请输入异味特征描述" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="采样体积（L）" prop="sampleVolume">
							<el-input v-model="saveForm.sampleVolume" placeholder="请输入采样体积（L）" />
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
    <multipleEditForm :multipleEditFormShow.sync="multipleEditFormShow" :dataList.sync="selectList" :item="multipleEditItem"/>
	</div>

</template>

<script>
  import tableColumn from '@/components/recordSheet/multipleColumn/tableColumn';
  import multipleEditForm from '@/components/recordSheet/multipleColumn/editForm';
	export default {
		name: 'stench',
		watch: {
			chooseVisible(val) {
				console.log(val);
				if (val) {
					this.init();
				}
			}
		},
    computed: {
      multipleColumnsConfig() {
        return [{
          key: 'time',
          label: '采样时间',
          type: 'time',
          options: [],
        },{
          key: 'odorDescription',
          label: '现场臭气描述',
          type: 'input',
          options: [],
        },{
          key: 'featureDescription',
          label: '异味特征描述',
          type: 'input',
          options: [],
        },{
          key: 'sampleVolume',
          label: '采样体积（L）',
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
    components: {
      tableColumn,
      multipleEditForm
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
					time: null,
					odorDescription: null,
					featureDescription: null,
					sampleVolume: null,
					sampleMedium: null,
					atmosphericPressure: null,
					temperature: null,
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
				stenchList: []
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
          if(list && list.length > 0){
            list.forEach(item =>{
              // sampleMedium = container;
              item.sampleMedium = item.container;
            })
          }
					this.$set(this.extendedProperties, 'stenchList', list);
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
						this.extendedProperties.stenchList[data][this.enterBatchColumn] = this.enterBatchContent;
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
						time: this.selectList[0].time,
						odorDescription: this.selectList[0].odorDescription,
						featureDescription: this.selectList[0].featureDescription,
						remark: this.selectList[0].remark,
						sampleVolume: this.selectList[0].sampleVolume,
						sampleMedium: this.selectList[0].sampleMedium,
						atmosphericPressure: this.selectList[0].atmosphericPressure,
						temperature: this.selectList[0].temperature,
						windDirection: this.selectList[0].windDirection,
						windVelocity: this.selectList[0].windVelocity,
						weatherConditions: this.selectList[0].weatherConditions,
					}
				}else{
					this.saveForm = {
						time: null,
						odorDescription: null,
						featureDescription: null,
						sampleVolume: null,
						sampleMedium: null,
						atmosphericPressure: null,
						temperature: null,
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
					this.$set(item, 'time', this.saveForm.time);
					this.$set(item, 'odorDescription', this.saveForm.odorDescription);
					this.$set(item, 'featureDescription', this.saveForm.featureDescription);
					this.$set(item, 'atmosphericPressure', this.saveForm.atmosphericPressure);
					this.$set(item, 'temperature', this.saveForm.temperature);
					this.$set(item, 'windDirection', this.saveForm.windDirection);
					this.$set(item, 'windVelocity', this.saveForm.windVelocity);
					this.$set(item, 'weatherConditions', this.saveForm.weatherConditions);
					this.$set(item, 'sampleMedium', this.saveForm.sampleMedium);
					this.$set(item, 'sampleVolume', this.saveForm.sampleVolume);
					this.$set(item, 'remark', this.saveForm.remark);
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
