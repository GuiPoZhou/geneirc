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
		<el-table :data.sync="extendedProperties.waterQualityList" @selection-change="handleSelectionChange" ref="multipleTable">
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
						<el-form-item label="采样量" prop="sampleVolume">
							<el-input v-model="saveForm.sampleVolume" placeholder="请输入采样量" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="采样容器" prop="container">
							<el-input v-model="saveForm.container" placeholder="请输入采样容器" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="保存方式" prop="saveMode">
							<el-input v-model="saveForm.saveMode" placeholder="请输入保存方式" />
						</el-form-item>
					</el-col>
          <el-col :span="22">
            <el-form-item label="保存剂" prop="preservatives">
              <el-input v-model="saveForm.preservatives" placeholder="请输入保存剂" />
            </el-form-item>
          </el-col>
					<el-col :span="22">
						<el-form-item label="颜色" prop="colour">
							<el-input v-model="saveForm.colour" placeholder="请输入颜色" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="气味" prop="odor">
							<el-input v-model="saveForm.odor" placeholder="请输入气味" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="状态" prop="status">
							<el-input v-model="saveForm.status" placeholder="请输入状态" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="油膜" prop="oilFilm">
							<el-input v-model="saveForm.oilFilm" placeholder="请输入油膜" />
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
		name: 'waterQuality',
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
          key: 'time',
          label: '采样时间',
          type: 'time',
          options: [],
        },{
          key: 'sampleVolume',
          label: '采样量',
          type: 'input',
          options: [],
        },{
          key: 'container',
          label: '采样容器',
          type: 'input',
          options: [],
        },{
          key: 'saveMode',
          label: '保存方式',
          type: 'input',
          options: [],
        },{
          key: 'preservatives',
          label: '保存剂',
          type: 'input',
          options: [],
        },{
          key: 'parent1',
          label: '样品感官性状',
          type: 'input',
          options: [],
          subItemList: [{
            key: 'colour',
            label: '颜色',
            type: 'input',
            options: [],
          },{
            key: 'odor',
            label: '气味',
            type: 'input',
            options: [],
          },{
            key: 'status',
            label: '状态',
            type: 'input',
            options: [],
          },{
            key: 'oilFilm',
            label: '油膜',
            type: 'input',
            options: [],
          }]
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
					time: null,
					sampleVolume: null,
					container: null,
					saveMode: null,
					colour: null,
					odor: null,
					status: null,
					oilFilm: null,
					remark: null,
          preservatives: null,
				},
				options: [],

        columnKey: null,
        columnLabel: null,
        columnEditFormVisible: false,

        multipleEditFormShow: false,
        multipleEditItem: null,
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据列表
				waterQualityList: []
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
              item.sampleVolume = item.sampleNum;
              item.container = item.container;
              item.saveMode = item.storageConditions;
              item.preservatives = item.preservatives;
            })
          }
					this.$set(this.extendedProperties, 'waterQualityList', list);
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
						this.extendedProperties.waterQualityList[data][this.enterBatchColumn] = this.enterBatchContent;
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
						sampleVolume: this.selectList[0].sampleVolume,
						container: this.selectList[0].container,
						saveMode: this.selectList[0].saveMode,
            preservatives: this.selectList[0].preservatives,
						colour: this.selectList[0].colour,
						odor: this.selectList[0].odor,
						status: this.selectList[0].status,
						oilFilm: this.selectList[0].oilFilm,
						remark: this.selectList[0].remark,
					}
				}else{
					this.saveForm = {
						time: null,
						sampleVolume: null,
						container: null,
						saveMode: null,
            preservatives: null,
						colour: null,
						odor: null,
						status: null,
						oilFilm: null,
						remark: null,
					};
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
					this.$set(item, 'sampleVolume', this.saveForm.sampleVolume);
					this.$set(item, 'container', this.saveForm.container);
					this.$set(item, 'saveMode', this.saveForm.saveMode);
					this.$set(item, 'preservatives', this.saveForm.preservatives);
					this.$set(item, 'colour', this.saveForm.colour);
					this.$set(item, 'odor', this.saveForm.odor);
					this.$set(item, 'status', this.saveForm.status);
					this.$set(item, 'oilFilm', this.saveForm.oilFilm);
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
