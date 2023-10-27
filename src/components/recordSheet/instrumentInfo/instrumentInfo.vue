<template>
	<div style="flex:1">

		<a-row>
			<a-col span="20">
				<div class="selected">
					<span>{{label}}</span>
				</div>
			</a-col>
			<a-col span="2" v-if="extendedProperties.formShowType === 0">
				<el-button type="primary" size="mini"  @click="showAdd">
					选择仪器
				</el-button>
			</a-col>
			<a-col span="2" v-if="extendedProperties.formShowType === 0">
				<el-button type="primary" size="mini"  @click="userFormShow = true" :disabled="multiple">
					添加使用记录
				</el-button>
			</a-col>
		</a-row>
		<el-table :data="extendedProperties.instrumentList" @selection-change="handleSelectionChange" ref="multipleTable">
			<el-table-column type="selection" width="55" align="center"/>
			<el-table-column label="序号" align="center" type="index" width="50"/>
			<el-table-column label="仪器编号" align="center" prop="equipmentNumber" :show-overflow-tooltip="true"/>
			<el-table-column label="仪器名称" align="center" prop="equipmentName" :show-overflow-tooltip="true"/>
			<el-table-column label="仪器型号" align="center" prop="equipmentModel" :show-overflow-tooltip="true"/>
			<el-table-column label="仪器分类" align="center" prop="equipmentClassName" :show-overflow-tooltip="true"/>

      <tableColumn :item="item" :multiple="multiple" @multipleColumnShow="multipleColumnShow" v-for="item in multipleColumnsConfig"/>

			<el-table-column label="操作" align="center" width="150" >
				<template slot-scope="scope">
					<el-button size="mini" type="text" icon="el-icon-edit" @click="handleDelete(scope.row, scope.$index)" :disabled="extendedProperties.formShowType !== 0">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- -------------------- 选择仪器 开始 -------------------- -->
		<a-modal title="选择仪器" v-model="equipmentVisible" :close-on-click-modal="false" :close-on-press-escape="false"
				 :getContainer="getContainer" width="1000px" @cancel="equipmentCancel" @ok="equipmentSubmit" >
			<a-row :gutter="8">
				<a-col :span="6">
					<a-form-item label="仪器名称" prop="equipmentName">
						<a-input v-model="equipmentQueryParam.equipmentName"/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="仪器编码" prop="equipmentNumber">
						<a-input v-model="equipmentQueryParam.equipmentNumber"/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="仪器型号" prop="equipmentModel">
						<a-input v-model="equipmentQueryParam.equipmentModel"/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item>
						<a-button @click="equipmentQuery" type="primary" icon="search" >查询</a-button>
					</a-form-item>
				</a-col>
			</a-row>

			<a-table :columns="equipmentColumns" rowKey="dataIndex"
					 :data-source="equipmentDataList"
					 :row-selection="{selectedRowKeys: equipmentSelectedRowKeys, onChange: onEquipmentSelectChange}"
					 :pagination="false">
			</a-table>

			<template slot="footer">
				<a-button key="submit" type="primary" @click="equipmentSubmit">
					确定
				</a-button>
				<a-button key="back" @click="equipmentCancel">
					取消
				</a-button>
			</template>

		</a-modal>
		<!-- -------------------- 选择仪器 结束 -------------------- -->

		<!-- -------------------- 添加使用记录 开始 -------------------- -->

		<el-dialog :title="'使用记录'" :visible.sync="userFormShow"
							 class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
			<el-form ref="form" :model="userForm" :disabled="extendedProperties.formShowType !== 0" size="small" :inline="true" label-width="110px">
				<el-row>
					<el-col :span="22">
						<el-form-item label="使用日期" prop="userDate">
							<el-date-picker v-model="userForm.userDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="开始时间" prop="userTimeStart">
							<el-time-picker v-model="userForm.userTimeStart" value-format="HH:mm" format="HH:mm" placeholder="请输入开始时间" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="结束时间" prop="userTimeEnd">
							<el-time-picker v-model="userForm.userTimeEnd" value-format="HH:ss" format="HH:mm"placeholder="请输入结束时间" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="使用前状况" prop="beforeStatus">
							<el-select v-model="userForm.beforeStatus" placeholder="请选择">
								<el-option :key="item.dictValue" :label="item.dictValue" :value="item.dictValue" v-for="item in options"/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="使用后状况" prop="afterStatus">
							<el-select v-model="userForm.afterStatus" placeholder="请选择">
								<el-option :key="item.dictValue" :label="item.dictValue" :value="item.dictValue" v-for="item in options"/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm" >确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>
		<!-- -------------------- 添加使用记录 结束 -------------------- -->
    <multipleEditForm :multipleEditFormShow.sync="multipleEditFormShow" :dataList.sync="selectList" :item="multipleEditItem"/>
	</div>

</template>

