<template>
	<div style="flex:1">
		<a-row>
			<a-col span="22">
				<div class="selected">
					<span>色谱文件</span>
				</div>
			</a-col>
			<a-col span="2" v-if="extendedProperties.formShowType === 0">
				<a-button type="primary" @click="showAdd">上传文件</a-button>
			</a-col>
		</a-row>

		<a-table
			:columns="listColumns"
			:data-source="extendedProperties.chromatographicResultDataList"
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
			title="色谱文件"
			:visible.sync="visible"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			width="650px"
			:append-to-body="true"
			center
		>
			<el-form ref="dataForm" :model="dataForm" label-width="120px">
				<!--        <el-row>-->
				<!--          <el-col>-->
				<!--            <el-form-item label="文件名" prop="fileName">-->
				<!--              <el-input v-model="dataForm.fileName" :readonly="true"/>-->
				<!--            </el-form-item>-->
				<!--          </el-col>-->
				<!--        </el-row>-->

				<el-row>
					<el-form-item label="上传文件" prop="filePath">
						<el-upload
							ref="upload"
							:action="uploadUrl()"
							:on-success="uploadSuccess"
							:on-remove="uploadRemove"
							:limit="1"
							:file-list="fileList"
						>
							<el-button
								type="info"
								icon="el-icon-upload2"
								size="mini"
								>点击上传</el-button
							>
						</el-upload>
					</el-form-item>
				</el-row>
				<div slot="footer" class="dialog-footer">
					<div align="center">
						<el-button @click="submit" type="primary"
							>确定</el-button
						>
						<el-button @click="cancel">取消</el-button>
					</div>
				</div>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import moment from "moment";

const listColumns = [
	{
		title: "序号",
		dataIndex: "index",
		width: 50,
		align: "center",
		customRender: (text, record, index) => `${index + 1}`
	},
	{
		title: "文件名",
		dataIndex: "fileName",
		align: "center"
	},
	{
		title: "上传人",
		dataIndex: "createBy",
		align: "center"
	},
	{
		title: "上传日期",
		dataIndex: "createTime",
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
			// 上传文件列表
			fileList: []
		};
	},
	props: {
		extendedProperties: {
			type: Object,
			default: {}
		}
	},
	mounted() {
		console.log("chromatographicFile");
		this.init();
		this.refill();
	},
	beforeDestroy() {
		this.$EventBus.$off("chromatographicFile");
	},
	methods: {
		init() {},
		refill() {},
		// 删除记录
		handleDelete(record, index) {
			this.$confirm("确认删除该色谱文件?", "警告", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				this.extendedProperties.chromatographicResultDataList.splice(
					index,
					1
				);
			});
		},
		// 显示增加记录
		showAdd() {
			this.dataForm = {
				fileName: "",
				businessId: this.extendedProperties.relationDataId
			};
			this.fileList = [];
			this.visible = true;
		},
		// 保存
		submit() {
			if (this.extendedProperties.chromatographicResultDataList == null) {
				this.extendedProperties.chromatographicResultDataList = [];
			}
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					if (this.dataForm.filePath) {
						let obj = JSON.parse(JSON.stringify(this.dataForm));
						this.extendedProperties.chromatographicResultDataList.push(
							obj
						);
					}
					this.cancel();
				}
			});
		},
		// 取消
		cancel() {
			this.visible = false;
			this.fileList = [];
		},

		// 文件上传路径返回
		uploadUrl() {
			return window.globalEnv.VUE_APP_BASE_API + "/common/upload";
		},
		// 文件上传成功
		uploadSuccess(res, file, fileList) {
			if (200 == res.code) {
				// 上传成功，赋值保存，用于保存修改
				this.dataForm.fileName = file.name;
				this.dataForm.filePath = res.url;
				this.dataForm.createBy = "admin";
				this.dataForm.createTime = moment(new Date()).format(
					"YYYY-MM-DD"
				);
			} else {
				this.dataForm.fileName = "";
				this.dataForm.filePath = "";
				this.dataForm.createBy = "";
				this.dataForm.createTime = "";
			}
		},
		// 文件删除
		uploadRemove(file, fileList) {
			this.dataForm.filePath = "";
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
