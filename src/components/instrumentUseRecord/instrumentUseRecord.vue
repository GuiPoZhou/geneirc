<template>
	<div style="flex:1">

		<a-row>
			<a-col span="22">
				<div class="selected">
					<span>仪器使用记录</span>
				</div>
			</a-col>
			<a-col span="2" v-if="extendedProperties.formShowType === 0">
				<a-button type="primary" @click="showAdd">增加记录</a-button>
			</a-col>
		</a-row>

		<a-table :columns="listColumns" :data-source="extendedProperties.instrumentUseResultDataList" size="small" :scroll={y:200} rowKey="dataIndex" :pagination="false">
			<template slot="operation" slot-scope="text, record, index" v-if="extendedProperties.formShowType === 0">
				<a-button size="mini" type="link" icon="delete" @click="handleDelete(record,index)">删除</a-button>
			</template>
		</a-table>

		<!-- -------------------- 仪器使用记录 开始 -------------------- -->
		<el-dialog title="仪器使用记录" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false"
				   width="650px" :append-to-body="true" center>
			<el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="120px">

				<el-row>
					<el-col>
						<el-form-item label="选择仪器" prop="apparatusId">
							<el-button type="primary" size="mini" @click="apparatusChooseShow">选择仪器</el-button>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col>
						<el-form-item label="设备名称" prop="apparatusName">
							<el-input v-model="dataForm.apparatusName" :readonly="true"/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="设备编号" prop="apparatusCode">
							<el-input v-model="dataForm.apparatusCode" :readonly="true"/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="设备型号" prop="apparatusModelNum">
							<el-input v-model="dataForm.apparatusModelNum" :readonly="true"/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col>
						<el-form-item label="开机日期" prop="startUpDate">
							<el-date-picker
								v-model="dataForm.startUpDate"
								type="date"
								value-format="yyyy-MM-dd"
								format="yyyy-MM-dd"
								placeholder="选择开机日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="时间" prop="startUpTime">
							<el-input v-model="dataForm.startUpTime"/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="结束日期" prop="endDate">
							<el-date-picker
								v-model="dataForm.endDate"
								type="date"
								value-format="yyyy-MM-dd"
								format="yyyy-MM-dd"
								placeholder="选择结束日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="时间" prop="endTime">
							<el-input v-model="dataForm.endTime"/>
						</el-form-item>
					</el-col>
				</el-row>
				<div slot="footer" class="dialog-footer">
					<div align="center">
						<el-button @click="submit" type="primary">确定</el-button>
						<el-button @click="cancel">取消</el-button>
					</div>
				</div>
			</el-form>
		</el-dialog>
		<!-- -------------------- 仪器使用记录 结束 -------------------- -->

		<!-- -------------------- 选择仪器 开始 -------------------- -->
		<el-dialog title="选择仪器" :visible.sync="chooseVisible" :close-on-click-modal="false" :close-on-press-escape="false"
				   width="850px" :append-to-body="true" center>
			<el-row>
				<el-form :model="apparatusQueryParam" ref="apparatusQueryParam" :inline="true">
					<div>
						<el-form-item label="仪器名称" prop="equipmentName">
							<el-input v-model="apparatusQueryParam.equipmentName"/>
						</el-form-item>
						<el-form-item label="仪器编码" prop="equipmentNumber">
							<el-input v-model="apparatusQueryParam.equipmentNumber"/>
						</el-form-item>
						<el-form-item>
							<el-button @click="apparatusQuery" type="primary" icon="el-icon-search" size="mini">查询</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-row>

			<el-row>
				<!-- 列表数据 -->
				<el-table v-loading="loading" :data="apparatusDataList">
					<el-table-column prop="equipmentName" label="设备名称" align="center"></el-table-column>
					<el-table-column prop="equipmentNumber" label="设备编号" align="center"></el-table-column>
					<el-table-column prop="equipmentModel" label="设备型号" align="center"></el-table-column>
					<el-table-column label="操作" align="center" width="75">
						<template slot-scope="scope">
							<el-button size="mini" type="text" icon="el-icon-edit" @click="apparatusChoose(scope.row, scope.$index)">选择</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>

			<!-- 分页 -->
			<div class="block">
				<pagination
					v-show="apparatusDataTotal>0"
					:total="apparatusDataTotal"
					:page.sync="apparatusQueryParam.pageNum"
					:limit.sync="apparatusQueryParam.pageSize"
					@pagination="apparatusQuery"
				/>
			</div>

		</el-dialog>
		<!-- -------------------- 选择仪器 结束 -------------------- -->

	</div>