<script>
	import {queryEquipmentList4RecordSheet} from "@/api/recordSheet/config";
	import {getDicts} from '@/api/system/dict/data';
	import tableColumn from '@/components/recordSheet/multipleColumn/tableColumn';
	import multipleEditForm from '@/components/recordSheet/multipleColumn/editForm';

	const equipmentColumns = [
		{
			title: '序号',
			dataIndex: 'index',
			width: 65,
			align: 'center',
			customRender: (text, record, index) => `${index + 1}`
		},
		{
			title: '仪器编号',
			dataIndex: 'equipmentNumber',
			align: 'center'
		},
		{
			title: '仪器名称',
			dataIndex: 'equipmentName',
			align: 'center'
		},
		{
			title: '仪器型号',
			dataIndex: 'equipmentModel',
			align: 'center'
		},
		{
			title: '仪器分类',
			dataIndex: 'equipmentClassName',
			align: 'center'
		}
	]

	export default {
		name: 'instrumentInfo',
		watch: {
			chooseVisible(val) {
				console.log(val);
				if (val) {

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
          key: 'userDate',
          label: '使用日期',
          type: 'date',
          options: [],
        },{
          key: 'userTimeStart',
          label: '开始时间',
          type: 'time',
          options: [],
        },{
          key: 'userTimeEnd',
          label: '结束时间',
          type: 'time',
          options: [],
        },{
          key: 'beforeStatus',
          label: '使用前状况',
          type: 'select',
          options: this.options,
        },{
          key: 'afterStatus',
          label: '使用后状况',
          type: 'select',
          options: this.options,
        }];
      },
    },
		data() {
			return {
				equipmentColumns,
				loading: true,
				// 添加仪器数据显示
				equipmentVisible: false,
				// 选择仪器查询
				equipmentQueryParam: {
					equipmentName: "",
					equipmentNumber: "",
					equipmentModel: ""
				},
				// 仪器列表数据
				equipmentDataList: [],
				// 仪器选中key列表
				equipmentSelectedRowKeys: [],
				// 仪器选中列表数据
				equipmentChooseDataList: [],
				// 仪器使用记录
				userFormShow: false,
				multiple: true,
				selectList: [],
				userForm:{
					userDate: new Date(),
					userTimeStart: new Date(),
					userTimeEnd: new Date(),
					beforeStatus: '正常',
					afterStatus: '正常',
				},
				options: [],
        multipleEditFormShow: false,
        multipleEditItem: null,
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据列表
				recordSheetInstrumentList: []
			},
      label: {
			  type: String,
        default: ''
      }
		},
		mounted() {
			console.log('instrumentInfo');
			this.init();
			this.refill();
		},
		methods: {
			init() {
				getDicts("record_sheet_sample_ipment_status").then(response => {
					if (response.code == 200 && response.data) {
						this.options = response.data;
					}
				})
			},
			refill() {
			},
			// 删除记录
			handleDelete(record, index) {
				this.$confirm('确认删除该仪器信息?', "警告", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					this.extendedProperties.instrumentList.splice(index, 1);
				});
			},
			// 添加选择仪器
			showAdd() {
				this.equipmentVisible = true;
				this.equipmentQueryParam = {
					equipmentName: "",
					equipmentNumber: "",
					equipmentModel: ""
				}
				this.equipmentQuery();
				this.equipmentSelectedRowKeys = [];
				this.equipmentChooseDataList = [];
			},
			// 选择仪器查询
			equipmentQuery() {
				this.loading = true;
				if(this.extendedProperties.entrustId){
					this.equipmentQueryParam.entrustId = this.extendedProperties.entrustId
				}
				queryEquipmentList4RecordSheet(this.equipmentQueryParam).then(response => {
					this.equipmentDataList = response.data;
					this.loading = false;
				})
			},
			onEquipmentSelectChange(selectedRowKeys, selectedRow) {
				this.equipmentSelectedRowKeys = selectedRowKeys;
				this.equipmentChooseDataList = selectedRow;
			},
			// 确定选择
			equipmentSubmit() {
				this.extendedProperties.instrumentList = this.equipmentChooseDataList;
				this.equipmentCancel();
			},
			// 取消选择
			equipmentCancel() {
				this.equipmentVisible = false;
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
				console.log('userFormOpenEvent...');
				if(this.selectList.length === 1){
					this.userForm = {
						userDate: this.selectList[0].userDate,
						userTimeStart: this.selectList[0].userTimeStart,
						userTimeEnd: this.selectList[0].userTimeEnd,
						beforeStatus: this.selectList[0].beforeStatus ? this.selectList[0].beforeStatus : '正常',
						afterStatus: this.selectList[0].afterStatus ? this.selectList[0].afterStatus : '正常',
					}
				}else{
					this.userForm = {
						userDate: null,
						userTimeStart: null,
						userTimeEnd: null,
						beforeStatus: '正常',
						afterStatus: '正常',
					};
          for(let key in this.userForm){
            let lastValue = this.selectList[0][key];
            let diff = false;
            this.selectList.forEach(async item => {
              if(lastValue !== item[key]){
                diff = true;
              }
            })
            if(!diff){
              this.$set(this.userForm, key, lastValue);
            }

          }
				}
			},
			submitForm(){
				this.selectList.forEach(item => {
					this.$set(item, 'userDate', this.userForm.userDate);
					this.$set(item, 'userTimeStart', this.userForm.userTimeStart);
					this.$set(item, 'userTimeEnd', this.userForm.userTimeEnd);
					this.$set(item, 'beforeStatus', this.userForm.beforeStatus);
					this.$set(item, 'afterStatus', this.userForm.afterStatus);
				});
				this.userFormShow = false;
			},
			cancel(){
				this.userFormShow = false;
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
