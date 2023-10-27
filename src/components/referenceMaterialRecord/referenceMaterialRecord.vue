<template>
	<div style="flex:1">
		<a-row>
			<a-col span="22">
				<div class="selected">
					<span>标准物质使用记录</span>
				</div>
			</a-col>
			<a-col span="2" v-if="extendedProperties.formShowType === 0">
				<a-button type="primary" @click="showAdd">增加记录</a-button>
			</a-col>
		</a-row>

		<a-table
			:columns="listColumns"
			:data-source="extendedProperties.materialResultDataList"
			size="small"
			:pagination="false"
			:scroll="{ y: 200 }"
			rowKey="dataIndex"
		>
			<template
				slot="operation"
				slot-scope="text, record, index"
				v-if="extendedProperties.formShowType === 0"
			>
				<a-button
					size="mini"
					type="link"
					icon="delete"
					@click="handleDelete(record, index)"
					>删除</a-button
				>
			</template>
		</a-table>

		<el-dialog
			title="标准物质使用记录"
			:visible.sync="visible"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			width="650px"
			:append-to-body="true"
			center
		>
			<el-form
				ref="dataForm"
				:model="dataForm"
				:rules="rules"
				label-width="120px"
			>
				<el-row>
					<el-col>
						<el-form-item label="标准物质编号" prop="materialCode">
							<el-input v-model="dataForm.materialCode" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="标准物质名称" prop="materialName">
							<el-input v-model="dataForm.materialName" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="有效期" prop="effectiveDate">
							<el-date-picker
								v-model="dataForm.effectiveDate"
								type="date"
								value-format="yyyy-MM-dd"
								format="yyyy-MM-dd"
								placeholder="选择日期"
							>
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<div slot="footer" class="dialog-footer">
					<div align="center">
						<el-button @click="submit" type="primary"
							>确 定</el-button
						>
						<el-button @click="cancel">取消</el-button>
					</div>
				</div>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
const listColumns = [
	{
		title: "序号",
		dataIndex: "index",
		width: 50,
		align: "center",
		customRender: (text, record, index) => `${index + 1}`
	},
	{
		title: "标准物质编号",
		dataIndex: "materialCode",
		align: "center"
	},
	{
		title: "标准物质名称",
		dataIndex: "materialName",
		align: "center"
	},
	{
		title: "有效期",
		dataIndex: "effectiveDate",
		align: "center"
	},
	{
		title: "操作",
		dataIndex: "operation",
		align: "center",
		scopedSlots: { customRender: "operation" }
	}
];

export default {
	data() {
		return {
			listColumns,
			visible: false,
			// 数据表单
			dataForm: {},
			// 数据校验
			rules: {
				materialCode: [
					{
						required: true,
						message: "标准物质编号不能为空",
						trigger: "blur"
					},
					{
						max: 50,
						message: "标准物质编号不能超过50个字",
						trigger: "blur"
					}
				],
				materialName: [
					{
						required: true,
						message: "标准物质名称不能为空",
						trigger: "blur"
					},
					{
						max: 50,
						message: "标准物质名称不能超过50个字",
						trigger: "blur"
					}
				]
			}
		};
	},
	props: {
		extendedProperties: {
			// 业务ID
			relationDataId: "",
			// 入参数据列表
			enterDataFormList: [],
			// 出参结果数据列表
			materialResultDataList: []
		}
	},
	mounted() {
		console.log("referenceMaterialRecord");
		this.init();
		this.refill();
	},
	methods: {
		init() {},
		refill() {},
		// 删除记录
		handleDelete(record, index) {
			this.$confirm("确认删除该标准物质使用记录?", "警告", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				this.extendedProperties.materialResultDataList.splice(index, 1);
			});
		},
		// 显示增加记录
		showAdd() {
			this.dataForm = {
				businessId: this.extendedProperties.relationDataId
			};
			this.visible = true;
		},
		// 保存
		submit() {
			if (this.extendedProperties.materialResultDataList == null) {
				this.extendedProperties.materialResultDataList = [];
			}
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					let obj = JSON.parse(JSON.stringify(this.dataForm));
					this.extendedProperties.materialResultDataList.push(obj);
					this.cancel();
				}
			});
		},
		// 取消
		cancel() {
			this.visible = false;
		}
	}
};
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