</template>

<script>
	import {listData} from "@/api/instrumentUseRecord/instrumentUseRecord";
	import moment from "moment";

	const listColumns = [
		{
			title: '序号',
			dataIndex: 'index',
			width: 50,
			align: 'center',
			customRender: (text, record, index) => `${index + 1}`
		},
		{
			title: '仪器编号',
			dataIndex: 'apparatusCode',
			align: 'center'
		},
		{
			title: '仪器名称',
			dataIndex: 'apparatusName',
			align: 'center'
		},
		{
			title: '型号',
			dataIndex: 'apparatusModelNum',
			align: 'center'
		},
		{
			title: '开机日期',
			dataIndex: 'startUpDate',
			align: 'center'
		},
		{
			title: '时间',
			dataIndex: 'startUpTime',
			align: 'center'
		},
		{
			title: '关机日期',
			dataIndex: 'endDate',
			align: 'center'
		},
		{
			title: '时间',
			dataIndex: 'endTime',
			align: 'center'
		},
		{
			title: '使用人',
			dataIndex: 'createBy',
			align: 'center'
		}, {
			title: '操作',
			dataIndex: 'operation',
			align: 'center',
			scopedSlots: {customRender: 'operation'},
		}
	]

	export default {
		name: 'instrumentUseRecord',
		watch: {
			chooseVisible(val) {
				console.log(val);
				if (val) {
					this.apparatusQuery();
				}
			}
		},
		components: {
			moment
		},
		data() {
			return {
				listColumns,
				// 添加仪器数据显示
				visible: false,
				// 添加仪器数据表单
				dataForm: {},
				// 添加仪器数据校验
				rules: {
					id: [
						{required: true, message: "必须选择使用仪器", trigger: "blur"}
					]
				},
				// 选择仪器显示
				chooseVisible: false,
				// 选择仪器查询
				apparatusQueryParam: {
					pageNum: 1,
					pageSize: 10,
					equipmentName: "",
					equipmentNumber: ""
				},
				loading: true,
				// 选择仪器列表数据
				apparatusDataList: [],
				// 选择仪器数据总数
				apparatusDataTotal: 0,
			}
		},
		props: {
			extendedProperties: {
				// 业务ID
				relationDataId: "",
				// 出参结果数据列表
				instrumentUseResultDataList: []
			}
		},
		mounted() {
			console.log('instrumentUseRecord');
			this.init();
			this.refill();
		},
		methods: {
			init() {

			},
			refill() {
			},
			// 删除记录
			handleDelete(record, index) {
				this.$confirm('确认删除该仪器使用记录?', "警告", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					this.extendedProperties.instrumentUseResultDataList.splice(index, 1);
				});
			},
			// 显示增加记录
			showAdd() {
				this.dataForm = {
					businessId: this.extendedProperties.relationDataId
				};
				this.visible = true;
			},
			// 增加记录
			submit() {
				if (this.extendedProperties.instrumentUseResultDataList == null) {
					this.extendedProperties.instrumentUseResultDataList = [];
				}
				this.$refs["dataForm"].validate((valid) => {
					if (valid) {
						this.dataForm.createBy = 'admin';
						let obj = JSON.parse(JSON.stringify(this.dataForm));
						this.extendedProperties.instrumentUseResultDataList.push(obj);
						this.cancel();
					}
				})
			},
			// 取消增加记录
			cancel() {
				this.visible = false;
			},

			// 选择仪器显示
			apparatusChooseShow() {
				this.chooseVisible = true;
				this.apparatusQueryParam.equipmentName = "";
				this.apparatusQueryParam.equipmentNumber = "";
			},
			// 选择仪器查询
			apparatusQuery() {
				this.loading = true;
				listData(this.apparatusQueryParam).then(response => {
					this.apparatusDataList = response.data.list;
					this.apparatusDataTotal = response.data.total;
					this.loading = false;
				})
			},
			// 选择仪器数据选择
			apparatusChoose(row, index) {
				this.dataForm = {
					apparatusId: row.id,
					apparatusName: row.equipmentName,
					apparatusCode: row.equipmentNumber,
					apparatusModelNum: row.equipmentModel,
				};
				this.apparatusCancel();
			},
			// 选择仪器取消
			apparatusCancel() {
				this.chooseVisible = false;
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
</style>
